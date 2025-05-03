# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

# Flight Data Tracker

This is a full-stack flight booking system built using **React + TypeScript (frontend)**, **Node.js + Express + MySQL (backend)**, and real-time **Amadeus APIs** for flights and seat maps. It also includes a **predictive pricing model** based on historical demand.

## Project Structure

### Frontend (`/src`)
- React + TypeScript
- Vite-based for fast development
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls

### Backend (`/backend`)
- Express server with modular architecture:
  - `controllers/` – Handle request logic
  - `routes/` – Define API endpoints
  - `services/` – Business logic + DB queries
  - `db/` – MySQL connection
  - `middleware/` – Authentication and error handling
  - `utils/` – Helper functions
  - `scripts/` – One-time tasks like model training or seeding

### Machine Learning
- Python-based training script (`scripts/train_model.py`)
- Predictive model served via REST API endpoint
- Uses features like bookings, time-to-departure, demand, and seats remaining

---

## Features

- User signup/login with secure password storage
- Search flights via Amadeus API
- View seat map and choose seats (before booking)
- Book flights and assign passengers
- Save and view past bookings
- Cancel bookings and release seats
- Predict flight price using custom ML model
- Fully modular and documented backend
- Modern UI with responsive layout

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/DavEspo/Flight-Data-Tracker.git
cd Flight\ Data\ Tracker
```

### 2. Install Frontend
```bash
cd src
npm install
npm run dev
```

### 3. Install Backend
```bash
cd backend
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in `/backend`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=userDB

AMADEUS_CLIENT_ID=your_id
AMADEUS_CLIENT_SECRET=your_secret
```

### 5. Start Backend Server
```bash
node server.mjs
```

### 6. Train Price Model (Optional)
```bash
cd ml_model
python train_model.py
```

---

## SQL Database Schema

All SQL tables and queries used in this project are documented under the sql folder.

---

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind, Axios
- **Backend**: Node.js, Express, MySQL, Amadeus API
- **ML**: Python, scikit-learn, pandas
- **Tools**: MySQL Workbench, VSCode, Postman
