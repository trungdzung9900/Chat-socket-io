function checkifLoggedIn() {
    firebase.auth().onAuthStateChanged((user => {
        if (user) {
            console.log(user);
            var photoURL = user.photoURL
            var name = user.displayName
            document.getElementById('google-display-name').innerHTML = name
            document.getElementById('google-pic').setAttribute('src', String(photoURL))
        }
        else {
            console.log("user not logged in");
        }
    })
    )



}
window.onload = () => {
    checkifLoggedIn()
}
// checkifLoggedIn()
function singOutGoogle() {
    firebase.auth().signOut()
    // localStorage.removeItem('firebase_idToken')
    // localStorage.removeItem('name_save')
    // localStorage.removeItem('pic_save')
    document.getElementById('google-pic').setAttribute('src', '')
    document.getElementById('google-display-name').innerHTML = null
}
function signInWithFaceBook(){
var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('user_birthday');
firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
})
.catch(err =>{
    console.log(err);
});
}
function signInWithGoogle() {
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    firebase.auth().signInWithPopup(provider)
        .then(result => {
            // This gives you a Google Access Token.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var idToken = result.credential.idToken
            var name = result.user.displayName
            // var img = new Image();
            // var photoURl = result.user.photoURl
            var photoURL = result.additionalUserInfo.profile.picture
            // localStorage.setItem('firebase_idToken', idToken)
            // localStorage.setItem('pic_save', photoURL)
            // localStorage.setItem('name_save', name)

            document.getElementById('google-display-name').innerHTML = name
            document.getElementById('google-pic').setAttribute('src', String(photoURL))
            location.href = 'https://maca-chat-app.herokuapp.com/trangchu';
        })
        .catch(err => {
            console.log(err);
        })
}