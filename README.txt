G.K.K LAW Website — README

Static website for G.K KIMANI & ASSOCIATES ADVOCATES. No build step or server needed.

Files
File	Purpose
index.html	Public website
styles.css	Website styles
script.js	Website behaviour (team, FAQs, chatbot engine, enquiry form, tracking)
data.js	Default content: team, practice areas, FAQs. Also used by the admin
ai-kb.js	AI Legal Consultant knowledge base (about 30 Kenyan law topics)
admin.html, admin.css, admin.js	Admin console
images/	Team portraits (geoffrey, george, brian, simon) and corporate.jpg

Upload all files together, keeping the images folder next to index.html.

Deploying

Upload to any static host (GitHub Pages, Netlify, cPanel and so on). Open index.html for the site and admin.html for the console.

Admin console
Login: admin.html, password lawgkk@gmail.com. Change it under Security & backup.
Sessions: expire after 2 hours. Five wrong attempts lock sign-in for 60 seconds.
Sections:
Dashboard: visits, enquiries, chatbot topics.
Enquiries: search, status, notes, reply by email or WhatsApp, CSV export, manual entry.
Team: edit text, upload photos (auto-cropped), add, remove or reorder members.
Practice areas and FAQs.
Articles: appear in the Legal Knowledge section.
AI Consultant: custom answers and the log of visitor questions.
Site settings: announcement bar and enquiry endpoint.
Security & backup: change password, export or import JSON, reset.
Important limitations
Admin data is stored in the browser's localStorage. Edits appear on the website only in the same browser, and enquiries show only if they were submitted from that browser.
To receive enquiries from all visitors, set an enquiry endpoint (Google Apps Script web app or Formspree URL, https only) under Site settings. The form then also POSTs each enquiry as JSON.
To make edits permanent for everyone, edit data.js (or send the exported backup to your developer).
The login is a convenience gate, not real security. Protect admin.html with your host's password protection for real access control. Do not store sensitive client documents in it.
Editing the default content
Team: data.js → team (name, role, bio, areas, photo path, links). To replace a photo, overwrite the matching file in images/ (4:5 portrait, about 800×1000).
FAQs and practice areas: data.js.
Chatbot topics: ai-kb.js. Each topic has keywords (kw), an answer (a), follow-up questions (f) and optional action buttons. Use **bold** and lines starting with •  for lists.
Contact details: search for +254706048083, +254715707574 and lawgkk@gmail.com in index.html and script.js.
Notes
The AI Legal Consultant runs fully in the browser with no API key. It gives general information only, not legal advice. Have an advocate review ai-kb.js before launch and update it when laws change.
External libraries load from CDNs (Tailwind, Font Awesome, Google Fonts), so an internet connection is needed for full styling.
The 10-second services popup, loader, court tools and news desk are unchanged.
