(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  $("#year").textContent = new Date().getFullYear();

  // Accordion + dial
  var items = $$(".acc-i"), nums = $$(".dial-box .n"), dial = $("#dial");
  var angles = [225, 315, 405, 495];
  function pick(i) {
    items.forEach(function (el, k) {
      el.classList.toggle("on", k === i);
      el.querySelector("button").setAttribute("aria-selected", k === i);
      nums[k].classList.toggle("on", k === i);
    });
    dial.style.transform = "rotate(" + angles[i] + "deg)";
  }
  items.forEach(function (el, i) {
    el.querySelector("button").addEventListener("click", function () { pick(i); });
  });
  pick(0);

  // Certification stack
  var certs = [
    ["PMI", "Project Management Professional (PMP)®. Formally evaluated for experience, knowledge and performance in defining and overseeing projects and resources.", "Project Management Institute", "Granted 22 Nov 2024 · Valid through 22 Nov 2027"],
    ["CSM", "Certified ScrumMaster® (CSM). Awarded for completing the prescribed requirements for Scrum Alliance certification.", "Scrum Alliance", "Awarded 6 Sep 2026 · Active through 6 Sep 2028"],
    ["G", "Google Project Management Professional Certificate.", "Google Career Certificates", "Professional certificate"],
    ["10P", "Managing Agile Scrum Projects with Jira.", "10 Pearls University", "Course certificate"],
    ["ML", "Machine Learning Specialization.", "Stanford University and DeepLearning.AI", "Specialization"],
    ["NLP", "Natural Language Processing Specialization.", "DeepLearning.AI", "Specialization"]
  ];
  var ci = 0, stack = $("#stack"), top = stack.querySelector(".s1");
  function next() {
    top.classList.add("flip");
    setTimeout(function () {
      ci = (ci + 1) % certs.length;
      var c = certs[ci];
      $("#cav").textContent = c[0]; $("#cq").textContent = c[1];
      $("#cn").textContent = c[2]; $("#cm").textContent = c[3];
      $("#ci").textContent = ci + 1;
      top.classList.remove("flip");
    }, 260);
  }
  stack.addEventListener("click", next);
  stack.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
  });

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    $$(".stats > div, .co, .tk, .chapters article, .needle, .stack").forEach(function (el) {
      el.classList.add("rv"); io.observe(el);
    });
  }
})();
