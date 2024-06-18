// /* Navbar section start */
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));


    dropdownElementList.forEach(function (dropdownToggleEl) {
        dropdownToggleEl.addEventListener('show.bs.dropdown', function (event) {
            const dropdownMenu = event.target.nextElementSibling;
            // Adjust the dropdown menu position here
            dropdownMenu.classList.add('custom-dropdown-menu');

            // Show the overlay
            overlay.style.display = 'block';
        });

        dropdownToggleEl.addEventListener('hide.bs.dropdown', function () {
            const dropdownMenu = event.target.nextElementSibling;
            dropdownMenu.classList.remove('custom-dropdown-menu');

            // Hide the overlay
            overlay.style.display = 'none';
        });
    });

    // Hide the dropdown when overlay is clicked
    overlay.addEventListener('click', function () {
        const openDropdownMenu = document.querySelector('.dropdown-menu.show');
        if (openDropdownMenu) {
            openDropdownMenu.classList.remove('show');
        }
        overlay.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.querySelector("#signUpForm");
    const signInForm = document.querySelector("#signInForm");
    const notOnCoursera = document.querySelector(".notOnCoursera a");
    const alreadyOnCoursera = document.querySelector(".alreadyOnCoursera a");
    const profileDropdown = document.querySelector('.profile_dropdown');
    const btnGroup = document.querySelector('.sign_in_loginBtn');
    const logoutButton = document.querySelector("#logoutButton");

    let isLoggedIn = localStorage.getItem('email') !== null;

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
                        if (response && response.ok) {
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
                            handleLoginSuccess(email);
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

    // Function to handle successful login
    function handleLoginSuccess(email) {
        isLoggedIn = true;
        localStorage.setItem('email', email);
        updateProfileDropdownVisibility(); // Update UI after login
        // Optionally redirect or perform other actions
        window.location.href = "home.html"; // Redirect to main page after login
    }

    // Logout snippet
    function logout() {
        isLoggedIn = false;
        localStorage.removeItem('email'); // Remove stored email from local storage
        updateProfileDropdownVisibility(); // Update profile dropdown visibility

        // Optionally redirect to home page or perform other actions after logout
        // Example:
        window.location.href = "index.html";
    }

    // Function to update profile dropdown visibility based on login state
    function updateProfileDropdownVisibility() {
        if (isLoggedIn) {
            if (btnGroup) {
                btnGroup.style.display = 'none'; // Hide login/signup buttons
            }
            if (profileDropdown) {
                profileDropdown.style.display = 'block'; // Show profile dropdown
            }
        } else {
            if (btnGroup) {
                btnGroup.style.display = 'flex'; // Show login/signup buttons
            }
            if (profileDropdown) {
                profileDropdown.style.display = 'none'; // Hide profile dropdown
            }
        }
    }

    // Event listeners for modals
    notOnCoursera.addEventListener('click', function (event) {
        event.preventDefault();
        var signInModal = bootstrap.Modal.getInstance(document.getElementById('signInBtn'));
        var signUpModal = new bootstrap.Modal(document.getElementById('signUpBtn'));

        closeModal(signInModal._element); // Close the sign-in modal
        signUpModal.show(); // Show the sign-up modal
    });

    alreadyOnCoursera.addEventListener('click', function (event) {
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

    signInForm.addEventListener('submit', signInRedirectBtn);

    // Initialize profile dropdown visibility based on login state
    updateProfileDropdownVisibility();

    // Attach event listener for logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});


/* Navbar section ends */




/* Expand your horizons section start */



/* Expand your horizons section ends */




/* Section1(We collaborate with ) section start */




/* Section1(We collaborate with ) section ends */




/* Section-2(Launch a new career) section start */

const indicator = document.querySelector('.indicator');
const navItems = document.querySelectorAll('.nav-itm');
let selectedIndex = 0;

const careerDetails = document.querySelector('.career-details');
const jobTitle = careerDetails.querySelector('h1');
const jobDescription = careerDetails.querySelector('h6');
const medianSalaryAll = document.querySelector('#all-occu');
const medianSalaryData = careerDetails.querySelector('#course-occu');
const jobOpenings = careerDetails.querySelector('#job-openings');
const authorImage = careerDetails.querySelector('#author-img');
const testimonialQuote = careerDetails.querySelector('#quote');
const testimonialAuthor = careerDetails.querySelector('#author');



function updateCareerCard(index) {
    const careers = [
        {
            title: 'Data Analyst',
            description: 'Collect, organize, and transform data to make informed decisions',
            medianSalaryAll: '\u20B9 821,927*',
            medianSalaryData: '\u20B9 1,210,372**',
            jobOpenings: '22,063**',
            authorImage: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/5RlbrLIj4lRBjywJoqzvap/3525fc7f71e1270103e5e3bd422a14e6/uma.png?auto=format%2Ccompress&dpr=1&h=136',
            testimonialQuote: '"The IBM Data Science Professional Certificate has continued to open doors for me."',
            testimonialAuthor: '- Uma K'
        },
        {
            title: 'Project Manager',
            description: 'Manage projects, resources, and timelines to achieve goals',
            medianSalaryAll: '\u20B9 900,000*',
            medianSalaryData: '\u20B9 1,300,000**',
            jobOpenings: '18,500**',
            authorImage: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/7ggy6QrC3CRJuXoFtHEibR/a5428532109301857b1be0f71f1c8235/Chitranshee_Agrawal_380x380.png?auto=format%2Ccompress&dpr=1&h=136',
            testimonialQuote: '"The Project Management course helped me enhance my skills and credibility."',
            testimonialAuthor: '- Amisha S'
        },
        {
            title: 'Digital Marketer',
            description: 'Develop and execute marketing strategies using digital channels',
            medianSalaryAll: '\u20B9 750,000*',
            medianSalaryData: '\u20B9 1,000,000**',
            jobOpenings: '15,200**',
            authorImage: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/4beG0idhJZIPmLcwgW9hxX/c905d1a4eb9dac54655213b3bc78738f/Profile-photo.JPG?auto=format%2Ccompress&dpr=1&h=136',
            testimonialQuote: '"Coursera\'s Digital Marketing course gave me practical skills that I apply daily."',
            testimonialAuthor: ' - Sarah M'
        },
        {
            title: 'IT Support Specialist',
            description: 'Provide technical assistance and support to users and organizations',
            medianSalaryAll: '\u20B9 650,000*',
            medianSalaryData: '\u20B9 900,000**',
            jobOpenings: '14,800**',
            authorImage: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/01RNaDDmaLo8RNgYj9EBnY/e71e1488c7509a9868c664216afa5b4a/Mcvean_Headshot.jpeg?auto=format%2Ccompress&dpr=1&h=136',
            testimonialQuote: '"The IT Support course prepared me well for real-world IT challenges."',
            testimonialAuthor: '- Mcvean S'
        },
        {
            title: 'Bookkeeper',
            description: 'Maintain financial records and ensure accuracy in financial transactions',
            medianSalaryAll: '\u20B9 600,000*',
            medianSalaryData: '\u20B9 800,000**',
            jobOpenings: '12,500**',
            authorImage: 'data:image/jpeg;base64,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',
            testimonialQuote: '"The Bookkeeping course on Coursera helped me transition into a new career smoothly."',
            testimonialAuthor: '- Emily W'
        },
        {
            title: 'Cybersecurity Specialist',
            description: 'Protect computer systems and networks from cyber threats and attacks',
            medianSalaryAll: '\u20B9 850,000*',
            medianSalaryData: '\u20B9 1,150,000**',
            jobOpenings: '19,000**',
            authorImage: 'data:image/jpeg;base64,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',
            testimonialQuote: '"Coursera\'s Cybersecurity course provided hands-on experience crucial for my career."',
            testimonialAuthor: ' - Michael L'
        },
        {
            title: 'UX Designer',
            description: 'Design user experiences for digital interfaces and applications',
            medianSalaryAll: '\u20B9 700,000*',
            medianSalaryData: '\u20B9 ;950,000**',
            jobOpenings: '16,500**',
            authorImage: 'data:image/jpeg;base64,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',
            testimonialQuote: '"The UX Design course gave me the skills to create intuitive and engaging user interfaces."',
            testimonialAuthor: '- Lisa R'
        },
        {
            title: 'Front-End Developer',
            description: 'Develop and implement the visual elements of a website or application',
            medianSalaryAll: '\u20B9 800,000*',
            medianSalaryData: '\u20B9 1,100,000**',
            jobOpenings: '17,800**',
            authorImage: 'data:image/jpeg;base64,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',
            testimonialQuote: '"The Front-End Development course broadened my skills and opened up new job opportunities."',
            testimonialAuthor: ' - David S'
        },
    ];

    jobTitle.textContent = careers[index].title;
    jobDescription.textContent = careers[index].description;
    medianSalaryAll.textContent = careers[index].medianSalaryAll;
    medianSalaryData.textContent = careers[index].medianSalaryData;
    jobOpenings.textContent = `Job openings: ${careers[index].jobOpenings}`;
    authorImage.src = careers[index].authorImage;
    testimonialQuote.textContent = careers[index].testimonialQuote;
    testimonialAuthor.textContent = careers[index].testimonialAuthor;


}


function moveIndicator(index) {
    const item = navItems[index];
    indicator.style.width = `${item.offsetWidth}px`;
    indicator.style.left = `${item.offsetLeft}px`;

    navItems[selectedIndex].style.color = 'black';
    navItems[selectedIndex].style.fontWeight = 'normal';

    navItems[index].style.color = 'rgb(0, 86, 210)';
    navItems[index].style.fontWeight = 'bold';

    selectedIndex = index;

    updateCareerCard(index);
    updateContainerCard(index);

}


window.addEventListener('load', () => {
    moveIndicator(0);
});


function updateContainerCard(index) {
    const navItems = document.querySelectorAll('.nav-itm');
    const itemName = navItems[index].textContent.trim();

    const containerCard = document.querySelector('.container-card');
    containerCard.innerHTML = ''; // Clear previous content

    switch (itemName) {
        case 'Data Analyst-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-0">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-0">
                          <span id="company-name-0">Google</span>
                      </div>
                      <div class="card-title" id="card-title-0">Google Data Analyst</div>
                      <div class="card-description" id="card-description-0">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-0">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-0">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-0">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/63/baf9bea98641aeb8fd36a7b1291791/DA-PC_Image.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-1">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-1">
                          <span id="company-name-1">IBM</span>
                      </div>
                      <div class="card-title" id="card-title-1">IBM Data Analyst</div>
                      <div class="card-description" id="card-description-1">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-1">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-1">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-1">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'Project Manager-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/bf/b07da9bbe24cb8b0daa00010ff8b22/1060x596_GCC-photos_Ashley.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-2">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-2">
                          <span id="company-name-2">Google</span>
                      </div>
                      <div class="card-title" id="card-title-2">Google Project Management:</div>
                      <div class="card-description" id="card-description-2">Skills you'll gain: Project Planning, Team Management, Budgeting,
                          Risk Management</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-2">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-2">100k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-2">Beginner · Certification · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/78/c4724ddada49db810c11a936e198c4/Projects.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-3">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-3">
                          <span id="company-name-3">Company B</span>
                      </div>
                      <div class="card-title" id="card-title-3">IBM Project Manager</div>
                      <div class="card-description" id="card-description-3">Skills you'll gain: Agile Methodologies, Stakeholder Management, Project Lifecycle,
                          Resource Allocation</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-3">4.7</span><i class="fa fa-star"></i>(<span id="card-reviews-3">528k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-3">Advanced · Professional Certificate · 3
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'Digital Marker-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/5a/8b726b9c414ccc894ed397d66789fc/1060x596_GCC-photos_Trin.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-2">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-2">
                          <span id="company-name-2">Google</span>
                      </div>
                      <div class="card-title" id="card-title-2">Google Digital Marketing & E-commerce</div>
                      <div class="card-description" id="card-description-2">Skills you'll gain: Search Engine Optimization (SEO), E-Commerce, Email Marketing, display</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-2">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-2">24k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-2">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/02/41460a29d744dfa39106941eae2e02/fb-specialization.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-3">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/73/e03b13a8e44df9b19eb279e5506396/360-x-360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-3">
                          <span id="company-name-3">Meta</span>
                      </div>
                      <div class="card-title" id="card-title-3">Meta Social Media Marketing</div>
                      <div class="card-description" id="card-description-3">Skills you'll gain: Social Media Marketing, Brand Management, Content Marketing, Digital Marketing, Performance Advertising, Social</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-3">4.7</span><i class="fa fa-star"></i>(<span id="card-reviews-3">528k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-3">Advanced ·  Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'IT Support Specialist-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-0">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-0">
                          <span id="company-name-0">Google</span>
                      </div>
                      <div class="card-title" id="card-title-0">Google Data Analyst</div>
                      <div class="card-description" id="card-description-0">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-0">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-0">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-0">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/63/baf9bea98641aeb8fd36a7b1291791/DA-PC_Image.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-1">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-1">
                          <span id="company-name-1">IBM</span>
                      </div>
                      <div class="card-title" id="card-title-1">IBM Data Analyst</div>
                      <div class="card-description" id="card-description-1">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-1">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-1">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-1">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'Bookkeeper-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-0">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-0">
                          <span id="company-name-0">Google</span>
                      </div>
                      <div class="card-title" id="card-title-0">Google Data Analyst</div>
                      <div class="card-description" id="card-description-0">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-0">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-0">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-0">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/63/baf9bea98641aeb8fd36a7b1291791/DA-PC_Image.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-1">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-1">
                          <span id="company-name-1">IBM</span>
                      </div>
                      <div class="card-title" id="card-title-1">IBM Data Analyst</div>
                      <div class="card-description" id="card-description-1">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-1">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-1">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-1">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'Cybersecurity-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-0">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-0">
                          <span id="company-name-0">Google</span>
                      </div>
                      <div class="card-title" id="card-title-0">Google Data Analyst</div>
                      <div class="card-description" id="card-description-0">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-0">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-0">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-0">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/63/baf9bea98641aeb8fd36a7b1291791/DA-PC_Image.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-1">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-1">
                          <span id="company-name-1">IBM</span>
                      </div>
                      <div class="card-title" id="card-title-1">IBM Data Analyst</div>
                      <div class="card-description" id="card-description-1">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-1">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-1">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-1">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'UX Designer-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-0">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-0">
                          <span id="company-name-0">Google</span>
                      </div>
                      <div class="card-title" id="card-title-0">Google Data Analyst</div>
                      <div class="card-description" id="card-description-0">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-0">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-0">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-0">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/63/baf9bea98641aeb8fd36a7b1291791/DA-PC_Image.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-1">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-1">
                          <span id="company-name-1">IBM</span>
                      </div>
                      <div class="card-title" id="card-title-1">IBM Data Analyst</div>
                      <div class="card-description" id="card-description-1">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-1">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-1">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-1">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;

        case 'Font-End Developer-':
            containerCard.innerHTML = `
              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/41/4d3d7c05fb42729c9d90352e072ca3/1060x596_GCC-photos_Karrim.png?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-0">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/4a/cb36835ae3421187080898a7ecc11d/Google-G_360x360.png?auto=format%2Ccompress&dpr=1&w=25&h=25&q=40"
                              alt="Logo" class="logo-img" id="logo-img-0">
                          <span id="company-name-0">Google</span>
                      </div>
                      <div class="card-title" id="card-title-0">Google Data Analyst</div>
                      <div class="card-description" id="card-description-0">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-0">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-0">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-0">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>

              <div class="card">
                  <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/63/baf9bea98641aeb8fd36a7b1291791/DA-PC_Image.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=216&fit=crop&q=50"
                      alt="Card image" class="card-img" id="card-img-1">
                  <div class="card-content">
                      <div class="card-header">
                          <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/bb/f5ced2bdd4437aa79f00eb1bf7fbf0/IBM-Logo-Blk---Square.png?auto=format%2Ccompress&amp;dpr=1&amp;w=25&amp;h=25&amp;q=40"
                              alt="Logo" class="logo-img" id="logo-img-1">
                          <span id="company-name-1">IBM</span>
                      </div>
                      <div class="card-title" id="card-title-1">IBM Data Analyst</div>
                      <div class="card-description" id="card-description-1">Skills you'll gain: Spreadsheet, Data Analysis, SQL,
                          Data Visualization, Data Cleansing</div>
                      <div class="card-rating">
                          <span style="font-weight: bold;" id="card-rating-1">4.8</span><i class="fa fa-star"></i>(<span id="card-reviews-1">136k reviews</span>)
                      </div>
                      <span style="font-size: 15px; color: #555;" id="card-duration-1">Beginner · Professional Certificate · 6
                          months</span>
                  </div>
              </div>
          `;
            break;


        // Add cases for other nav-items similarly with their respective card content

        default:
            containerCard.innerHTML = `
              <div class="card">
                  <p>No content available for ${itemName}</p>
              </div>
          `;
            break;
    }
}


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
            if (viewportWidth <= 600) {
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
            if (viewportWidth <= 600) {
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
            if (viewportWidth <= 600) {
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
            if (viewportWidth <= 600) {
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
        if (showMore2.textContent === "Show 8 more") {
            K2 += 8;
            await showData(data2, K2, "uni2");
            if (K2 < data2.length) {
                showMore2.textContent = `Show ${data2.length - K2} more`;
            } else {
                showMore2.textContent = "Show fewer";
            }
        } else if (showMore2.textContent === "Show fewer") {
            let viewportWidth = window.innerWidth;
            if (viewportWidth <= 600) {
                await showData(data2, 1, "uni2");
            } else if (viewportWidth <= 1023) {
                await showData(data2, 2, "uni2");
            } else {
                await showData(data2, 4, "uni2");
            }
            showMore2.textContent = "Show 8 more";
        }
    };


    let handleShowMore3 = async () => {
        if (showMore3.textContent === "Show 8 more") {
            K3 += 8;
            await showData(data3, K3, "coursera");
            if (K3 < data3.length) {
                showMore3.textContent = `Show ${data3.length - K3} more`;
            } else {
                showMore3.textContent = "Show fewer";
            }
        } else if (showMore3.textContent === "Show fewer") {
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
            K3 += 8;
            await showData(data3, K3, "coursera");
            showMore3.textContent = "Show fewer";
        }
    };

    let handleShowMore4 = async () => {
        if (showMore4.textContent === "Show 8 more") {
            K4 += 8;
            await showData(data4, K4, "learning");
            if (K4 < data4.length) {
                showMore4.textContent = `Show ${data4.length - K4} more`;
            } else {
                showMore4.textContent = "Show fewer";
            }
        } else if (showMore4.textContent === "Show fewer") {
            await sd4();
            showMore4.textContent = "Show 8 more";
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



document.addEventListener("DOMContentLoaded", (event) => {
    let prevbtn = document.querySelector(".prevbtn");

    function handleBorder() {
        prevbtn.style.border = "1px solid black";
    }

    function removeBorder() {
        prevbtn.style.border = "none";
    }

    prevbtn.addEventListener("click", handleBorder);
    prevbtn.addEventListener("mouseleave", removeBorder);
});
document.addEventListener("DOMContentLoaded", (event) => {
    let nextbtn = document.querySelector(".nextbtn");

    function handleBorder() {
        nextbtn.style.border = "1px solid black";
    }

    function removeBorder() {
        nextbtn.style.border = "none";
    }

    nextbtn.addEventListener("click", handleBorder);
    nextbtn.addEventListener("mouseleave", removeBorder);
});




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