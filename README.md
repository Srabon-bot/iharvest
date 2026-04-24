# iHarvest — Project Progress Report (Phase-Based)

This report maps our current development progress against the original 8-phase project plan. We have successfully completed Phases 1, 2, 3, 4, 5, and 6, followed by an exhaustive code audit and bug-fixing phase. We are currently transitioning into Phase 7 (Cloud Functions) and Phase 8 (Polish & Deploy).

---

## 🟢 Phase 1: Firebase Layer (✅ COMPLETE)
The foundational data engine and business logic layer are complete and fully functional.
**Files Built:**
*   **Firebase SDK Wrappers:** `src/firebase/auth.js`, `config.js`, `firestore.js`, `functions.js`, `storage.js`
*   **Business Logic Services:** `src/services/authService.js` (Includes our custom Mock Auth toggle), `investmentService.js`, `livestockService.js`, `packageService.js`, `surveyService.js`, `transactionService.js`, `userService.js`, `vetService.js`
*   **React Integration Layer:** `src/hooks/useAuth.js`, `useRole.js`, `useFirestore.js`, `useStorage.js`

## 🟢 Phase 2: Design System & Common Components (✅ COMPLETE)
The visual foundation and core UI elements are complete and ready for use across all pages.
**Files Built:**
*   **Global Layouts:** `src/components/layout/DashboardLayout.jsx`, `Navbar.jsx` (with Logout), `Sidebar.jsx` (with role-based routing)
*   **UI Components:** `src/components/ui/Button.jsx`, `Input.jsx`, `Modal.jsx`, `Loader.jsx`, `Toast.jsx`, `Card.jsx`, `Table.jsx` (along with their corresponding `.css` files).

## 🟢 Phase 3: Auth Pages (✅ COMPLETE)
The authentication flow and access control pages are complete.
**Files Built:**
*   **Pages:** `src/pages/auth/Login.jsx`, `src/pages/auth/Unauthorized.jsx`
*   **Features:** Email/password login form, "Demo Credentials" bypass system for UI testing.

## 🟢 Phase 4: Role Dashboards (✅ COMPLETE)
We have built and wired all role-based dashboards and their detailed sub-pages, including dynamic data fetching hooks and complete UI navigation.
**Files Built:**
*   **Dashboards:** `src/pages/dashboards/AdminDashboard.jsx`, `FarmerDashboard.jsx`, `FsoDashboard.jsx`, `InvestorDashboard.jsx`, `ManagerDashboard.jsx`, `VetDashboard.jsx`, `FundManagerDashboard.jsx`
*   **Admin:** `/admin/users`, `/admin/farms`, `/admin/investments`
*   **Farmer:** `/farmer/livestock`, `/farmer/tasks`
*   **Investor:** `/investor/investments`, `/investor/transactions`
*   **FSO:** `/fso/surveys`, `/fso/farmers`
*   **Cluster Manager:** `/manager/clusters`, `/manager/deliveries`
*   **Vet:** `/vet/requests`, `/vet/reports`

## 🟢 Phase 5: Router Wiring (✅ COMPLETE)
The application routing and role-based access control are complete.
**Files Built:**
*   **Router Logic:** `src/App.jsx` (Nested Routes), `src/context/AuthContext.jsx`
*   **Security:** `src/routes/RoleRoute.jsx` (Restricts routes based on user role)

## 🟢 Phase 6: Platform Features (✅ COMPLETE)
**Files Built:**
*   **Notifications:** Notification Toast system (`src/components/ui/Toast.jsx`).
*   **Data Grids:** Advanced Table sorting with search and client-side pagination (`src/components/ui/Table.jsx`, `.css`).
*   **Media & Visualization:** Traceability View component (`src/components/ui/TraceabilityView.jsx`, `.css`), Lightbox for images (`src/components/ui/Lightbox.jsx`, `.css`), Status Badge (`src/components/ui/StatusBadge.jsx`, `.css`).

## 🟢 Phase 7: Cloud Functions (Server-Side) (✅ COMPLETE)
**Files Built:**
*   `functions/index.js` containing three callable HTTPS functions:
    1.  `calculateROI`: Calculates expected ROI based on livestock packages and mortality.
    2.  `sendNotification`: Creates notification records in Firestore and simulates email dispatch.
    3.  `processInvestorPayout`: Handles transactional atomicity for closing out completed investments.

## 🔴 Phase 8: Polish & Deploy (⬜ NOT STARTED)
**What is Left to Build in Detail:**
1.  **Firebase Production Setup:** Create a real Firebase project, replace the `.env` dummy keys, and deploy `firestore.rules`.
2.  **Form Validation UX:** Add inline error states and disable submit buttons using `validators.js`.
3.  **Deployment:** Deploy the frontend to Firebase Hosting.

---

## Progress Summary

```text
██████████████████████████████  Phase 1: Firebase Layer     ✅ COMPLETE
██████████████████████████████  Phase 2: Design System      ✅ COMPLETE
██████████████████████████████  Phase 3: Auth Pages         ✅ COMPLETE
██████████████████████████████  Phase 4: Role Dashboards    ✅ COMPLETE
██████████████████████████████  Phase 5: Router Wiring      ✅ COMPLETE
██████████████████████████████  Phase 6: Platform Features  ✅ COMPLETE
██████████████████████████████  Phase 7: Cloud Functions    ✅ COMPLETE
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Phase 8: Polish & Deploy    ⬜ NOT STARTED

Overall: ███████████████████████████░░░  ~90% complete
```

---

## 🐛 Bugs Found & Fixed (Deep Code Audit)

Following the completion of the dashboards, an exhaustive code audit was performed to stabilize the platform. The following critical and UI issues were resolved:

| # | Component/File | Bug | Resolution |
|---|---|---|---|
| 1 | `RequestsPage.jsx` | `loading` variable used but never declared → crash | Added `useState(false)` + wired to `load()` |
| 2 | `TransactionsPage.jsx` | `loading` variable undefined → white page crash | Added `useState(false)` + wired to fetch |
| 3 | `Login.jsx` | Missing demo buttons for FSO, Manager, Fund Manager | Added 3 new demo credential buttons |
| 4 | `Navbar.jsx` | Showed raw email instead of user's name with Mock Auth | Now reads `userProfile.name` via `useAuth` |
| 5 | `FsoDashboard.jsx` | Pending count always 0 (wrong field) | Fixed to filter on `healthStatus === sick/critical` |
| 6 | `Card.jsx` | Trend badge showed raw count as `%` | Removed auto-`%` formatting; use `trend.label` only |
| 7 | `FundManagerDashboard` | Label "Total Vol." confusing | Renamed to "Total Assets" and "Total Transactions" |
| 8 | `Login.jsx` | Dead `useAuth` import | Removed unused import |
| 9 | `DashboardLayout.jsx`| Passed stale `user` prop to Navbar | Removed prop; Navbar reads auth internally |
| 10 | `package.json` | `npm run emulators` failed every new terminal | Hardcoded Java 21 path into npm script to force JDK 21 |
| 11 | `global.css` | **Critical:** Named spacing (`--spacing-md`, etc.) was completely missing, collapsing all gaps to zero | Appended the entire named scale to the root CSS |
| 12 | `Sidebar.jsx` | Dead routes for Fund Manager (`/fund-manager/pools`) | Removed non-existent navigation links |

---

## 🚀 Deployment Guide

### Step 1 — Get Real Firebase Credentials
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project (or use existing)
3. Go to **Project Settings → Your Apps → Web App** → copy the config object
4. Update your `.env` file:

```env
VITE_FIREBASE_API_KEY="your_real_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_real_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_USE_MOCK_AUTH="false"
VITE_USE_FIREBASE_EMULATOR="false"
```

### Step 2 — Update firebase.json Project ID
```bash
firebase use your_real_project_id
```

### Step 3 — Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Step 4 — Deploy Cloud Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Step 5 — Build & Deploy Frontend
```bash
npm run build
firebase deploy --only hosting
```

Your app is now live at `https://your_project.web.app`!

---

## 💻 Running Locally (Existing PC)

### One-Time Setup (Already Done)
```powershell
npm install -g firebase-tools
winget install Microsoft.OpenJDK.21
```

### Every Time You Want to Run
Open **two terminal windows** in `d:\user\srabon\software`:

**Terminal 1 — Backend (Firebase Emulators):**
```powershell
npm run emulators
```
Wait until you see: `✔ All emulators ready!`

**Terminal 2 — Frontend (React Dev Server):**
```powershell
npm run dev
```

Open browser: `http://localhost:5173`  
Emulator Dashboard: `http://localhost:4000`

### To Stop
Press `Ctrl + C` in each terminal.

---

## 🖥️ Brand New PC Setup — Complete Commands

Run these commands **in order** in PowerShell or Command Prompt:

### 1. Fix PowerShell Script Policy (one-time)
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 2. Install Node.js
Download from [nodejs.org](https://nodejs.org) (LTS version) and install.  
Verify: `node --version` and `npm --version`

### 3. Install Java 21 (required by Firebase Emulators)
```powershell
winget install Microsoft.OpenJDK.21
```
Or download from [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk).

### 4. Install Firebase CLI
```powershell
npm install -g firebase-tools
```

### 5. Install Git (if not installed)
```powershell
winget install Git.Git
```

### 6. Clone the Project
```powershell
git clone https://github.com/YOUR_REPO/iharvest.git
cd iharvest
```

### 7. Install Project Dependencies
```powershell
npm install
```

### 8. Install Cloud Functions Dependencies
```powershell
cd functions
npm install
cd ..
```

### 9. Set Up Environment File
Copy the example file and fill in values:
```powershell
copy .env.example .env
```
Edit `.env` with your Firebase credentials (or leave dummy values for local testing).

### 10. Run the Project
```powershell
# Terminal 1
npm run emulators

# Terminal 2 (new window)
npm run dev
```

Open: `http://localhost:5173`

---

## 📋 Quick Reference — Login Credentials (Mock Auth)

| Role | Email | Password |
|---|---|---|
| Admin | admin@iharvest.com | admin123 |
| Farmer | farmer@iharvest.com | farmer123 |
| Investor | investor@iharvest.com | investor123 |
| Veterinarian | vet@iharvest.com | vet123 |
| FSO | fso@iharvest.com | fso123 |
| Cluster Manager | manager@iharvest.com | manager123 |
| Fund Manager | fund@iharvest.com | fund123 |
