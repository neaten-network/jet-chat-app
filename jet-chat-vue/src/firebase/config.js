import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTkHY29Vw64gDirOKt7hu0V1KuF3F79yU",
  authDomain: "jet-chat-6cdef.firebaseapp.com",
  projectId: "jet-chat-6cdef",
  storageBucket: "jet-chat-6cdef.appspot.com",
  messagingSenderId: "561189782927",
  appId: "1:561189782927:web:140e75b0b8cc1032a1b7fa",
};

// Init firebase
firebase.initializeApp(firebaseConfig);

const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectAuth, projectFirestore, projectStorage, timestamp };
