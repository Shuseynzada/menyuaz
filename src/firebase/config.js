import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-bPXjUnTh05H_Kkn-WYmFg9L7t2ShBWk",
  authDomain: "firegram-a1204.firebaseapp.com",
  projectId: "firegram-a1204",
  storageBucket: "firegram-a1204.appspot.com",
  messagingSenderId: "1079845883540",
  appId: "1:1079845883540:web:73b5adc97e9d2ba0c0ee81"
};

firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage()
const projectFirestore = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export {
  projectStorage,
  projectFirestore,
  timestamp
}