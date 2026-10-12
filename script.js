// Inline manifesto "coins" — show cycling themed photos by default
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coins = [].slice.call(document.querySelectorAll("[data-coin]"));
  if (!coins.length) return;

  coins.forEach(function (coin, n) {
    var imgs = [].slice.call(coin.querySelectorAll(".coin-back img"));
    var idx = 0;
    var timer = null;

    function show(i) {
      if (imgs.length < 2) return;
      imgs[idx].classList.remove("is-shown");
      idx = (i + imgs.length) % imgs.length;
      imgs[idx].classList.add("is-shown");
    }

    function play() {
      coin.classList.add("is-playing"); // drives the equalizer animation
      if (reduce || imgs.length < 2 || timer) return;
      // stagger each coin so they don't all cross-fade in lockstep
      timer = setInterval(function () { show(idx + 1); }, 2600);
    }
    function pause() {
      coin.classList.remove("is-playing");
      if (timer) { clearInterval(timer); timer = null; }
    }

    // only run while the coin is on screen
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play() : pause(); });
      }, { threshold: 0.2 });
      io.observe(coin);
    } else {
      play();
    }

    // phase-offset the first advance so the coins feel alive, not synced
    if (!reduce && imgs.length > 1) {
      setTimeout(function () { if (timer) show(idx + 1); }, n * 650);
    }
  });
})();

// Header gets a background only once the page is scrolled
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Impact stat ledger — staggered reveal when it scrolls into view
(function () {
  var grid = document.querySelector(".stat-grid[data-reveal]");
  if (!grid || !("IntersectionObserver" in window)) return;
  grid.classList.add("js-reveal"); // arm the hidden initial state
  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      grid.classList.add("is-revealed");
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe(grid);
})();

// Hero rotating identity — "Meet / a writer. … Ramen." (holds on the name)
(function () {
  var rotator = document.querySelector(".rotator");
  if (!rotator) return;
  var words = [].slice.call(rotator.querySelectorAll(".rot-word"));
  if (words.length < 2) return;

  // Reduced motion: rest on the name, no cycling
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    words.forEach(function (w) {
      w.classList.toggle("is-current", w.classList.contains("rot-name"));
    });
    return;
  }

  var i = 0;
  function holdFor(w) { return w.classList.contains("rot-name") ? 2800 : 1700; }
  function tick() {
    words[i].classList.remove("is-current");
    i = (i + 1) % words.length;
    words[i].classList.add("is-current");
    timer = setTimeout(tick, holdFor(words[i]));
  }
  var timer = setTimeout(tick, holdFor(words[0]));

  // pause while the tab is hidden so it doesn't race in the background
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { clearTimeout(timer); }
    else { timer = setTimeout(tick, holdFor(words[i])); }
  });
})();

// Book rail — visible prev/next arrows
(function () {
  var rail = document.querySelector(".book-rail");
  if (!rail) return;
  var prev = document.querySelector("[data-rail-prev]");
  var next = document.querySelector("[data-rail-next]");
  if (!prev || !next) return;

  function step() {
    var card = rail.querySelector(".book");
    var gap = parseFloat(getComputedStyle(rail).columnGap || "32") || 32;
    var w = card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
    return Math.max(w * 2, rail.clientWidth * 0.8); // ~2 covers per click
  }
  function update() {
    var max = rail.scrollWidth - rail.clientWidth - 2;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max;
  }
  prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: "smooth" }); });
  next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: "smooth" }); });
  rail.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// Sessions accordion
(function () {
  var items = [].slice.call(document.querySelectorAll(".acc-item"));
  if (!items.length) return;

  items.forEach(function (item) {
    var head = item.querySelector(".acc-head");
    var panel = item.querySelector(".acc-panel");
    if (!head || !panel) return;

    // initialise open state height
    if (item.classList.contains("is-open")) panel.style.height = panel.firstElementChild.offsetHeight + "px";

    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      if (isOpen) {
        panel.style.height = panel.scrollHeight + "px";       // from auto → fixed, then to 0
        requestAnimationFrame(function () { panel.style.height = "0px"; });
        item.classList.remove("is-open");
        head.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
        panel.style.height = panel.firstElementChild.offsetHeight + "px";
      }
    });

    // after expanding, let it breathe (height:auto) so responsive reflow works
    panel.addEventListener("transitionend", function (e) {
      if (e.propertyName !== "height") return;
      if (item.classList.contains("is-open")) panel.style.height = "auto";
    });
  });

  // keep open panels sized correctly on resize
  window.addEventListener("resize", function () {
    items.forEach(function (item) {
      if (!item.classList.contains("is-open")) return;
      var panel = item.querySelector(".acc-panel");
      panel.style.height = "auto";
    });
  });
})();

// Rich session-type dropdown
(function () {
  var root = document.querySelector("[data-rich-select]");
  if (!root) return;
  var trigger = root.querySelector(".rs-trigger");
  var panel = root.querySelector(".rs-panel");
  var valueEl = root.querySelector(".rs-value");
  var hidden = root.querySelector("input[type=hidden]");
  var options = [].slice.call(root.querySelectorAll("[role=option]"));

  function open() {
    root.classList.add("is-open");
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }
  function close() {
    root.classList.remove("is-open");
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }
  function choose(opt) {
    options.forEach(function (o) { o.classList.remove("is-active"); o.setAttribute("aria-selected", "false"); });
    opt.classList.add("is-active");
    opt.setAttribute("aria-selected", "true");
    valueEl.textContent = opt.getAttribute("data-value");
    valueEl.removeAttribute("data-placeholder");
    hidden.value = opt.getAttribute("data-value");
    close();
    trigger.focus();
  }

  trigger.addEventListener("click", function () {
    root.classList.contains("is-open") ? close() : open();
  });
  options.forEach(function (opt) {
    opt.addEventListener("click", function () { choose(opt); });
  });
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target)) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("is-open")) { close(); trigger.focus(); }
  });
})();

