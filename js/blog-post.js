/* ============================================
   BLOG POST RENDERER
   Fetches Markdown from posts/<slug>.md,
   renders it with marked + highlight.js
   ============================================ */

(function () {
  'use strict';

  var header = document.getElementById('blog-article-header');
  var body = document.getElementById('blog-article-body');
  var nav = document.getElementById('blog-post-nav');

  function getSlug() {
    var params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function estimateReadTime(text) {
    var words = text.trim().split(/\s+/).length;
    var minutes = Math.ceil(words / 200);
    return minutes + ' min read';
  }

  function renderHeader(post, markdown) {
    var tagsHtml = (post.tags || []).map(function (t) {
      return '<span class="blog-article__tag">' + t + '</span>';
    }).join('');

    header.innerHTML =
      '<span class="blog-article__category">' + (post.category || 'Blog') + '</span>' +
      '<h1 class="blog-article__title">' + post.title + '</h1>' +
      '<div class="blog-article__meta">' +
        '<span>' + formatDate(post.date) + '</span>' +
        '<span>' + estimateReadTime(markdown) + '</span>' +
      '</div>' +
      '<div class="blog-article__tags">' + tagsHtml + '</div>';

    document.title = post.title + ' — Omar Abdelrazik';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = post.excerpt;
  }

  function renderBody(markdown) {
    // Configure marked
    marked.setOptions({
      gfm: true,
      breaks: false,
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });

    body.innerHTML = marked.parse(markdown);

    // Fix image paths: markdown references images/ relative to posts/ dir
    body.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src');
      if (src && src.indexOf('images/') === 0) {
        img.setAttribute('src', 'posts/' + src);
      }
    });

    // Apply syntax highlighting to any remaining code blocks
    body.querySelectorAll('pre code').forEach(function (block) {
      hljs.highlightElement(block);
    });
  }

  function renderPostNav(posts, currentSlug) {
    var idx = posts.findIndex(function (p) { return p.slug === currentSlug; });
    if (idx === -1) return;

    var prev = idx < posts.length - 1 ? posts[idx + 1] : null;
    var next = idx > 0 ? posts[idx - 1] : null;

    if (!prev && !next) return;

    nav.style.display = 'grid';

    var prevLink = document.getElementById('prev-post');
    var nextLink = document.getElementById('next-post');
    var prevTitle = document.getElementById('prev-post-title');
    var nextTitle = document.getElementById('next-post-title');

    if (prev) {
      prevLink.href = 'post.html?slug=' + prev.slug;
      prevTitle.textContent = prev.title;
    } else {
      prevLink.style.visibility = 'hidden';
    }

    if (next) {
      nextLink.href = 'post.html?slug=' + next.slug;
      nextTitle.textContent = next.title;
    } else {
      nextLink.style.visibility = 'hidden';
    }
  }

  function loadPost() {
    var slug = getSlug();
    if (!slug) {
      header.innerHTML = '<div class="blog-article__loading">Post not found.</div>';
      return;
    }

    var posts = [];

    fetch('posts.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        posts = data.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        var post = posts.find(function (p) { return p.slug === slug; });
        if (!post) {
          header.innerHTML = '<div class="blog-article__loading">Post not found.</div>';
          return Promise.reject('not_found');
        }

        return fetch('posts/' + slug + '.md')
          .then(function (res) {
            if (!res.ok) throw new Error('Markdown not found');
            return res.text();
          })
          .then(function (markdown) {
            renderHeader(post, markdown);
            renderBody(markdown);
            renderPostNav(posts, slug);
          })
          .catch(function () {
            // No local markdown — redirect to Medium
            if (post.medium_url) {
              window.location.href = post.medium_url;
            } else {
              header.innerHTML = '<div class="blog-article__loading">Post content not available yet.</div>';
            }
          });
      })
      .catch(function (err) {
        if (err !== 'not_found') {
          header.innerHTML = '<div class="blog-article__loading">Failed to load post.</div>';
          console.error('Post load error:', err);
        }
      });
  }

  // Adapt syntax highlighting theme to current theme
  function updateHljsTheme() {
    var link = document.getElementById('hljs-theme');
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    } else {
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }
  }

  // Watch for theme changes
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') {
        updateHljsTheme();
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });
  updateHljsTheme();

  loadPost();
})();
