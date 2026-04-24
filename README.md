# iHarvest — Project Progress Report (Phase-Based)

This report maps our current development progress against the original 8-phase project plan. We have successfully completed Phases 1, 2, 3, and 5, and are currently transitioning into Phase 4 (Role Dashboards) and Phase 6 (Platform Features).

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

## 🟡 Phase 4: Role Dashboards (🟨 IN PROGRESS - ~40% Complete)
We have built the high-level dashboard "shells" for all 7 roles. However, they are currently populated with static mock data, and the detailed sub-pages (like the specific marketplace or survey forms) are not yet built.
**Files Built:**
*   `src/pages/dashboards/AdminDashboard.jsx`
*   `src/pages/dashboards/FarmerDashboard.jsx`
*   `src/pages/dashboards/FsoDashboard.jsx`
*   `src/pages/dashboards/FundManagerDashboard.jsx`
*   `src/pages/dashboards/InvestorDashboard.jsx`
*   `src/pages/dashboards/ManagerDashboard.jsx`
*   `src/pages/dashboards/VetDashboard.jsx`

**What is Left to Build in Detail:**
1.  **Dynamic Data Hooks:** Replace the hard-coded arrays inside the dashboards with `useEffect` calls to our `src/services/` layer (e.g., fetch real stats instead of hard-coded `$2.4M`).
2.  **Detailed Views & CRUD Forms:** Create the dedicated pages for the sidebar links:
    *   **Admin:** `/admin/users` (Table + Edit User Modal), `/admin/farms`, `/admin/investments` (Create Package Form).
    *   **Farmer:** `/farmer/livestock` (View assigned animals), `/farmer/tasks` (Daily input forms).
    *   **Investor:** `/investor/investments` (Marketplace to buy packages), `/investor/transactions`.
    *   **FSO:** `/fso/surveys` (Submit Survey Form with photo upload), `/fso/farmers`.
    *   **Cluster Manager:** `/manager/clusters`, `/manager/deliveries`.
    *   **Vet:** `/vet/requests` (Diagnosis & Prescription Form), `/vet/reports`.

## 🟢 Phase 5: Router Wiring (✅ COMPLETE)
The application routing and role-based access control are complete.
**Files Built:**
*   **Router Logic:** `src/App.jsx` (Nested Routes), `src/context/AuthContext.jsx`
*   **Security:** `src/routes/RoleRoute.jsx` (Restricts routes based on user role)

## 🟡 Phase 6: Platform Features (🟨 IN PROGRESS - ~20% Complete)
**What We Built:**
*   Notification Toast system (`src/components/ui/Toast.jsx`).
*   Basic Table sorting (`src/components/ui/Table.jsx`).

**What is Left to Build in Detail:**
1.  **Traceability View:** The UI component that visually chains Investor → Package → Livestock → Farmer → FSO.
2.  **Global Search & Filters:** Adding search functionality to our tables and lists.
3.  **Image/Video Viewer:** A Lightbox component to view FSO survey media in full screen.
4.  **Pagination:** Upgrading `Table.jsx` to handle API-side pagination for large datasets.

## 🔴 Phase 7: Cloud Functions (Server-Side) (⬜ NOT STARTED)
**What is Left to Build in Detail:**
We need to write the Node.js backend functions in the Firebase console for:
1.  `calculateROI` (Auto-calculates ROI based on mortality/growth).
2.  `sendNotification` (Email/push alerts).
3.  `processInvestorPayout`.

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
████████████░░░░░░░░░░░░░░░░░░  Phase 4: Role Dashboards    🟨 IN PROGRESS
██████████████████████████████  Phase 5: Router Wiring      ✅ COMPLETE
██████░░░░░░░░░░░░░░░░░░░░░░░░  Phase 6: Platform Features  🟨 IN PROGRESS
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Phase 7: Cloud Functions    ⬜ NOT STARTED
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Phase 8: Polish & Deploy    ⬜ NOT STARTED

Overall: ████████████████░░░░░░░░░░░░░░  ~55% complete
```
