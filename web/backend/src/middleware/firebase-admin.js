const admin = require("firebase-admin");
const serviceAccount = require("../../config/serviceAccountKey.json");
// Admin setup firebase for manage authentication and users 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;