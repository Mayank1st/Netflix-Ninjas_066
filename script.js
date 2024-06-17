// /* Navbar section start */
// let signUpForm = document.querySelector("#signUpForm");
// let signInForm = document.querySelector("#signInForm");
// let notOnCoursera = document.querySelector(".notOnCoursera a");
// let alredyOnCoursera = document.querySelector(".alredyOnCoursera a");

// // Encryption and Decryption functions using CryptoJS

// const encryptionKey = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012'); // Example key (32 bytes for AES-256)

// function MyEncrypt(data) {
//     return new Promise((resolve, reject) => {
//         try {
//             const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
//             let encrypted = CryptoJS.AES.encrypt(data, encryptionKey, { iv: iv });
//             // Combine IV and encrypted data
//             const ivAndEncrypted = iv.concat(encrypted.ciphertext);
//             resolve(ivAndEncrypted.toString(CryptoJS.enc.Base64)); // Convert to Base64 for storage
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// function MyDecrypt(data) {
//     return new Promise((resolve, reject) => {
//         try {
//             // Decode the Base64 string
//             const ivAndEncrypted = CryptoJS.enc.Base64.parse(data);
//             // Extract the IV and the encrypted data
//             const iv = CryptoJS.lib.WordArray.create(ivAndEncrypted.words.slice(0, 4), 16); // First 16 bytes
//             const encrypted = CryptoJS.lib.WordArray.create(ivAndEncrypted.words.slice(4)); // Rest of the data
//             let decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, encryptionKey, { iv: iv });
//             resolve(decrypted.toString(CryptoJS.enc.Utf8));
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// // Sign up snippet

// function signUpRedirectBtn(event) {
//     event.preventDefault();

//     let fullname = signUpForm.elements.fullname.value;
//     let email = signUpForm.elements.email.value;
//     let password = signUpForm.elements.password.value;

//     // Encrypt the password
//     MyEncrypt(password)
//         .then(encryptedPassword => {
//             let newUser = { fullname, email, password: encryptedPassword };

//             // Check for existing user before sending POST request
//             return fetch("http://localhost:3000/users")
//                 .then(response => response.json())
//                 .then(existingUsers => {
//                     const existingEmail = existingUsers.find(user => user.email === email);

//                     if (existingEmail) {
//                         alert("This email address is already registered. Please try a different email or log in.");
//                         return;
//                     }

//                     // Send POST request only if email is unique
//                     return fetch("http://localhost:3000/users", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json"
//                         },
//                         body: JSON.stringify(newUser)
//                     });
//                 })
//                 .then((response) => {
//                     if (response.ok) {
//                         alert("Registered successfully!");
//                         signUpForm.reset();
//                         // Optionally redirect to a confirmation or login page
//                     } else {
//                         alert("An error occurred during registration. Please try again later.");
//                         signUpForm.reset();
//                     }
//                 })
//                 .catch((error) => {
//                     alert("Error connecting to server. Please try again later.");
//                     signUpForm.reset();
//                 });
//         })
//         .catch(error => {
//             console.error("Encryption error:", error);
//             alert("An error occurred during registration. Please try again later.");
//             signUpForm.reset();
//         });
// }

// // Sign In snippet

// function signInRedirectBtn(event) {
//     event.preventDefault();

//     let email = signInForm.elements.signInemail.value;
//     let password = signInForm.elements.signInpassword.value;

//     // Fetch existing users to validate credentials
//     fetch("http://localhost:3000/users")
//         .then(response => response.json())
//         .then(existingUsers => {
//             const existingUser = existingUsers.find(user => user.email === email);

//             if (!existingUser) {
//                 alert("User not found. Please check your email.");
//                 return;
//             }

//             // Decrypt stored password
//             MyDecrypt(existingUser.password)
//                 .then(decryptedPassword => {
//                     if (password === decryptedPassword) {
//                         alert("Login Successful.");
//                         window.location.href = "login.html"; // Redirect to login page
//                     } else {
//                         alert("Wrong password. Please try again.");
//                     }
//                 })
//                 .catch(error => {
//                     console.error("Decryption error:", error);
//                     alert("Error during login. Please try again later.");
//                 });
//         })
//         .catch(error => {
//             console.error("Fetch error:", error);
//             alert("Error connecting to server. Please try again later.");
//         });
// }



// // forgotPassword.addEventListener('click', function (event) {
// //     event.preventDefault();
// //     var signInModal = bootstrap.Modal.getInstance(document.getElementById('signInBtn'));
// //     var forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
// //     closeModal(signInModal._element); // Close the sign-in modal
// //     forgotPasswordModal.show();
// // })


// // Event listeners for modals

// notOnCoursera.addEventListener('click', function (event) {
//     event.preventDefault();
//     var signInModal = bootstrap.Modal.getInstance(document.getElementById('signInBtn'));
//     var signUpModal = new bootstrap.Modal(document.getElementById('signUpBtn'));

//     closeModal(signInModal._element); // Close the sign-in modal
//     signUpModal.show(); // Show the sign-up modal
// });

// alredyOnCoursera.addEventListener('click', function (event) {
//     event.preventDefault();
//     var signInModal = new bootstrap.Modal(document.getElementById('signInBtn'));
//     var signUpModal = bootstrap.Modal.getInstance(document.getElementById('signUpBtn'));

//     closeModal(signUpModal._element); // Close the sign-up modal
//     signInModal.show(); // Show the sign-in modal
// });

// function closeModal(modalElement) {
//     var modalInstance = bootstrap.Modal.getInstance(modalElement);
//     if (modalInstance) {
//         modalInstance.hide(); // Hide the modal
//         var modalBackdrop = document.querySelector('.modal-backdrop');
//         if (modalBackdrop) {
//             document.body.removeChild(modalBackdrop); // Remove the backdrop manually
//         }
//     }
// }

// signUpForm.addEventListener('submit', signUpRedirectBtn);
// signInForm.addEventListener('submit', signInRedirectBtn);

// // Forgot Password Section starts

// let forgotPasswordForm = document.querySelector('#forgotPasswordForm');
// let otpPasswordForm = document.querySelector('#otpPasswordForm');
// function generateCaptcha() {
//     const canvas = document.getElementById('captchaCanvas');
//     const ctx = canvas.getContext('2d');
//     const random = Math.random;

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw background
//     const bkgStyles = [
//         'repeating-linear-gradient(45deg, white, white 10px, lightgray 10px, lightgray 20px)',
//         'repeating-linear-gradient(90deg, white, white 10px, lightgray 10px, lightgray 20px)',
//         'repeating-linear-gradient(-45deg, white, white 10px, lightgray 10px, lightgray 20px)'
//     ];
//     const bkgStyle = bkgStyles[Math.floor(random() * bkgStyles.length)];
//     canvas.style.background = bkgStyle;

//     // Draw random lines
//     ctx.beginPath();
//     ctx.moveTo(random() * 50, random() * 30);
//     ctx.lineTo(random() * 200, random() * 50);
//     ctx.strokeStyle = 'black';
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.rect(random() * 20, random() * 20, random() * 50 + 50, random() * 20 + 20);
//     ctx.strokeStyle = 'blue';
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(random() * 20, random() * 50);
//     ctx.lineTo(random() * 100 + 100, random() * 80);
//     ctx.strokeStyle = 'blue';
//     ctx.stroke();

//     // Generate CAPTCHA code
//     const captchaCode = Math.floor(random() * 9000000 + 1000000).toString(16).toUpperCase();
//     sessionStorage.setItem('sessionCaptcha', captchaCode.toLowerCase());

//     // Draw CAPTCHA text
//     ctx.font = '25px Arial';
//     ctx.fillStyle = 'black';
//     ctx.fillText(captchaCode, 20, 50);
// }

// function fetchCaptchaRedirect(event) {

//     event.preventDefault();

//     const email = document.getElementById('forgotPasswordEmail').value;
//     const userInput = document.getElementById('captchaCanvasinput').value.toLowerCase();
//     const storedCaptcha = sessionStorage.getItem('sessionCaptcha');

//     // Check if CAPTCHA is correct
//     if (userInput !== storedCaptcha) {
//         alert('Captcha did not match. Please try again.');
//         generateCaptcha();
//         return;
//     }

//     // Check if email exists in the JSON data
//     fetch('db.json')
//         .then(response => response.json())
//         .then(data => {
//             const user = data.users.find(user => user.email === email);

//             if (user) {
//                 alert('Captcha matched! Form submitted successfully.');
//                 document.getElementById('forgotPasswordForm').reset(); // Reset the form fields
//                 generateCaptcha(); // Refresh the CAPTCHA
//                 // Hide Forgot-password section smoothly
//                 document.getElementById('Forgot-password').classList.add('hide');

//                 // Show OTP section smoothly after delay for transition
//                 setTimeout(() => {
//                     document.getElementById('otp-password').classList.add('show');
//                 }, 500); // Adjust delay to match transition duration

//             } else {
//                 alert('Email not found! Please check your email address.');
//                 generateCaptcha(); // Refresh the CAPTCHA
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching the JSON data:', error);
//             alert('There was an error processing your request. Please try again later.');
//             generateCaptcha(); // Refresh the CAPTCHA
//         });
// }

// window.onload = generateCaptcha;
// forgotPasswordForm.addEventListener("submit", fetchCaptchaRedirect);

// Forgot Password Section ends

/* Navbar section ends */




/* Expand your horizons section start */



/* Expand your horizons section ends */




/* Section1(We collaborate with ) section start */




/* Section1(We collaborate with ) section ends */




/* Section-2(Launch a new career) section start */




/* Section-2(Launch a new career) section ends */



/* section-3(Degree Programs) section start */

document.addEventListener("DOMContentLoaded", () => {
  let data, data2, data3, data4;
  let K1Cards = document.querySelector(".K1Cards");
  let K2Cards = document.querySelector(".K2Cards");
  let K3Cards = document.querySelector(".K3Cards");
  let K4Cards = document.querySelector(".K4Cards");
  let showMore = document.querySelector(".showMore");
  let showMore2 = document.querySelector(".showMore2");
  let showMore3 = document.querySelector(".showMore3");
  let showMore4 = document.querySelector(".showMore4");

  let showData = (arr, condition, div) => {
    let targetDiv;
    if (div === "uni1") targetDiv = K1Cards;
    else if (div === "uni2") targetDiv = K2Cards;
    else if (div === "coursera") targetDiv = K3Cards;
    else if (div === "learning") targetDiv = K4Cards;

    targetDiv.innerHTML = "";
    arr.forEach((ele, i) => {
      if (condition > i) {
        let K1Card = document.createElement("div");
        K1Card.className = "K1Card";
        K1Card.style.cursor = "pointer";

        K1Card.addEventListener("click", (ele) => {
          if (div === "uni1") {
            window.location.href = "https://www.coursera.org/degrees/imba";
          } else if (div === "uni2") {
            window.location.href =
              "https://www.coursera.org/degrees/bachelor-of-science-data-science-ai-iitguwahati";
          } else if (div === "coursera") {
            window.location.href =
              "https://www.coursera.org/professional-certificates/microsoft-business-analyst";
          } else if (div === "learning") {
            window.location.href =
              "https://www.coursera.org/learn/introduction-to-generative-ai";
          }
        });

        let titleImg = document.createElement("div");
        titleImg.className = "example12";
        titleImg.style.backgroundImage = `url(${ele.img})`;

        let uni = document.createElement("div");
        uni.className = "uni";

        let uniLogo = document.createElement("img");
        uniLogo.src = ele.uniLogo;

        let uniName = document.createElement("p");
        uniName.textContent = ele.uniName;

        uni.append(uniLogo, uniName);

        let degreeName = document.createElement("p");
        degreeName.innerHTML = `<p style="margin-bottom: 10px"><b>${ele.degree}</b></p>`;

        let earnDegree = document.createElement("div");
        earnDegree.className = "earnDegree";

        let templateIcon = document.createElement("span");
        templateIcon.className = "material-symbols-outlined";
        templateIcon.textContent = ele.templateIcon;

        let template = document.createElement("p");
        template.innerHTML = `<a href="${ele.templateHref}">${ele.template}</a>`;

        earnDegree.append(templateIcon, template);

        let title = document.createElement("p");
        title.textContent = ele.title;

        K1Card.append(titleImg, uni, degreeName, earnDegree, title);
        targetDiv.append(K1Card);
      }
    });
  };

  let sd = () => {
    if (showMore.textContent === "Show 8 more") {
      let viewportWidth = window.innerWidth;
      if (viewportWidth <= 767) {
        K = 1;
      } else if (viewportWidth <= 1023) {
        K = 2;
      } else {
        K = 4;
      }
      showData(data, K, "uni1");
    }
  };

  let sd2 = () => {
    if (showMore2.textContent === "Show 8 more") {
      let viewportWidth = window.innerWidth;
      if (viewportWidth <= 767) {
        K2 = 1;
      } else if (viewportWidth <= 1023) {
        K2 = 2;
      } else {
        K2 = 4;
      }
      showData(data2, K2, "uni2");
    }
  };

  let sd3 = () => {
    if (showMore3.textContent === "Show 8 more") {
      let viewportWidth = window.innerWidth;
      if (viewportWidth <= 767) {
        K3 = 1;
      } else if (viewportWidth <= 1023) {
        K3 = 2;
      } else {
        K3 = 4;
      }
      showData(data3, K3, "coursera");
    }
  };

  let sd4 = () => {
    if (showMore4.textContent === "Show 8 more") {
      let viewportWidth = window.innerWidth;
      if (viewportWidth <= 767) {
        K4 = 1;
      } else if (viewportWidth <= 1023) {
        K4 = 2;
      } else {
        K4 = 4;
      }
      showData(data4, K4, "learning");
    }
  };

  let K = 4;
  let K2 = 4;
  let K3 = 4;
  let K4 = 4;

  window.addEventListener("resize", () => {
    sd();
    sd2();
    sd3();
    sd4();
  });

  let handleShowMore = async () => {
    if (showMore.textContent === "Show 8 more") {
      K += 8;
      await showData(data, K, "uni1");
      if (K < data.length) {
        showMore.textContent = `Show ${data.length - K} more`;
      } else {
        showMore.textContent = "Show fewer";
      }
    } else if (showMore.textContent === "Show fewer") {
      let viewportWidth = window.innerWidth;
      if (viewportWidth <= 600) {
        await showData(data, 1, "uni1");
      } else if (viewportWidth <= 1023) {
        await showData(data, 2, "uni1");
      } else {
        await showData(data, 4, "uni1");
      }
      showMore.textContent = "Show 8 more";
    } else {
      K += 8;
      await showData(data, K, "uni1");
      showMore.textContent = "Show fewer";
    }
  };

  let handleShowMore2 = async () => {
if (showMore2.textContent.includes("Show 8 more")) {
    K2 += 8;
    await showData(data2, K2, "uni2");
    if (K2 < data2.length) {
        showMore2.textContent = `Show ${data2.length - K2} more`;
    } else {
        showMore2.textContent = "Show fewer";
    }
} else if (showMore2.textContent.includes("Show fewer")) {
    let viewportWidth = window.innerWidth;
    if (viewportWidth <= 600) {
        await showData(data2, 1, "uni2");
    } else if (viewportWidth <= 1023) {
        await showData(data2, 2, "uni2");
    } else {
        await showData(data2, 4, "uni2");
    }
    showMore2.textContent = "Show 8 more";
    K2 = 0;
} else {
  K2 += 8;
  await showData(data2, K2, "uni2");
  showMore2.textContent = "Show fewer";
}
};


let handleShowMore3 = async () => {
if (showMore3.textContent.includes("Show 8 more")) {
    K3 += 8;
    await showData(data3, K3, "coursera");
    if (K3 < data3.length) {
        showMore3.textContent = `Show ${data3.length - K3} more`;
    } else {
        showMore3.textContent = "Show fewer";
    }
} else if (showMore3.textContent.includes("Show fewer")) {
    let viewportWidth = window.innerWidth;
    if (viewportWidth <= 600) {
        await showData(data3, 1, "coursera");
    } else if (viewportWidth <= 1023) {
        await showData(data3, 2, "coursera");
    } else {
        await showData(data3, 4, "coursera");
    }
    showMore3.textContent = "Show 8 more";
    K3 = 0;
} else {
    K3 += 8;
    await showData(data3, K3, "coursera");
    showMore3.textContent = "Show fewer";
}
};

let handleShowMore4 = async () => {
if (showMore4.textContent.includes("Show 8 more")) {
    K4 += 8;
    await showData(data4, K4, "learning");
    if (K4 < data4.length) {
        showMore4.textContent = `Show ${data4.length - K4} more`;
    } else {
        showMore4.textContent = "Show fewer";
    }
} else if (showMore4.textContent.includes("Show fewer")) {
    let viewportWidth = window.innerWidth;
    if (viewportWidth <= 600) {
        await showData(data4, 1, "learning");
    } else if (viewportWidth <= 1023) {
        await showData(data4, 2, "learning");
    } else {
        await showData(data4, 4, "learning");
    }
    showMore4.textContent = "Show 8 more";
    K4 = 0;
} else {
    K4 += 8;
    await showData(data4, K4, "learning");
    showMore4.textContent = "Show fewer";
}
};

  showMore.addEventListener("click", () => {
    handleShowMore();
  });

  showMore2.addEventListener("click", () => {
    handleShowMore2();
  });

  showMore3.addEventListener("click", () => {
    handleShowMore3();
  });

  showMore4.addEventListener("click", () => {
    handleShowMore4();
  });

  let getData = async (endPoint) => {
    let res = await fetch(`http://localhost:3000/${endPoint}`);
    let ans = await res.json();

    if (endPoint === "Universities") {
      data = ans;
      sd();
    } else if (endPoint === "Universities2") {
      data2 = ans;
      sd2();
    } else if (endPoint === "coursera") {
      data3 = ans;
      sd3();
    } else if (endPoint === "learning") {
      data4 = ans;
      sd4();
    }
  };

  getData("Universities");
  getData("Universities2");
  getData("coursera");
  getData("learning");
});

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