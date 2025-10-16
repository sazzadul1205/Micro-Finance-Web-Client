# MicroFinance Website

![MicroFinance](https://img.shields.io/badge/MicroFinance-React-blue) ![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue) ![DaisyUI](https://img.shields.io/badge/DaisyUI-2.57-purple) ![No License](https://img.shields.io/badge/License-none-lightgrey)

> ⚠️ **Important — Security & Liability Notice:**
> This project is a demo / educational implementation with **low security** measures. It **must not** be used with real personal, financial, or sensitive data.
> Do **not** deploy this application in production without a full security audit, proper authentication/authorization, encryption of sensitive data, and legal review. I am **not liable** for any misuse, data loss, fraud, or illegal activity (including phishing) resulting from use or deployment of this code.

---

## Table of contents

- [What it is](#what-it-is)
- [Features](#features)
- [Project structure](#project-structure)
- [Component map (quick)](#component-map-quick)
- [Screenshots (placeholders)](#screenshots-placeholders)
- [Installation](#installation)
- [Backend & Auth](#backend--auth)
- [Styling & Responsiveness](#styling--responsiveness)
- [Deployment](#deployment)
- [Security warning (explicit)](#security-warning-explicit)
- [Future improvements](#future-improvements)
- [No license / Liability](#no-license--liability)

---

## What it is

A React (Vite) + Node.js + MongoDB microfinance web app prototype.
Users can register personal, nominee, and bank info, request loans, and view loan history/status. Admins can view/manage users, nominees and loan requests.

This README reflects the actual client tree and components in your repository.

---

## Features

**User side**

- Personal info registration & edit
- Nominee info registration & edit
- Bank info registration & edit
- Loan request form
- Loan history view
- Loan status view

**Admin side**

- View all users & nominees
- Detailed modals for users/nominees
- Loan management dashboard (approve/reject/view)
- Search & filter capabilities (basic)

---

## Project structure (condensed)

```
naziur_rahman_client/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ Hooks/
│  ├─ Layout/         # AdminLayout.jsx, MainLayout.jsx
│  ├─ Pages/
│  │  ├─ Admin/
│  │  ├─ Auth/
│  │  └─ Users/
│  ├─ Routes/         # PrivateRoute.jsx
│  ├─ Shared/         # Shared components (Navbar, TextInput, FileUploadCard...)
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.local
├─ package.json
└─ vite.config.js
```

---

## Component map (quick)

Users:

- `PersonalInfo.jsx`, `NomineeInfo.jsx`, `BankInfo.jsx`
- `Loans.jsx`, `LoanRequest.jsx`, `LoanHistory.jsx`, `LoanStatus.jsx`
- `UserInformationEdit.jsx`, `UserNomineeEdit.jsx`, `UserBankInfoEdit.jsx`

Admin:

- `AllUsers.jsx`, `UsersDetailsModal.jsx`
- `AllNominees.jsx`, `NomineeDetailsModal.jsx`
- `LoanManagement.jsx`, `LoanManagementTable.jsx`

Auth:

- `Login.jsx`, `SignUp.jsx`

Shared:

- `Navbar.jsx`, `FileUploadCard.jsx`, `TextInput.jsx`, `SignaturePad.jsx`, shared lists (loan options)

---

## Screenshots (placeholders)

_User Dashboard_
![User Dashboard](https://pokinski.com/api/v1/images?size=800x360&text=User+Dashboard)

_Loan Request_
![Loan Request](https://pokinski.com/api/v1/images?size=800x360&text=Loan+Request)

_Admin Panel_
![Admin Panel](https://pokinski.com/api/v1/images?size=800x360&text=Admin+Panel)

_(Replace with real screenshots when ready — keep same file names in `src/assets/` if you want them to load automatically.)_

---

## Installation

1. Clone:

```bash
git clone https://github.com/yourusername/naziur_rahman_client.git
cd naziur_rahman_client
```

2. Install:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

Client (Vite) default: `http://localhost:5173`

**Backend:** Run separately (Node.js + Express) and point client `.env.local` to API base URL.

---

## Backend & Authentication

- **Backend:** Node.js + Express, MongoDB (Atlas or local).
- **Auth:** Custom server-side encryption / authentication (self-made).

  - Because auth is custom, do **not** consider it production-ready. Replace or harden with industry standards (bcrypt/scrypt for password hashing, JWT or sessions, HTTPS, rate-limiting, account lockouts, CSRF protection).

Environment variables (example `.env.local` entries for client):

```
VITE_API_BASE_URL=https://your-server.example.com/api
```

Server should keep secrets out of public repos and use environment variables for DB credentials and encryption keys.

---

## Styling & Responsiveness

- Tailwind CSS + DaisyUI are used for styling and components.
- Layouts are built responsive, but responsiveness should be tested across devices — refine breakpoints and accessibility before production.

---

## Deployment

- **Client:** planned for Firebase hosting (not yet deployed).
- **Server:** planned/hosted on Vercel (serverless functions) — ensure Vercel functions are configured securely.

---

## Security warning (explicit)

This section is not optional — **read it**:

- This repo is a prototype. It lacks enterprise-grade security practices (encryption at rest, secure session management, input sanitization, strict CORS, rate-limiting, full validation, logging & monitoring).
- **DO NOT** use this with real user financial or identifying data without:

  - full security audit,
  - professional hardening, and
  - legal/privacy compliance (GDPR/PDPA/etc. where applicable).

- **Do not** use this repository to create phishing sites or to harvest credentials or financial information. Any malicious use is illegal and unethical.
- I will **not** be held responsible for any criminal activity, data breaches, or misuse related to this code. By using it you accept full responsibility.

If you plan to deploy publicly, add at minimum:

- HTTPS everywhere
- Proper password hashing (bcrypt/argon2) with salts
- JWT with short expiry + refresh tokens OR secure server sessions
- Input validation & sanitization on server-side
- Rate limiting & IP blocking for suspicious activity
- Audit logging & breach notification process

---

## Future improvements (prioritized)

1. Replace custom auth with proven solution (Auth0 / Firebase Auth / robust JWT flow)
2. Harden backend: validation, sanitization, rate-limiting, helmet, CORS rules
3. Encrypt sensitive fields in DB (or avoid storing them)
4. Add tests (unit + integration + e2e)
5. Real-time notifications (WebSockets) for loan updates
6. Admin analytics & role-based permissions
7. Full CI/CD with security checks (Snyk, Dependabot, automated linting)

---

## No license / Liability

- This repository **has no license**. Others may not have legal permission to reuse, fork, or redistribute it. If you want to allow reuse, add an appropriate open-source license.
- By using this code you agree that the author is **not liable** for any consequences, damages, or misuse of the code. You are responsible for all deployments and data.
