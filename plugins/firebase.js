import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// if(!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyCxWObiHXYF1lUFtvZ8uCuceZArIzj83A0",
    authDomain: "haller-kurs.firebaseapp.com",
    databaseURL: "https://haller-kurs-default-rtdb.firebaseio.com",
    projectId: "haller-kurs",
    storageBucket: "haller-kurs.appspot.com",
    messagingSenderId: "507210299419",
    appId: "1:507210299419:web:311fad8499956d499d20be",
    measurementId: "G-6HCNV0VR0X"
  }
if(!firebase.apps.length) {
  // Initialize Firebase
  var firebaseApp = firebase.initializeApp(firebaseConfig)
} else {
  var firebaseApp = firebase.app()
}
  const db = firebaseApp.firestore()
  // const auth = firebaseApp.auth()
  const storage = firebaseApp.storage()

  export {
    db,
    // auth,
    storage
  }


