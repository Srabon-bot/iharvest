# iHarvest — Firebase Layer Setup Guide

This document explains how to set up the Firebase backend for iHarvest, a contract farming platform operating in Bangladesh (BDT).

---

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it `iharvest` (or your preferred name)
4. Enable or disable Google Analytics (optional)
5. Click **Create project**

---

## 2. Enable Firebase Services

### Authentication
1. In the Firebase Console, go to **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**
4. Save

### Cloud Firestore
1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll deploy proper rules below)
4. Select a Firestore location closest to Bangladesh (e.g., `asia-southeast1`)
5. Click **Enable**

### Storage
1. Go to **Build → Storage**
2. Click **Get started**
3. Accept default rules for now
4. Select the same region as Firestore
5. Click **Done**

### Cloud Functions (Optional — for Phase 2)
1. Upgrade to **Blaze plan** (pay-as-you-go) — required for Cloud Functions
2. Go to **Build → Functions**
3. Click **Get started** and follow the setup wizard

---

## 3. Register a Web App

1. In **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** section
3. Click the web icon (`</>`) to add a web app
4. Register app name: `iharvest-web`
5. **Do NOT** enable Firebase Hosting (unless you want to deploy there)
6. Copy the Firebase config object — you'll need these 6 values

---

## 4. Set Up Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config values in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=iharvest-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=iharvest-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=iharvest-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

> **Note:** The `VITE_` prefix is required — Vite only exposes env variables with this prefix to the client.

---

## 5. Deploy Firestore Security Rules

### Option A: Firebase CLI (Recommended)

1. Install the Firebase CLI if you haven't:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in the project (if not already):
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Use `firestore.rules` as the rules file
   - Use `firestore.indexes.json` for indexes (default)

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option B: Firebase Console (Manual)

1. Go to **Firestore Database → Rules** tab
2. Copy the contents of `firestore.rules` from this project
3. Paste it into the editor
4. Click **Publish**

---

## 6. Create the First Admin User

Since only admins can assign roles, you need to manually set up the first admin:

1. Start the app and register a new account (will default to `investor` role)
2. Go to **Firebase Console → Firestore → users collection**
3. Find the document matching your user's UID
4. Change the `role` field from `investor` to `admin`
5. Log out and log back in — you'll now have admin access

---

## 7. Firestore Indexes

Some queries use composite indexes. Firestore will auto-prompt you to create them when the queries first run, or you can create them manually:

| Collection    | Fields                              | Order        |
|---------------|-------------------------------------|--------------|
| `livestock`   | `fsoId`, `createdAt`                | ASC, DESC    |
| `livestock`   | `farmerId`, `createdAt`             | ASC, DESC    |
| `livestock`   | `investorId`, `createdAt`           | ASC, DESC    |
| `livestock`   | `clusterId`, `createdAt`            | ASC, DESC    |
| `investments` | `investorId`, `createdAt`           | ASC, DESC    |
| `investments` | `status`, `createdAt`               | ASC, DESC    |
| `surveys`     | `fsoId`, `createdAt`                | ASC, DESC    |
| `surveys`     | `livestockId`, `createdAt`          | ASC, DESC    |
| `surveys`     | `farmerId`, `createdAt`             | ASC, DESC    |
| `vet_requests`| `vetId`, `createdAt`                | ASC, DESC    |
| `vet_requests`| `status`, `createdAt`               | ASC, DESC    |
| `transactions`| `userId`, `createdAt`               | ASC, DESC    |
| `packages`    | `isActive`, `createdAt`             | ASC, DESC    |

---

## Project Architecture

```
src/
├── firebase/          ← SDK wrappers (never import Firebase SDK elsewhere)
│   ├── config.js      ← App initialization, exports auth/db/storage/functions
│   ├── auth.js        ← Firebase Auth helpers
│   ├── firestore.js   ← Generic Firestore CRUD helpers
│   ├── storage.js     ← File upload/download helpers
│   └── functions.js   ← Cloud Functions callable wrappers
├── services/          ← Business logic layer (imports from firebase/)
│   ├── authService.js
│   ├── userService.js
│   ├── packageService.js
│   ├── livestockService.js
│   ├── investmentService.js
│   ├── surveyService.js
│   ├── vetService.js
│   └── transactionService.js
├── hooks/             ← React hooks (imports from services/ or firebase/)
│   ├── useAuth.js
│   ├── useRole.js
│   ├── useFirestore.js
│   └── useStorage.js
├── context/
│   └── AuthContext.jsx ← Global auth state provider
├── routes/
│   ├── PrivateRoute.jsx ← Requires authentication
│   └── RoleRoute.jsx    ← Requires specific role(s)
└── utils/
    ├── constants.js   ← Collection names, roles, statuses, routes
    ├── formatters.js  ← BDT currency, date, percentage formatting
    └── validators.js  ← Input validation helpers
```

### Data Flow

```
UI Components
    ↓ import
  hooks/ (useAuth, useRole, useFirestore, useStorage)
    ↓ import
  services/ (authService, userService, packageService, ...)
    ↓ import
  firebase/ (config, auth, firestore, storage, functions)
    ↓ calls
  Firebase SDK → Firebase Backend
```

> **Rule:** UI components should NEVER import from `firebase/` directly. Always go through `services/` or `hooks/`.

---

## Available User Roles

| Role              | Constant Key       | Description                        |
|-------------------|--------------------|------------------------------------|
| `admin`           | `ROLES.ADMIN`      | Platform superuser                 |
| `fso`             | `ROLES.FSO`        | Field Survey Officer               |
| `cluster_manager` | `ROLES.CLUSTER_MANAGER` | Manages multiple FSOs         |
| `vet`             | `ROLES.VET`        | Veterinarian                       |
| `fund_manager`    | `ROLES.FUND_MANAGER` | Financial operations             |
| `farmer`          | `ROLES.FARMER`     | Livestock raiser                   |
| `investor`        | `ROLES.INVESTOR`   | Default role on registration       |

---

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.
