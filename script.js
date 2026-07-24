/* ============================================
   LA CASA DEL SABOR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // === Mobile Menu ===
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinksEl.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', toggleMobileMenu);

    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksEl.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // === Hero Slider ===
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function nextSlide() {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }

    if (heroSlides.length > 1) {
        setInterval(nextSlide, 6000);
    }

    // === Menu Filters ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // === Cart System ===
    const cart = [];
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartWhatsapp = document.getElementById('cartWhatsapp');

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add to cart buttons
    document.querySelectorAll('.menu-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            updateCartUI();
            openCart();

            // Button feedback
            btn.style.transform = 'scale(1.3)';
            btn.style.background = 'var(--primary)';
            btn.style.color = 'var(--white)';
            setTimeout(() => {
                btn.style.transform = '';
                btn.style.background = '';
                btn.style.color = '';
            }, 300);
        });
    });

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        cartCount.textContent = totalItems;

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-basket-shopping"></i>
                    <p>Tu carrito esta vacio</p>
                    <span>Agrega platos del menu para empezar</span>
                </div>
            `;
            cartFooter.style.display = 'none';
        } else {
            cartBody.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="changeQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                        <span class="cart-item-qty">${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="cart-item-remove" onclick="removeItem(${index})">
                        <i class="fas fa-xmark"></i>
                    </button>
                </div>
            `).join('');

            cartFooter.style.display = 'block';
            cartTotal.textContent = '$' + totalPrice.toLocaleString();

            // Build WhatsApp message
            let message = 'Hola! Quiero hacer el siguiente pedido:\n\n';
            cart.forEach(item => {
                message += `- ${item.name} x${item.qty} ($${(item.price * item.qty).toLocaleString()})\n`;
            });
            message += `\n*Total: $${totalPrice.toLocaleString()}*`;
            const encodedMsg = encodeURIComponent(message);
            cartWhatsapp.setAttribute('data-msg', encodedMsg);
        }
    }

    cartWhatsapp.addEventListener('click', function(e) {
        e.preventDefault();
        const msg = this.getAttribute('data-msg');
        if (msg) {
            window.open(`https://wa.me/5493884418917?text=${msg}`, '_blank');
        } else {
            window.open('https://wa.me/5493884418917?text=Hola!%20Quisiera%20hacer%20un%20pedido', '_blank');
        }
    });

    // Expose functions globally
    window.changeQty = function(index, delta) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    // === AOS-like Scroll Animations ===
    const animatedElements = document.querySelectorAll('[data-aos]');

    function handleAOS() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.getAttribute('data-delay') || 0);

            if (rect.top < window.innerHeight - 80) {
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', handleAOS);
    handleAOS();

    // === Contact Form ===
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const phone = document.getElementById('formPhone').value;
        const message = document.getElementById('formMessage').value;

        const whatsappMsg = encodeURIComponent(
            `Hola! Soy ${name}.\n\n` +
            `Telefono: ${phone}\n` +
            `Email: ${email}\n\n` +
            `Mensaje: ${message}`
        );

        window.open(`https://wa.me/5493884418917?text=${whatsappMsg}`, '_blank');

        contactForm.reset();

        // Success feedback
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Mensaje Enviado!';
        btn.style.background = '#52C41A';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 3000);
    });

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
