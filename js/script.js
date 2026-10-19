
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
