// Function to update the navbar profile picture
function updateNavProfilePic(imgData) {
    const navProfileImageElement = document.querySelector('.nav-profile_pic');
    if (navProfileImageElement) {
        navProfileImageElement.src = imgData;
    }
}

// Function to fetch and set the profile image from the database
function fetchAndSetProfileImage(userEmail) {
    fetch(`http://localhost:3000/users?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0 && users[0].profile_img) {
                updateNavProfilePic(users[0].profile_img);
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}
