window.onload = function () {
    var firebaseheadingref = firebase
        .database()
        .ref()
        .child("users");
    firebaseheadingref.on("value", function (datasnapshot) {
        //console.log(datasnapshot.val());
        calculate_avg(datasnapshot);
    });
};

function calculate_avg(datasnapshot) {
    datasnapshot = datasnapshot.val();
    console.log(datasnapshot);

}

function write_db() {
    var today = new Date();
    //console.log("The time is ", today);

    if (percent != null) {
        //console.log(percent);
        time_as_str = String(today);
        //console.log(time_as_str);
        set = {
            score: percent,
            time: time_as_str
        };
        firebase
            .database()
            .ref()
            .child("quiz_scores")
            .push()

            .set(set);
    } else {
        //console.log(" No score to be had");
    }
}


function login() {
    console.log("Login starting")
}

function toggle_forms(visible) {



    if (visible) {
        loginForm.style.display = "block"
        signupForm.style.display = "block"
        logout.style.display = "none"
        help_request.style.display = "none"

    } else {


        loginForm.style.display = "none"
        signupForm.style.display = "none"
        speed_alert.style.display = "none"
        wrong_pwd.style.display = "none"
        no_user.style.display = "none"
        logout.style.display = "block"
        help_request.style.display = "block"

    }
}
// login
let loginForm = document.querySelector("#login-form");
let speed_alert = document.querySelector("#speedwarning");
let wrong_pwd = document.querySelector("#wrong_pwd");
let no_user = document.querySelector("#no_user");
let short_pwd = document.querySelector("#short_pass");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("login like twitter")

    // get user info
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    console.log(email, "|", password)

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        //when successful close option for google sign in
        //if signed in with email/passowrd then remove option to sign in with google.SO you would have to sign out.
        // /google_sign_in_button.style.display = "none";

        console.log("signed in with email and password");
        global_user = firebase.auth().currentUser;

        //getusername();
        isverified = cred.user.emailVerified;
        // close the signup modal & reset form

        //const modal = document.querySelector("#modal-login");
        //if not verified
        /*
        if (cred.user.emailVerified == false) {
            //document.getElementById("verify").innerHTML =You cannot 'tweet' until account is verified.Check your email.<br>After you verify your email,you must logout and re sign in.This is all extra security and for the greater good.";
            isverified = false;
            console.log("verify pls");
            firebase.auth().currentUser.sendEmailVerification();
        }

        */
        toggle_forms(false)
        loginForm.reset();


    }).catch((err) => {
        console.log("Could not login")
        console.log(err)
        console.log("|" + err.message + "|")

        if (err.message == "The password is invalid or the user does not have a password.") {
            console.log("incorrrect paswrod")
            wrong_pwd.style.display = "block"
        } else if (err.message == "Too many unsuccessful login attempts. Please try again later.") {
            console.log("slowww down buddy")
            speed_alert.style.display = "block"
        } else if (err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
            console.log("slowww down buddy")
            no_user.style.display = "block"

        }
    });
});





//signup

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", function (e) {
    //stop reloadings
    e.preventDefault();



    // get user info
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;
    const username = signupForm["signup-username"].value;
    const emerphone = signupForm["signup-emerphone"].value;
    const medical = signupForm["signup-medical"].value;
    const realname = signupForm["signup-realname"].value;

    //console.log("jd");
    console.log(username);
    console.log(emerphone, medical)
    console.log(email, password);

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        console.log("going to sign up")
        //ueser data = auth
        console.log(firebase.auth().currentUser);
        global_user = firebase.auth().currentUser;
        current_user_name = username;
        current_user_name = current_user_name.toLowerCase();
        allow = true;
        isverified = cred.user.emailVerified;


        //adding the user to the database
        console.log(username);


        console.log("add");
        firebase.database().ref().child("users").child(global_user.uid).set({
            user_name: current_user_name,
            emerphone: emerphone,
            medical: medical,
            realname: realname

        }).catch((err) => {
            console.log("Could not add to db")
        })




        signupForm.reset();
    }).catch((err) => {
        console.log("Could not sign up")

        console.log(err)
        console.log("|" + err.message + "|")

        if (err.message == "Password should be at least 6 characters") {
            console.log("Password is too short")
            short_pwd.style.display = "block"
        }
    });
});
let current_user_name = ""
// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        //making verif not seen
        document.getElementById("login-status").innerHTML = "Not lgged in";

        //temoving user add
        toggle_forms(true)
        //console.log("user signed out");
    });
});

// logout
let realname = ""
const help_request = document.querySelector("#help_request");
help_request.addEventListener("click", (e) => {

    //get the location
    getLocation()

    //ask for help
    console.log("emerphone", emerphone)
    let time = String(new Date())
    console.log(time)
    console.log("Help requested")
    firebase.database().ref().child("help").child(global_user.uid).set({
        status: true,
        user_name: current_user_name,
        emerphone: emerphone,
        medical: medical,
        realname: realname,
        time: time

    }).catch((err) => {
        console.log("Could not sign up")
    })
});



// listen for auth status changes
auth.onAuthStateChanged((user) => {
    if (user) {
        //adding user read


        global_user = firebase.auth().currentUser;

        //if signed in then remove option to sign in with google again.SO you would have to sign out.

        console.log("user logged in: ");
        document.getElementById("login-status").innerHTML = "Logged in"
        allow = true;
        console.log(global_user);
        isverified = user.emailVerified;

        toggle_forms(false)
        //retrieve form data

        let firebaseheadingref = firebase
            .database()
            .ref()
            .child("users");
        firebaseheadingref.on("value", function (datasnapshot) {
            //console.log(datasnapshot.val());
            let data = datasnapshot.val()
            //get emerphone

            emerphone = data[user.uid]["emerphone"]
            medical = data[user.uid]["medical"]
            current_user_name = data[user.uid]["user_name"]
            realname = data[user.uid]["realname"]
            console.log("SUPPOSED REAL NAME" + realname)
        });



        //make login and signupnforms not seen
    } else {
        //making verif not seen

        document.getElementById("login-status").innerHTML = "Logged out"
        console.log("user logged out");
        toggle_forms(true)
    }
});


function getLocation() {


    console.log(navigator.geolocation)
    document.getElementById("location").innerHTML = "gay"
    navigator.geolocation.getCurrentPosition(test);
    //document.getElementById("location").innerHTML = "help"





}

function test(position) {
    var lat = position.coords.latitude;
    //console.log(position.coords.latitude, position.coords.longitude);
    document.getElementById("location").innerHTML = "here";

}