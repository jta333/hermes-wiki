# Email Triage Rules

> See also: [[30-Systems/Cron-Jobs]], [[30-Systems/Systems-Index]]

---

## Two-Label Rule

Every email in inbox gets exactly **one urgency label + one subject label**. No exceptions. Once both are applied, remove INBOX (archive it).

---

## Urgency Labels

| Label | ID | When to use |
|-------|-----|------------|
| `___URGENT` | Label_2349044306460253095 | Needs Jay's attention today, time-sensitive, client/legal/financial impact |
| `__Today` | Label_1840303639641381457 | Should be handled today but not on fire |
| `_Routine` | Label_6204995643768620522 | Informational, FYI, low urgency |

---

## Subject Labels

| Label | ID | When to use |
|-------|-----|------------|
| `JET Business` | Label_138463780657347624 | Default for all business — employees, vendors, receipts, tax, insurance, etc. |
| `Personal` | Label_6942977917443977791 | ONLY emails to/from Jay personally or friends/family. Nothing else. |
| `Travel` | Label_2927841856630056008 | Airlines, rideshare, hotels, trains, car rental — anything travel |
| `EODs & V.C.` | Label_4711058082521983690 | EOD reports, calendar notifications |
| `Website Quote Requests` | Label_1826002741649343626 | Inbound leads via website contact form |
| `Clients/*` | Various | Client-specific label — if present, do NOT also add JET Business |

---

## Personal Label — Hard Rule

`Personal` is **only** for:
- Emails Jay sends to himself
- Emails from friends or family

**Never use Personal for:** employees, vendors, receipts (Instacart, DoorDash, etc.), shipping, tax, insurance, AI platform charges, meeting invites, or anything business-related.

**If unsure: stop and ask Jay. Never guess.**

---

## Auto-Trash

- Sur La Table marketing emails → trash immediately, no label

---

## Travel Senders

United, Delta, Southwest, American Airlines, Alaska Airlines, Krisflyer, Singapore Air, Amtrak, Lyft, Uber, Hertz, Marriott, Hilton, Hyatt, Airbnb, Expedia, Booking.com

---

## Triage Script

- Path: `C:\Users\Jay\AppData\Local\hermes\scripts\inbox_triage.py`
- Fix script: `C:\Users\Jay\AppData\Local\hermes\scripts\triage_fix.py`
- Runs at: 7am, 12pm, 3:50pm PT weekdays via cron
- **Archive rule:** remove INBOX in the same API call as labeling — never label without archiving
- **Thread-level audit:** Gmail shows aggregated thread labels. Audit violations at thread level using `threads().get()`, not `messages().list()`
- **Clients/* check:** if a message already has a `Clients/*` label, do NOT add `JET Business` on top

---

## Known Bugs Fixed (Jun 8 2026)

1. Pre-labeled emails were skipped without archiving (missing `removeLabelIds: ['INBOX']`)
2. Newly labeled emails never had INBOX removed (same bug)
3. `SUBJECT_IDS` set didn't include `Clients/*` labels — those emails were never recognized as fully labeled
4. `add_labels` could be empty when client label present, causing silent API error
