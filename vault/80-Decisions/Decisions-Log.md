# Decisions Log

> See also: [[60-Open-Loops/Open-Loops]], [[30-Systems/Systems-Index]]

Durable decisions made with date and context. These should not need to be re-litigated.

---

## 2026-06-08

- **Personal label rule finalized:** Personal = only emails to/from Jay personally or friends/family. Everything else defaults to JET Business. If unsure, ask Jay — never guess. → [[50-Operations/Email-Triage-Rules]]
- **Email triage audit must happen at thread level**, not message level. Gmail aggregates thread labels in UI.
- **inbox_triage.py** rewritten to archive atomically (remove INBOX in same API call as labeling).
- **OpenRouter budget cap hit.** Fix: raise at https://openrouter.ai/settings/limits
- **Tennessee TNTAP emails auto-forward to Cati** going forward.
- **Wiki updated to 1am PT daily** with compaction logic (was 8pm weekdays).
- **No reminders Tuesdays 9-10am** — Jay's blocked window.

---

## 2026-06-05

- **Jay out of office auto-reply** active June 5-8, Chelsea Blake handling escalations.
- **Form 5500 ADP compliance** deadline July 14 surfaced — needs Jay action.

---

## 2026-06-04

- **World of Concrete 2027 (Reading Truck)** flagged URGENT — 30x40 booth for Jan 2027, planning kickoff needed.
- **IPMI payment issue escalated** — Annie Gala on-site Jun 13, event Jun 14-15, payment unresolved.

---

## 2026-06-03

- **Invoice design direction:** monochrome only (black/white/gray). No teal, no color. McKinsey/architecture firm aesthetic.
- **Email triage approach:** LLM Reasoning Pass cron (Haiku 4.5), two-label rule with archive, 7am/12pm/3:50pm weekdays.
- **Verify-before-flagging rule:** always check sent mail before telling Jay something needs attention.
- **Task list format:** numbered items, Jay can say "1 is done, push 2 to tomorrow."

---

## 2026-06-02

- **Tailscale** confirmed as VPN mesh for all devices. No port forwarding needed.
- **Jay Voice skill v2.0** = canonical writing style guide. Load before writing anything as Jay.
- **Cron reminder timezone rule:** default 10am PT when Jay is traveling (safe for both PT and ET).

---

## 2026-06-01

- **Default model:** Sonnet 4.6 (cost-conscious). Opus only on demand via `/model opus`.
- **OpenRouter spending cap:** $50/mo.
- **Hot list** lives in Google Doc in _Hermes Drive folder.
- **Wiki hosted** on GitHub Pages (jta333.github.io/hermes-wiki).
- **Homedrums auto-login** configured so gateway survives reboots without PIN prompt.
