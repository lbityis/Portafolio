
// ======================================================
// ✧ PORTAFOLIO DE ELISA SOTO · FUNCIONES INTERACTIVAS ✧
// ======================================================

// Elementos principales
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");
const progressBar = document.getElementById("progressBar");
const sectionCounter = document.getElementById("sectionCounter");
const toast = document.getElementById("toast");

let currentIndex = 0;
let toastTimeout;
let previousIndex = 0;
let starRotation = 0;

// ======================================================
// ♡ NAVEGACIÓN ENTRE LAS CINCO SECCIONES
// ======================================================

function changeSection(index) {
  if (!navItems.length || !panels.length) return;

  // Guardar la sección anterior para saber hacia dónde girar la estrella
  previousIndex = currentIndex;

  // Actualizar sección seleccionada
  currentIndex = (index + navItems.length) % navItems.length;

  const selectedItem = navItems[currentIndex];
  const sectionId = selectedItem.dataset.section;

  // Activar el botón seleccionado
  navItems.forEach((item, i) => {
    const active = i === currentIndex;

    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });

  // Mostrar solamente la sección correspondiente
  panels.forEach(panel => {
    panel.classList.toggle("active", panel.id === sectionId);
  });

  // Actualizar barra de progreso
  const progress = ((currentIndex + 1) / navItems.length) * 100;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  // Actualizar contador de secciones
  if (sectionCounter) {
    sectionCounter.textContent =
      `${String(currentIndex + 1).padStart(2, "0")} / ${String(navItems.length).padStart(2, "0")}`;
  }

  // ==================================================
  // ✨ HACER GIRAR LA ESTRELLA AL CAMBIAR DE SECCIÓN
  // ==================================================

  const mainStar = document.querySelector(".hero-star");

  if (mainStar) {
    // Girar hacia la derecha si avanzas y hacia la izquierda si retrocedes.
    // Gira 90° cada vez: la estrella pasa de derecha a "dormida" (acostada),
    // luego de cabeza, y así se nota claramente el giro.
    const direction = currentIndex >= previousIndex ? 1 : -1;

    if (currentIndex !== previousIndex) {
      starRotation += direction * 360;
    }

    mainStar.style.transform = `translate(-50%, -50%) rotate(${starRotation}deg)`;
  }

  previousIndex = currentIndex;

  // En celulares, volver al inicio del contenido
  if (window.innerWidth <= 760) {
    document.querySelector(".main-layout")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

// Eventos de los botones del menú
navItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    changeSection(index);
  });
});

// Navegación con las flechas del teclado
document.addEventListener("keydown", event => {
  if (!navItems.length) return;

  // Evitar interferir con otros controles
  if (event.target.matches("input, textarea, button, a")) return;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    changeSection(currentIndex + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    changeSection(currentIndex - 1);
  }
});

// ======================================================
// ✧ MENSAJES FLOTANTES
// ======================================================

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// ======================================================
// ♡ COPIAR CORREO ELECTRÓNICO
// ======================================================

const copyButton = document.getElementById("copyEmail");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const email = document
      .getElementById("emailText")
      ?.textContent.trim();

    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);

      showToast("¡Correo copiado correctamente! ♡");

    } catch (error) {
      showToast("Mi correo es: " + email);
    }
  });
}

// ======================================================
// ✧ INFORMACIÓN DEL COMPUTADOR INTERACTIVO
// ======================================================

const skillInfo = {

  bienvenida: {
    title: "¡Hola, bienvenida!",
    description: "Selecciona una tecnología en el panel para descubrir cómo la utilizo en mis proyectos."
  },

  html: {
    title: "HTML · Estructura",
    description: "Utilizo HTML para estructurar páginas: títulos, párrafos, imágenes, enlaces, formularios y secciones."
  },

  css: {
    title: "CSS · Diseño visual",
    description: "Con CSS doy estilo a los sitios web: colores, tipografías, distribuciones, animaciones y diseños adaptables a distintos dispositivos."
  },

  javascript: {
    title: "JavaScript · Interacción",
    description: "Me permite agregar funciones a una página, responder a clics, validar información, modificar elementos y crear experiencias dinámicas."
  },

  python: {
    title: "Python · Programación",
    description: "Lo utilizo para practicar lógica, crear funciones, trabajar con datos y desarrollar la parte del servidor."
  },

  flask: {
    title: "Flask · Aplicaciones web",
    description: "Es un framework de Python que permite crear aplicaciones web, definir rutas y conectar el frontend con la lógica del servidor. Con él también trabajo con Jinja2 para las plantillas, PyMySQL para conectar con la base de datos, Flask-Bcrypt para proteger contraseñas y Pipenv para administrar los paquetes del proyecto."
  },

  mysql: {
    title: "MySQL · Bases de datos",
    description: "Permite almacenar y organizar información mediante tablas, relaciones y consultas SQL."
  },

  git: {
    title: "Git y GitHub · Versiones",
    description: "Uso Git para llevar el control de los cambios y GitHub para guardar repositorios y compartir mis proyectos."
  }
};

// Elementos del computador
const skillButtons = document.querySelectorAll(".skill-button");
const skillTitle = document.getElementById("skillTitle");
const skillDescription = document.getElementById("skillDescription");

// Cambiar información al seleccionar una tecnología
skillButtons.forEach(button => {
  button.addEventListener("click", () => {
    const info = skillInfo[button.dataset.skill];

    if (!info) return;

    // Marcar botón seleccionado
    skillButtons.forEach(item => {
      item.classList.toggle("selected", item === button);
    });

    // Actualizar título
    if (skillTitle) {
      skillTitle.textContent = info.title;
    }

    // Actualizar descripción
    if (skillDescription) {
      skillDescription.textContent = info.description;
    }
  });
});

// ======================================================
// ♡ AÑO AUTOMÁTICO DEL FOOTER
// ======================================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// ======================================================
// ✧ INICIAR PORTAFOLIO EN LA PRIMERA SECCIÓN
// ======================================================

changeSection(0);

// ======================================================
// ✨ DESTELLOS QUE SIGUEN EL CURSOR
// Solo funcionan en dispositivos con mouse.
// ======================================================

(() => {

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  // No activar en celulares ni si el usuario
  // prefiere reducir las animaciones
  if (!finePointer || reduceMotion) return;

  const symbols = ["✦", "✧", "♡", "⋆", "❀", "♥", "✩"];
  let lastTime = 0;

  document.addEventListener("pointermove", event => {

    const now = performance.now();

    // Evitar crear demasiados destellos
    if (now - lastTime < 120) return;

    lastTime = now;

    const sparkle = document.createElement("span");

    sparkle.className = "cursor-sparkle";

    sparkle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;

    // Tamaño y tono rosado aleatorio para más brillo
    sparkle.style.fontSize = `${10 + Math.random() * 12}px`;
    sparkle.style.color = ["#ff6fae", "#ff9cc9", "#f7a8d0", "#e0569b"][Math.floor(Math.random() * 4)];

    document.body.appendChild(sparkle);

    // Eliminar el destello al terminar su animación
    sparkle.addEventListener("animationend", () => {
      sparkle.remove();
    });

  });

})();

// ✿ Muchos stickers rosados de fondo
(function(){
  const box=document.querySelector(".mas-stickers"); if(!box) return;
  const simbolos=["♡","✿","✦","☁","❀","✧","🎀","☆","♥","⋆","˚","✩","❁","｡"];
  for(let i=0;i<60;i++){
    const s=document.createElement("span");
    s.textContent=simbolos[i%simbolos.length];
    s.style.left=Math.random()*100+"vw"; s.style.top=Math.random()*100+"vh";
    s.style.fontSize=(14+Math.random()*26)+"px";
    s.style.animationDelay=(-Math.random()*8)+"s";
    s.style.animationDuration=(6+Math.random()*6)+"s";
    box.appendChild(s);
  }
})();
