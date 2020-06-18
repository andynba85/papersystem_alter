/*
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
*/
// listen for auth status changes

//sign-up
//const signupForm = document.querySelector('#signup-form');
signup.addEventListener('click', (e) => {
  e.preventDefault();
  const signupForm = document.querySelector('#signup-form');
  // get user info
  const name = signupForm['signup-name'].value;
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user['uid']);
    
    dbtest.ref('users/'+ cred.user['uid']).set({
      username:name,
      useremail:email,
      userpassword:password,
      img:"account.jpg"
    }).then(()=>{
      M.toast({html: 'Sign up successfully!', classes: 'rounded'});
      console.log("success");
    });
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});


// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function(){
     // log the user in
  return auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    window.location.href='nav.html';
    loginForm.reset();
  })
/*
  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    
    // close the signup modal & reset form
    window.location.href='index.html';
    loginForm.reset();*/
  });

});
