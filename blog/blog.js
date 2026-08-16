document.addEventListener("DOMContentLoaded", () => {
    // Agar koi article define nahi hai
    if (typeof ARTICLES === "undefined" || !Array.isArray(ARTICLES) || ARTICLES.length === 0) {
        document.getElementById("empty-state").style.display = "block";
        document.getElementById("featured-section").style.display = "none";
        document.getElementById("blog-controls").style.display = "none";
        return;
    }

    let activeCategory = "all";
    let currentSearchTerm = "";

    // 1. Categories Filter Buttons Auto-generate karna
    const categories = ["All", ...new Set(ARTICLES.map(a => a.category))];
    const filterTabsContainer = document.getElementById("filter-tabs");

    filterTabsContainer.innerHTML = categories.map((cat, idx) => `
        <button class="tab-btn ${idx === 0 ? 'active' : ''}" 
                data-category="${cat.toLowerCase()}" 
                role="tab" 
                aria-selected="${idx === 0 ? 'true' : 'false'}">
            ${cat}
        </button>
    `).join("");

    // Category click handler
    filterTabsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;

        document.querySelectorAll(".tab-btn").forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
        });

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        activeCategory = btn.getAttribute("data-category");
        renderArticles();
    });

    // 2. Search Handler
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    function handleSearch() {
        currentSearchTerm = searchInput.value.trim().toLowerCase();
        renderArticles();
    }

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") handleSearch();
        if (searchInput.value === "") {
            currentSearchTerm = "";
            renderArticles();
        }
    });

    // 3. Render Featured Article
    const featuredArticle = ARTICLES.find(a => a.featured) || ARTICLES[0];
    const featuredContainer = document.getElementById("featured-container");

    if (featuredArticle) {
        featuredContainer.innerHTML = `
            <div class="featured-card">
                <img src="${featuredArticle.image}" alt="${featuredArticle.title}" class="featured-image" loading="lazy" onerror="this.style.display='none'">
                <div class="featured-content">
                    <div class="category">${featuredArticle.category}</div>
                    <h3><a href="${featuredArticle.url}" style="text-decoration:none; color:inherit;">${featuredArticle.title}</a></h3>
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
    } else {
        document.getElementById("featured-section").style.display = "none";
    }

    // 4. Render Article Grid
    function renderArticles() {
        const gridContainer = document.getElementById("article-grid");
        const emptyState = document.getElementById("empty-state");

        // Filter by category & search term
        const filtered = ARTICLES.filter(art => {
            const matchesCat = activeCategory === "all" || art.category.toLowerCase() === activeCategory;
            const matchesSearch = currentSearchTerm === "" || 
                                  art.title.toLowerCase().includes(currentSearchTerm) || 
                                  art.excerpt.toLowerCase().includes(currentSearchTerm);
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            gridContainer.innerHTML = "";
            emptyState.style.display = "block";
            document.getElementById("empty-message").innerText = "No articles found matching your criteria.";
            document.getElementById("empty-sub").innerText = "Try searching for a different keyword or selecting another category.";
            return;
        }

        emptyState.style.display = "none";

        gridContainer.innerHTML = filtered.map(art => `
            <article class="article-card">
                <img src="${art.image}" alt="${art.title}" class="article-image" loading="lazy" onerror="this.style.display='none'">
                <span class="category">${art.category}</span>
                <h3><a href="${art.url}" style="text-decoration:none; color:inherit;">${art.title}</a></h3>
                <p class="excerpt">${art.excerpt}</p>
                <div class="meta">
                    <span>📅 ${art.date}</span>
                    <span>⏱️ ${art.readTime}</span>
                </div>
                <a href="${art.url}" class="read-more">Read Guide →</a>
            </article>
        `).join("");
    }

    // Initial render
    renderArticles();
});
