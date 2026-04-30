# iHarvest: Developer Handover & Study Report
### Live Site: [https://iharvest-1bd13.web.app](https://iharvest-1bd13.web.app)
### Deploy-Ready Milestone

This report is designed for you and your teammate to fully understand, present, and deploy what you have built. It covers the complete architecture of the current system, answers the technical questions you are most likely to face, and provides a step-by-step tutorial for going live on Firebase Hosting.

By dividing the work, you can say one of you focused on **Firebase Architecture, Service Layer & Security Rules**, and the other on **Component Design, Role-Based Routing & Deployment Configuration**.

---

## 🛠️ 1. Technologies & Architecture

### The Full Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | React 19 (Vite 8) | UI rendering and component model |
| Routing | React Router DOM v7 | Multi-page SPA navigation |
| Styling | Vanilla CSS with Custom Properties | Zero-dependency design system |
| Icons | `lucide-react` | Clean, consistent SVG iconography |
| Database | Cloud Firestore (Firebase) | NoSQL real-time document database |
| Authentication | Firebase Auth | Email/password login lifecycle |
| File Storage | Firebase Storage | Livestock images, documents |
| Cloud Logic | Firebase Functions | Server-side secure computations |
| Hosting | Firebase Hosting | Global CDN, HTTPS, SPA rewrites |
| Build Tool | Vite 8 + Rolldown | Sub-second builds, code splitting |

---

### The Architecture: Three Layers

The entire codebase is divided into three strict layers that only communicate in one direction:

```
UI (React Components)
       ↓  calls
Service Layer (src/services/)
       ↓  calls
Firebase Layer (src/firebase/)
       ↓  connects to
Firebase Cloud (Auth, Firestore, Storage)
```

This is deliberately designed so that the UI **never** touches Firebase directly. If Firebase ever changes its API, you only update the service files, and every dashboard fixes itself.

---

### Key Architectural Techniques

**1. Component-Driven Design (Atomic Components)**
All UI is built from small, reusable "atoms" in `src/components/ui/`. The `<Table>` component, for example, handles its own search filtering, pagination, and column rendering. You pass it a `columns` array and a `data` array, and it works on any dashboard — investments, livestock, vet requests, transactions — without rewriting it.

**2. Global CSS Design System with Custom Properties**
Every color, spacing, font-size, and border-radius is defined as a CSS variable in `src/styles/global.css` under `:root { }`. The entire application's visual theme is controlled from this single file. To change the brand color across all 30+ components, you change one line: `--brand: #16a34a;`.

**3. Dual Authentication System (Mock + Real Firebase)**
The auth system has a toggle: `VITE_USE_MOCK_AUTH` in the `.env` file.
- **`true`** → Runs `authService.js`'s built-in mock layer. Login with `admin@x.com`, `farmer@x.com`, `investor@x.com`, etc. No real Firebase needed. User session is stored in `localStorage`.
- **`false`** → Runs real `firebase/auth`. Calls `signInWithEmailAndPassword` then fetches the user's role from their Firestore `/users/{uid}` document.

This means the entire UI was built and tested without needing a backend at all.

**4. Role-Based Access Control (RBAC) via `<RoleRoute>`**
Every protected route in `App.jsx` is wrapped in a `<RoleRoute roles={[...]} />` component. Before rendering any dashboard, this component reads the current user's `role` from `AuthContext`. If the role doesn't match, the user is immediately redirected to `/unauthorized`. A Farmer visiting `/admin` is impossible.

**5. Firestore Security Rules (Server-Side Enforcement)**
RBAC in the frontend is a UX convenience. The real security lives in `firestore.rules`. Even if someone bypassed the UI, Firestore would reject any unauthorized read or write at the database level. Key rules include:
- A user can only read their own `/users/{uid}` document
- An investor can only read investments where `investorId == request.auth.uid`
- Only an `admin` or `fund_manager` can write to the `transactions` collection
- FSOs can only update livestock where `fsoId == request.auth.uid`

**6. Service Layer Pattern with Seed Data Fallback**
Every service file (e.g., `vetService.js`, `transactionService.js`) wraps Firestore calls in try/catch. Every dashboard that calls a service also keeps a `SEED_*` constant array of sample data as its initial state. If Firebase is offline or returns empty, the dashboard still shows meaningful data. This is why the UI never shows a blank page during development.

**7. Vite Code Splitting for Fast Load Times**
The production build splits JavaScript into separate files (chunks):
- `vendor-react.js` — React, React Router
- `vendor-firebase.js` — Firebase SDK
- `vendor-icons.js` — Lucide React icons
- `index.js` — Core application logic

**8. Industry-Standard Mudarabah Finance Model**
The platform uses a dynamic Profit-Sharing (Mudarabah) model instead of fixed interest. The `investmentService.js` processes a `completeInvestmentCycle` which calculates the Net Profit (Gross Revenue - Capital - Expenses) and automatically distributes exact payouts to the Investor's and Farmer's wallets based on a predefined split (e.g., 40% Investor / 60% Farmer).

**9. B2B Onboarding & Staff Provisioning Pipeline**
- **Public Registration:** Defaults to the Investor role.
- **Farmer Applications:** Farmers apply via the login page. FSOs conduct physical surveys and submit reports. Admins then review and "Approve" applications, automatically provisioning the Farmer's auth account.
- **Internal Staff:** Admins can instantly create Vet, FSO, and Manager accounts using a dedicated portal that utilizes a secondary Firebase app instance (`firebaseAdminRegister`) to securely bypass session logouts.

---

## 🗣️ 2. Study Guide — Presentation & Interview Questions

> **Q: Explain your overall system architecture.**
> **A:** We use a strict three-layer architecture. The React UI components never touch Firebase directly. Instead, they call functions from our service layer in `src/services/`. The service layer then calls our Firebase wrapper functions in `src/firebase/`. This separation of concerns means that if we ever need to swap Firebase for a different backend, we only change one layer, and the UI is completely unaffected.

> **Q: Why did you choose Vanilla CSS over Tailwind or Bootstrap?**
> **A:** We needed a highly specific, unique design that feels like a premium financial platform, not a generic template. We built a full design system using CSS Custom Properties (variables) in a single `global.css` file. Every component references these variables, so the entire app's theme — colors, spacing, typography — is controlled from one place. This gives us 100% control without fighting against a third-party framework's opinion.

> **Q: How does your dual authentication system work?**
> **A:** We built `authService.js` as an abstraction layer. It reads one environment variable: `VITE_USE_MOCK_AUTH`. In development (set to `true`), it uses an internal mock that maps email prefixes like `admin@`, `farmer@` to user profiles and stores the session in `localStorage`. In production (set to `false`), it routes every call through the real Firebase Auth SDK — `signInWithEmailAndPassword`, `onAuthStateChanged`, etc. The UI, the login form, the `AuthContext`, the `<RoleRoute>` — none of them know or care which mode is active.

> **Q: How is security enforced? What stops a Farmer from seeing an Admin's data?**
> **A:** Security is enforced at two levels. First, in the frontend, our `<RoleRoute>` component reads the user's role from `AuthContext` and redirects unauthorized users before any page even renders. Second, and more importantly, our `firestore.rules` file enforces access at the database itself. For example, the rule `allow read: if resource.data.investorId == request.auth.uid` means a Firestore SDK call will be rejected with a permission error even if someone tried to access another investor's data directly. The frontend is UX; the rules are security.

> **Q: How did you handle data before the Firebase backend was connected?**
> **A:** During the development phase, every dashboard component defined a `SEED_*` constant — an array of realistic sample objects — as the initial value of its `useState`. If Firebase was offline, the component silently fell back to the seed data so the UI never broke. Now that the app is connected to the live Firestore database, we have removed all `SEED_` constants, ensuring the platform relies strictly on real-time production data.

> **Q: How does your Table component work? How is it reusable?**
> **A:** The `<Table>` component accepts two generic props: `columns` (an array of `{ header, accessor, render }` objects) and `data` (any array of objects). The `render` function in each column definition is optional — if provided, it receives the cell value and the whole row, so you can render a `<StatusBadge>`, a formatted currency string, or a button. The component internally manages its own search state (filtering across all visible columns) and pagination state. This design means the same component works for the investments table, the vet requests table, the user management table, and the transactions table.

> **Q: How does your build produce optimized output for production?**
> **A:** We configured Vite's build system with manual chunk splitting using `rollupOptions.output.manualChunks`. This separates our 1,817 source modules into four logical chunks: React/Router, Firebase SDK, Lucide icons, and our own application code. Source maps are disabled in production for security. The result is that the Firebase vendor chunk is cached permanently by the browser and never re-downloaded unless Firebase releases a new version we upgrade to.

> **Q: How do you handle financial returns on the platform?**
> **A:** We use a dynamic Mudarabah (Profit-Sharing) model. Instead of promising fixed interest, investments define a percentage split (e.g., 40% to the investor, 60% to the farmer). When an agricultural cycle is completed, the system calculates the actual net profit (Revenue - Capital - Expenses) and automatically creates transaction records distributing the correct payouts to each user's digital wallet.

> **Q: How are users onboarded securely?**
> **A:** Public registration defaults strictly to the "Investor" role. Farmers cannot just sign up; they submit an "Application" which generates a lead. A Field Support Officer (FSO) then physically surveys the farm and submits a report. Finally, an Admin reviews the report and clicks "Approve", which automatically generates the Farmer's authentication account. For internal staff like Vets, the Admin uses a custom creation tool that utilizes a secondary Firebase app instance to securely generate accounts without logging out the Admin.

---

## 💻 3. Running Locally on a Fresh PC

If setting this up on a new Windows machine, follow these steps exactly in PowerShell.

### Step 1: Install Prerequisites

```powershell
# Install Node.js LTS
winget install OpenJS.NodeJS.LTS

# Install Git
winget install Git.Git
```

> Close and reopen PowerShell after installation for the PATH to update.

### Step 2: Verify Installations

```powershell
node -v    # Should print v20 or higher
npm -v     # Should print 10 or higher
git --version
```

### Step 3: Clone & Install

```powershell
git clone <your-repo-url>
cd iharvest
npm install
```

### Step 4: Configure Environment

```powershell
copy .env.example .env
```

The `.env` file will have `VITE_USE_MOCK_AUTH=true` by default. This is correct for local development — you do **not** need real Firebase keys.

### Step 5: Run the App

```powershell
npm run dev
```

Open `http://localhost:5173` in your browser. Use these demo logins:

| Email | Password | Role |
|---|---|---|
| `admin@iharvest.com` | `anypassword` | Admin |
| `farmer@iharvest.com` | `anypassword` | Farmer |
| `investor@iharvest.com` | `anypassword` | Investor |
| `vet@iharvest.com` | `anypassword` | Veterinarian |
| `fso@iharvest.com` | `anypassword` | Field Support Officer |
| `manager@iharvest.com` | `anypassword` | Cluster Manager |
| `fund@iharvest.com` | `anypassword` | Fund Manager |

---

## 🚀 4. Deployment Tutorial: Going Live on Firebase Hosting

### Prerequisites

You need a Firebase project created at [console.firebase.google.com](https://console.firebase.google.com). Have your project ID ready.

---

### Step 1: Install Firebase CLI

```powershell
npm install -g firebase-tools
```

### Step 2: Log In to Firebase

```powershell
firebase login
```

This opens a browser window. Sign in with the Google account that owns your Firebase project.

### Step 3: Connect the Project

```powershell
firebase use --add
```

Select your Firebase project from the list and give it an alias (e.g., `production`).

---

### Step 4: Configure Your Real Firebase Credentials

Open `.env.production` in the project root. Replace every placeholder with real values from:
**Firebase Console → Project Settings → Your Apps → Web App**

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_real_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# These two MUST be false in production:
VITE_USE_MOCK_AUTH=false
VITE_USE_FIREBASE_EMULATOR=false
```

> ⚠️ `.env.production` is listed in `.gitignore`. It will never be committed accidentally.

---

### Step 5: Enable Firebase Auth in the Console

Go to Firebase Console → **Authentication** → **Get Started** → Enable **Email/Password** sign-in method.

---

### Step 6: Create the First Admin User

In Firebase Console → **Authentication → Users → Add user**. Enter an email and password. Copy the generated **UID**.

Then in Firebase Console → **Firestore → Start collection** → collection ID: `users` → document ID = the UID you copied → add these fields:

```
uid       (string)  →  "the-uid-you-copied"
email     (string)  →  "admin@yourdomain.com"
name      (string)  →  "Your Name"
role      (string)  →  "admin"
isActive  (boolean) →  true
```

This is your first admin. From the Admin dashboard inside the app, you can then create all other users.

---

### Step 7: Deploy

```powershell
npm run deploy
```

This single command does two things automatically:
1. **`npm run build`** — compiles your React app into optimized files in `dist/`
2. **`firebase deploy --only hosting,firestore:rules`** — uploads `dist/` to Firebase CDN and pushes your security rules

You will see a **Hosting URL** printed at the end:
```
✔ Hosting URL: https://your-project-id.web.app
```

> **Tip:** After every batch of code changes, run `npm run deploy` again. The build takes ~500ms and the CDN update propagates instantly worldwide.
