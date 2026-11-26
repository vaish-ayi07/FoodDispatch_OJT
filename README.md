# FoodDispatch

A static, browser-based demo for Customer, Restaurant and Delivery Partner roles. No build step or backend is required.

## Project structure

| Page | HTML | CSS | JavaScript |
|---|---|---|---|
| Home / sign-in | `index.html` | `css/landing.css` | `js/session.js`, `js/shared-orders.js`, `js/landing-images.js`, `js/landing.js` |
| Customer | `customer.html` | `css/customer.css` | `js/session.js`, `js/shared-orders.js`, `js/customer-images.js`, `js/customer.js` |
| Driver | `driver.html` | `css/driver.css` | `js/session.js`, `js/shared-orders.js`, `js/driver.js` |
| Restaurant | `restaurant.html` | `css/restaurant.css` | `js/session.js`, `js/shared-orders.js`, `js/restaurant.js` |

The `*-images.js` files contain embedded image data. Keep them in place and load them before their matching page script. Existing CSS animation and reveal effects are retained.

## Run locally

Use a local web server rather than opening the pages as `file://` URLs. For example, from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

Sign in through `index.html` and open the role pages in separate tabs in the **same browser**. They must use the same host and port for browser `localStorage` to be shared.

## Shared order demo

`js/shared-orders.js` provides a common same-origin `localStorage` order record (`fooddispatch_shared_orders_v1`). Customer checkout creates a shared order. The restaurant page imports it into the queue and publishes restaurant status changes. The driver page imports Ready / Preparing shared orders; driver pickup and delivery status updates are written back. The customer tracking page reads shared status, driver name, position and ETA updates.

This is a front-end demonstration only. Browser storage is not a secure database, cross-device sync is not available, and role checks are client-side demo logic. Do not use real customer or payment information.

## External services and API keys

The customer page uses Leaflet / OpenStreetMap resources and external routing where available. Restaurant and driver map views use built-in simulated map fallbacks by default, so no Google Maps key is required. If you choose to enable Google Maps later, add your own key locally and restrict it by HTTP referrer and API. Do not commit unrestricted credentials. Any key that was present in an earlier copy should be rotated in Google Cloud Console before making the repository public.

## Known scope notes

- This remains a localStorage demo, not a production dispatch service or real GPS stream.
- The existing responsive CSS has been preserved to avoid breaking the visual design. Bootstrap 5 has not been added because its global component styles can conflict with the existing custom classes; the explicit Bootstrap requirement should be treated as outstanding unless the project is safely migrated and re-tested.
- Use synthetic sample data only.
