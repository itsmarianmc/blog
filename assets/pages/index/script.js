document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.blog-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function extractAllHashtags() {
        const hashtags = new Set();
        document.querySelectorAll('.blog-card').forEach(card => {
            const cardTags = card.getAttribute('b-hash').split(',');
            cardTags.forEach(tag => {
                hashtags.add(tag.trim());
            });
        });
        return Array.from(hashtags);
    }

    function filterProjectsByTag(tag) {
        const allProjects = document.querySelectorAll('.blog-card');
        allProjects.forEach(project => {
            const projectTags = project.getAttribute('b-hash').split(',').map(t => t.trim());
            project.style.display = projectTags.includes(tag) ? 'flex' : 'none';
        });
    }

    function createHashtagFilters() {
        let filterContainer = document.querySelector('.hashtag-filters');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.id = 'hashtag-filters';
            filterContainer.className = 'hashtag-filters';
            document.querySelector('.container').insertBefore(filterContainer, document.querySelector('.projects-grid'));
        }
        filterContainer.innerHTML = `
            <div class="filter-header">
                <h3>Filter by Tag</h3>
            </div>
            <div class="filter-tags">
                <a class="filter-tag filter-remove" href="/">Remove filters</a>
            </div>
        `;

        const tagsContainer = filterContainer.querySelector('.filter-tags');
        const allTags = extractAllHashtags();

        allTags.forEach(tag => {
            const tagElement = document.createElement('a');
            tagElement.className = 'filter-tag';
            tagElement.href = `/?q=h-${tag}`;
            tagElement.textContent = `#${tag}`;
            tagsContainer.appendChild(tagElement);
        });
    }

    function processUrlTag() {
        const params = new URLSearchParams(window.location.search);
        const tagParam = params.get('q');
        
        if (tagParam && tagParam.startsWith('h-')) {
            const tag = tagParam.substring(2);
            filterProjectsByTag(tag);
            
            document.querySelector(".hashtag-filters").style.display = 'block';

            document.querySelectorAll('.filter-tag').forEach(tagElement => {
                if (tagElement.textContent === `#${tag}`) {
                    tagElement.classList.add('active');
                }
            });
            
            document.querySelector('.section-title').textContent = `Projects tagged #${tag}`;
            document.querySelector('.section-subtitle').textContent = `Showing blog with the hashtag #${tag}`;
        } else {
            document.querySelector('.hashtag-filters').remove();
            console.log('No hashtag filter applied.');
        }
    }

    createHashtagFilters();
    processUrlTag();
    
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("blog_id");

    if (blogId) {
        fetch("assets/pages/index/blogs.json")
            .then(response => response.json())
            .then(blogs => {
                for (const [path, id] of Object.entries(blogs)) {
                    if (id === blogId) {
                        window.location.href = `/blog/${path}.html`;
                        return;
                    }
                }

                alert("Invalid blog ID!");
            })
            .catch(error => {
                console.error("Error loading blogs.json:", error);
            });
    }
});
