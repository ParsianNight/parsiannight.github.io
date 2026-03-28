/* ============================================
   BLOG LISTING PAGE
   ============================================ */

(function () {
  'use strict';

  var grid = document.getElementById('blog-grid');
  var emptyMsg = document.getElementById('blog-empty');
  var filters = document.querySelectorAll('.blog-filter');
  var posts = [];

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function hasLocalPost(slug) {
    // Check if a local Markdown post exists by trying to fetch it
    // For the listing page, we'll determine this from the post data
    return !posts.find(function (p) { return p.slug === slug; }).medium_url;
  }

  function getPostUrl(post) {
    // If there's a local markdown file, link to the post renderer
    // Otherwise link to Medium
    if (post.local) {
      return 'post.html?slug=' + post.slug;
    }
    return post.medium_url || 'post.html?slug=' + post.slug;
  }

  function renderPosts(filter) {
    var filtered = filter === 'all' ? posts : posts.filter(function (p) {
      return p.category === filter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';

    grid.innerHTML = filtered.map(function (post) {
      var url = getPostUrl(post);
      var target = post.local ? '' : ' target="_blank" rel="noopener noreferrer"';
      var source = post.local ? '' : '<span class="blog-card__source">(Medium)</span>';
      var tagsHtml = (post.tags || []).slice(0, 3).map(function (t) {
        return '<span class="blog-card__tag">' + t + '</span>';
      }).join('');

      return '<a href="' + url + '"' + target + ' class="blog-card">' +
        '<span class="blog-card__category">' + (post.category || 'Blog') + '</span>' +
        '<h2 class="blog-card__title">' + post.title + '</h2>' +
        '<p class="blog-card__excerpt">' + post.excerpt + '</p>' +
        '<div class="blog-card__meta">' +
          '<span class="blog-card__date">' + formatDate(post.date) + '</span>' +
          '<span class="blog-card__link-hint">Read &rarr;' + source + '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  function initFilters() {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('blog-filter--active'); });
        this.classList.add('blog-filter--active');
        renderPosts(this.dataset.filter);
      });
    });
  }

  function loadPosts() {
    fetch('posts.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        posts = data.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        // Check which posts have local markdown files
        var checks = posts.map(function (post) {
          return fetch('posts/' + post.slug + '.md', { method: 'HEAD' })
            .then(function (res) {
              post.local = res.ok;
            })
            .catch(function () {
              post.local = false;
            });
        });

        return Promise.all(checks);
      })
      .then(function () {
        renderPosts('all');
      })
      .catch(function (err) {
        grid.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Failed to load posts.</p>';
        console.error('Blog load error:', err);
      });
  }

  initFilters();
  loadPosts();
})();
