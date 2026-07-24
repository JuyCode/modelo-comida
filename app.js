document.addEventListener('DOMContentLoaded', () => {

  // Init Lucide icons
  lucide.createIcons();

  const searchInput = document.getElementById('searchInput');
  const categories = document.getElementById('categories');
  const catButtons = categories.querySelectorAll('.cat-item');
  const menuSections = document.querySelectorAll('.menu-section');
  const productCards = document.querySelectorAll('.product-card');

  let activeCategory = 'all';

  // Category filter
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat');
      filterProducts();
    });
  });

  // Search
  searchInput.addEventListener('input', () => {
    filterProducts();
  });

  function filterProducts() {
    const query = searchInput.value.toLowerCase().trim();

    menuSections.forEach(section => {
      const sectionCat = section.getAttribute('data-section');
      const cards = section.querySelectorAll('.product-card');
      let sectionVisible = false;

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        const cardName = card.getAttribute('data-name');
        const cardTitle = card.querySelector('.product-title').textContent.toLowerCase();
        const cardDesc = card.querySelector('.product-desc') ? card.querySelector('.product-desc').textContent.toLowerCase() : '';

        const matchesCat = activeCategory === 'all' || cardCat === activeCategory;
        const matchesSearch = !query || cardName.includes(query) || cardTitle.includes(query) || cardDesc.includes(query);

        if (matchesCat && matchesSearch) {
          card.style.display = '';
          sectionVisible = true;
        } else {
          card.style.display = 'none';
        }
      });

      section.style.display = sectionVisible ? '' : 'none';
    });
  }

});
