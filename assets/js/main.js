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

  /* ---------------- Expertise menu (hover is CSS; this handles keyboard and touch) ---------------- */
  document.querySelectorAll("[data-menu]").forEach(function (item) {
    var button = item.querySelector("[data-menu-button]");
    function setOpen(open) {
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      if (open && header) header.classList.remove("is-hidden");
    }
    button.addEventListener("click", function () { setOpen(!item.classList.contains("is-open")); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.classList.contains("is-open")) { setOpen(false); button.focus(); }
    });
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (!item.contains(e.target)) setOpen(false);
    });
  });

  /* ---------------- Insights filter ---------------- */
  var filters = document.querySelector("[data-filters]");
  var filterTarget = document.querySelector("[data-filter-target]");
  if (filters && filterTarget) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var value = btn.getAttribute("data-filter");
      filters.querySelectorAll("[data-filter]").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      filterTarget.querySelectorAll("[data-category]").forEach(function (card) {
        card.hidden = value !== "all" && card.getAttribute("data-category") !== value;
        if (!card.hidden) card.classList.add("is-visible");
      });
    });
  }

  /* ---------------- Contact form: prefill the area and open an email ---------------- */
  var enquiry = document.querySelector("[data-enquiry]");
  if (enquiry) {
    var area = enquiry.querySelector("[data-practice-select]");
    var wanted = new URLSearchParams(window.location.search).get("practice");
    if (area && wanted && area.querySelector('option[value="' + wanted + '"]')) area.value = wanted;

    enquiry.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!enquiry.reportValidity()) return;
      var f = enquiry.elements;
      var areaLabel = area && area.value ? area.options[area.selectedIndex].text : "General enquiry";
      var body = [
        "Name: " + f.name.value,
        "Email: " + f.email.value,
        f.phone.value ? "Phone: " + f.phone.value : "",
        "Area: " + areaLabel,
        "",
        f.message.value,
      ].filter(function (line, i) { return line !== "" || i === 4; }).join("\n");
      var subject = "New enquiry: " + areaLabel;
      window.location.href = "mailto:" + enquiry.getAttribute("data-to") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------------- Footer year ---------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
