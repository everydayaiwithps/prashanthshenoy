/* prashanthshenoy.com. Progressive enhancement only.
   Every feature below degrades to something usable with JS disabled. */

(function () {
  'use strict';

  /* ---- Theme toggle -------------------------------------------------- */
  var root = document.documentElement;
  var STORE = 'ps-theme';

  try {
    var saved = localStorage.getItem(STORE);
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) { /* private mode, blocked storage, system theme still applies */ }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.theme-toggle');
    if (!btn) return;
    var current = root.getAttribute('data-theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = current ? current === 'dark' : systemDark;
    var next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    try { localStorage.setItem(STORE, next); } catch (e) {}
  });

  /* ---- Header hairline on scroll ------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Explainer decks ------------------------------------------------
     The track is a scroll-snap container, so swipe already works with no
     JS at all. This only adds dots, arrows and keyboard control.        */
  document.querySelectorAll('.deck').forEach(function (deck) {
    var track = deck.querySelector('.deck__track');
    var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
    var dotsWrap = deck.querySelector('.deck__dots');
    var prev = deck.querySelector('[data-deck="prev"]');
    var next = deck.querySelector('[data-deck="next"]');
    if (!track || slides.length < 2) return;

    var index = 0;

    var dots = slides.map(function (slide, i) {
      var b = document.createElement('button');
      b.className = 'deck__dot';
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }

    function sync() {
      var mid = track.scrollLeft + track.clientWidth / 2;
      var nearest = 0, best = Infinity;
      slides.forEach(function (s, i) {
        var c = s.offsetLeft - track.offsetLeft + s.clientWidth / 2;
        var d = Math.abs(c - mid);
        if (d < best) { best = d; nearest = i; }
      });
      if (nearest === index) return;
      index = nearest;
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === index ? 'true' : 'false'); });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    dots[0].setAttribute('aria-current', 'true');
    if (prev) {
      prev.disabled = true;
      prev.addEventListener('click', function () { go(index - 1); });
    }
    if (next) next.addEventListener('click', function () { go(index + 1); });

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { sync(); ticking = false; });
    }, { passive: true });

    // Arrow keys work once the deck has focus, not globally, otherwise the
    // deck hijacks arrow-key page scrolling for readers who never touched it.
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); go(index + 1); }
      if (ev.key === 'ArrowLeft')  { ev.preventDefault(); go(index - 1); }
    });
  });

  /* ---- Portrait fallback ---------------------------------------------
     Until the real photograph is dropped in at assets/img/portrait.jpg,
     show a quiet monogram plate rather than a broken-image icon.       */
  document.querySelectorAll('.about__portrait').forEach(function (img) {
    var swap = function () {
      img.src = "data:image/svg+xml," + encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 600'>" +
        "<rect width='480' height='600' fill='%23E9E6DF'/>" +
        "<text x='240' y='325' font-family='Georgia,serif' font-size='120' fill='%230E5E56' " +
        "text-anchor='middle' opacity='0.55'>PS</text></svg>"
      );
      img.removeEventListener('error', swap);
    };
    img.addEventListener('error', swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });

  /* ---- Click-to-reveal phone -----------------------------------------
     The number is base64-encoded in the markup so that the digit pattern
     harvesters regex for is not present in the served HTML. It is decoded
     only on a real click. Not cryptography, just enough friction that a
     bulk scraper walks past.                                            */
  document.querySelectorAll('[data-reveal-phone]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var digits;
      try { digits = atob(btn.getAttribute('data-x') || ''); } catch (e) { return; }
      if (!/^\d{8,15}$/.test(digits)) return;

      var pretty = '+' + digits.replace(/^(\d{3})(\d{2})(\d{3})(\d+)$/, '$1 $2 $3 $4');
      var link = document.createElement('a');
      link.href = 'https://wa.me/' + digits;
      link.rel = 'noopener';
      link.target = '_blank';
      link.textContent = pretty;
      btn.replaceWith(link);
      link.focus();
    });
  });
})();
