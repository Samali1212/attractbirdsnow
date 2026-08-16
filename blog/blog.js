/**
 * Blog Rendering & Live Filter Engine
 * Automatically parses the ARTICLES array and renders UI components into blog.html.
 */

document.addEventListener("DOMContentLoaded", () => {
    const featuredSection = document.getElementById("featured-section");
    const featuredContainer = document.getElementById("featured-container");
    const controlsSection = document.getElementById("blog-controls");
    const filterTabsContainer = document.getElementById("filter-tabs");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const gridContainer = document.getElementById("article-grid");
    const emptyState = document.getElementById("empty-state");
    const emptyMessage = document.getElementById("empty-message");
    const emptySub = document.getElementById("empty-sub");

    // Verify article registry availability
    if (typeof ARTICLES === "undefined" || !Array.isArray(ARTICLES) || ARTICLES.length === 0) {
        if (featuredSection) featuredSection.style.display = "none";
        if (controlsSection) controlsSection.style.display = "none";
        if (emptyState) {
            emptyState.style.display = "block";
            emptyMessage.innerText = "No published articles available yet.";
            emptySub.innerText = "Please check back soon for research-informed habitat guides.";
        }
        return;
    }

    let activeCategory = "all";
    let currentSearchTerm = "";

    // 1. Generate Category Filter Tabs
    const uniqueCategories = ["All", ...new Set(ARTICLES.map(article => article.category))];

    filterTabsContainer.innerHTML = uniqueCategories.map((category, index) => `
        <button type="button" 
                class="tab-btn ${index === 0 ? 'active' : ''}" 
                data-category="${category.toLowerCase()}" 
                role="tab" 
                aria-selected="${index === 0 ? 'true' : 'false'}">
            ${category}
        </button>
    `).join("");

    // Category button click listener
    filterTabsContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".tab-btn");
        if (!button) return;

        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-selected", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
        activeCategory = button.getAttribute("data-category");
        renderArticlesGrid();
    });

    // 2. Search Handlers
    function executeSearch() {
        currentSearchTerm = searchInput.value.trim().toLowerCase();
        renderArticlesGrid();
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", executeSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                executeSearch();
            }
            if (searchInput.value === "") {
                currentSearchTerm = "";
                renderArticlesGrid();
            }
        });
    }

    // 3. Render Featured Article
    const featuredArticle = ARTICLES.find(article => article.featured) || ARTICLES[0];

    if (featuredArticle && featuredContainer) {
        featuredContainer.innerHTML = `
            <div class="featured-card">
                <img src="${featuredArticle.image}" 
                     alt="${featuredArticle.title}" 
                     class="featured-image" 
                     loading="lazy" 
                     onerror="this.style.display='none'">
                <div class="featured-content">
                    <div class="category">${featuredArticle.category}</div>
                    <h3>
                        <a href="${featuredArticle.url}" style="text-decoration:none; color:inherit;">
                            ${featuredArticle.title}
                        </a>
                    </h3>
                    <p>${featuredArticle.excerpt}</p>
                    <div class="meta">
                        <span>📅 ${featuredArticle.date}</span>
                        <span>⏱️ ${featuredArticle.readTime}</span>
                    </div>
                    <div>
                        <a href="${featuredArticle.url}" class="btn">Read Article →</a>
                    </div>
                </div>
            </div>
        `;
    } else if (featuredSection) {
        featuredSection.style.display = "none";
    }

    // 4. Render Main Article Grid
    function renderArticlesGrid() {
        const filteredArticles = ARTICLES.filter(article => {
            const matchesCategory = activeCategory === "all" || article.category.toLowerCase() === activeCategory;
            const matchesSearch = currentSearchTerm === "" || 
                                  article.title.toLowerCase().includes(currentSearchTerm) || 
                                  article.excerpt.toLowerCase().includes(currentSearchTerm);
            return matchesCategory && matchesSearch;
        });

        if (filteredArticles.length === 0) {
            gridContainer.innerHTML = "";
            emptyState.style.display = "block";
            emptyMessage.innerText = "No articles found matching your criteria.";
            emptySub.innerText = "Try searching for a different keyword or selecting another category filter.";
            return;
        }

        emptyState.style.display = "none";

        gridContainer.innerHTML = filteredArticles.map(article => `
            <article class="article-card">
                <img src="${article.image}" 
                     alt="${article.title}" 
                     class="article-image" 
                     loading="lazy" 
                     onerror="this.style.display='none'">
                <span class="category">${article.category}</span>
                <h3>
                    <a href="${article.url}" style="text-decoration:none; color:inherit;">
                        ${article.title}
                    </a>
                </h3>
                <p class="excerpt">${article.excerpt}</p>
                <div class="meta">
                    <span>📅 ${article.date}</span>
                    <span>⏱️ ${article.readTime}</span>
                </div>
                <a href="${article.url}" class="read-more">Read Guide →</a>
            </article>
        `).join("");
    }

    // Initial render execution
    renderArticlesGrid();
});
