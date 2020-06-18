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
    console.log(auth.currentUser);
    console.log(auth.currentUser.email);
    console.log(auth.currentUser.uid);
    /*
    dbtest.ref('users').on('value',function(data){
      console.log(data)
      //some類似forEach
      data.forEach(function(item){
        console.log(item.key + " " + item.val())
        if( item.key === auth.currentUser.uid){
          console.log(item.key);
          return true;
        }
      });
    });
    */
    if(auth.currentUser.providerData[0].providerId == 'password'){
      dbtest.ref('users/'+auth.currentUser.uid).update({'onlinestatus':true});
      dbtest.ref('users/'+auth.currentUser.uid).on('value',function(data){
        console.log(data.val().username)
        document.getElementById('welcomename').innerHTML="Hi "+ data.val().username;
        if(data.val().img != null){
          document.getElementById('imgProfile').src = data.val().img
        }
        $('#load').removeClass("is-active");
      });
    }
    else{
      dbtest.ref('users').on('value',function(data){
        console.log(data.length)
        //num判斷有沒有登入過
        var num = false;
        data.forEach(function(item){
          console.log(item.key + " " + item.val())
          if( item.key === auth.currentUser.uid){
            console.log(item.key);
            dbtest.ref('users/'+auth.currentUser.uid).update({'onlinestatus':true});
            dbtest.ref('users/'+auth.currentUser.uid).on('value',function(data){
              console.log(data.val().username)
              document.getElementById('welcomename').innerHTML="Hi "+ data.val().username;
              if(data.val().img != null){
                document.getElementById('imgProfile').src = data.val().img
              }
              $('#load').removeClass("is-active");
            });
            num = true
            return true;
          }

        });
        if(num == false){
          dbtest.ref('users/'+auth.currentUser.uid).update({'onlinestatus':true});
          document.getElementById('imgProfile').src=auth.currentUser.photoURL;
          document.getElementById('welcomename').innerHTML="Hi "+auth.currentUser.displayName;
          $('#load').removeClass("is-active");
          dbtest.ref('users/'+ auth.currentUser.uid).set({
            username:auth.currentUser.displayName,
            useremail:auth.currentUser.email,
            img:auth.currentUser.photoURL
          });
        }
      });
    }
  }
  else{
    dbtest.ref('users/'+auth.currentUser.uid).update({'onlinestatus':false});
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


//onfirebaseStateChanged();