/* prashanthshenoy.com
   Progressive enhancement only. The reveal cards are native details elements
   and the mobile menu is a details element too, so the whole site works with
   JavaScript switched off. Nothing below is load bearing. */

(function () {
  'use strict';

  /* ---- Theme toggle --------------------------------------------------- */
  var root = document.documentElement;
  var STORE = 'ps-theme';

  try {
    var saved = localStorage.getItem(STORE);
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) { /* blocked storage, the system theme still applies */ }

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

  /* ---- Header hairline on scroll -------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu: close on outside click and on Escape --------------- */
  var menu = document.querySelector('.menu');
  if (menu) {
    document.addEventListener('click', function (ev) {
      if (menu.open && !menu.contains(ev.target)) menu.open = false;
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && menu.open) { menu.open = false; }
    });
  }

  /* ---- Mark the current page in the navigation ------------------------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .menu__panel a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (target && target === here) a.setAttribute('aria-current', 'page');
  });

  /* ---- Explainer decks -------------------------------------------------
     The track is a scroll-snap container, so swiping already works with no
     JavaScript. This only adds the dots, arrows and keyboard control. */
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
      setTimeout(function () { sync(); ticking = false; }, 60);
    }, { passive: true });

    /* Arrow keys work once the deck has focus, not globally, otherwise the
       deck hijacks arrow-key page scrolling for readers who never touched it. */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); go(index + 1); }
      if (ev.key === 'ArrowLeft')  { ev.preventDefault(); go(index - 1); }
    });
  });

  /* ---- Portrait fallback -----------------------------------------------
     If the photograph is ever missing, show a monogram plate rather than a
     broken image icon. */
  document.querySelectorAll('.hero__portrait, .about__portrait').forEach(function (img) {
    var swap = function () {
      img.src = 'data:image/svg+xml,' + encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 600'>" +
        "<rect width='480' height='600' fill='%23E9E6DD'/>" +
        "<text x='240' y='325' font-family='Georgia,serif' font-size='120' fill='%230F5F54' " +
        "text-anchor='middle' opacity='0.5'>PS</text></svg>"
      );
      img.removeEventListener('error', swap);
    };
    img.addEventListener('error', swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });

  /* ---- Enquiry form: compose an email ----------------------------------
     Static host, so there is no server to post to. The form builds a
     readable message and hands it to the visitor's own email program. The
     mailto action on the form element is the no-JavaScript fallback. */
  var enquiry = document.getElementById('enquiry');
  if (enquiry) {
    enquiry.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var get = function (n) {
        var el = enquiry.elements[n];
        return el ? (el.value || '').trim() : '';
      };
      var interest = enquiry.querySelector('input[name="interest"]:checked');
      interest = interest ? interest.value : 'Enquiry';

      var lines = [];
      if (get('name')) lines.push('Name: ' + get('name'));
      if (get('organisation')) lines.push('Organisation: ' + get('organisation'));
      if (get('role')) lines.push('Role: ' + get('role'));
      if (get('country')) lines.push('Country: ' + get('country'));
      lines.push('Interested in: ' + interest);
      lines.push('');
      lines.push(get('message'));

      var href = 'mailto:prshenoy@jyu.fi'
        + '?subject=' + encodeURIComponent(interest + ' enquiry from ' + (get('organisation') || get('name') || 'the website'))
        + '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = href;
    });
  }

  /* ---- Click to reveal phone -------------------------------------------
     Base64 so the digit pattern harvesters grep for is not in the served
     HTML. Not cryptography, just enough friction that a bulk scraper
     walks past. */
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
