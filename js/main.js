// TechBlanc interactions
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");
  if (toggle && menu) {
    const setExpanded = (state) =>
      toggle.setAttribute("aria-expanded", String(state));
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      const open = menu.classList.contains("open");
      setExpanded(open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      if (!e.target.closest(".nav") && !e.target.closest(".nav-toggle")) {
        menu.classList.remove("open");
      }
    });
    $$(".nav-link").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open"))
    );
  }

  // Highlight current nav link
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Smooth scroll
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  $$("[data-animate]").forEach((el) => observer.observe(el));

  // Counter animation
  const counters = $$(".counter");
  if (counters.length) {
    const animateCounter = (el) => {
      const target = Number(el.dataset.to || 0);
      const suffix = el.dataset.suffix || "";
      const durationMs = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value + (progress >= 1 ? suffix : "");
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => io.observe(c));
  }

  // 3D Tilt
  const cards = $$(".tilt");
  if (cards.length) {
    const maxDeg = 16;
    cards.forEach((card) => {
      let rect;
      const move = (e) => {
        rect = rect || card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * maxDeg * 2;
        const ry = (x - 0.5) * maxDeg * 2;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      };
      const leave = () => {
        rect = undefined;
        card.style.transform = "";
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
    });
  }

  // Parallax
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length) {
    const onScroll = () => {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        const intensity = Number(el.getAttribute("data-parallax")) || 30;
        el.style.transform = `translateY(${Math.round(y / intensity)}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Portfolio filter
  const grid = $("#portfolioGrid");
  if (grid) {
    const buttons = $$(".filter-btn");
    const cards = $$(".project-card", grid);
    const applyFilter = (cat) => {
      cards.forEach((card) => {
        card.style.display =
          cat === "all" || card.dataset.category === cat ? "" : "none";
      });
    };
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        buttons.forEach((b) => b.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        applyFilter(btn.dataset.filter);
      });
    });
  }

  // Contact form
  const form = $("#contactForm");
  if (form) {
    const name = $("#name");
    const email = $("#email");
    const message = $("#message");
    const success = $("#formSuccess");

    // Your actual EmailJS credentials
    const SERVICE_ID = "service_0iodjev";
    const TEMPLATE_ID = "template_qsz041x";
    const PUBLIC_KEY = "jrS5B2zwA0v_DAj4v";
    date: new Date().toLocaleString();

    const setError = (el, msg) => {
      const small = $("#" + el.id + "Error");
      small.textContent = msg || "";
      el.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;

      if (!name.value.trim()) {
        setError(name, "Please enter your name");
        valid = false;
      } else setError(name, "");

      if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError(email, "Please enter a valid email");
        valid = false;
      } else setError(email, "");

      if (!message.value.trim()) {
        setError(message, "Please include a message");
        valid = false;
      } else setError(message, "");

      if (!valid) return;

      try {
        emailjs.init(PUBLIC_KEY);
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          from_name: name.value,
          reply_to: email.value,
          message: message.value,
        });
        success.hidden = false;
        form.reset();
      } catch (err) {
        alert("Failed to send message. Check EmailJS settings.");
        console.error(err);
      }
    });
  }

  // Newsletter
  const newsletterForm = $(".newsletter");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#newsletter-email");
      if (input && input.value) {
        alert("Subscribed: " + input.value);
        input.value = "";
      }
    });
  }

  // Pricing toggle
  const toggleWrap = document.querySelector(".billing-toggle");
  if (toggleWrap) {
    const buttons = Array.from(toggleWrap.querySelectorAll(".toggle-btn"));
    const prices = Array.from(document.querySelectorAll(".price"));
    const setMode = (mode) => {
      buttons.forEach((b) =>
        b.classList.toggle("active", b.dataset.mode === mode)
      );
      prices.forEach((p) => {
        const text = p.getAttribute(`data-${mode}`);
        if (text) p.textContent = text;
      });
    };
    buttons.forEach((b) =>
      b.addEventListener("click", () => setMode(b.dataset.mode))
    );
    setMode("project");
  }
})();
