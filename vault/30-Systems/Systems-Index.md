# Systems Index

> See also: [[30-Systems/Cron-Jobs]], [[30-Systems/Hermes-Config]], [[30-Systems/Devices]]

---

## Hermes Agent

- **Host machine:** Homedrums (Windows 10, Las Vegas)
- **Profile:** default
- **Gateway:** Google Chat via Pub/Sub, runs as Windows Scheduled Task "Hermes_Gateway"
- **Auto-start:** S4U logon, starts at logon and boot, survives logged-off sessions
- **Default model:** claude-sonnet-4.6 via OpenRouter (Jay's INFERENCE key)
- **Aliases:** `/model opus` and `/model sonnet` for per-thread switching
- **Source of truth repo:** https://github.com/jta333/jet-claude-central

---

## Devices

| Device | OS | Tailscale IP | Role |
|--------|-----|-------------|------|
| Homedrums | Windows 10 | 100.100.54.91 | Gateway host, always-on |
| Aura | Windows (laptop) | 100.105.21.92 | Jay's main dev laptop |
| StudioPro | Windows (laptop) | 100.75.154.98 | Secondary dev machine |
| Galaxy Fold 7 | Android | 100.88.65.64 | Jay's phone |
| JetNAS | Synology | 100.99.185.57 | NAS storage |

---

## Integrations

| Service | Status | Notes |
|---------|--------|-------|
| Google Chat | Connected | Home channel: spaces/AAQAhsusdV8 |
| Telegram | Connected | Home: 8424767843 |
| ntfy | Connected | Topic: jc3jtajc3 |
| Google Workspace (Gmail, Calendar, Drive, Docs, Sheets, Contacts) | Connected | OAuth token at ~/.hermes/google_token.json |
| GitHub | Connected | PAT as jta333, token in ~/.git-credentials |
| OpenRouter | Connected | INFERENCE key, ~$50/mo budget cap |

---

## Cron Jobs

> Full cron job list: [[30-Systems/Cron-Jobs]]

| Job | Schedule | Purpose |
|-----|----------|---------|
| JET Morning Briefing | 7am PT weekdays | Email + calendar summary |
| JET Production Meeting Prep | 7am PT weekdays | Prep doc for Monday meeting |
| JET Email Triage LLM Pass | 7am + 12pm PT weekdays | Label and archive inbox |
| JET Email Triage 3:50pm | 3:50pm PT weekdays | Afternoon inbox pass |
| JET Lead Monitor | Every 30 min | New leads via ntfy |
| Plaud Transcript Auto-Filer | Hourly 12-5pm PT Mon-Fri | Files Plaud/Gemini transcripts |
| Hermes Wiki Daily Update | 1am PT daily | Update and compact wiki |
| Auto-Forward TN TNTAP | Daily | Forward TN tax emails to Cati |

---

## Key File Paths

| File | Path |
|------|------|
| Hermes home | `C:\Users\Jay\AppData\Local\hermes\` |
| Google OAuth token | `C:\Users\Jay\AppData\Local\hermes\google_token.json` |
| Email triage script | `C:\Users\Jay\AppData\Local\hermes\scripts\inbox_triage.py` |
| Triage fix script | `C:\Users\Jay\AppData\Local\hermes\scripts\triage_fix.py` |
| Plaud auto-file script | `C:\Users\Jay\plaud_transcript_handler.py` |
| JET master-brain repo | `C:\Users\Jay\AppData\Local\hermes\jet-claude-central\` |
| Hermes wiki repo | `C:\Users\Jay\AppData\Local\hermes\hermes-wiki\` |
