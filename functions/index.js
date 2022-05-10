const functions = require("firebase-functions");

const express = require('express');

const bodyParser = require('body-parser');

const firebase = require('firebase/app');

const firebaseAuthentication = require('firebase/auth');

const { Firestore, getFirestore } = require("@firebase/firestore");

const admin = require('firebase-admin');

const { response } = require("express");

require('firebase/firestore');

const appUssd = express();

appUssd.use(bodyParser.json());
appUssd.use(bodyParser.urlencoded({ extended: false }));

const regUssd = express();

regUssd.use(bodyParser.json());
regUssd.use(bodyParser.urlencoded({extended: false}));

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIEL3ibfhqZo-hFMimqh7yA6nd08ysJoA",
  authDomain: "msikayaalimi.firebaseapp.com",
  projectId: "msikayaalimi",
  storageBucket: "msikayaalimi.appspot.com",
  messagingSenderId: "356290313512",
  appId: "1:356290313512:web:9ca771f2d28250fef6641d",
  measurementId: "G-3QXVWQSBWJ"
};

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize firestore
admin.initializeApp();

// Initialise firebase auth
const auth = firebaseAuthentication.getAuth();

appInit();
function appInit() {
    appUssd.post('/ussd', (req, res) => {
    // Read the variables sent via POST from Africa's Talking API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
        
    } = req.body;

    let response = '';
    let level = 0;

    if (text == '') {
        // This is the first request. First code starts with CON
        response = `CON What would you like to do?
        1. Register Account
        2. Login to Msika Ya Alimi
        3. Exit`;
    } else if ( text != '') {
        // Business logic for first level response

        textArray = text.split('*');
        level = textArray.length;
        if (textArray[0] == 1){

            /**
             * Code to load the registraion menu 
             * once a user has chosen option 1
             */

            if (level == 1){
                response = "CON please enter your email:";
            } 
            else if (level == 2){
                response = "CON please enter your first name:";
            } 
            else if (level == 3){
                response = 'CON Please enter your last name:';
            } 
            else if (level == 4){
                response = 'CON Please enter your password:';
            } 
            else if (level == 5){
                response = 'CON Please re-enter your password:';
            } 
            else if (level == 6 && (textArray[4] == textArray[5])){
                response = `CON Please select your gender:
                1. Male
                2. Female`;
            } 
            else if (level == 6 && (textArray[4] != textArray[5])){
                response = `CON Warning: Your passwords do not match! Please enter 
                Please enter a new password`;
            } 
            else if (level == 7 && (textArray[4] == textArray[5])){
                response = `CON Please select the type of account you would like to create:
                1. Customer
                2. Farmer`;
            } 
            else if (level == 7 && (textArray[4] != textArray[5])){
                response = 'CON Please re-enter your password:';
            } 
            else if (level == 8 && (textArray[4] != textArray[5])){
                response = `CON Please select your gender:
                1, Male
                2. Female`;
            } 
            else if (level == 8 && (textArray[4] == textArray[5])){
                response = `END you have successfully registered your account!`;
                registerUser(textArray);
            } 
            else if (level == 9 && (textArray[4] != textArray[5])){
                response = `CON Please select the type of account you would like to create:
                1. Customer
                2. Farmer`;
            } 
            else if (level == 10 && (textArray[4] == textArray[5])){
                response = `END you have successfully registered your account!`;
                registerUser(textArray);
            }
        } 
        
        // Code to log user into the application if they already have an account:  
        else if (textArray[0] == 2){
            if (level == 1){
                response = "CON please enter your email:";
            } 
            else if (level == 2){
                response = "CON please enter your password:";
            } 
            else if (level == 3){
                registrationEmail = textArray[1];
                registrationPassword = textArray[2];

                response = loginUser(textArray);
                
            } 
            else if (textArray[3] == 1){
                // Menu to add a product
                if (level == 4){
                    response = `CON Please enter the product title: `;
                } 
                else if (level == 5){
                    response = `CON Please enter the product price: `;
                } 
                else if (level == 6){
                    response = `CON Please enter the product description: `;
                } 
                else if (level == 7){
                    response = `CON Please enter the product specification:
                    e.g. Product weight, height etc `;
                } 
                else if (level == 8){
                    response = `CON Please enter the product location: `;
                } 
                else if (level == 9){
                    response = `CON Please enter the product quantity: `;
                } 
                else if (level == 10){
                    response = `CON Please enter the product category:
                    1. Animals
                    2. Eggs and Dairy
                    3. Nuts
                    4. Vegetables
                    5. Fruits
                    6. Other `;
                } 
                else if (level ==12){
                    createProduct(textArray);
                }
            } 
            else if (level == 4 && textArray[3] == 2){
                // TODO: Menu to update a product
                
            } 
            else if (level == 4 && textArray[3] == 3){
                
                response = `CON List of products`+ getProducts();
            } 
            else if (level == 4 && textArray[3] == 4){
                // TODO: Menu to sign out
                firebaseAuthentication.signOut(auth);
                response = 'END You have successfully signed out!'
            }
            
        }
        else if (text == '3'){
            response = `END Thank you for using our services!`;
        }       
    }
    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
    });

    exports.ussd = functions.https.onRequest(appUssd);
}


function loginUser(textArray){
    // code to log user into their account
    registrationEmail = textArray[1];
    registrationPassword = textArray[2];

    const res = firebaseAuthentication.signInWithEmailAndPassword(auth, registrationEmail, registrationPassword).then((userCredential) =>{
        const user = userCredential.user;
        console.log('Successfully loggeg in!');
    }
        ).catch((error) =>{
        console.log('Error', error);
    })

    let userEmail = "";

    let loggedInUser = admin.auth().getUserByEmail(registrationEmail).then((docref) =>{
        console.log("User:", docref.email);
        userEmail += docref.email;
        return userEmail += docref.email;
    });
    let response = '';

    userEmail += loggedInUser;

    if (userEmail != ""){
        response = `CON You have successfully signed in. Please select an option:
        1. Add product
        2. Delete a Product
        3. View My Products
        4. Sign Out`;
    } else {
        response = `END Error while signing you in!`;
    }

    return response;

}

/**
 * 
 * @param {} textArray takes in all the information the user has entered in the registration menu
 * 
 * Function to process the information entered into the registration menu and save them into Firebase 
 */

function registerUser(textArray){

    registrationFirstName = textArray[2];
    registrationLastName = textArray[3];
    registrationEmail = textArray[1];

    if (textArray[4] == textArray[5]){
        registrationPassword = textArray[4];
        if (textArray[6] == 1){
            registrationGender = 'male';
        } else {
            registrationGender = 'female';
        } 
        if (textArray[7] == 1){
            registrationType = 'customer';
        } else {
            registrationType = 'farmer';
        }
        
    } else if (textArray[4] != textArray[5]){
        registrationPassword = textArray[6];
        if (textArray[8] == 1){
            registrationGender = 'male';
        } else {
            registrationGender = 'female';
        } if (textArray[9] == 1){
            registrationType = 'customer';
        } else {
            registrationType = 'farmer';
        }
    }

    const data = {
        email: registrationEmail, 
        firstName: registrationFirstName, 
        lastName: registrationLastName, 
        gender: registrationGender, 
        id: '', 
        image: '', 
        mobile: Number(''), 
        userType: registrationType
    };

    

    admin.firestore().collection('users').add(data).then((docref) =>{
        console.log('Successfully registered user!!!', docref.id);
        admin.auth().createUser({
            uid: docref.id,
            email: registrationEmail,
            password: registrationPassword
        }).then((userRecord)=>{
            console.log("Successfully created user", userRecord.uid);
        }).catch((error)=>{
            console.log("Error:", error);
        })
    }).catch(
        (error) => {console.log('Error: ', error)});
            
}

function createProduct(textArray){
    title = textArray[4];
    price = textArray[5];
    description = textArray[6];
    specification = textArray[7];
    location = textArray[8];
    quantity = textArray[9];

    if (textArray[10] == 1){
        category = 'Animals';
    } else if (textArray[10] == 2){
        category = 'Eggs and Dairy';
    } else if (textArray[10] == 3){
        category = 'Nuts';
    } else if (textArray[10] == 4){
        category = 'Vegetables';
    } else if (textArray[10] == 5){
        category = 'Fruits';
    } else if (textArray[10] == 6){
        category = 'Other';
    }

    const data = {
        productTitle: title,
        productPrice: price,
        productDescription: description,
        productSpecification: specification,
        productLocation: location,
        productQuantity: quantity,
        product_category: category
    }

    const res = admin.firestore().collection('products').add(data).then((docref)=>{
        console.log("You have successfully created product: ", docref.id);
    }).catch((error)=>{
        console.log("Error:", error);
    })
}

// TODO: Complete the functions below 

function updateProduct(){
    
}

function deleteAccount(){

}

function deleteProduct(){

}

function getProducts(){
    let products = [];
    const productsRef = admin.firestore().collection('products').get().then(
        doc =>{
            doc.forEach(
                product =>{
                    console.log(product.data);
                    return product.data();
                }
            )
        }
    ).catch(error =>{
        console.log("Error", error);
    });
 
    

    return String(productsRef);
}


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

