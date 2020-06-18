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

function firebasestagepost(){
    auth.onAuthStateChanged(onpostchange);
}

function onpostchange(user){
    if(user){
        console.log(auth.currentUser);
        console.log(auth.currentUser.email);
        console.log(auth.currentUser.uid);
        
        dbtest.ref('onlinepost').on('value',function(data){
        console.log(data.val())
          //some類似forEach
        //document.getElementById('content').innerHTML=""
        //document.getElementById('content').innerHTML=""
        data.forEach(function(item){
            console.log(item.key + " " + item.val())
            document.getElementById('content').insertAdjacentHTML('afterbegin', 
            `<div class="card">
                <div class="card_bar">
                    <img class="card_profile_pic" src="account.jpg">
                    <span class="card_span">John</span>
                </div>
                <img class="card_img" src="${item.val().post}" alt="Avatar" style="width:100%">
                <div class="container">
                    <i id="good${item.key}" class="far fa-heart" onclick="good()"></i>
                    <span id="${item.key}" class="container_span">20個讚</span>
                    <i onclick="openNav('${item.key}')" class="far fa-compass"></i>
                    <p>${item.val().content}</p>
                </div>
            </div>`);
            console.log(item.val().content)
        });
    });
    
    }
    else{
        dbtest.ref('users/'+auth.currentUser.uid).update({'onlinestatus':false});
        console.log('user logged out');
    }
}

function onStateChanged(user){
  if(user){
    console.log(auth.currentUser);
    console.log(auth.currentUser.email);
    console.log(auth.currentUser.uid);
    
    dbtest.ref('onlinepost').once('value',function(data){
      console.log(data.val())
      //document.getElementById('content').innerHTML=""
      //some類似forEach
      data.forEach(function(item){
        console.log(item.key + " " + item.val())
        document.getElementById('content').insertAdjacentHTML('afterbegin', 
        `<div class="card">
            <div class="card_bar">
                <img class="card_profile_pic" src="${item.val().userimg}">
                <span class="card_span">${item.val().username}</span>
                <div class="topic">${item.val().topic}</div>
                <p>${item.val().pushtime}</p>
            </div>
            <img class="card_img" src="${item.val().post}" alt="Avatar" style="width:100%">
            <div class="container">
                <i id="good${item.key}" class="far fa-heart" onclick="good()"></i>
                <span id="${item.key}" class="container_span">${item.val().good}個讚</span>
                <i onclick="openNav('${item.key}')" class="far fa-compass"></i>
                <p>${item.val().content}</p>
            </div>
        </div>`);
        dbtest.ref('users/'+auth.currentUser.uid+'/goodpost').once('value',function(d2){
          d2.forEach(function(item){
            document.getElementById("good"+item.val()).setAttribute('class','fas fa-heart hred')
          })
        })
        console.log(item.val().content)
      });
    });

    if(auth.currentUser.providerData[0].providerId == 'password'){
      dbtest.ref('users/'+auth.currentUser.uid).update({'onlinestatus':true});
      dbtest.ref('users/'+auth.currentUser.uid).on('value',function(data){
        console.log(data.val().username)
        document.getElementById('welcomename').innerHTML="Welcome  &nbsp"+ data.val().username;
        if(data.val().img != null){
          document.getElementById('imgProfile').src = data.val().img
        }
        if(data.val().motto != null){
            document.getElementById('motto').innerHTML = data.val().motto
        }else{
          document.getElementById('motto').innerHTML = "探索、冒險、喜歡旅行"
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
              document.getElementById('welcomename').innerHTML="Welcome Back "+ data.val().username+" !";
              if(data.val().img != null){
                document.getElementById('imgProfile').src = data.val().img
              }
              if(data.val().motto != null){
                document.getElementById('motto').innerHTML = data.val().motto
              }else{
                document.getElementById('motto').innerHTML = "探索、冒險、喜歡旅行"
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
          document.getElementById('welcomename').innerHTML="Welcome Back "+auth.currentUser.displayName+" !";
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