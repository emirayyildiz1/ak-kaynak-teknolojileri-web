const firebaseConfig = {
  apiKey: "AIzaSyCoQBn8oAkPy3cbe1pM67rm-OempD4Eg64",
  authDomain: "ak-kaynak-teknolojileri.firebaseapp.com",
  projectId: "ak-kaynak-teknolojileri",
  storageBucket: "ak-kaynak-teknolojileri.firebasestorage.app",
  messagingSenderId: "240096407336",
  appId: "1:240096407336:web:ba86feff09ff5cc4462a1d",
  measurementId: "G-3HVSTJ5XPW"
};

firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();

/* ============================================
   A.K. KAYNAK - Ana JavaScript Dosyası
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 800);
  });
  // Fallback: 3 saniye sonra mutlaka gizle
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);

  // ── Header Scroll Efekti ──
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Header
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to top button
    if (scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Aktif section'ı işaretle
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // İlk yükleme

  // ── Scroll to Top ──
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Hamburger Menü ──
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  const mobileLinks = navMobile.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Aktif Navigasyon Linki ──
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Masaüstü
        document.querySelectorAll('.nav-desktop a').forEach(a => a.classList.remove('active'));
        const desktopLink = document.querySelector(`.nav-desktop a[href="#${sectionId}"]`);
        if (desktopLink) desktopLink.classList.add('active');
        // Mobil
        document.querySelectorAll('.nav-mobile a').forEach(a => a.classList.remove('active'));
        const mobileLink = document.querySelector(`.nav-mobile a[href="#${sectionId}"]`);
        if (mobileLink) mobileLink.classList.add('active');
      }
    });
  }

  // ── Hero Slider ──
  const slides = document.querySelectorAll('.hero-slide');
  const sliderDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    sliderDots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    sliderDots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  sliderDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(i);
      startSlider();
    });
  });

  if (slides.length > 0) {
    goToSlide(0);
    startSlider();
  }

  // ── Kıvılcım Parçacık Efekti ──
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.bottom = Math.random() * 30 + '%';
      particle.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 6000);
    }

    setInterval(createParticle, 400);
  }

  // ── Galeri Filtreleme ──
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Scroll Reveal Animasyonu ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── İstatistik Sayaç Animasyonu ──
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statNumbers.forEach(numEl => {
      const target = parseInt(numEl.dataset.target);
      const suffix = numEl.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(eased * target);
        numEl.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          numEl.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ── İletişim Formu ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-primary');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✓ Mesajınız Alındı!';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ── Smooth Scroll (navigasyon linkleri) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Yorumlar (Comments) ──
  const commentForm = document.getElementById('commentForm');
  const commentsList = document.getElementById('commentsList');

  // Zamanı formatlamak için basit bir fonksiyon
  function formatDate(date) {
    if (!date) return "Az önce";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  }

  // Yorumları Firestore'dan çekme
  if (commentsList) {
    const q = db.collection("comments").orderBy("createdAt", "desc").limit(5);
    
    q.onSnapshot((snapshot) => {
      commentsList.innerHTML = ''; // Temizle
      
      if (snapshot.empty) {
        commentsList.innerHTML = '<p class="comment-text" style="text-align:center;">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const comment = doc.data();
        const avatarInitial = comment.author ? comment.author.charAt(0).toUpperCase() : '?';
        const dateString = comment.createdAt ? formatDate(comment.createdAt.toDate()) : "Az önce";
        
        const commentHTML = `
          <div class="comment-item">
            <div class="comment-avatar">${avatarInitial}</div>
            <div class="comment-content">
              <h4 class="comment-author">${comment.author}</h4>
              <span class="comment-date">${dateString}</span>
              <p class="comment-text">${comment.text}</p>
            </div>
          </div>
        `;
        commentsList.insertAdjacentHTML('beforeend', commentHTML);
      });
    });
  }

  // Yeni yorum ekleme
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('commentName');
      const textInput = document.getElementById('commentText');
      const submitBtn = document.getElementById('submitCommentBtn');
      
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Gönderiliyor...';
      submitBtn.disabled = true;
      
      try {
        await db.collection("comments").add({
          author: nameInput.value.trim(),
          text: textInput.value.trim(),
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        submitBtn.innerHTML = '✓ Yorum Eklendi';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        commentForm.reset();
      } catch (error) {
        console.error("Yorum eklenirken hata oluştu: ", error);
        submitBtn.innerHTML = 'Hata Oluştu';
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      }
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    });
  }

});
