document.addEventListener('DOMContentLoaded', () => {

  lucide.createIcons();

  const searchInput = document.getElementById('searchInput');
  const categories = document.getElementById('categories');
  const catButtons = categories.querySelectorAll('.cat-item');
  const menuSections = document.querySelectorAll('.menu-section');
  const productCards = document.querySelectorAll('.product-card');
  const emptyState = document.getElementById('emptyState');
  const darkToggle = document.getElementById('darkToggle');

  let activeCategory = 'all';

  // === Dark Mode ===
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // === Category Filter ===
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat');
      filterProducts();
    });
  });

  // === Search ===
  searchInput.addEventListener('input', () => {
    filterProducts();
  });

  function filterProducts() {
    const query = searchInput.value.toLowerCase().trim();
    let totalVisible = 0;

    menuSections.forEach(section => {
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
          card.classList.remove('fade-out');
          card.style.display = '';
          sectionVisible = true;
          totalVisible++;
        } else {
          card.classList.add('fade-out');
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });

      section.style.display = sectionVisible ? '' : 'none';
    });

    // Show/hide empty state
    if (totalVisible === 0) {
      emptyState.style.display = '';
      lucide.createIcons();
    } else {
      emptyState.style.display = 'none';
    }
  }

});
