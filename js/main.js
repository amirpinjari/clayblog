/* ===================================================
   CLAYBLOG — MAIN JAVASCRIPT
   =================================================== */

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
}

// ---- Filter tabs ----
const tabs = document.querySelectorAll('.tab');
const posts = document.querySelectorAll('.post-card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    posts.forEach(post => {
      if (filter === 'all' || post.dataset.category === filter) {
        post.style.display = '';
        post.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        post.style.display = 'none';
      }
    });
  });
});

// ---- Newsletter subscribe ----
function handleSubscribe(e) {
  e.preventDefault();
  showToast('🎉 You\'re subscribed! Welcome to ClayBlog.');
  e.target.reset();
}

// ---- Toast notification ----
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- Scroll to top ----
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-top';
scrollBtn.innerHTML = '↑';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollBtn);
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ---- Load more (demo) ----
const loadMore = document.getElementById('load-more');
if (loadMore) {
  let count = 0;
  loadMore.addEventListener('click', () => {
    count++;
    if (count >= 2) {
      loadMore.textContent = 'All Articles Loaded';
      loadMore.disabled = true;
      return;
    }
    const grid = document.getElementById('posts-grid');
    const newPosts = [
      { title: 'How Remote Work Is Reshaping City Design', cat: 'lifestyle', catLabel: 'Lifestyle', tagClass: 'tag-life', author: 'Maya Chen', date: 'June 9, 2025', time: '7 min', grad: 'linear-gradient(135deg,#fde68a,#fca5a5)', emoji: '🏙️' },
      { title: 'The Science of Habit Formation: A Complete Guide', cat: 'productivity', catLabel: 'Productivity', tagClass: 'tag-prod', author: 'Jordan Kim', date: 'June 5, 2025', time: '13 min', grad: 'linear-gradient(135deg,#bbf7d0,#a5f3fc)', emoji: '🧠' },
      { title: 'Top 5 JavaScript Frameworks to Learn in 2025', cat: 'technology', catLabel: 'Technology', tagClass: 'tag-tech', author: 'Alex Rivera', date: 'June 1, 2025', time: '9 min', grad: 'linear-gradient(135deg,#c4b5fd,#818cf8)', emoji: '⚡' },
    ];
    newPosts.forEach((p, i) => {
      const art = document.createElement('article');
      art.className = 'clay-card post-card animate-in';
      art.style.animationDelay = `${i * 0.1}s`;
      art.dataset.category = p.cat;
      art.innerHTML = `
        <div class="post-img" style="background:${p.grad}">
          <span class="tag ${p.tagClass}">${p.catLabel}</span>
        </div>
        <div class="post-body">
          <h3 class="post-title"><a href="post.html">${p.title}</a></h3>
          <p class="post-excerpt">Explore our in-depth guide covering everything you need to know about this topic.</p>
          <div class="post-meta">
            <img src="assets/avatar1.svg" alt="Author" class="avatar" />
            <div>
              <span class="author-name">${p.author}</span>
              <span class="post-date">${p.date} · ${p.time}</span>
            </div>
          </div>
        </div>`;
      grid.appendChild(art);
    });
  });
}

// ---- TOC active state ----
const tocLinks = document.querySelectorAll('.toc-list a');
if (tocLinks.length) {
  const headings = Array.from(document.querySelectorAll('.post-content h2, .post-content h3'));
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    headings.forEach((h, i) => {
      const top = h.offsetTop;
      const next = headings[i + 1] ? headings[i + 1].offsetTop : Infinity;
      if (scrollY >= top && scrollY < next) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const id = h.id || h.textContent.toLowerCase().replace(/\s+/g, '-');
        const link = document.querySelector(`.toc-list a[href="#${id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ---- Share buttons ----
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.share;
    const url = encodeURIComponent(location.href);
    const title = encodeURIComponent(document.title);
    const urls = {
      tw: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      li: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}`,
    };
    if (type === 'cp') {
      navigator.clipboard.writeText(location.href).then(() => showToast('Link copied to clipboard!'));
      return;
    }
    if (urls[type]) window.open(urls[type], '_blank', 'width=600,height=450');
  });
});

// ---- Search ----
const searchForm = document.getElementById('search-form');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('search-input').value.trim();
    if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  });
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  if (q) {
    const input = document.getElementById('search-input');
    if (input) input.value = q;
    const heading = document.getElementById('search-heading');
    if (heading) heading.textContent = `Results for "${q}"`;
  }
}

// ---- Animate on scroll (Intersection Observer) ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.clay-card, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ---- Contact form ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.');
    contactForm.reset();
  });
}

// ---- Advertise link tracking (demo) ----
document.querySelectorAll('[href="advertise.html"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'advertise_click', { event_category: 'engagement' });
    }
  });
});
