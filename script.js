/* ═══════════════════════════════════════════════════
   WALTER GONZAGA — PORTFÓLIO
   script.js

   FUNCIONALIDADES:
   1. Cursor glow que segue o mouse
   2. Navbar: scroll detection (adiciona classe .scrolled)
   3. Typed text: efeito de digitação no hero
   4. Reveal on scroll: Intersection Observer para animações
   5. Hamburger menu mobile
   6. Active nav link on scroll
   7. Footer: ano dinâmico
   8. Smooth scroll para links âncora
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────
   1. CURSOR GLOW
   Segue o mouse com delay suave para efeito premium
───────────────────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Não mostrar em dispositivos touch
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let isVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      glow.style.opacity = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    isVisible = false;
  });

  // Animação com lerp (linear interpolation) para suavidade
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';

    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();


/* ─────────────────────────────────────────────────
   2. NAVBAR SCROLL
   Adiciona .scrolled ao passar de 50px
───────────────────────────────────────────────── */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const threshold = 50;

  function handleScroll() {
    if (window.scrollY > threshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Estado inicial
})();


/* ─────────────────────────────────────────────────
   3. TYPED TEXT
   Efeito de digitação com múltiplas strings
   Para alterar os textos, edite o array STRINGS
───────────────────────────────────────────────── */
(function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // ↓↓ EDITE AQUI as frases que serão digitadas ↓↓
  const STRINGS = [
    'Engenheiro de Dados',
    'Arquiteto de Dados',
    'Especialista em Azure',
    'Criador de Conteúdo',
    'Community Builder',
  ];

  const TYPING_SPEED   = 70;   // ms por caractere ao digitar
  const DELETING_SPEED = 35;   // ms por caractere ao apagar
  const PAUSE_AFTER    = 1800; // ms após digitar a string completa
  const PAUSE_BEFORE   = 400;  // ms antes de começar a apagar

  let stringIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() {
    const current = STRINGS[stringIndex];

    if (isDeleting) {
      // Apagando
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Digitando
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Chegou ao fim — pausa e começa a apagar
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Apagou tudo — troca string
      isDeleting = false;
      stringIndex = (stringIndex + 1) % STRINGS.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800); // Delay inicial para deixar o hero "respirar"
})();


/* ─────────────────────────────────────────────────
   4. REVEAL ON SCROLL
   Intersection Observer para animar elementos .reveal
───────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Opcional: para de observar após revelar (melhor performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,      // 10% do elemento visível já dispara
      rootMargin: '0px 0px -60px 0px', // Antecipa um pouco a animação
    }
  );

  elements.forEach((el) => observer.observe(el));

  // Revela imediatamente elementos já visíveis (acima do fold)
  function revealVisible() {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });
  }
  revealVisible();
})();


/* ─────────────────────────────────────────────────
   5. HAMBURGER MENU MOBILE
───────────────────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  function openMenu() {
    btn.classList.add('active');
    links.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('active');
    links.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    if (links.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fecha ao clicar em um link
  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
  });
})();


/* ─────────────────────────────────────────────────
   6. ACTIVE NAV LINK ON SCROLL
   Destaca o link de navegação correspondente à seção visível
───────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // CSS para o estado ativo (injetado via JS para manter CSS limpo)
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--text-primary) !important;
      background: rgba(56, 189, 248, 0.08);
    }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────────
   7. ANO DINÂMICO NO FOOTER
───────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─────────────────────────────────────────────────
   8. SMOOTH SCROLL PARA ÂNCORAS
   Com suporte a navegadores que não implementam
   scroll-behavior: smooth nativamente
───────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
})();


/* ─────────────────────────────────────────────────
   9. CARDS DE PROJETO — Hover efeito de paralaxe leve
   Efeito 3D sutil nos cards ao mover o mouse
───────────────────────────────────────────────── */
(function initCardParallax() {
  const cards = document.querySelectorAll('.projeto-card');
  if (!cards.length) return;

  // Não aplica em touch
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;

      card.style.transform = `translateY(-6px) rotateX(${y * 0.4}deg) rotateY(${x * 0.4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


/* ─────────────────────────────────────────────────
   10. PREFERS REDUCED MOTION
   Respeita a preferência do sistema operacional
   por animações reduzidas (acessibilidade)
───────────────────────────────────────────────── */
(function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Revela todos os elementos imediatamente sem animação
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.transition = 'none';
      el.classList.add('visible');
    });

    // Para o cursor glow
    const glow = document.getElementById('cursorGlow');
    if (glow) glow.style.display = 'none';
  }
})();
