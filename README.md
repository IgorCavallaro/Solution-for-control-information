# Church Service Attendance Dashboard

A simple, no-cost tool to log attendance per church service (adults, children,
infants, visitors, decisions for Christ) and view monthly indicators. Built
for teams that don't yet have this feature in their main management tool
(ChMS, spreadsheet, etc.) and need something quick, easy for anyone on the
team to use, without waiting on budget approval for a new tool.

![status](https://img.shields.io/badge/status-stable-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

## Why this project exists

Most ChMS (Church Management Systems) treat "attendance per service" as an
advanced feature. When it exists at all, it usually ships after donation and
communication features. Smaller teams, or teams switching tools, often end up
relying on WhatsApp, loose spreadsheets, or plain memory.

This project solves that with as little friction as possible:

- **Zero installation** for anyone who just needs to log data (it's an HTML page).
- **Zero infrastructure cost** (uses Google Sheets as the database).
- **Truly shared data** between anyone who opens the link, not tied to a
  single browser or device.

## Features

- Service registration with adults, children, infants (total calculated
  automatically), visitors, and decisions for Christ.
- Categorization by service type (configurable).
- Monthly indicators dashboard (totals, averages).
- History with filters by date range, service type, and text search.
- CSV export of the filtered period.
- Bar and distribution charts built in plain SVG/CSS (no external library
  dependency, see [Technical decisions](#technical-decisions)).

## Architecture

```
+------------------+       fetch (JSON)        +------------------------+
|   index.html     | -------------------------> |  Google Apps Script    |
| (plain HTML/CSS/  | <------------------------- |  (Web App, doGet/     |
|  JS, no build)     |                             |   doPost)              |
+------------------+                             +-----------+------------+
                                                              |
                                                              v
                                                    +--------------------+
                                                    |   Google Sheets    |
                                                    |  (database)        |
                                                    +--------------------+
```

There's no build step, framework, or Node dependency. Just open
`index.html` in any browser.

## Setup

### 1. Backend (Google Sheets + Apps Script)

1. Create a new spreadsheet in [Google Sheets](https://sheets.google.com).
2. Menu **Extensions -> Apps Script**.
3. Delete the default content and paste in the contents of
   [`backend/apps-script-backend.gs`](backend/apps-script-backend.gs).
4. Save.
5. **Deploy -> New deployment**.
6. Type: **Web app**. Execute as: **Me**. Who has access: **Anyone**.
7. Deploy and authorize the requested permissions.
8. Copy the generated URL (it ends in `/exec`).

> Any time you edit the script afterward, you'll need to create a new
> deployment (or a new version of the existing deployment) for the changes
> to take effect on the published URL. That's a quirk of Apps Script itself.

### 2. Frontend (`index.html`)

```bash
cp config.example.js config.js
```

Edit `config.js` and paste in your Web App URL:

```js
window.APP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/YOUR_ID_HERE/exec'
};
```

`config.js` is listed in `.gitignore`. It should never be committed, since
it holds the URL of your specific backend.

### 3. Publish/distribute

Any of these options work, since it's plain HTML/CSS/JS:

- Upload the files (`index.html` + `config.js`) to any static host
  (GitHub Pages, Netlify, Vercel, a Google Drive hosting extension, etc.).
- Simply share `index.html` and `config.js` together by email/Drive for
  small teams.

## Customization

- **Service types:** edit the `<option>` elements inside
  `<select id="r-tipo">` in `index.html` (and mirror the same options in
  the `<select id="h-tipo">` history filter).
- **Colors/branding:** every color uses CSS variables in `:root`
  (`--app-blue`, `--app-navy`, etc.). Changing the values there updates the
  whole interface.

## Technical decisions

- **Google Sheets as the database**, instead of a "real" database: for the
  data volume of a small or mid-size church (a handful of records per week),
  this is enough, it's free, and anyone on the team can open the sheet and
  understand the raw data without technical knowledge. Conscious trade-off:
  not the right choice if write volume grows a lot (Apps Script has daily
  execution quotas).
- **Charts in plain SVG/CSS, no Chart.js or similar:** the first version
  used Chart.js via CDN, but loading external scripts isn't guaranteed in
  every execution environment (for example, inside sandboxed iframes). We
  switched to hand built charts to remove that network dependency entirely.
- **No build step or framework:** the goal was an artifact that anyone on
  the team (not just developers) could open and understand, and that could
  be hosted anywhere without a build pipeline.

## Known limitations

- No per-user authentication. Anyone with the file link and the backend URL
  can read and write data. Fine for internal team use, not for sensitive or
  public data.
- Google Apps Script has daily execution quotas (generous for the intended
  use, but they exist).
- Without user control, there's no log of who edited what.

## Possible roadmap

- [ ] Simple authentication (e.g. a shared team password).
- [ ] Log of who created/edited each record.
- [ ] Support for multiple campuses/locations.
- [ ] Excel (.xlsx) export, in addition to CSV.

## License

[MIT](LICENSE). Use, copy, and adapt freely.
