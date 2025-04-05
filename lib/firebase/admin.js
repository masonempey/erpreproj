import admin from "firebase-admin";

let adminInstance;

try {
  if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error("Firebase service account key not found");
    }

    adminInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
    });

    console.log("Firebase Admin initialized successfully");
  } else {
    adminInstance = admin.app();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  throw error;
}

export const auth = adminInstance.auth();
export default adminInstance;
