import admin from "firebase-admin";
// Admin setup firebase for manage authentication and users
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export default admin;
