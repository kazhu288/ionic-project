# Product Catalog

A modern Ionic Vue product catalog with full CRUD functionality powered by Firebase Firestore.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete products
- **Firebase Integration**: Real-time data storage with Firestore
- **Search & Filter**: Case-insensitive search and category filtering
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern UI**: Clean Ionic Vue interface with Philippine peso pricing

## Setup

### Prerequisites
- Node.js 24.x
- Firebase account and project

### Installation

1. **Install dependencies:**
```powershell
cd catalog-app
npm ci
```

2. **Firebase Setup:**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore Database
   - Set Firestore rules to test mode (or proper security rules)
   - Get your web app configuration from Project Settings → General
   - Replace the placeholder values in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. **Run development server:**
```powershell
npm run dev
```

Open http://localhost:8100 to view the app.

## Build for Production

```powershell
npm run build
```

The built files will be in the `dist/` directory.

## GitHub Deployment

1. **Initialize Git:**
```powershell
git init
git add .
git commit -m "Initial commit with CRUD functionality"
```

2. **Create GitHub repository** and push:
```powershell
git remote add origin https://github.com/your-username/product-catalog.git
git branch -M main
git push -u origin main
```

3. **Deploy to GitHub Pages** (optional):
   - Go to repository Settings → Pages
   - Select `main` branch and `dist` folder as source
   - Your app will be available at `https://your-username.github.io/product-catalog/`

## Component Structure

- `src/components/ProductCard.vue` - Individual product display
- `src/components/ProductForm.vue` - Add/Edit product modal
- `src/components/ProductList.vue` - Product grid with filtering
- `src/services/firebase.ts` - Firebase CRUD operations
- `src/views/HomePage.vue` - Main page with all components

## Firebase Security Rules

For development, use test mode:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, implement proper authentication rules.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Technology Stack

- **Framework**: Vue 3 + Ionic Vue
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Language**: TypeScript
- **Styling**: Ionic CSS

## License

MIT
