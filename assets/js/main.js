// Hero staged entrance + looping typewriter title + theme initialization
window.addEventListener("load", () => {
  const savedTheme = window.localStorage.getItem("theme");
  /* Mặc định dark mode; chỉ dùng light khi user đã chọn */
  if (savedTheme === "light") {
    document.body.classList.remove("theme-dark");
  } else {
    document.body.classList.add("theme-dark");
  }

  document.body.classList.add("hero-loaded");

  const titleEl = document.getElementById("hero-title");
  if (titleEl) {
    const fullText =
      titleEl.dataset.text || titleEl.textContent.trim() || "Hi, I'm Andrew";
    const minWidthCh = fullText.length + 1;
    titleEl.style.minWidth = `${minWidthCh}ch`;

    let index = 0;
    let deleting = false;

    const type = () => {
      const visible = fullText.slice(0, Math.max(0, index));
      const paddingSpaces = "\u00A0".repeat(fullText.length - visible.length);
      titleEl.textContent = visible + paddingSpaces;

      if (!deleting) {
        index += 1;
        if (index > fullText.length) {
          deleting = true;
          setTimeout(type, 1400);
          return;
        }
      } else {
        index -= 1;
        if (index <= 0) {
          deleting = false;
          index = 0;
          setTimeout(type, 350);
          return;
        }
      }

      const delay = deleting ? 60 : 80;
      setTimeout(type, delay);
    };

    titleEl.textContent = "\u00A0".repeat(fullText.length);
    type();
  }

});

// Reveal sections on scroll
const animatedSections = document.querySelectorAll(".section-animated");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-animated--visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animatedSections.forEach((section) => revealObserver.observe(section));

// Smooth scroll for nav links (with header offset handled by CSS scroll-margin)
const navLinks = document.querySelectorAll(".site-header__link[href^='#']");

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      event.preventDefault();
      updateTerminalTitle(targetId);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Highlight active nav item based on scroll position
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".site-header__item");
const terminalTitleEl = document.querySelector(".terminal-title");

const terminalPaths = {
  home: "~",
  projects: "~/projects",
  skills: "~/skills",
  contact: "~/contact",
};

const updateTerminalTitle = (id) => {
  if (!terminalTitleEl) return;
  const path = terminalPaths[id] || "~";
  terminalTitleEl.textContent = `andrew@portfolio ${path}`;
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        updateTerminalTitle(id);
        navItems.forEach((item) => {
          const link = item.querySelector(".site-header__link");
          if (!link) return;
          const hrefId = link.getAttribute("href").slice(1);
          if (hrefId === id) {
            item.classList.add("site-header__item--active");
          } else {
            item.classList.remove("site-header__item--active");
          }
        });
      }
    });
  },
  {
    root: null,
    threshold: 0.35,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

if (window.location.hash) {
  const initialId = window.location.hash.slice(1);
  updateTerminalTitle(initialId);
} else {
  updateTerminalTitle("home");
}

// Scroll progress bar
const progressBar = document.querySelector(".scroll-progress");

const updateProgress = () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.setProperty("--progress", `${progress}%`);
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// Theme toggle
const themeToggleBtn = document.querySelector(".theme-toggle");
const updateThemeIcon = () => {
  if (!themeToggleBtn) return;
  const iconEl = themeToggleBtn.querySelector(".theme-toggle__icon");
  if (!iconEl) return;
  const isDark = document.body.classList.contains("theme-dark");
  iconEl.textContent = isDark ? "☼" : "☾";
  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
};

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const willBeDark = !document.body.classList.contains("theme-dark");
    document.body.classList.toggle("theme-dark", willBeDark);
    window.localStorage.setItem("theme", willBeDark ? "dark" : "light");
    updateThemeIcon();
  });
  updateThemeIcon();
}

// Project cards: staggered reveal on scroll
const projectCards = document.querySelectorAll(".project-card");

if (projectCards.length) {
  const projectsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const cards = Array.from(projectCards);
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("project-card--visible");
          }, index * 120);
        });
        observer.disconnect();
      });
    },
    { threshold: 0.2 }
  );

  const projectsSection = document.getElementById("projects");
  if (projectsSection) {
    projectsObserver.observe(projectsSection);
  }
}

// Project modal functionality
const modal = document.getElementById("project-modal");
const modalClose = modal?.querySelector(".modal__close");
const modalOverlay = modal?.querySelector(".modal__overlay");
const modalTitle = modal?.querySelector(".modal__title");
const modalPeriod = modal?.querySelector(".modal__period");
const modalRole = modal?.querySelector(".modal__role");
const modalDescription = modal?.querySelector(".modal__description");
const modalHighlights = modal?.querySelector(".modal__highlights-list");
const modalTags = modal?.querySelector(".modal__tags");
const modalLink = modal?.querySelector(".modal__link");

// Project data
const projectData = {
  "teaching-team": {
    title: "Teaching Team Platform",
    period: "March 2025 — June 2025",
    role: "Software Developer & Web Lead",
    description:
      "Education platform to manage teaching team applications, ranking and selection with real‑time updates. Built scalable features using TypeScript, GraphQL, and WebSocket for real-time notifications.",
    highlights: [
      "Built scalable features using TypeScript, GraphQL, and WebSocket for real-time notifications",
      "Designed API workflows for candidate application, review, ranking, and selection; prevented over-allocation through validation logic",
      "Optimized client-side caching and event handling for consistent system state across role-based interfaces",
      "Collaborated in feature planning, debugging, and performance optimization with Jest and React Testing Library",
      "Delivered role-based dashboards for candidates, lecturers, and administrators with GraphQL subscriptions",
    ],
    tags: ["TypeScript", "React", "GraphQL", "WebSocket"],
    github: "https://github.com/Quocan1410/TeachTeamApp",
  },
  neonsquare: {
    title: "NeonSquare",
    period: "2024 — 2025",
    role: "Software Developer",
    description:
      "Social media platform with posts, reactions, notifications and real‑time chat across a Java backend and Next.js web app.",
    highlights: [
      "Developed posts, reactions, comments, and real-time chat with Java Spring Boot backend and Next.js web app",
      "Implemented WebSocket-based notifications, friend request system, and JWT authentication",
      "Built image upload, user profiles, and notification dropdown with responsive UI components",
      "Integrated STOMP/WebSocket for live messaging; designed REST APIs for posts, reactions, and friendships",
      "Implemented conversation list, sidebar chat UI, and real-time message delivery with Socket.io",
    ],
    tags: ["Next.js", "Java", "Spring Boot", "WebSocket"],
    github: "https://github.com/Quocan1410/NeonSquare",
  },
  bookstore: {
    title: "BookStore System",
    period: "2024",
    role: "Developer — Java/JavaFX",
    description:
      "Desktop bookstore management app with shopping cart, SQL integration, authentication and order workflows.",
    highlights: [
      "Built bookstore management system with shopping cart, payment processing, and user dashboard",
      "Implemented SQL database integration, CRUD operations, and secure authentication",
      "Developed order management, import/export, and profile editing with JavaFX FXML layouts",
      "Integrated payment validation for card details, CVV, and expiration; designed data models with DAO pattern",
      "Utilized TableView for cart display, FileChooser for profile images, and AlertUtil for user feedback",
    ],
    tags: ["Java", "JavaFX", "SQL"],
    github: "https://github.com/Quocan1410/BookStoreSystem",
  },
  "grocery-mart": {
    title: "Grocery Mart",
    period: "2024",
    role: "Web Developer",
    description:
      "Responsive e‑commerce web app with product catalog, filters and reusable UI components.",
    highlights: [
      "Developed responsive e-commerce UI with HTML5, CSS3, SCSS, and modular components",
      "Implemented slideshow, product catalog, category browsing, and filter forms",
      "Built payment interface, account management, and product card components with reusable styles",
      "Applied BEM methodology and Sass variables for maintainable, themeable layouts",
      "Structured modular templates for header, footer, and reusable UI blocks with dynamic content loading",
    ],
    tags: ["HTML", "CSS", "SCSS"],
    github: "https://github.com/Quocan1410/f8-project-08",
  },
};

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data || !modal) return;

  // Populate modal content
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalPeriod) modalPeriod.textContent = data.period;
  if (modalRole) modalRole.textContent = data.role;
  if (modalDescription) modalDescription.textContent = data.description;

  // Populate highlights
  if (modalHighlights) {
    modalHighlights.innerHTML = "";
    data.highlights.forEach((highlight) => {
      const li = document.createElement("li");
      li.textContent = highlight;
      modalHighlights.appendChild(li);
    });
  }

  // Populate tags
  if (modalTags) {
    modalTags.innerHTML = "";
    data.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      modalTags.appendChild(span);
    });
  }

  // Set GitHub link
  if (modalLink) {
    modalLink.href = data.github;
  }

  // Show modal
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Open modal on project card click
projectCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Don't open modal if clicking on links/buttons inside card
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    const projectId = card.dataset.project;
    if (projectId) {
      openModal(projectId);
    }
  });
});

// Close modal handlers
if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", closeModal);
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});


