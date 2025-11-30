// Load sidebar content with caching to avoid re-renders
(function () {
  const CACHE_KEY = "table-sort-js-sidebar";
  const sidebarContainer = document.getElementById("sidebar-container");

  if (!sidebarContainer) return;

  // Check if sidebar is already cached in sessionStorage
  const cachedSidebar = sessionStorage.getItem(CACHE_KEY);
  if (cachedSidebar) {
    sidebarContainer.innerHTML = cachedSidebar;
    attachNavHandlers();
    return;
  }

  // Fetch and cache sidebar
  fetch("sidebar.html")
    .then((response) => response.text())
    .then((html) => {
      sidebarContainer.innerHTML = html;
      sessionStorage.setItem(CACHE_KEY, html);
      attachNavHandlers();
    })
    .catch((err) => console.error("Failed to load sidebar:", err));

  function attachNavHandlers() {
    // Make entire li elements clickable
    const navItems = sidebarContainer.querySelectorAll(".sidebar ul li");
    navItems.forEach((li) => {
      const link = li.querySelector("a");
      if (link) {
        li.style.cursor = "pointer";
        li.addEventListener("click", (e) => {
          if (e.target.tagName !== "A") {
            window.location.href = link.href;
          }
        });
      }
    });
  }
})();
