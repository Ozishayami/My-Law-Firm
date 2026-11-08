/* Trueworth: site behaviour (no dependencies) */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Header: hide on scroll down, show on scroll up ---------------- */
  var header = document.querySelector("[data-header]");
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header && !document.body.classList.contains("menu-open")) {
      header.classList.toggle("is-scrolled", y > 4);
      var goingDown = y > lastY;
      header.classList.toggle("is-hidden", goingDown && y > header.offsetHeight * 2);
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".visually-hidden").textContent = open ? "Close menu" : "Menu";
    document.body.classList.toggle("menu-open", open);
    if (open) {
      header.classList.remove("is-hidden");
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("is-open"); });
    } else {
      menu.classList.remove("is-open");
      setTimeout(function () { if (toggle.getAttribute("aria-expanded") === "false") menu.hidden = true; }, 300);
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------------- Hero carousel ---------------- */
  var hero = document.querySelector("[data-carousel]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".slide"));
    var bars = Array.prototype.slice.call(hero.querySelectorAll(".progress-bar"));
    var toggleBtn = hero.querySelector("[data-carousel-toggle]");
    var INTERVAL = 7000;
    var index = 0;
    var timer = null;
    var playing = !reduceMotion;

    hero.style.setProperty("--slide-ms", INTERVAL + "ms");

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var active = n === index;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", String(!active));
        if ("inert" in s) s.inert = !active;
        if (active) {
          var img = s.querySelector("img[loading='lazy']");
          if (img) img.loading = "eager";
        }
      });
      bars.forEach(function (b, n) {
        b.classList.toggle("is-active", n === index);
        if (n === index) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
        // restart the progress animation
        var span = b.querySelector("span");
        span.style.animation = "none";
        void span.offsetWidth;
        span.style.animation = "";
      });
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (playing) timer = setTimeout(function () { show(index + 1); }, INTERVAL);
    }

    function setPlaying(p) {
      playing = p;
      hero.classList.toggle("is-playing", p);
      hero.classList.toggle("is-paused", !p);
      toggleBtn.setAttribute("aria-label", p ? "Pause slideshow" : "Play slideshow");
      if (p) show(index); else clearTimeout(timer);
    }

    hero.querySelector("[data-carousel-next]").addEventListener("click", function () { show(index + 1); });
    hero.querySelector("[data-carousel-prev]").addEventListener("click", function () { show(index - 1); });
    toggleBtn.addEventListener("click", function () { setPlaying(!playing); });
    bars.forEach(function (b, n) { b.addEventListener("click", function () { show(n); }); });

    // pause while the tab is hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearTimeout(timer);
      else if (playing) show(index);
    });

    // swipe on touch screens
    var startX = null, startY = null;
    hero.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    // keyboard arrows when focus is inside the carousel
    hero.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });

    setPlaying(playing);
  }

  /* ---------------- Reveal on scroll ---------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el, i) {
      // small stagger for siblings
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var pos = Array.prototype.indexOf.call(siblings, el);
      if (pos > 0) el.style.transitionDelay = Math.min(pos, 6) * 80 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Active nav link ---------------- */
  var navLinks = document.querySelectorAll(".primary-nav a[href^='#']");
  if (navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) navIO.observe(sec);
    });
  }

  /* ---------------- Footer year ---------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
