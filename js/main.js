// Routing
const routes = {
  "/": "home.html",
  "/about": "about.html",
  "/portfolio": "portfolio.html",
  "/contact": "contact.html",
  "/careers": "careers.html",
  "/blog": "blog.html",
  "/privacy-policy": "privacy-policy.html",
}

function updateActiveLink(url) {
  document.querySelectorAll("[data-link]").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${url}`) {
      link.classList.add("active");
    }
    document.querySelector('.header').classList.remove('nav-open');
  });
}

async function loadContent(url) {
  const page = routes[url] || "404.html";
  try {
    const res = await fetch(`/pages/${page}`);
    if (!res.ok) throw new Error("Page not found");
    const content = await res.text();
    if (page === '404.html') {
      document.body.innerHTML = content;
    } else {
      app.innerHTML = content;
    }
    if (document.querySelector('.swiper')) {
      intializeSwiper();
    }

    if (document.getElementById('open-positions')) {
      intializeCareer()
    }
  } catch (error) {
    app.innerHTML = `<h1>Page not found</h1>`;
  }
}

function navigateTo(url) {
  window.location.hash = url;
}

// Listen for clicks on links
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.getAttribute("href").replace('#', ''));
  }
});

// Handle hash changes
window.addEventListener("hashchange", () => {
  const url = window.location.hash.slice(1) || "/";

  loadContent(url);
  updateActiveLink(url);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initial page load
document.addEventListener("DOMContentLoaded", () => {
  const url = window.location.hash.slice(1) || "/";
  loadContent(url);
  updateActiveLink(url);
})

// Mobile Menu
const btnMobile = document.getElementById("btn-mobile-nav");

btnMobile.addEventListener("click", () => {
  document.querySelector('.header').classList.toggle('nav-open');
})

// Language Switcher

let currentLanguage = "en";

async function changeLanguage() {
  const flagIcon = document.getElementById("flagIcon");

  if (currentLanguage == 'en') {
    flagIcon.src = "./images/myanmar.svg";
    flagIcon.alt = "Myanmar Flag";
    currentLanguage = "mm";
  } else {
    flagIcon.src = "./images/uk.svg";
    flagIcon.alt = "UK Flag";
    currentLanguage = "en";
  }

  try {
    const module = await import(`./languages/${currentLanguage}.js`);
    const translations = module.default;

    document.querySelectorAll("[data-translate]").forEach(element => {
      let key = element.getAttribute('data-translate');
      element.textContent = translations[key];
    })

  } catch (error) {
    console.log("Error loading in translation file:", error);
  }

}

document.getElementById("languageSwitcher").addEventListener("click", changeLanguage);

// Carousel
const isCustomPreview = document.querySelector(".custom-preview") !== null;

function intializeSwiper() {
  if (typeof Swiper !== undefined) {
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: isCustomPreview ? 3 : 2,
        },
        1200: {
          slidesPerView: isCustomPreview ? 4 : 3,
        },
      }
    });
  }
}

// tabs
function openTab(event, tabId) {

  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'))
  document.querySelectorAll('.tab-link').forEach(button => button.classList.remove('active'))
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

//scroll to element

function intializeCareer() {
  document.getElementById('open-positions').addEventListener('click', function () {
    document.getElementById('open-postions-section').scrollIntoView({ behavior: 'smooth' })
  })
}
