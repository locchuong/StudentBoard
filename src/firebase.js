import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/storage';
var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};
const app = firebase.default.initializeApp(firebaseConfig);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const localPersistence = firebase.auth.Auth.Persistence.LOCAL;
export const sessionPersistence = firebase.auth.Auth.Persistence.SESSION;
export const auth = app.auth();
export const storageRef = app.storage().ref();
export const userRef = app.database().ref('users');
export const courseRef = app.database().ref('courses');

export default app;
