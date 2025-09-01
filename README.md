# VerdeLah! 

An eco-friendly mobile app that encourages sustainable habits through AI-powered item scanning, gamification, and community challenges.

##  Features

- **AI Item Scanning**: Scan any item to get recycling information and eco-friendly alternatives
- **User Authentication**: Secure login/register with Firebase Auth
- **Gamification**: Earn Eco Points and compete on leaderboards
- **Community Features**: Neighborhood challenges and eco-circles
- **Real-time Data**: Live leaderboards and user statistics
- **Firebase Integration**: Secure backend with Firestore database

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Auth + Firestore)
- **Navigation**: Expo Router
- **State Management**: React Context
- **Styling**: React Native StyleSheet
- **Environment Variables**: react-native-dotenv


## 🚀 Getting Started

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

4. **Start the development server**
   ```bash
   npm start
   ```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database (start in test mode)
4. Get your config values and add them to `.env`


