(function () {console.log("JavaScript connected");
  const themeButton = document.getElementById("themeToggle");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      themeButton.textContent = document.body.classList.contains("dark-mode")
        ? "Switch to Light Mode"
        : "Switch to Dark Mode";
    });
  }
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const sectionIds = ["about", "skills", "projects"];
  const links = Array.from(document.querySelectorAll(".primary-nav a"));

  function setActiveLink() {
    const fromTop = window.scrollY + 120;
    let current = sectionIds[0];

    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= fromTop) {
        current = id;
      }
    });

    links.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + current;
      link.classList.toggle("is-active", isActive);
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  const searchInput = document.getElementById("project-search");
  const techFilters = document.getElementById("tech-filters");
  const projectItems = Array.from(document.querySelectorAll(".projects-list li"));
  const emptyState = document.getElementById("project-empty");
  const statusEl = document.getElementById("project-filter-status");
  let selectedTech = "all";

  function parseTechs(value) {
    return String(value || "")
      .split(",")
      .map(function (tech) {
        return tech.trim();
      })
      .filter(Boolean);
  }

  function uniqueTechs() {
    const techs = [];
    projectItems.forEach(function (item) {
      parseTechs(item.getAttribute("data-tech")).forEach(function (tech) {
        if (techs.indexOf(tech) === -1) {
          techs.push(tech);
        }
      });
    });
    return techs.sort();
  }

  function matchesQuery(item, query) {
    if (!query) {
      return true;
    }
    const name = (item.getAttribute("data-name") || "").toLowerCase();
    const techs = (item.getAttribute("data-tech") || "").toLowerCase();
    const text = (item.textContent || "").toLowerCase();
    return name.indexOf(query) !== -1 || techs.indexOf(query) !== -1 || text.indexOf(query) !== -1;
  }

  function matchesTech(item, tech) {
    if (tech === "all") {
      return true;
    }
    return parseTechs(item.getAttribute("data-tech")).some(function (itemTech) {
      return itemTech.toLowerCase() === tech.toLowerCase();
    });
  }

  function applyProjectFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    projectItems.forEach(function (item) {
      const show = matchesQuery(item, query) && matchesTech(item, selectedTech);
      item.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (statusEl) {
      const techLabel = selectedTech === "all" ? "all technologies" : selectedTech;
      const queryLabel = query ? ' matching "' + searchInput.value.trim() + '"' : "";
      statusEl.textContent =
        visibleCount +
        " project" +
        (visibleCount === 1 ? "" : "s") +
        " for " +
        techLabel +
        queryLabel +
        ".";
    }
  }

  function renderTechFilters() {
    if (!techFilters) {
      return;
    }

    techFilters.innerHTML = "";
    const options = ["all"].concat(uniqueTechs());

    options.forEach(function (tech) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tech-filter";
      button.setAttribute("aria-pressed", tech === selectedTech ? "true" : "false");
      button.dataset.tech = tech;
      button.textContent = tech === "all" ? "All" : tech;
      button.addEventListener("click", function () {
        selectedTech = tech;
        techFilters.querySelectorAll(".tech-filter").forEach(function (btn) {
          btn.setAttribute(
            "aria-pressed",
            btn.dataset.tech === selectedTech ? "true" : "false"
          );
        });
        applyProjectFilters();
      });
      techFilters.appendChild(button);
    });
  }

  if (projectItems.length) {
    renderTechFilters();
    if (searchInput) {
      searchInput.addEventListener("input", applyProjectFilters);
    }
    applyProjectFilters();
  }
})();
