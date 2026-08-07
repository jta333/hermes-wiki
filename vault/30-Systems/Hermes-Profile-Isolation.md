# Hermes Profile Isolation

> See also: [[30-Systems/Systems-Index]], [[30-Systems/Cron-Jobs]], [[50-Operations/Email-Triage-Rules]]

Status: **APPLIED AND VERIFIED on Homedrums 2026-08-07.** `-Stage verify` reports MATCH on both
profiles: work reaches `j@jet.events`, personal reaches `jaycastellano@gmail.com`. The crossover is
closed. What remains is the OS-level wall, tracked as loop L154 in the brain repo.

---

## The two Hermes instances

| | Work Hermes | HermesJr (personal) |
|---|---|---|
| Account | `j@jet.events` | `jaycastellano@gmail.com` |
| Channel | Google Chat | Telegram |
| Scheduled task | `Hermes_Gateway` | `Hermes_Gateway_personal` |
| Process signature | `hermes_cli.main gateway run` | `hermes_cli.main --profile personal gateway run` |
| Profile home | `C:\Users\Jay\AppData\Local\hermes` | `C:\Users\Jay\AppData\Local\hermes\profiles\personal` |

Both run on Homedrums, both as the Windows user `Jay`.

---

## The problem

HermesJr repeatedly read, and on 2026-08-02 wrote to, the JET work Gmail account. Three
defects stacked:

1. **The personal profile home is a subdirectory of the work profile home.** The work
   `google_token.json` sits two levels above the personal one in the same tree. There was
   never a wall between them.
2. **Token paths came from the inherited `HERMES_HOME` variable.** A cron child that
   resolved it to the root authenticated as work.
3. **The 2026-08-04 repair made it worse.** It replaced the environment lookup with a
   resolver that picks the most recently modified token across all known locations, and
   mirrored every re-auth into the shared root path.

Defect 3 is why it never stopped. The work profile refreshes its OAuth token constantly
(lead monitor every 30 minutes, triage at 7am, 12pm and 3:50pm); HermesJr refreshes once
or twice a day. So the work token is almost always the newest file on disk, and a resolver
that prefers the newest file hands HermesJr the work credential nearly every run. The
mirroring is the reverse leak: a personal re-auth overwrites the work credential.

**Nothing switches.** No token expires at the wrong moment and nothing resets itself. The
personal profile was configured to search for a credential and take whichever was freshest.

### Why the account guard never caught it

The guard is a separate script. It opens the personal token by explicit path, confirms the
address, and exits. The API layer then resolves a token independently and calls Google with
a different credential. It passed during every one of these incidents.

---

## The repair

Four rules, in priority order:

1. **Pin, never search.** One profile, one absolute token path declared in a `profile.json`
   manifest. No fallback, no modification-time heuristic. A missing token is a hard failure.
2. **Bind identity to the credential.** Every Google client asserts the authenticated
   address matches the profile owner, on the same client object about to be used.
3. **De-nest the directories.** Profile homes become siblings, never parent and child.
4. **Enforce in the OS.** HermesJr runs as its own Windows account with NTFS denying it the
   work secrets. Until then both gateways run as `Jay`, so file permissions cannot tell them
   apart and the wall is only as strong as Hermes' own code.

Repair kit lives in the brain repo at `scripts/homedrums/great-wall/`:

| File | Purpose |
|------|---------|
| `hermes_identity.py` | Enforcement module. Pinned paths, containment checks, live identity assertion. |
| `test_hermes_identity.py` | 11 tests, all passing. Two reproduce the August failure. |
| `great-wall.ps1` | Staged operator script: `audit`, `pin`, `denest`, `separate`, `verify`, `rollback`. |
| `README.md` | Full diagnosis and apply procedure. |

Apply order on Homedrums, elevated PowerShell, gateways stopped first:

```
great-wall.ps1 -Stage audit      (read-only, confirms the diagnosis on the box)
great-wall.ps1 -Stage pin -DryRun
great-wall.ps1 -Stage pin
great-wall.ps1 -Stage verify
great-wall.ps1 -Stage denest
great-wall.ps1 -Stage verify
```

`-Stage separate` is disruptive and interactive; run it while watching.

Every stage backs up to `<name>.bak-greatwall-<timestamp>` and deletes nothing.

---

## What the live run corrected

- **The dual-write was never in `setup.py`.** The AST patcher found no token mirroring there. The
  overwrite came from `google_api.py` writing the refreshed credential back to whatever the
  resolver returned, so the personal profile resolved to the work token file and wrote personal
  credentials into it. Do not go looking for a file copy.
- **The live resolver listed the work token by absolute path** as one of its candidates, so
  de-nesting alone would never have fixed this.
- **By repair time the leak had already run in reverse.** Both token files were byte-identical and
  authenticated as the personal account, so the work Hermes was live on the personal mailbox. No
  work cron fired in that window, so no writes landed. Recovery was a work re-auth, not a restore.

---

## Still open

- **The OS-level wall.** Both gateways still run as the Windows user `Jay`, so NTFS cannot separate
  them and the isolation is enforced by Hermes' own code. `-Stage separate` cannot complete until
  the personal profile stops storing its state inside the work tree: `hermes_cli --profile personal`
  resolves its own state from the root home regardless of `HERMES_PROFILE_HOME`. Tracked as loop
  L154 in `jet-claude-central`.
- **Do not delete `C:\Users\Jay\AppData\Local\hermes\profiles` yet.** It holds the live personal
  state and is locked.
- Cron jobs `e47d92b4a313` (Personal Inbox: Daily Triage), `0ad98a71c1e6` (Insurance Inbox
  Monitor) and `e29fc25c8dd3` (Triage Health Watchdog): retire the account-guard step from the
  triage prompt. It cannot work and it produces false confidence.
- Three promotional emails trashed on `j@jet.events` on 2026-08-02 (two Sur La Table, one
  Instacart). Recoverable from Trash until roughly 2026-09-01.

---

## Rule going forward

Neither profile may hold, resolve, or fall back to the other's credential. A profile that
cannot prove which account it is holding does not run.
