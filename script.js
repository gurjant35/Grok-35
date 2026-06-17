document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ===== 3D SERVICE CAROUSEL ===== */
  const carousel = document.getElementById('serviceCarousel');
  if (carousel) {
    const cards = Array.from(carousel.querySelectorAll('.service-card'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const total = cards.length;
    let active = 2; // start on the highlighted "Most Popular" card

    function posLabel(offset) {
      switch (offset) {
        case 0: return 'center';
        case -1: return 'left1';
        case 1: return 'right1';
        case -2: return 'left2';
        case 2: return 'right2';
        default: return 'hidden';
      }
    }

    function spawnSparkles(card) {
      const existing = card.querySelectorAll('.sparkle');
      existing.forEach(s => s.remove());
      const positions = [
        { top: '-6%', left: '8%' },
        { top: '4%', left: '88%' },
        { top: '85%', left: '12%' },
        { top: '92%', left: '82%' }
      ];
      positions.forEach((pos, i) => {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.textContent = '✦';
        s.style.top = pos.top;
        s.style.left = pos.left;
        s.style.animationDelay = (i * 0.08) + 's';
        card.appendChild(s);
        setTimeout(() => s.remove(), 1000);
      });
    }

    function render() {
      let newCenterCard = null;
      cards.forEach((card, i) => {
        let diff = i - active;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        const pos = posLabel(diff);
        const wasCenter = card.getAttribute('data-pos') === 'center';
        card.setAttribute('data-pos', pos);
        if (pos === 'center' && !wasCenter) newCenterCard = card;
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
      if (newCenterCard) spawnSparkles(newCenterCard);
    }

    function go(newIndex) {
      active = (newIndex + total) % total;
      render();
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (i !== active) {
          e.preventDefault();
          go(i);
        }
      });
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => go(i));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => go(active - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(active + 1));

    // swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const track = carousel.querySelector('.carousel-track');

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) go(active + 1);
        else go(active - 1);
      }
    }, { passive: true });

    // keyboard support
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(active - 1);
      if (e.key === 'ArrowRight') go(active + 1);
    });

    render();
  }
});
