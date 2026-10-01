# Githu Varghese - Portfolio

A responsive, static portfolio built with HTML, CSS, and vanilla JavaScript. No build step or frontend dependencies are required.

## Preview

Open [index.html](index.html) directly in a browser. Fonts and Boxicons load from their respective CDNs; the layout uses fallback fonts if the font service is unavailable.

The layout adapts to phones, tablets, and desktops. Navigation supports keyboard access, Escape-to-close, and reduced-motion preferences.

## Experience Dates

- Career start, including internships: **02 September 2022**.
- Full-time employment start: **02 January 2023**.
- Experience uses completed calendar years and months in the `Asia/Kolkata` time zone. It never rounds up before an anniversary and never counts internships as full-time employment.
- Values refresh on page load, every minute, and when the page becomes visible again. The short statistics and longer About Me values use the same calculation in [js/index.js](js/index.js).
- Without JavaScript, the page displays the start dates instead of a stale year count. Search engines receive date-based metadata.
- The calculation assumes continuous experience from each supplied date. Update the `data-experience-start` attributes if a start date changes; employment breaks would need explicit date ranges.

## Netlify Deployment

Keep the existing static setup: no framework migration, Python service, or npm install is needed. Import the repository into Netlify with the project root as the base directory, no build command, and `.` as the publish directory. These settings are also in [netlify.toml](netlify.toml).

Redeploy after content changes. Enable form detection and configure email notifications as described below. The date counters update in the browser without rebuilding the site.

## Contact Form

- **Netlify:** Enable form detection in the site's Forms settings before deploying. The `portfolio-contact` form is submitted to Netlify, not to a visitor's localhost. Configure a form notification in Netlify to receive submissions by email.
- **Local preview:** Opening the file directly or using localhost creates an email draft. The visitor must open the draft in their email application and send it; the page never claims that a draft has been delivered.
- **Optional FastAPI backend:** Set `data-endpoint="https://your-api.example/send-email"` on the `contactForm` element to use your deployed API instead of Netlify Forms. Set `PORTFOLIO_EMAIL_PASSWORD` in the backend environment. The static site does not start or deploy the Python server.
- HTTP errors, backend rejections, network errors, and request timeouts preserve the visitor's message and show an error with a direct-email alternative.

**Security:** The mail backend previously contained a hard-coded SMTP app password. Revoke that password and create a replacement before using the backend. Removing the value from the current file does not revoke it or remove it from Git history. Never commit the replacement.

## Checks

```powershell
node --check js/index.js
node --test tests/experience.test.cjs
python -m py_compile app.py
```

Browser checks should cover 320px phones through 1920px desktops, short landscape screens, menu focus and resizing, anchor offsets, expandable work summaries, experience refreshes, form validation, mocked delivery failures, and reduced-motion behavior. Live delivery requires a configured Netlify form or deployed API and must be verified separately.

The selected-work summaries describe engineering areas without inventing client names, performance metrics, or public demos. The older, client-specific project markup remains commented out until those projects are ready to publish.
