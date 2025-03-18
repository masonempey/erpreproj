import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let adminInstance;

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.join(process.cwd(), "config/serviceAccountKey.json");

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error("Firebase service account key file not found");
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

    adminInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
