# Café Fausse

Responsive React + Flask restaurant website based on the supplied SRS. It includes the menu, restaurant story, gallery lightbox, reservation availability/30-table assignment, and newsletter sign-up.

## Run locally

1. Install the front-end packages: `npm install`
2. Start the site: `npm run dev`
3. In a second terminal, install the API requirements: `python -m pip install -r backend/requirements.txt`
4. Start the API: `python backend/app.py`

The API runs at `http://localhost:5000`; the Vite development site runs at the URL Vite reports. In the absence of `DATABASE_URL`, the API uses a local SQLite file for a zero-configuration preview.

## PostgreSQL deployment

Set `DATABASE_URL` to a valid PostgreSQL connection string, for example:

`postgresql://username:password@localhost:5432/cafe_fausse`

Install the dependencies and start `backend/app.py`. On startup it initializes `customers` and `reservations`. The production database provides customer ID/name/email/phone/newsletter fields and reservation ID/customer/time/table fields. Serve the built front end (`npm run build`) with any static host and set `VITE_API_URL` to the deployed API base URL before building.
