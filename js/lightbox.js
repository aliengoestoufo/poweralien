/* ==========================================================
   PLANET ALIEN — lightbox.js
   Shared by log.html (shows/movies, split panel, hover-reveal
   arrows) and favorites.html (favorite characters, stacked
   gradient card). Reads whatever data-title/-rating/-log/-color-1/
   -color-2 each gallery item provides and fills in whichever
   lightbox elements exist on the current page — click a thumbnail
   to open it, then browse with the arrows, the keyboard
   (left / right / escape), or by clicking outside the panel.
   Only runs on pages that actually have a .gallery element.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxRating = document.getElementById('lightboxRating');
  const lightboxLog = document.getElementById('lightboxLog');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const images = items.map(item => {
    const img = item.querySelector('img');
    return {
      src: img.src,
      title: img.dataset.title || img.alt || '',
      rating: img.dataset.rating || '',
      log: img.dataset.log || '',
      color1: img.dataset.color1 || '',
      color2: img.dataset.color2 || ''
    };
  });

  let currentIndex = 0;

  function updateLightbox() {
    const current = images[currentIndex];
    lightboxImage.src = current.src;
    lightboxImage.alt = current.title;
    if (lightboxTitle) lightboxTitle.textContent = current.title;
    if (lightboxRating) lightboxRating.textContent = current.rating ? `Rating: ${current.rating}` : '';
    if (lightboxLog) lightboxLog.textContent = current.log;

    // Every new item should start scrolled to the top of its description,
    // not wherever the previous (possibly longer) entry left the scrollbar.
    if (lightboxLog) lightboxLog.scrollTop = 0;

    // Per-item accent gradient, used by the character-card lightbox on
    // favorites.html. Harmless no-op on pages that don't set these.
    if (current.color1) lightbox.style.setProperty('--char-c1', current.color1);
    if (current.color2) lightbox.style.setProperty('--char-c2', current.color2);
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    // Keyboard support for anyone tabbing through the gallery.
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Click the dark backdrop (not the image itself) to close.
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
