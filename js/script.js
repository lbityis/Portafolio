
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