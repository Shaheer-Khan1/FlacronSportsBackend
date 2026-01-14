require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testDashboardSettingsNewsletter() {
  console.log('Testing dashboard_settings newsletterEnabled and language from Firebase...\n');

  try {
    // Fetch dashboard_settings
    console.log('Fetching dashboard_settings...');
    const snapshot = await db.collection('dashboard_settings').get();

    if (!snapshot.empty) {
      console.log(`✅ Successfully fetched ${snapshot.size} dashboard_settings documents:\n`);
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`Email (doc ID): ${doc.id}`);
        console.log(`- newsletterEnabled: ${data.newsletterEnabled}`);
        console.log(`- language: ${data.language}`);
        console.log('');
      });
    } else {
      console.log('ℹ️ No dashboard_settings found in the database.');
      console.log('\nExpected document structure:');
      console.log(`
{
  "language": "en",
  "newsletterEnabled": true
}
      `);
    }
  } catch (error) {
    console.error('❌ Error fetching dashboard_settings:', error.message);
  }
}

// Run the test
testDashboardSettingsNewsletter(); 