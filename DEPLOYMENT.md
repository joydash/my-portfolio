# Deployment guide — GitHub → Vercel → Namecheap (joydash.me)

## 1. Push to GitHub

The repository is already initialised with a clean first commit on `main` (`.env.local` is git-ignored).

```bash
cd my-portfolio
git remote add origin https://github.com/joydash/my-portfolio.git
git push -u origin main
```

Create the empty repo `joydash/my-portfolio` on GitHub first (no README/license) if it doesn't exist yet.

## 2. Check locally (recommended)

```bash
npm install
npm run lint
npm run build
```

## 3. Deploy on Vercel

1. Vercel dashboard → **Add New… → Project** → import `joydash/my-portfolio`. Framework preset: **Next.js** (auto-detected).
2. Before clicking Deploy, open **Environment Variables** and add (Production, Preview, Development):
   - `RESEND_API_KEY` = your key from <https://resend.com/api-keys>
   - `CONTACT_EMAIL` = `info@joydash.me`
   - `CONTACT_FROM` = `Portfolio Contact <contact@joydash.me>` (add this after step 6 verifies the domain in Resend)
3. Click **Deploy**.
4. **Project → Settings → Domains**: add `joydash.me` and `www.joydash.me`. Set one as primary and let the other redirect to it (recommended: `joydash.me` primary, `www` → redirects to it).
5. Vercel shows the DNS records it expects. If they differ from the values below, use Vercel's values.

## 4. Namecheap — point the domain to Vercel

1. Namecheap → **Domain List** → **Manage** next to `joydash.me` → **Nameservers** must be **Namecheap BasicDNS** (not "Custom DNS").
2. Open the **Advanced DNS** tab.
3. **Delete the default parking records**: the `CNAME www → parkingpage.namecheap.com` record and the `URL Redirect Record @` record.
4. Add:

   | Type         | Host  | Value                  | TTL       |
   | ------------ | ----- | ---------------------- | --------- |
   | A Record     | `@`   | `76.76.21.21`          | Automatic |
   | CNAME Record | `www` | `cname.vercel-dns.com` | Automatic |

5. Save. DNS usually propagates in minutes (up to a few hours). Back in Vercel → Domains, both entries should turn to **Valid Configuration** and an SSL certificate is issued automatically.

## 5. Namecheap — make `info@joydash.me` receive email

**Option A: Namecheap Email Forwarding (free, simplest — receive only)**

1. Advanced DNS → **Mail Settings** → choose **Email Forwarding**.
2. Click **Add Forwarder** → Alias `info` → forward to the inbox you actually read → save.
3. Namecheap adds the forwarding **MX** records and an **SPF TXT** record automatically. They should look like:

   | Type | Host | Value                                                  | Priority |
   | ---- | ---- | ------------------------------------------------------ | -------- |
   | MX   | `@`  | `eforward1.registrar-servers.com`                      | 10       |
   | MX   | `@`  | `eforward2.registrar-servers.com`                      | 10       |
   | MX   | `@`  | `eforward3.registrar-servers.com`                      | 10       |
   | MX   | `@`  | `eforward4.registrar-servers.com`                      | 15       |
   | MX   | `@`  | `eforward5.registrar-servers.com`                      | 20       |
   | TXT  | `@`  | `v=spf1 include:spf.efwd.registrar-servers.com ~all`   | —        |

   If what Namecheap generates differs from this table, keep Namecheap's values.

   Forwarding does not let you *send* as `info@joydash.me`. If you want to reply from that address, use Option B.

**Option B: a hosted mailbox (Zoho Mail / Google Workspace)** — follow the provider's setup wizard, which gives you its own MX and SPF values. Remove the Namecheap forwarding MX records first; a domain should have exactly **one** SPF TXT record on `@`.

> Never add two `v=spf1` TXT records on the same host — merge them into one.

## 6. Resend — send the contact-form emails from your domain

1. <https://resend.com/domains> → **Add Domain** → `joydash.me`.
2. Resend shows DNS records (a DKIM TXT on `resend._domainkey`, plus MX and SPF TXT on the `send` subdomain). Add them in Namecheap **Advanced DNS** exactly as shown — enter only the host part (e.g. `resend._domainkey`, `send`), not the full domain. These sit on different hosts from your root records, so they do not conflict with Email Forwarding.
3. Click **Verify** in Resend, then set `CONTACT_FROM` in Vercel and **redeploy** (Deployments → ⋯ → Redeploy) so the variable takes effect.
4. Optional: add a DMARC record — TXT, Host `_dmarc`, Value `v=DMARC1; p=none; rua=mailto:info@joydash.me`.

## 7. Final checks

- `https://joydash.me` and `https://www.joydash.me` both load over HTTPS and one redirects to the other.
- Send a test message from the contact form → it arrives at `info@joydash.me` (and your forwarded inbox) with a working Reply-To.
- Click **Copy Email** (toast appears) and **Download CV**.
- `https://joydash.me/sitemap.xml` and `/robots.txt` respond.
- Paste the URL into LinkedIn's Post Inspector or any chat app to confirm the preview card (`/og.png`).
- Submit the site in Google Search Console (add `joydash.me` as a Domain property using a TXT record, then submit `sitemap.xml`).

## Troubleshooting

| Symptom                                    | Likely cause / fix                                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Domain shows "Invalid Configuration"       | Old parking records still present, or nameservers not on BasicDNS. Remove them and wait a few minutes.     |
| Contact form says "not configured"         | `RESEND_API_KEY` missing in Vercel for that environment — add it and redeploy.                             |
| Form says "Could not send your message"    | `CONTACT_FROM` domain not verified in Resend yet. Remove `CONTACT_FROM` or finish step 6.                  |
| Mail to `info@` bounces                    | MX records missing/duplicated, or the forwarder alias isn't created.                                       |
| CV still shows the old file                | Hard-refresh; the PDF is cached by the browser. Redeploy after replacing `public/cv.pdf`.                  |
