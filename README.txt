G.K.K LAW — ADVANCED STATIC DEPLOYMENT

Upload these files together:
- index.html
- styles.css
- script.js
- admin.html

GitHub Pages:
1. Put all four files in the repository root.
2. Commit/push.
3. Settings -> Pages -> Deploy from branch -> main -> /root.
4. Open the generated Pages URL.

Important:
- No Cloudflare/Netlify/Vercel is required for this frontend.
- The enquiry button works without Formspree by opening the visitor's email client and providing a WhatsApp fallback.
- The AI Legal Consultant is a self-contained on-page information assistant; it does not call a paid AI API.
- Official Judiciary/Kenya Law links remain external links.
- The 10-second services popup is shown once per browser session.
- The admin.html page is a visual/static admin console. It is NOT a secure multi-user backend. Do not put passwords, API secrets or confidential client records into static JavaScript/localStorage.
