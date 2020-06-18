// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDMHSqUW_e7B8-iCsXqDWfXUWr2sqagYH8",
    authDomain: "triprec-30e5f.firebaseapp.com",
    databaseURL: "https://triprec-30e5f.firebaseio.com",
    projectId: "triprec-30e5f",
    storageBucket: "triprec-30e5f.appspot.com",
    messagingSenderId: "953678545738",
    appId: "1:953678545738:web:4253c956a3bff4aa3e37b3"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

  //make auth and firestore reference
const auth = firebase.auth();
const db = firebase.firestore();
const dbtest = firebase.database();


function onfirebaseStateChanged(){
  auth.onAuthStateChanged(onStateChanged);
}

function onStateChanged(user){
  if(user){
    console.log(auth.currentUser.email);
    console.log(auth.currentUser.uid);
  }
  else{
    console.log('user logged out');
  }
}
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user);
    } else {
        console.log('user logged out');
    }
});