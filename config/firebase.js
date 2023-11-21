const { initializeApp } = require('firebase/app');
const { getStorage, ref } = require('firebase/storage');
require('dotenv').config();

const firebaseConfig = {
  apiKey:process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;