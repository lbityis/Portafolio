
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");

const giantStar = document.getElementById("giantStar");
const progressBar = document.getElementById("progressBar");
const sectionCounter = document.getElementById("sectionCounter");
const toast = document.getElementById("toast");

let currentIndex = 0;
let toastTimeout;

// CAMBIO DE SECCIONES Y GIRO DE LA ESTRELLA
function changeSection(index) {
  currentIndex = index;

  const selectedItem = navItems[index];
  const sectionId = selectedItem.dataset.section;

  navItems.forEach((item, i) => {
    const isActive = i === index;

    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  panels.forEach(panel => {
    panel.classList.toggle("active", panel.id === sectionId);
  });

  // Mantiene la estrella original y la hace girar.
  giantStar.style.transform =
    `translateY(-50%) rotate(${index * 72}deg)`;

  // Actualiza el indicador de progreso.
  const progress = ((index + 1) / navItems.length) * 100;

  progressBar.style.width = `${progress}%`;

  sectionCounter.textContent =
    `${String(index + 1).padStart(2, "0")} / ` +
    `${String(navItems.length).padStart(2, "0")}`;
}

// NAVEGACIÓN MEDIANTE LOS BOTONES
navItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    changeSection(index);
  });
});

// NAVEGACIÓN MEDIANTE EL TECLADO
document.addEventListener("keydown", event => {
  if (event.target.matches("input, textarea")) return;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    changeSection((currentIndex + 1) % navItems.length);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    changeSection(
      (currentIndex - 1 + navItems.length) % navItems.length
    );
  }
});

// NOTIFICACIONES FLOTANTES
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// COPIAR CORREO
const copyButton = document.getElementById("copyEmail");

copyButton.addEventListener("click", async () => {
  const email = document
    .getElementById("emailText")
    .textContent.trim();

  try {
    await navigator.clipboard.writeText(email);
    showToast("¡Correo copiado! ♡");
  } catch (error) {
    showToast("Tu correo es: " + email);
  }
});

// FILTRAR PROYECTOS
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });

    projectCards.forEach(card => {
      const category = card.dataset.category;

      const shouldShow =
        selectedFilter === "todos" ||
        category === selectedFilter;

      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

// ENLACES DE DEMOSTRACIÓN AÚN NO CONFIGURADOS
document.querySelectorAll(".demo-link").forEach(link => {
  link.addEventListener("click", event => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
      showToast("Agrega el enlace real de tu proyecto ✧");
    }
  });
});

// AÑO AUTOMÁTICO
document.getElementById("year").textContent =
  new Date().getFullYear();

// INICIAR EN LA PRIMERA SECCIÓN
changeSection(0);

// =========================================================
// EXTRAS: se carga DESPUÉS de script.js
// =========================================================
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- 1. Efecto máquina de escribir en el subtítulo ----------
  const subtitle = document.querySelector(".subtitle");

  if (subtitle) {
    const heart = subtitle.querySelector("span");
    const fullText = "Desarrolladora web en formación ";

    if (reduceMotion) {
      // Sin animación: se deja el texto original
    } else {
      subtitle.textContent = "";

      const typed = document.createElement("span");
      typed.className = "typed";
      typed.style.color = "inherit";
      typed.style.fontSize = "inherit";

      subtitle.append(typed, heart);
      heart.style.opacity = "0";
      heart.style.transition = "opacity .4s";

      let i = 0;
      const type = () => {
        typed.textContent = fullText.slice(0, ++i);
        if (i < fullText.length) {
          setTimeout(type, 55 + Math.random() * 45);
        } else {
          typed.classList.add("done");
          heart.style.opacity = "1";
        }
      };

      setTimeout(type, 700);
    }
  }

  // ---------- 2. Inclinación 3D en imágenes grandes ----------
  if (finePointer && !reduceMotion) {
    document
      .querySelectorAll(".profile-photo, .contact-illustration")
      .forEach(el => {
        el.addEventListener("pointermove", event => {
          const rect = el.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          el.style.transform =
            `perspective(900px) rotateY(${x * 9}deg) ` +
            `rotateX(${-y * 9}deg) scale(1.015)`;
        });

        el.addEventListener("pointerleave", () => {
          el.style.transform = "";
        });
      });
  }

  // ---------- 3. Rastro de brillos que sigue al cursor ----------
  if (finePointer && !reduceMotion) {
    const glyphs = ["✦", "✧", "♡", "✿"];
    let lastTime = 0;

    document.addEventListener("pointermove", event => {
      const now = performance.now();
      if (now - lastTime < 70) return;
      lastTime = now;

      const spark = document.createElement("span");
      spark.className = "trail";
      spark.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty("--dx", `${Math.random() * 44 - 22}px`);
      spark.style.setProperty("--size", `${10 + Math.random() * 10}px`);

      document.body.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove());
    });
  }

  // ---------- 4. Al cambiar de sección, volver arriba suavemente ----------
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isSmall = window.innerWidth < 650;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = list => list[Math.floor(Math.random() * list.length)];

  const glyphs = ["✦", "✧", "♡", "✿", "❀", "✩", "⋆", "✺"];
  const colors = ["#ec6eaa", "#f6a0c6", "#cf3e85", "#f4b2d0", "#d9a8f0", "#ffb3a7", "#e88db7"];
  const dotColors = ["#f6a0c6", "#ec6eaa", "#d9a8f0", "#ffcfb8", "#f4b2d0"];

  // ---------- Capas de fondo ----------
  const blobs = document.createElement("div");
  blobs.className = "bg-blobs";
  blobs.setAttribute("aria-hidden", "true");
  blobs.innerHTML =
    '<span class="blob blob-1"></span>' +
    '<span class="blob blob-2"></span>' +
    '<span class="blob blob-3"></span>';

  const scene = document.createElement("div");
  scene.className = "bg-scene";
  scene.setAttribute("aria-hidden", "true");

  scene.innerHTML = `
    <svg class="bg-squiggle sq-1" viewBox="0 0 1200 200" preserveAspectRatio="none">
      <path d="M0 100 Q150 0 300 100 T600 100 T900 100 T1200 100"/>
    </svg>
    <svg class="bg-squiggle sq-2" viewBox="0 0 1200 200" preserveAspectRatio="none">
      <path d="M0 100 Q150 200 300 100 T600 100 T900 100 T1200 100"/>
    </svg>
    <span class="bg-big bg-big-flower">✿</span>
    <span class="bg-big bg-big-heart">♡</span>
  `;

  // ---------- Brillos y símbolos ----------
  const glyphCount = isSmall ? 16 : 34;

  for (let i = 0; i < glyphCount; i++) {
    const el = document.createElement("span");
    el.className = "bg-glyph";
    el.textContent = pick(glyphs);

    el.style.left = `${rand(1, 97)}%`;
    el.style.top = `${rand(2, 94)}%`;
    el.style.fontSize = `${rand(11, 36)}px`;
    el.style.color = pick(colors);

    el.style.setProperty("--anim", Math.random() > 0.5 ? "bg-twinkle" : "bg-float");
    el.style.setProperty("--dur", `${rand(3.5, 8)}s`);
    el.style.setProperty("--delay", `-${rand(0, 8)}s`);
    el.style.setProperty("--depth", `${(Math.random() > 0.5 ? 1 : -1) * rand(5, 28)}`);

    scene.appendChild(el);
  }

  // ---------- Puntitos de confeti ----------
  const dotCount = isSmall ? 10 : 24;

  for (let i = 0; i < dotCount; i++) {
    const el = document.createElement("span");
    el.className = "bg-dot";

    const size = rand(4, 11);
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${rand(1, 98)}%`;
    el.style.top = `${rand(2, 96)}%`;
    el.style.background = pick(dotColors);

    el.style.setProperty("--dur", `${rand(3, 7)}s`);
    el.style.setProperty("--delay", `-${rand(0, 7)}s`);
    el.style.setProperty("--depth", `${(Math.random() > 0.5 ? 1 : -1) * rand(4, 18)}`);

    scene.appendChild(el);
  }

  // ---------- Corazones y flores que suben ----------
  if (!reduceMotion) {
    const riseCount = isSmall ? 6 : 14;
    const riseGlyphs = ["♡", "✦", "✿", "❤", "✧"];

    for (let i = 0; i < riseCount; i++) {
      const el = document.createElement("span");
      el.className = "bg-rise";
      el.textContent = pick(riseGlyphs);

      el.style.left = `${rand(0, 98)}%`;
      el.style.fontSize = `${rand(12, 26)}px`;
      el.style.color = pick(colors);
      el.style.animationDuration = `${rand(16, 32)}s`;
      el.style.animationDelay = `-${rand(0, 30)}s`;
      el.style.setProperty("--sway", `${rand(-45, 45)}px`);

      scene.appendChild(el);
    }
  }

  document.body.prepend(blobs, scene);

  // ---------- Parallax suave con el mouse ----------
  if (finePointer && !reduceMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      scene.style.setProperty("--px", currentX.toFixed(3));
      scene.style.setProperty("--py", currentY.toFixed(3));

      const moving =
        Math.abs(targetX - currentX) > 0.002 ||
        Math.abs(targetY - currentY) > 0.002;

      if (moving) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    window.addEventListener("pointermove", event => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;

      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    });
  }

  // ---------- Cinta con texto en movimiento ----------
  const footer = document.querySelector(".footer");

  if (footer) {
    const words = [
      "✦ CREATIVIDAD", "♡ CÓDIGO", "✿ CURIOSIDAD", "✧ APRENDIZAJE",
      "♡ HTML", "✦ CSS", "✿ JAVASCRIPT", "✧ IDEAS"
    ];

    const group = words.map(word => `<span>${word}</span>`).join("").repeat(2);

    const ribbon = document.createElement("div");
    ribbon.className = "ribbon";
    ribbon.setAttribute("aria-hidden", "true");
    ribbon.innerHTML = `<div class="ribbon-track">${group}${group}</div>`;

    footer.before(ribbon);
  }
})();