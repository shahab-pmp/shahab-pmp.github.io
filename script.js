/* Interactions for the portfolio. State data (assets/states.js) holds the recorded
   class + inline-style values for every animated component. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var layout = window.__layout || "layout-desktop", phone = layout === "layout-phone";
  var S = (window.__STATES || {})[layout] || {};
  // each screen size has its own markup; reload if the window crosses a breakpoint
  window.addEventListener("resize", function () {
    var w = window.innerWidth, now = w < 744 ? "layout-phone" : w < 940 ? "layout-tablet" : "layout-desktop";
    if (now !== layout) window.location.reload();
  });

  // Put a component into one of its recorded states.
  function apply(root, st) {
    if (!root || !st) return;
    if (st.cls) root.className = st.cls;
    Object.keys(st.kids).forEach(function (k) {
      var p = k.split("#"), el = root.querySelectorAll("." + p[0])[+p[1] || 0];
      if (!el) return;
      el.className = st.kids[k][0];
      el.setAttribute("style", st.kids[k][1]);
    });
  }
  function hoverable(root, pair, target) {
    if (!root || !pair) return;
    (target || root).addEventListener("mouseenter", function () { apply(root, pair[1]); });
    (target || root).addEventListener("mouseleave", function () { apply(root, pair[0]); });
  }

  /* ---------- scroll-linked: nav, compass needle, hero cards, toolkit columns ---------- */
  var nav = $(".framer-4oaYY"), needle = $(".framer-13prd4q");
  var cards = [
    [$(".framer-11d4yik-container"), 2, -254, -170, -23],
    [$(".framer-1xn3g3i-container"), -11, 111, -425, 24],
    [$(".framer-1kc9msy-container"), 11, 347, -223, 56],
  ].map(function (c) { // keep each card's own centring transform, animate what follows it
    var t = c[0] ? c[0].style.transform : "";
    return c.concat(t.replace(/\s*rotate\([^)]*\)\s*$/, ""));
  });
  var cols = [[$(".framer-87wfsd"), 700], [$(".framer-v3y5vu"), 200], [$(".framer-dehvaw"), 500]];
  var secWork = $("#work"), secStory = $("#personal"), secWall = $("#inspo"), secCta = $("#cta");
  var chapters = [$(".framer-2a0oq4"), $(".framer-dvj1fr"), $(".framer-mpy573")], collage = $(".framer-193imed");
  var ctaBtn = $(".framer-792554-container"), ctaBg = $(".framer-16bsmuj");
  var navState = -1, chapter = 0;
  var top = function (el) { return el ? el.getBoundingClientRect().top + window.scrollY : 1e9; };

  // compass needle: follows the scroll position, and swings a further 24deg on a spring while the logo is hovered
  var scrollDeg = 0, swing = 0, swingV = 0, swingTo = 0, swinging = false, swingT = 0;
  function turnNeedle() { if (needle) needle.style.transform = "rotate(" + (scrollDeg + swing).toFixed(2) + "deg)"; }
  function swingStep(t) {
    var dt = Math.min((t - swingT) / 1000, 0.032), n = Math.ceil(dt / 0.004), h = dt / n;
    swingT = t;
    for (var i = 0; i < n; i++) { swingV += (-2380 * (swing - swingTo) - 29 * swingV) * h; swing += swingV * h; }
    if (Math.abs(swing - swingTo) < 0.05 && Math.abs(swingV) < 0.5) { swing = swingTo; swingV = 0; swinging = false; }
    turnNeedle();
    if (swinging) requestAnimationFrame(swingStep);
  }
  function swingNeedle(to) {
    swingTo = to;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { swing = to; turnNeedle(); return; }
    if (swinging) return;
    swinging = true; swingT = performance.now();
    requestAnimationFrame(swingStep);
  }
  var logo = $(".framer-EL9sb");
  if (logo) {
    logo.addEventListener("mouseenter", function () { swingNeedle(24); });
    logo.addEventListener("mouseleave", function () { swingNeedle(0); });
  }

  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;

    var st = y < 100 ? 0 : y < top(secWork) - 120 ? 1 : y < top(secStory) - 120 ? 2 : y < top(secWall) - 120 ? 3 : y < top(secCta) - 220 ? 4 : 5;
    if (st !== navState && S.nav) { navState = st; apply(nav, S.nav[st]); }
    scrollDeg = max > 0 ? (y / max) * 360 : 0;
    turnNeedle();

    if (!phone) {
      var p = clamp((y - 53) / 780, 0, 1); // hero cards drift apart
      cards.forEach(function (c) {
        if (!c[0]) return;
        c[0].style.transform = c[5] + " translateX(" + (c[2] * p).toFixed(2) + "px) translateY(" + (c[3] * p).toFixed(2) + "px) rotate(" + (c[1] + (c[4] - c[1]) * p).toFixed(3) + "deg)";
      });
      if (secWall) { // toolkit columns slide at different speeds across the section
        var w = clamp((y - (top(secWall) - 220)) / secWall.offsetHeight, 0, 1);
        cols.forEach(function (c) { if (c[0]) c[0].style.transform = "translateY(" + (-c[1] * w).toFixed(2) + "px)"; });
      }
    }

    // closing section: the dark panel rises and the button swings in over the last screen of scroll
    var q = clamp(1 - (max - y) / window.innerHeight, 0, 1);
    if (ctaBtn) ctaBtn.style.transform = "translate(-50%, -50%) translateY(" + (317 * (1 - q)).toFixed(2) + "px) rotate(" + (-50 + 62 * q).toFixed(2) + "deg)";
    if (ctaBg) ctaBg.style.transform = "translateY(" + (-645 * q).toFixed(2) + "px)";

    if (collage && S.collage) {
      var mid = window.innerHeight / 2, best = 0, dist = 1e9;
      chapters.forEach(function (c, i) {
        if (!c) return;
        var r = c.getBoundingClientRect(), dd = Math.abs((r.top + r.bottom) / 2 - mid);
        if (dd < dist) { dist = dd; best = i; }
      });
      if (best !== chapter) { chapter = best; apply(collage, S.collage[best]); }
    }
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; onScroll(); });
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- "How I keep releases on track": list + dial ---------- */
  var acc = $(".framer-i5beM"), dialBase = $(".framer-7b2byk img");
  (S.dial || []).forEach(function (u) { new Image().src = u; });
  [".framer-kw1xu6", ".framer-z8u9v4", ".framer-uge5zi", ".framer-3565ka"].forEach(function (sel, i) {
    var el = $(sel);
    if (!el) return;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    var go = function () {
      apply(acc, S.acc && S.acc[i]);
      if (dialBase && S.dial) dialBase.src = S.dial[i];
    };
    el.addEventListener("click", go);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* ---------- hover states ---------- */
  [".framer-vquiZ", ".framer-LXDKt", ".framer-LMtiT"].forEach(function (sel, i) { hoverable($(sel), S.hero && S.hero[i]); });
  $$(".framer-1suVi").forEach(function (c) { hoverable(c, S.card); });
  hoverable($(".framer-aLlWN"), S.next);
  hoverable($(".framer-792554-container"), S.cta, $(".framer-4VW2L"));

  /* ---------- footer tool names: rotate through five per slot ---------- */
  var slots = $$(".framer-za2WY"), li = 0;
  if (slots.length && S.logos && S.logos.length) {
    setInterval(function () {
      li = (li + 1) % S.logos.length;
      slots.forEach(function (s, j) { setTimeout(function () { apply(s, S.logos[li]); }, j * 160); });
    }, 2200);
  }

  /* ---------- certification card stack: click or drag the top card ---------- */
  var stackBox = $(".framer-1vz82uo-container > div");
  if (stackBox) {
    var order = $$(":scope > div", stackBox), busy = false;
    var layout = function () {
      order.forEach(function (el, d) {
        el.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1), opacity .3s";
        el.style.zIndex = order.length - d;
        el.style.opacity = 1;
        el.style.cursor = d ? "default" : "grab";
        el.style.transform = "translateX(" + 7.5 * d + "px) translateY(" + -8 * d + "px) translateZ(" + -10 * d + "px) scale(" + (1 - 0.05 * d) + ") rotate(" + (-3.5 + 1.875 * d) + "deg)";
      });
    };
    var next = function (dir) {
      if (busy) return;
      busy = true;
      var t = order[0];
      t.style.transition = "transform .35s ease-in, opacity .35s";
      t.style.transform = "translateX(" + (dir || 1) * 70 + "%) translateY(-6%) rotate(" + (dir || 1) * 14 + "deg)";
      t.style.opacity = 0;
      setTimeout(function () { order.push(order.shift()); layout(); busy = false; }, 340);
    };
    var x0 = null, moved = 0;
    stackBox.addEventListener("pointerdown", function (e) { x0 = e.clientX; moved = 0; });
    window.addEventListener("pointermove", function (e) {
      if (x0 === null || busy) return;
      moved = e.clientX - x0;
      order[0].style.transition = "none";
      order[0].style.transform = "translateX(" + moved + "px) rotate(" + (-3.5 + moved / 25) + "deg)";
    });
    window.addEventListener("pointerup", function () {
      if (x0 === null) return;
      x0 = null;
      if (Math.abs(moved) > 60 || Math.abs(moved) < 5) next(moved < 0 ? -1 : 1); else layout();
    });
    stackBox.setAttribute("tabindex", "0");
    stackBox.setAttribute("aria-label", "Certifications. Press Enter for the next one.");
    stackBox.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(1); } });
    stackBox.style.touchAction = "pan-y";
  }

  /* ---------- fade-up on first view ---------- */
  var hidden = $$('[style*="translateY(56px)"]');
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transition = "opacity .7s, transform .7s cubic-bezier(.2,.8,.2,1)";
        e.target.style.opacity = 1;
        e.target.style.transform = "none";
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    hidden.forEach(function (el) { io.observe(el); });
  } else hidden.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
})();
