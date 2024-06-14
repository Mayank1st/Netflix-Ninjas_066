/* Navbar section start */
let signUpForm = document.querySelector("#signUpForm");
let signInForm = document.querySelector("#signInForm");
let notOnCoursera = document.querySelector(".notOnCoursera a");
let alredyOnCoursera = document.querySelector(".alredyOnCoursera a");

// Encryption and Decryption functions using CryptoJS

const encryptionKey = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012'); // Example key (32 bytes for AES-256)

function MyEncrypt(data) {
    return new Promise((resolve, reject) => {
        try {
            const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
            let encrypted = CryptoJS.AES.encrypt(data, encryptionKey, { iv: iv });
            // Combine IV and encrypted data
            const ivAndEncrypted = iv.concat(encrypted.ciphertext);
            resolve(ivAndEncrypted.toString(CryptoJS.enc.Base64)); // Convert to Base64 for storage
        } catch (error) {
            reject(error);
        }
    });
}

function MyDecrypt(data) {
    return new Promise((resolve, reject) => {
        try {
            // Decode the Base64 string
            const ivAndEncrypted = CryptoJS.enc.Base64.parse(data);
            // Extract the IV and the encrypted data
            const iv = CryptoJS.lib.WordArray.create(ivAndEncrypted.words.slice(0, 4), 16); // First 16 bytes
            const encrypted = CryptoJS.lib.WordArray.create(ivAndEncrypted.words.slice(4)); // Rest of the data
            let decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, encryptionKey, { iv: iv });
            resolve(decrypted.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            reject(error);
        }
    });
}

// Sign up snippet

function signUpRedirectBtn(event) {
    event.preventDefault();

    let fullname = signUpForm.elements.fullname.value;
    let email = signUpForm.elements.email.value;
    let password = signUpForm.elements.password.value;

    // Encrypt the password
    MyEncrypt(password)
        .then(encryptedPassword => {
            let newUser = { fullname, email, password: encryptedPassword };

            // Check for existing user before sending POST request
            return fetch("http://localhost:3000/users")
                .then(response => response.json())
                .then(existingUsers => {
                    const existingEmail = existingUsers.find(user => user.email === email);

                    if (existingEmail) {
                        alert("This email address is already registered. Please try a different email or log in.");
                        return;
                    }

                    // Send POST request only if email is unique
                    return fetch("http://localhost:3000/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newUser)
                    });
                })
                .then((response) => {
                    if (response.ok) {
                        alert("Registered successfully!");
                        signUpForm.reset();
                        // Optionally redirect to a confirmation or login page
                    } else {
                        alert("An error occurred during registration. Please try again later.");
                        signUpForm.reset();
                    }
                })
                .catch((error) => {
                    alert("Error connecting to server. Please try again later.");
                    signUpForm.reset();
                });
        })
        .catch(error => {
            console.error("Encryption error:", error);
            alert("An error occurred during registration. Please try again later.");
            signUpForm.reset();
        });
}

// Sign In snippet

function signInRedirectBtn(event) {
    event.preventDefault();

    let email = signInForm.elements.signInemail.value;
    let password = signInForm.elements.signInpassword.value;

    // Fetch existing users to validate credentials
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(existingUsers => {
            const existingUser = existingUsers.find(user => user.email === email);

            if (!existingUser) {
                alert("User not found. Please check your email.");
                return;
            }

            // Decrypt stored password
            MyDecrypt(existingUser.password)
                .then(decryptedPassword => {
                    if (password === decryptedPassword) {
                        alert("Login Successful.");
                        window.location.href = "login.html"; // Redirect to login page
                    } else {
                        alert("Wrong password. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Decryption error:", error);
                    alert("Error during login. Please try again later.");
                });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("Error connecting to server. Please try again later.");
        });
}



// forgotPassword.addEventListener('click', function (event) {
//     event.preventDefault();
//     var signInModal = bootstrap.Modal.getInstance(document.getElementById('signInBtn'));
//     var forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
//     closeModal(signInModal._element); // Close the sign-in modal
//     forgotPasswordModal.show();
// })


// Event listeners for modals

notOnCoursera.addEventListener('click', function (event) {
    event.preventDefault();
    var signInModal = bootstrap.Modal.getInstance(document.getElementById('signInBtn'));
    var signUpModal = new bootstrap.Modal(document.getElementById('signUpBtn'));

    closeModal(signInModal._element); // Close the sign-in modal
    signUpModal.show(); // Show the sign-up modal
});

alredyOnCoursera.addEventListener('click', function (event) {
    event.preventDefault();
    var signInModal = new bootstrap.Modal(document.getElementById('signInBtn'));
    var signUpModal = bootstrap.Modal.getInstance(document.getElementById('signUpBtn'));

    closeModal(signUpModal._element); // Close the sign-up modal
    signInModal.show(); // Show the sign-in modal
});

function closeModal(modalElement) {
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide(); // Hide the modal
        var modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            document.body.removeChild(modalBackdrop); // Remove the backdrop manually
        }
    }
}

signUpForm.addEventListener('submit', signUpRedirectBtn);
signInForm.addEventListener('submit', signInRedirectBtn);




/* Navbar section ends */




/* Expand your horizons section start */



/* Expand your horizons section ends */




/* Section1(We collaborate with ) section start */




/* Section1(We collaborate with ) section ends */




/* Section-2(Launch a new career) section start */




/* Section-2(Launch a new career) section ends */



/* section-3(Degree Programs) section start */



/* section-3(Degree Programs) section ends */




/* section-4(Courses and Professional Certificates) section start */



/* section-4(Courses and Professional Certificates) section ends */




/* section-5(100% Free) section start */



/* section-5(100% Free) section ends */



/* Section-6(Explore Coursera)  section start */








/* Section-6(Explore Coursera)  section ends */




/* section-7(World-class learning)  section start */



/* section-7(World-class learning)  section ends */


/* section-8(From the Coursera community)  section start */


/* section-8(From the Coursera community)  section ends */






/* section-9(The ideal solution for your business)  section start */


/* section-9(The ideal solution for your business)  section ends */



/* section-10(Take the next step)  section start */


/* section-10(Take the next step)  section ends */



/* section-11(Footer)  section start */


/* section-11(Footer)  section ends */