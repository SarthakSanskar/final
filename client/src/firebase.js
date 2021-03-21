import firebase from 'firebase';

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDPPc0RYhQXsU8hJReM6aXinK8ClulqHeI",
    authDomain: "dream-e-rent.firebaseapp.com",
    projectId: "dream-e-rent",
    storageBucket: "dream-e-rent.appspot.com",
    messagingSenderId: "490390759306",
    appId: "1:490390759306:web:e19f626333a48a05d58a73"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
