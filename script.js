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

