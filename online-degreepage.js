// soumya section starts

// navbar section 

const indicator = document.querySelector('.indicators');
        const navItems = document.querySelectorAll('.nav-item-landing');
        let selectedIndex = 0;
        function moveIndicators(index) {
            const item = navItems[index];
            indicator.style.width = `${item.offsetWidth}px`;
            indicator.style.left = `${item.offsetLeft}px`;
            navItems[selectedIndex].style.color = 'black';
            navItems[selectedIndex].style.fontWeight = 'normal';
            navItems[index].style.color = 'rgb(0, 86, 210)';
            navItems[index].style.fontWeight = 'bold';
            selectedIndex = index;
        }
        window.addEventListener('load', () => {
            moveIndicators(0);
        });
//navbar end

document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('db.json'); 
  const data = await response.json();
  const cards = data.cards;
  let filteredCards = cards.slice();
  const cardsPerPage = 8;
  let currentPage = 1;
  let totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  function displayCards(page) {
      const start = (page - 1) * cardsPerPage;
      const end = start + cardsPerPage;
      const paginatedCards = filteredCards.slice(start, end);

      const cardContainer = document.getElementById('card-container');
      cardContainer.innerHTML = '';

      paginatedCards.forEach((card) => {
          const cardElement = document.createElement('div');
          cardElement.classList.add('card');

          cardElement.innerHTML = `
              <img src="${card.img}" alt="Card image" class="card-img">
              <div class="card-content">
                  <div class="card-title">${card.title}</div>
                  <div class="card-degree">${card.degree}</div>
                  <div class="card-description">${card.description}</div>
                  <span style="font-size: 15px; color: #555;">${card.duration || ''}</span>
              </div>`;

          cardContainer.appendChild(cardElement);
      });
  }

  function displayPagination() {
      const paginationContainer = document.getElementById('pagination-container');
      paginationContainer.innerHTML = '';

      // Previous button
      paginationContainer.innerHTML += `
          <div class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                  <i class="fa fa-chevron-left"></i>
              </button>
          </div>`;

      
      for (let i = 1; i <= totalPages; i++) {
          paginationContainer.innerHTML += `
              <div class="page-item ${i === currentPage ? 'active' : ''}">
                  <button onclick="changePage(${i})">${i}</button>
              </div>`;
      }

     
      paginationContainer.innerHTML += `
          <div class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
              <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                  <i class="fa fa-chevron-right"></i>
              </button>
          </div>`;
  }

  window.changePage = function (page) {
      if (page >= 1 && page <= totalPages) {
          currentPage = page;
          displayCards(currentPage);
          displayPagination();
      }
  };

  function applyFilter(type) {
      let selectedFilters = [];
      if (type === 'program') {
          selectedFilters = Array.from(document.querySelectorAll('.program-filter:checked')).map(el => el.value);
      } else if (type === 'subject') {
          selectedFilters = Array.from(document.querySelectorAll('.subject-filter:checked')).map(el => el.value);
      }

      console.log(`${type} filter applied:`, selectedFilters);

     
      if (type === 'program') {
          if (selectedFilters.length > 0) {
              filteredCards = cards.filter(card => selectedFilters.some(filter => card.degree.toLowerCase().includes(filter.toLowerCase())));
          } else {
              filteredCards = cards.slice(); 
          }
      } else if (type === 'subject') {
          if (selectedFilters.length > 0) {
              filteredCards = cards.filter(card => selectedFilters.includes(card.subject));
          } else {
              filteredCards = cards.slice();
          }
      }

     
      currentPage = 1;
      totalPages = Math.ceil(filteredCards.length / cardsPerPage);
      displayCards(currentPage);
      displayPagination();
  }

  function clearFilter(type) {
      const checkboxes = document.querySelectorAll(`.${type}-filter`);
      checkboxes.forEach(checkbox => checkbox.checked = false);
      console.log(`${type} filter cleared`);

     
      filteredCards = cards.slice(); 

     
      currentPage = 1;
      totalPages = Math.ceil(filteredCards.length / cardsPerPage);
      displayCards(currentPage);
      displayPagination();
  }

 
  displayCards(currentPage);
  displayPagination();
});


// soumya section ends 


/* frequently asked question section starts */

document.addEventListener('DOMContentLoaded', function() {
    const accordionTitles = document.querySelectorAll('.core-accordion-title');
    
    accordionTitles.forEach(title => {
      title.addEventListener('click', function() {
        // Toggle the 'active' class on the clicked title
        this.classList.toggle('active');
        
        // Toggle the display of the content
        const content = this.nextElementSibling;
        if (content.style.display === 'block') {
          content.style.display = 'none';
        } else {
          content.style.display = 'block';
        }
      });
    });
  });


/* frequently asked question section ends */
