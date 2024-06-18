const logOutBtn = document.querySelector('#logOutBtn');
    const isLoggedIn = localStorage.getItem('email');

    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }

    if (logOutBtn) {
        logOutBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action of link
            localStorage.removeItem('email');  // Clear username from local storage
            window.location.href = 'index.html';  // Redirect to index.html
        });
    }

     // Wait for the DOM to be fully loaded
     document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        // Function to perform the search
        function performSearch() {
            const searchText = searchInput.value.trim().toLowerCase();
            // Implement your search logic here
            // For demonstration, let's log the search query to console
            console.log('Performing search for:', searchText);
        }

        // Add event listener to the search button
        if (searchButton) {
            searchButton.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent form submission
                performSearch();
            });
        }

        // Optional: Add keypress event to trigger search on Enter key
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                performSearch();
            }
        });
    });