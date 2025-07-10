function setupSlider({ slideSelector, radioName, btnSelector, intervalTime }) {
  const slides = document.querySelectorAll(slideSelector);
  const radios = document.querySelectorAll(`input[name="${radioName}"]`);
  const labels = document.querySelectorAll(btnSelector);
  let index = 0;
  let intervalId;

  function updateSlides() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    radios.forEach((radio, i) => {
      radio.checked = i === index;
    });
    labels.forEach((label, i) => {
      label.classList.toggle("active", i === index);
    });
  }

  function startInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      index = (index + 1) % slides.length;
      updateSlides();
    }, intervalTime);
  }

  radios.forEach((radio, i) => {
    radio.addEventListener("change", () => {
      index = i;
      updateSlides();
      startInterval(); // restart timer on manual change
    });
  });

  updateSlides();
  startInterval();
}

// Apply sliders
setupSlider({
  slideSelector: ".video-slide",
  radioName: "video-slider",
  btnSelector: ".discover .manual-btn",
  intervalTime: 6000
});

setupSlider({
  slideSelector: ".slide",
  radioName: "slider",
  btnSelector: ".news .manual-btn",
  intervalTime: 5000
});

// Navigation link hover and click effects
document.querySelectorAll('.nav-link, .nav-link2').forEach(link => {
  let timer;
  const originalText = link.textContent;
  const altText = link.getAttribute('data-alt');
  const bg = link.getAttribute('data-bg');
  const isWide = link.getAttribute('data-size') === 'wide';

  link.setAttribute('data-original', originalText);

  link.addEventListener('mouseenter', () => {
    if (link.classList.contains('active')) return;

    link.style.backgroundImage = `url(${bg})`;
    link.style.backgroundRepeat = 'no-repeat';
    link.style.backgroundPosition = 'center';
    link.style.backgroundSize = isWide ? '150% 100%' : 'cover';

    link.textContent = '';

    const span = document.createElement('span');
    span.textContent = altText;
    span.style.opacity = '0';
    span.style.transition = 'color 0.6s ease, opacity 0.2s ease';
    span.style.color = 'white';
    span.style.fontFamily = '"Noto Sans SC", sans-serif';
    link.appendChild(span);

    timer = setTimeout(() => {
      span.style.opacity = '1';
      void span.offsetWidth; // force reflow
      span.style.color = '#A88E61';
    }, 150);
  });

  link.addEventListener('mouseleave', () => {
    if (link.classList.contains('active')) return;
    clearTimeout(timer);
    link.textContent = originalText;
    link.style.backgroundImage = '';
    link.style.backgroundSize = '';
    link.style.backgroundPosition = '';
  });

  link.addEventListener('click', (e) => {
    e.preventDefault();

    document.querySelectorAll('.nav-link, .nav-link2').forEach(l => {
      l.classList.remove('active');
      l.style.backgroundImage = '';
      l.style.backgroundSize = '';
      l.style.backgroundPosition = '';
      l.textContent = l.getAttribute('data-original');
    });

    link.classList.add('active');
    link.textContent = '';

    const span = document.createElement('span');
    span.textContent = altText;
    span.style.opacity = '1';
    span.style.color = 'white';
    span.style.transition = 'color 0.65s ease';
    span.style.fontFamily = '"Noto Sans SC", sans-serif';
    link.appendChild(span);

    link.style.backgroundImage = `url(${bg})`;
    link.style.backgroundRepeat = 'no-repeat';
    link.style.backgroundPosition = 'center';
    link.style.backgroundSize = isWide ? '150% 100%' : 'cover';

    setTimeout(() => {
      span.style.color = '#A88E61';
    }, 150);
  });
});

// SVG rotation on hover
document.querySelectorAll('.youtube, .switch-button').forEach(el => {
  const svg = el.querySelector('svg');
  if (!svg) return;

  let rotation = 0;
  svg.style.transition = 'transform 0.3s ease';

  el.addEventListener('mouseenter', () => {
    rotation += 180;
    svg.style.transform = `rotate(${rotation}deg)`;
  });
});

// YouTube overlay controls
const youtubeTrigger = document.querySelector('.youtube');
const overlay = document.getElementById('overlay');
const iframe = overlay?.querySelector('iframe');
const closeBtn = document.getElementById('close-btn');

if (youtubeTrigger && overlay && iframe && closeBtn) {
  youtubeTrigger.addEventListener('click', () => {
    overlay.style.display = 'flex';
    iframe.src = "https://www.youtube.com/embed/TAlKhARUcoY?autoplay=1";
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    iframe.src = "";
  });
}

// Visibility change listener (optional, currently just logging)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    console.log('Tab is hidden');
  } else {
    console.log('Tab is visible again');
  }
});

// NAVIGATION + HOVER + ACTIVE STYLING
const navLinks = document.querySelectorAll('.nav-link, .nav-link2');
const nav = document.querySelector('.nav');

const sectionsMap = {
  home: document.querySelector('.home'),
  characters: document.querySelector('.characters'),
  news: document.querySelector('.news'),
  discover: document.querySelector('.discover'),
  footer: document.querySelector('footer') || document.querySelector('.footer')
};

function activateNav(id) {
  navLinks.forEach(link => {
    link.classList.remove('active', 'chinese');
    link.classList.add('original');
    link.textContent = link.getAttribute('data-original');
    link.style.backgroundImage = '';
    link.style.backgroundSize = '';
    link.style.backgroundPosition = '';
  });

  const link = document.querySelector(`[data-section="${id}"]`);
  if (link) {
    link.classList.add('active', 'chinese');
    link.classList.remove('original');
    const alt = link.getAttribute('data-alt');
    if (alt) link.textContent = alt;

    const bg = link.getAttribute('data-bg');
    const isWide = link.getAttribute('data-size') === 'wide';
    if (bg) {
      link.style.backgroundImage = `url(${bg})`;
      link.style.backgroundRepeat = 'no-repeat';
      link.style.backgroundPosition = 'center';
      link.style.backgroundSize = isWide ? '150% 100%' : 'cover';
    }
  }
}

Object.entries(sectionsMap).forEach(([key, section]) => {
  const link = document.querySelector(`[data-section="${key}"]`);
  if (link && section && key !== 'footer') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activateNav(key);
      const y = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: y, behavior: 'auto' });
    });
  }
});

navLinks.forEach(link => {
  const altText = link.getAttribute('data-alt');
  const originalText = link.textContent;
  link.setAttribute('data-original', originalText);

  link.addEventListener('mouseenter', () => {
    if (!link.classList.contains('active')) {
      link.textContent = altText;
      link.classList.remove('original');
      link.classList.add('chinese');

      const bg = link.getAttribute('data-bg');
      const isWide = link.getAttribute('data-size') === 'wide';
      if (bg) {
        link.style.backgroundImage = `url(${bg})`;
        link.style.backgroundRepeat = 'no-repeat';
        link.style.backgroundPosition = 'center';
        link.style.backgroundSize = isWide ? '150% 100%' : 'cover';
      }
    }
  });

  link.addEventListener('mouseleave', () => {
    if (!link.classList.contains('active')) {
      link.textContent = link.getAttribute('data-original');
      link.classList.remove('chinese');
      link.classList.add('original');
      link.style.backgroundImage = '';
      link.style.backgroundSize = '';
      link.style.backgroundPosition = '';
    }
  });
});

// FULL PAGE SCROLLER + INTERSECTION HANDLER
(() => {
  const sections = [
    document.querySelector('.home'),
    document.querySelector('.characters'),
    document.querySelector('.news'),
    document.querySelector('.discover'),
    document.querySelector('.Chronicled-wish'),
    document.querySelector('.footer') || document.querySelector('footer')
  ].filter(Boolean);

  window.sectionScroller = {
    sections,
    currentIndex: 0,
    updateIndex(index) {
      this.currentIndex = index;
    }
  };

  const scrollToSection = (index, instant = false) => {
    if (index < 0 || index >= sections.length) return;
    sections[index].scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
    sectionScroller.updateIndex(index);
  };

  let scrollCooldown = false;
  window.addEventListener('wheel', (e) => {
    if (scrollCooldown) {
      e.preventDefault();
      return;
    }
    const delta = e.deltaY;
    scrollCooldown = true;
    setTimeout(() => { scrollCooldown = false; }, 400);
    const nextIndex = sectionScroller.currentIndex + (delta > 0 ? 1 : -1);
    if (nextIndex >= 0 && nextIndex < sections.length) {
      e.preventDefault();
      scrollToSection(nextIndex);
    }
  }, { passive: false });

  const navMap = [
    { link: '[data-section="home"]', section: '.home', index: 0 },
    { link: '[data-section="characters"]', section: '.characters', index: 1 },
    { link: '[data-section="news"]', section: '.news', index: 2 },
    { link: '[data-section="discover"]', section: '.discover', index: 3 }
  ];

  navMap.forEach(({ link, index }) => {
    const navLink = document.querySelector(link);
    if (navLink) {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(index, true);
      });
    }
  });

  const wishLink = document.querySelector('[data-section="wish"]');
  if (wishLink) {
    wishLink.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection(4, true);
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-85% 0px -0% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const isFooter = entry.target.matches('.footer, footer');
      const isWish = entry.target.matches('.Chronicled-wish');
      const isNews = entry.target.classList.contains('news');

      if (isFooter) {
        if (entry.isIntersecting) {
          nav.style.opacity = '0';
          nav.style.pointerEvents = 'none';
        } else {
          nav.style.opacity = '1';
          nav.style.pointerEvents = 'auto';
        }
        return;
      }

      if (isNews) {
        if (entry.isIntersecting) {
          entry.target.classList.add("news-start-animate");
          entry.target.classList.remove("news-exit-animate");
        } else {
          setTimeout(() => {
            if (!entry.isIntersecting) {
              entry.target.classList.remove("news-start-animate");
              entry.target.classList.add("news-exit-animate");
            }
          }, 50);
        }
      }

      if (entry.isIntersecting) {
        let matched = navMap.find(({ section }) => entry.target.matches(section));
        if (isWish) {
          matched = navMap.find(({ section }) => section === '.discover');
        }

        if (matched) {
          sectionScroller.updateIndex(sections.indexOf(entry.target));

          document.querySelectorAll('.nav-link, .nav-link2').forEach((link) => {
            link.classList.remove('active', 'chinese');
            link.classList.add('original');
            const original = link.getAttribute('data-original');
            if (original) link.textContent = original;
            link.style.backgroundImage = '';
            link.style.backgroundSize = '';
            link.style.backgroundPosition = '';
          });

          const activeLink = document.querySelector(matched.link);
          if (activeLink) {
            activeLink.classList.add('active', 'chinese');
            activeLink.classList.remove('original');
            const alt = activeLink.getAttribute('data-alt');
            if (alt) activeLink.textContent = alt;

            const bg = activeLink.getAttribute('data-bg');
            const isWide = activeLink.getAttribute('data-size') === 'wide';
            if (bg) {
              activeLink.style.backgroundImage = `url(${bg})`;
              activeLink.style.backgroundRepeat = 'no-repeat';
              activeLink.style.backgroundPosition = 'center';
              activeLink.style.backgroundSize = isWide ? '150% 100%' : 'cover';
            }
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
  scrollToSection(0);
})();

// Character switch buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".char-btn");
  const images = document.querySelectorAll(".char-img");
  const infoItems = document.querySelectorAll(".info-item");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;

      // Activate button
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Activate image
      images.forEach((img) => img.classList.remove("active"));
      const selectedImage = document.querySelector(`.char-img[data-index="${index}"]`);
      if (selectedImage) selectedImage.classList.add("active");

      // Activate info
      infoItems.forEach((info) => info.classList.remove("active"));
      const selectedInfo = document.querySelector(`.info-item[data-index="${index}"]`);
      if (selectedInfo) selectedInfo.classList.add("active");
    });
  });
});




// News section show/back buttons and animation
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".news-content-wrapper");
  const showBtn = document.querySelector(".show-btn");
  const backBtn = document.querySelector(".back-btn");
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    const row = Math.floor(index / 4);
    card.dataset.anim = row % 2 === 0 ? "right" : "left";
  });

  if (wrapper && showBtn && backBtn) {
    showBtn.addEventListener("click", () => {
      wrapper.classList.add("show-cards");
      showBtn.style.display = "none";
      backBtn.style.display = "inline-block";

      const texts = document.querySelectorAll(".card-text");
      texts.forEach((text, i) => {
        const card = text.closest(".card");

        setTimeout(() => {
          // Text animation
          text.style.opacity = "1";
          text.style.transform = "translateY(0)";

          // Add "auto-hover" class to simulate hover
          card.classList.add("auto-hover");

          // Remove it after a short time to mimic hover-out
          setTimeout(() => {
            card.classList.remove("auto-hover");
          }, 500); // Adjust this if needed
        }, 600 + i * 300);
      });
    });

    backBtn.addEventListener("click", () => {
      wrapper.classList.remove("show-cards");
      backBtn.style.display = "none";
      showBtn.style.display = "inline-block";

      const texts = document.querySelectorAll(".card-text");
      texts.forEach(text => {
        text.style.opacity = "0";
        text.style.transform = "translateY(20px)";
      });
    });
  }
});



// wish
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".Chronicled-wish");

  // When scrolling in — animate image only
  const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add("animate");         // image in
        section.classList.remove("scroll-out");   // h2 reset
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px 0px 0px"
  });

  // When scrolling out — animate h2 only
  const exitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        section.classList.remove("animate");      // image out
        section.classList.add("scroll-out");      // h2 slide down
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -90% 0px"
  });

  if (section) {
    entryObserver.observe(section);
    exitObserver.observe(section);
  }
});

document.querySelector('[data-section="characters"]').style.backgroundImage = 'url(image17.png)';


// --- Mobile Navigation Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.createElement('div');
  hamburgerMenu.classList.add('hamburger-menu');
  hamburgerMenu.innerHTML = '<span></span><span></span><span></span>';

  const mobileNavMenu = document.createElement('div');
  mobileNavMenu.classList.add('mobile-nav-menu');

  // Clone navigation links from the existing left-side div
  const navLinks = document.querySelectorAll('.left-side .nav-link, .left-side .nav-link2');
  navLinks.forEach(link => {
    const clonedLink = link.cloneNode(true);
    // Remove hover effects or special data attributes that might not be needed for mobile
    clonedLink.classList.remove('nav-link', 'nav-link2'); // Remove original classes
    clonedLink.classList.add('mobile-nav-link'); // Add a new class for mobile links
    mobileNavMenu.appendChild(clonedLink);

    // Close menu when a link is clicked
    clonedLink.addEventListener('click', () => {
      hamburgerMenu.classList.remove('open');
      mobileNavMenu.classList.remove('open');
      document.body.classList.remove('no-scroll'); // Re-enable scroll
    });
  });

  const header = document.querySelector('header');
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.appendChild(hamburgerMenu);
    header.appendChild(mobileNavMenu); // Append mobile menu to header or body, depending on desired overlay
  }

  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('open');
    mobileNavMenu.classList.toggle('open');
    // Prevent scrolling when mobile menu is open
    document.body.classList.toggle('no-scroll');
  });

  // Close menu if clicked outside (optional, but good for UX)
  document.addEventListener('click', (event) => {
    if (!mobileNavMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileNavMenu.classList.contains('open')) {
      hamburgerMenu.classList.remove('open');
      mobileNavMenu.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

});

