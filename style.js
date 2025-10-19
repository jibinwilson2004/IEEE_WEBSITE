// Smooth scroll helper
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Counter Animation
function animateCounter(id, endValue) {
  let count = 0;
  const interval = setInterval(() => {
    if (count < endValue) {
      count++;
      document.getElementById(id).textContent = count + "+";
    } else {
      clearInterval(interval);
    }
  }, 20);
}

window.addEventListener("load", () => {
  animateCounter("count-events", 30);
  animateCounter("count-participants", 300);
  animateCounter("count-awards", 6);
});

// FAQ Toggle
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});

