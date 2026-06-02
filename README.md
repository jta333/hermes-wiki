# Jay × Hermes — Memory Wiki

A dark, minimal static wiki for tracking daily sessions, decisions, and open items between Jay Castellano and Hermes Agent.

## Structure

```
hermes-wiki/
├── index.html          # Single-page app shell
├── assets/
│   ├── style.css       # Dark theme (Linear/Notion aesthetic)
│   └── app.js          # Vanilla JS app — reads data/
├── data/
│   ├── logs.json       # Daily session logs
│   ├── topics.json     # Topic index with counts
│   └── meta.json       # Site metadata
├── .nojekyll           # Disables Jekyll processing on GitHub Pages
└── README.md
```

## Features

- **Recent Activity** — last 7 days of sessions at a glance
- **Today view** — quick look at today's session, open items, and decisions
- **Daily Logs** — full chronological archive, expandable cards
- **Topics** — tag cloud with filtered session views
- **Live search** — filters across all content in real time
- **Mobile responsive** — sidebar on desktop, tabs on mobile

## Design

- Background: `#0d0d0d` | Cards: `#161616` | Accent: `#4f7fff`
- Font: [Inter](https://rsms.me/inter/)
- Zero dependencies — pure HTML/CSS/JS

## Hosting

Push to a GitHub repo and enable **GitHub Pages** from the repo settings (root of `main` branch). The `.nojekyll` file ensures CSS/JS assets are served correctly.

For local development, serve with any static server:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Adding Logs

Edit `data/logs.json` — append a new object at the start of the array:

```json
{
  "date": "2026-06-02",
  "title": "Session Title",
  "summary": "2-3 sentence summary.",
  "topics": ["Topic1", "Topic2"],
  "work_done": ["Item 1", "Item 2"],
  "key_decisions": ["Decision 1"],
  "open_items": ["Open item 1"]
}
```

Also update `data/topics.json` counts and `data/meta.json` timestamps.

---

*Maintained by Hermes Agent — last bootstrap: 2026-06-01*
