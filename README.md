# TechBlanc Agency Template

A modern, professional 4-page website template (Home, Portfolio, Pricing, Contact) built with semantic HTML, modern CSS (Flexbox/Grid), and vanilla JavaScript.

## Structure

- `index.html` — Home
- `portfolio.html` — Work grid with filters + modal
- `pricing.html` — Tiered pricing
- `contact.html` — Contact form with client-side validation and optional EmailJS send
- `css/style.css` — Global styles, components, responsive rules
- `js/main.js` — Interactions (menu, scroll effects, tilt/parallax, counters, filters, modal, validation, pricing toggle)
- `assets/` — Logo and placeholders
- `demos/` — Simple demo pages for portfolio items

## Customize

- Replace `assets/logo.png` with your logo
- Update colors in `:root` within `css/style.css` (primary: `#A3C4F3`, gray: `#666666`)
- Swap placeholder thumbnails (`.ph1`…`.ph6`) with real images in `assets/images` and update project cards in `portfolio.html`
- Replace contact details in `contact.html`

## Email sending (EmailJS)

This template can send the Contact form via EmailJS (no backend needed).

1. Create a free EmailJS account at `https://www.emailjs.com`
2. Add an Email Service and create an Email Template with variables:
   - `from_name`, `reply_to`, `message`
3. Get your Public Key, Service ID, and Template ID from EmailJS dashboard.
4. In `contact.html`, the EmailJS browser SDK is loaded:
   ```html
   <script
     src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
     defer
   ></script>
   ```
5. In `js/main.js`, replace placeholders:
   ```js
   emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
   // and later in send(...)
   emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
     from_name: name.value,
     reply_to: email.value,
     message: message.value,
   });
   ```
6. Test the form on `contact.html`. On success you’ll see the success message. Errors show a simple alert.

Notes:

- Keep your Public Key safe. Use environment-based injection for production when possible.
- For GDPR/consent, add a required checkbox before submitting.

## Notes

- Fully responsive; mobile nav included
- Accessible: semantic tags, ARIA, focusable cards, keyboard controls for modal
- SEO: descriptive titles, meta descriptions, alt text for images
- Performance: no frameworks, minimal JS; consider minifying for production

## Deployment

Use any static host (GitHub Pages, Netlify, Vercel, S3). No build step required.
