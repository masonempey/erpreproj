import admin from "firebase-admin";

let adminInstance;

try {
  if (!admin.apps.length) {
    // Get the service account key from environment variable
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error("Firebase service account key not found");
    }

    // Parse the JSON string from environment variable
    const serviceAccountCredential = JSON.parse(serviceAccountKey);

    adminInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountCredential),
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
