# FinPlanner - Personal Finance Management App

A cross-platform personal finance management application that connects to real bank accounts via open banking, provides spending insights, and supports multiple authentication methods across web and mobile.

---

## Features

- **Open Banking Integration** — connects to real bank accounts via the Salt Edge API to fetch live transaction data and sync account balances and spending history
- **Spending Insights** — doughnut and bar charts built with Chart.js, filterable by month, year, and category across multiple linked accounts
- **Transaction History** — detailed transaction views per account with category filtering
- **Authentication** — biometric (fingerprint) and voice authentication for mobile (iOS and Android); Facebook and Google OAuth across web and mobile
- **Cross-Platform** — single codebase deployed to web, iOS, and Android via Capacitor/Cordova

---

## Tech Stack

| Layer        | Technologies                                      |
|--------------|---------------------------------------------------|
| Frontend     | Angular, Ionic Framework, TypeScript              |
| Mobile       | Capacitor / Cordova (iOS & Android)               |
| Auth         | Ionic Native (fingerprint, voice), Facebook OAuth, Google OAuth |
| Backend/Data | Firebase Firestore, Firebase Realtime Database    |
| Charts       | Chart.js                                          |
| Banking API  | Salt Edge Open Banking API                        |

---

## Project Notes

The Firebase security rules reflect the development/demo environment used during the project and are not configured for production use.
