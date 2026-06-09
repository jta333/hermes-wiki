# Cron Jobs

> See also: [[30-Systems/Systems-Index]], [[50-Operations/Email-Triage-Rules]]

---

## Active Jobs

### Recurring

| Job ID | Name | Schedule | Deliver | Status |
|--------|------|----------|---------|--------|
| 46930f8972e2 | JET Morning Briefing | 7am PT weekdays | Google Chat | OK |
| a9352a7a80b2 | JET Production Meeting Prep | 7am PT weekdays | Google Chat | OK |
| 7d6d0d562917 | JET Email Triage LLM Pass | 7am + 12pm PT weekdays | local | Error (budget) |
| e5105a0e2a90 | JET Email Triage 3:50pm | 3:50pm PT weekdays | local | OK |
| 0d20d75bf7f0 | JET Lead Monitor | Every 30 min | ntfy | OK |
| e3914e2409b7 | Plaud Transcript Auto-Filer | Hourly 12-5pm Mon-Fri | Google Chat | OK |
| 95a6afc10f75 | Plaud Transcript Auto-File (script) | Hourly 12-5pm Mon-Fri | Google Chat | Fixed Jun 8 |
| cc3cd60d075e | Hermes Wiki Daily Update | 1am PT daily | local (silent) | OK |
| f1a293a76ece | Auto-Forward TN TNTAP to Cati | Daily | local | Pending first run |

### One-Shot Pending

| Job ID | Name | Fires | Deliver |
|--------|------|-------|---------|
| 244dc7de8fc2 | Follow Up: Travelers Insurance, Cecilia | Jun 10 10:37am | Google Chat |
| 5f2dc2699112 | Follow Up: VIP EVENT, Lee Teva | Jun 10 5:31pm | Google Chat |
| 1915229f84cb | Follow Up: Caroline, Trustpilot | Jun 9 10:30am | Google Chat |
| 9d17df2b7ff5 | Reminder: Wire Transfer Form, Aleksandra | Jun 9 10:30am | Google Chat |
| 2c5a9aad99ac | Reminder: Update doc + notify Aleksandra | Jun 9 11am | Google Chat |
| 32d242f3c159 | LVCVA Listing Follow-Up | Jun 12 9am | ntfy |
| 4e65524dd174 | Reminder: AI for Founders Jun 11 | Jun 11 10am | ntfy |

---

## Notes

- OpenRouter budget limit was exceeded Jun 8 — all LLM-based crons returned 403. Fix: raise cap at https://openrouter.ai/settings/limits
- Plaud Auto-File (95a6afc10f75) was pointing to Telegram (delivery error) — fixed to Google Chat Jun 8
- Duplicate Caroline reminder at 9am (887d6a9dd65c) removed Jun 8. Rule: no reminders Tuesdays 9-10am.
- Wiki cron rescheduled from 8pm weekdays → 1am daily on Jun 8; compaction logic added
