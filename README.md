# VerdeLah!

An eco-friendly mobile app that encourages sustainable habits through AI-powered item scanning, gamification, and community challenges.

## Main Features

- **AI Item Scanning**: Scan any item to get recycling information and eco-friendly alternatives
- **Gamification**: Earn Eco Points and compete on leaderboards
- **Community Features**: Neighborhood-specific challenges

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Auth + Firestore)
- **AI/ML**: AWS Rekognition for item recognition
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ongjianyong/verdelah.git
   cd VerdeLah
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   **For Public Repository (General Users):**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Firebase credentials:

   ```env
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

   **For Hackathon Judging:**

   - Environment variables are pre-configured
   - No additional setup required
   - Simply proceed to step 4

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run the app**

   - Download [Expo Go](https://expo.dev/client) from App Store/Google Play
   - Scan the QR code that appears in your terminal

### Firebase Setup (For Public Repository Users)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database (start in test mode)
4. Get your config values and add them to `.env`
