# Joy Dash — Portfolio (joydash.me)

Executive-grade personal branding site for a Support Engineer targeting Banking & Enterprise IT roles.
Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4**, deployed on **Vercel**.

## Quick start

```bash
npm install
cp .env.example .env.local     # then add your RESEND_API_KEY
npm run dev                    # http://localhost:3000
```

Before every push:

```bash
npm run lint && npm run build
```

## Update content (no code changes needed)

Everything lives in **`src/data/portfolio.ts`**:

| To change…                | Edit                                   |
| ------------------------- | -------------------------------------- |
| Name, email, links, CTA   | `site`                                 |
| Bio paragraphs            | `about`                                |
| Strip cards / pillars     | `highlights`, `pillars`                |
| Jobs and bullets          | `experience`                           |
| Projects                  | `projects` (add an object)             |
| Skills matrix             | `skillGroups`                          |
| Certifications            | `certifications`                       |
| Education                 | `education`                            |

### Add a project

Append an object to `projects`. Set `category` to `"network"` or `"systems"` (or add a new filter in `projectFilters`).
Optional fields: `live`, `repo` (show Live/GitHub buttons) and `image` (put a screenshot in `public/images/projects/` and use `"/images/projects/name.png"`).

### Replace the CV

Overwrite **`public/cv.pdf`** — the Preview and Download buttons update automatically.
Keep the public CV free of date of birth, home address, family details and references' phone numbers.

### Replace the photo

`public/images/joy.webp` is a transparent PNG-style cut-out (990×1290). Replace it with another transparent image of the same ratio for the best result (a clean background-removal tool gives a sharper edge than the automatic cut-out used here).

## Contact form

`POST /api/contact` validates input, applies a honeypot and a simple per-IP rate limit, then sends the message through **Resend** to `CONTACT_EMAIL` (default `info@joydash.me`) with the visitor's address as Reply-To.

| Variable         | Required | Purpose                                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------------------- |
| `RESEND_API_KEY` | yes      | Resend API key                                                                           |
| `CONTACT_EMAIL`  | yes      | Delivery address — `info@joydash.me`                                                     |
| `CONTACT_FROM`   | optional | Sender, e.g. `Portfolio Contact <contact@joydash.me>`. Needs the domain verified in Resend |

If `RESEND_API_KEY` is missing the form shows a friendly message pointing visitors to the email address, and the Copy Email / `mailto:` fallbacks keep working.

## Project structure

```
src/
  app/            layout (SEO, fonts), page, sitemap.ts, robots.ts, api/contact
  components/     Navbar, Hero, NetworkCanvas, About, Pillars, ExperienceTimeline,
                  Projects (+ modal), Skills, Certifications, EducationSection,
                  Contact (+ CopyEmail, CvActions, ContactForm), Footer
  data/portfolio.ts   all content
public/           cv.pdf, og.png, images/
```

Deployment and DNS steps: see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
