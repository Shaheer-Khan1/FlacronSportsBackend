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

// Function to store sports data in Firestore
async function storeSportsData(date, data, collection = 'sports_data') {
  try {
    await db.collection(collection).doc(date).set(data);
    console.log(`Sports data stored for date: ${date}`);
  } catch (error) {
    console.error('Error storing sports data:', error);
    throw error;
  }
}

// Function to retrieve sports data from Firestore
async function getSportsData(date, collection = 'sports_data') {
  try {
    const doc = await db.collection(collection).doc(date).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Error getting sports data:', error);
    throw error;
  }
}

// Function to retrieve data for a specific sport
async function getSportData(sport, date) {
  try {
    const docRef = db.collection(sport).doc(date);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (error) {
    console.error(`Error retrieving ${sport} data from Firestore:`, error);
    throw error;
  }
}

// Store generated content
async function storeGeneratedContent(content) {
  try {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const contentData = {
      ...content,
      createdAt: timestamp
    };

    const docRef = await db.collection('generated_content').add(contentData);
    console.log(`Content stored with ID: ${docRef.id} and title: ${content.title}`);
    return docRef.id;
  } catch (error) {
    console.error('Error storing generated content:', error);
    throw error;
  }
}

// Get latest generated content
async function getLatestGeneratedContent(limit = 10) {
  try {
    const snapshot = await db.collection('generated_content')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting latest generated content:', error);
    throw error;
  }
}

// Get all active subscribers
async function getSubscribers() {
  try {
    const snapshot = await db.collection('subscribers')
      .where('status', '==', 'active')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting subscribers:', error);
    throw error;
  }
}

module.exports = {
  storeSportsData,
  getSportsData,
  getSportData,
  storeGeneratedContent,
  getLatestGeneratedContent,
  getSubscribers
}; 