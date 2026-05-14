/* ================================================
   YURANANA AI — Landing Page Scripts
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ================================================
  // Scroll Animations (Intersection Observer)
  // ================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // ================================================
  // Navbar Scroll Effect
  // ================================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ================================================
  // Mobile Menu
  // ================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);

  // Close menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  // ================================================
  // Glass Card Mouse Tracking
  // ================================================
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ================================================
  // Emotion Selector
  // ================================================
  const emotionBtns = document.querySelectorAll('.emotion-btn');
  const aiMessage = document.getElementById('aiMessage');
  const aiMessageText = document.getElementById('aiMessageText');

  const emotionResponses = {
    calm: {
      text: "I'm glad you're feeling calm today, Sarah. Remember — calmness is a strength, especially on the hard days. Would you like to do a brief breathing exercise together? 🌿",
      color: 'rgba(139, 124, 246, 0.3)'
    },
    tired: {
      text: "It sounds like today is harder than usual, Sarah. That's completely okay. Even the strongest among us need rest. Shall I suggest some gentle self-care ideas? 💜",
      color: 'rgba(94, 234, 212, 0.3)'
    },
    anxious: {
      text: "I hear you, Sarah. Anxiety can feel overwhelming, but you're not alone in this. Let's try a grounding exercise together — 5 things you can see, 4 you can touch? 🌊",
      color: 'rgba(240, 171, 252, 0.3)'
    },
    hopeful: {
      text: "That's beautiful to hear, Sarah. Hope is a powerful companion on this journey. Let's channel that positive energy into something meaningful today. What matters most to you right now? 🌷",
      color: 'rgba(52, 211, 153, 0.3)'
    }
  };

  // Show initial AI message after a delay
  setTimeout(() => {
    aiMessage.classList.add('message-visible');
  }, 1500);

  emotionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      emotionBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = 'rgba(255,255,255,0.05)';
        b.style.background = 'rgba(255,255,255,0.02)';
      });

      btn.classList.add('active');
      btn.style.borderColor = emotionResponses[btn.dataset.emotion].color;
      btn.style.background = `${emotionResponses[btn.dataset.emotion].color.replace('0.3', '0.1')}`;

      // Animate AI response
      aiMessage.classList.remove('message-visible');
      aiMessage.style.opacity = '0';
      aiMessage.style.transform = 'translateY(10px)';

      setTimeout(() => {
        aiMessageText.textContent = emotionResponses[btn.dataset.emotion].text;
        aiMessage.classList.add('message-visible');
        aiMessage.style.opacity = '1';
        aiMessage.style.transform = 'translateY(0)';
      }, 300);
    });
  });

  // ================================================
  // Waitlist Form
  // ================================================
  const waitlistForm = document.getElementById('waitlistForm');
  const emailInput = document.getElementById('emailInput');
  const successMessage = document.getElementById('successMessage');

  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (email && email.includes('@') && email.includes('.')) {
      // Simulate form submission
      waitlistForm.style.opacity = '0';
      waitlistForm.style.transform = 'translateY(-10px)';
      waitlistForm.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        waitlistForm.style.display = 'none';
        successMessage.classList.remove('hidden');
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(10px)';

        requestAnimationFrame(() => {
          successMessage.style.transition = 'all 0.5s ease';
          successMessage.style.opacity = '1';
          successMessage.style.transform = 'translateY(0)';
        });
      }, 300);
    } else {
      emailInput.style.borderColor = 'rgba(239, 68, 68, 0.5)';
      emailInput.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.1)';

      setTimeout(() => {
        emailInput.style.borderColor = '';
        emailInput.style.boxShadow = '';
      }, 2000);
    }
  });

  // ================================================
  // Smooth Scroll for Anchor Links
  // ================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ================================================
  // Parallax Effect on Hero
  // ================================================
  const heroSection = document.querySelector('section');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroGlow = document.querySelector('.hero-glow');
        if (heroGlow && scrolled < window.innerHeight) {
          heroGlow.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0002})`;
          heroGlow.style.opacity = Math.max(0.3, 1 - scrolled * 0.001);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ================================================
  // Staggered Animation for Feature Cards
  // ================================================
  const featureCards = document.querySelectorAll('.glass-card');
  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        featureObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // ================================================
  // Phone Mockup Interactive Breathing Animation
  // ================================================
  const aiIcon = document.querySelector('.ai-message .w-8');
  if (aiIcon) {
    function breathe() {
      aiIcon.style.transition = 'transform 4s ease-in-out';
      aiIcon.style.transform = 'scale(1.1)';
      setTimeout(() => {
        aiIcon.style.transform = 'scale(1)';
      }, 2000);
    }
    setInterval(breathe, 4000);
    breathe();
  }

  // ================================================
  // Keyboard Navigation Enhancement
  // ================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // ================================================
  // Preload Enhancement
  // ================================================
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Trigger initial animations
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
      }
    });
  });

  // ================================================
  // Counter Animation for Stats
  // ================================================
  function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (Number.isInteger(target)) {
        element.textContent = Math.floor(current) + suffix;
      } else {
        element.textContent = current.toFixed(1) + suffix;
      }
    }, 16);
  }

  // Animate stats when hero section is visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statElements = entry.target.querySelectorAll('.text-2xl, .text-3xl');
        if (statElements.length >= 3) {
          // Parse and animate
          const values = [
            { el: statElements[0], target: 94, suffix: '%' },
            { el: statElements[1], target: 12, suffix: 'k+' },
            { el: statElements[2], target: 4.9, suffix: '' }
          ];
          values.forEach(v => {
            const original = v.el.textContent;
            v.el.textContent = '0';
            setTimeout(() => {
              animateCounter(v.el, v.target, v.suffix);
            }, 800);
          });
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.animate-on-scroll[data-delay="400"]');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

});