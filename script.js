document.documentElement.classList.add('js');
(() => {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });

  nav?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu?.setAttribute('aria-expanded', 'false');
      nav?.classList.remove('is-open');
    }),
  );

  /* Header follows the material/color chapter instead of floating white over it. */
  const themed = [...document.querySelectorAll('[data-theme]')];
  const updateHeader = () => {
    const y = window.scrollY + 72;
    let theme = 'light';

    for (const section of themed) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const bottom = top + section.offsetHeight;
      if (y >= top && y < bottom) {
        theme = section.dataset.theme || 'light';
        break;
      }
    }

    const bridge = document.querySelector('.structural-transition');
    if (theme === 'light' && bridge) {
      const top = bridge.getBoundingClientRect().top + window.scrollY;
      const bottom = top + bridge.offsetHeight;
      if (y >= top && y < bottom) {
        const local = Math.min(1, Math.max(0, (y - top) / Math.max(1, bridge.offsetHeight - innerHeight)));
        if (local > 0.55) theme = 'black';
      }
    }

    header?.classList.toggle('is-dark', theme === 'dark' || theme === 'black');
    header?.classList.toggle('is-warm', theme === 'warm');
    header?.classList.toggle('is-sage', theme === 'sage');
    header?.classList.toggle('is-lumina', theme === 'lumina');
    header?.classList.toggle('is-sand', theme === 'sand');
    header?.classList.toggle('is-about', theme === 'about');
  };

  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });
  addEventListener('resize', updateHeader);

  /* Work preview switches with a hard spatial shutter, not fade-up typography. */
  const items = [...document.querySelectorAll('[data-preview]')];
  const stages = [...document.querySelectorAll('[data-stage]')];
  const setPreview = (name) => {
    items.forEach((item) => item.classList.toggle('is-active', item.dataset.preview === name));
    stages.forEach((stage) => stage.classList.toggle('is-visible', stage.dataset.stage === name));
  };

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => setPreview(item.dataset.preview));
    item.addEventListener('focus', () => setPreview(item.dataset.preview));
  });

  /* Ponto Comum accessibility demonstration stays interactive. */
  const demo = document.querySelector('[data-ponto-demo]');
  const site = demo?.querySelector('[data-ponto-site]');
  demo?.querySelectorAll('[data-access]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const type = btn.dataset.access;
      if (!site) return;

      if (type === 'reset') {
        site.classList.remove('high-contrast', 'large-text', 'links-on');
        demo.querySelectorAll('button').forEach((button) => button.classList.remove('is-active'));
        return;
      }

      const map = {
        contrast: 'high-contrast',
        text: 'large-text',
        links: 'links-on',
      };
      const className = map[type];
      site.classList.toggle(className);
      btn.classList.toggle('is-active', site.classList.contains(className));
    }),
  );

  /* Hero → Work is one scroll-linked structural split. */
  const structural = document.querySelector('.structural-transition');
  const leftPanel = structural?.querySelector('.structural-transition__panel--left');
  const rightPanel = structural?.querySelector('.structural-transition__panel--right');
  const core = structural?.querySelector('.structural-transition__core');

  const updateStructuralTransition = () => {
    if (!structural || reducedMotion.matches) return;
    const rect = structural.getBoundingClientRect();
    const travel = Math.max(1, structural.offsetHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    const reveal = Math.min(1, progress / 0.075);
    const splitProgress = Math.min(1, Math.max(0, (progress - 0.035) / 0.965));
    const eased = 1 - Math.pow(1 - splitProgress, 3);

    structural.style.setProperty('opacity', String(reveal));
    leftPanel?.style.setProperty('transform', `translate3d(${-101 * eased}%,0,0)`);
    rightPanel?.style.setProperty('transform', `translate3d(${101 * eased}%,0,0)`);
    core?.style.setProperty('transform', `scale(${0.94 + eased * 0.06})`);
  };

  updateStructuralTransition();
  addEventListener('scroll', updateStructuralTransition, { passive: true });
  addEventListener('resize', updateStructuralTransition);

  /* Project navigation behaves like a page change: a material plane crosses the viewport. */
  const projectTransition = document.querySelector('[data-project-transition]');
  const transitionIndex = projectTransition?.querySelector('[data-transition-index]');
  const transitionTitle = projectTransition?.querySelector('[data-transition-title]');
  let transitioning = false;

  const transitionThemes = {
    lumina: { bg: '#d7ddd1', fg: '#10110f', index: '01 / FLAGSHIP', title: 'Lumina Skin' },
    ponto: { bg: '#071f27', fg: '#f4f2e8', index: '02 / ACCESSIBILITY', title: 'Ponto Comum' },
    bella: { bg: '#e6c7ad', fg: '#5f211b', index: '03 / PRODUCT FLOW', title: 'Bella Napoli' },
    inventory: { bg: '#bfcbbd', fg: '#20382f', index: '04 / DATA MODEL', title: 'Inventory System' },
  };

  const jumpWithTransition = (item, event) => {
    if (
      reducedMotion.matches ||
      !projectTransition ||
      transitioning ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const href = item.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    const key = item.dataset.preview;
    const theme = transitionThemes[key];
    if (!target || !theme) return;

    event.preventDefault();
    transitioning = true;
    setPreview(key);

    projectTransition.style.setProperty('--tx-bg', theme.bg);
    projectTransition.style.setProperty('--tx-fg', theme.fg);
    if (transitionIndex) transitionIndex.textContent = theme.index;
    if (transitionTitle) transitionTitle.textContent = theme.title;

    projectTransition.classList.remove('is-exiting');
    projectTransition.classList.add('is-entering');

    window.setTimeout(() => {
      const html = document.documentElement;
      const previousBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, Math.max(0, target.offsetTop - 63));
      history.pushState(null, '', href);
      html.style.scrollBehavior = previousBehavior;
      updateHeader();

      requestAnimationFrame(() => {
        projectTransition.classList.remove('is-entering');
        projectTransition.classList.add('is-exiting');
      });

      window.setTimeout(() => {
        projectTransition.classList.remove('is-exiting');
        transitioning = false;
      }, 560);
    }, 540);
  };

  items.forEach((item) => item.addEventListener('click', (event) => jumpWithTransition(item, event)));

  /* Project-specific surfaces enter by opening/cutting/drawing, never by generic fade-up. */
  const structuralTargets = [
    ...document.querySelectorAll('.lumina-product-split,.architecture,.ponto-demo,.bella-system,.inventory-rulebook'),
  ];

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-structural-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18 },
    );
    structuralTargets.forEach((target) => observer.observe(target));
  } else {
    structuralTargets.forEach((target) => target.classList.add('is-structural-visible'));
  }
})();

/* =========================================================
   V4 FINAL POLISH
   ========================================================= */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  /* Mobile menu can always be dismissed from the keyboard. */
  addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    menu?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    menu?.focus();
  });

  /* The embedded Ponto demo is a demonstration, not page navigation. */
  document.querySelectorAll('.ponto-demo-site a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  /* Header navigation receives section awareness and a chapter-specific accent. */
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const chapterMap = [
    { selector: '#work,#lumina,#ponto,#bella,#inventory', href: '#work', accent: '#b9632f' },
    { selector: '#capabilities', href: '#capabilities', accent: '#5f3922' },
    { selector: '#about', href: '#about', accent: '#485a51' },
    { selector: '#contact', href: '#contact', accent: '#c57640' },
  ];

  const updateNavigationState = () => {
    const y = scrollY + Math.min(innerHeight * 0.32, 260);
    let active = null;

    for (const group of chapterMap) {
      const sections = [...document.querySelectorAll(group.selector)];
      if (sections.some((section) => {
        const top = section.getBoundingClientRect().top + scrollY;
        return y >= top && y < top + section.offsetHeight;
      })) {
        active = group;
        break;
      }
    }

    navLinks.forEach((link) => {
      if (active && link.getAttribute('href') === active.href) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    header?.style.setProperty('--header-accent', active?.accent || '#b9632f');
  };

  updateNavigationState();
  addEventListener('scroll', updateNavigationState, { passive: true });
  addEventListener('resize', updateNavigationState);

  /* Hero responds as one structure, not as independent floating decoration. */
  const hero = document.querySelector('.hero');
  const heroComposition = document.querySelector('[data-hero-composition]');
  const problemWord = document.querySelector('.hero-word--problem');
  const systemWord = document.querySelector('.hero-word--system');
  const axisNode = document.querySelector('.hero-axis b');

  if (hero && heroComposition && !reducedMotion.matches && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      problemWord?.style.setProperty('translate', `${nx * -4}px ${ny * -2}px`);
      systemWord?.style.setProperty('translate', `${nx * 4}px ${ny * 2}px`);
      axisNode?.style.setProperty('margin-left', `${nx * 7}px`);
    });

    hero.addEventListener('pointerleave', () => {
      problemWord?.style.removeProperty('translate');
      systemWord?.style.removeProperty('translate');
      axisNode?.style.removeProperty('margin-left');
    });
  }

  /* A second page-transition grammar for the global navigation.
     Projects keep the material wipe; chapters use a closing horizontal cut. */
  const transition = document.querySelector('[data-section-transition]');
  const transitionTitle = transition?.querySelector('[data-section-title]');
  const transitionIndex = transition?.querySelector('[data-section-index]');
  let sectionTransitioning = false;

  const sectionThemes = {
    work: { bg: '#10120f', fg: '#f0eee7', index: '01 / SELECTED WORK', title: 'Work' },
    capabilities: { bg: '#c8b59a', fg: '#1b1915', index: '05 / EVIDENCE', title: 'Capabilities' },
    about: { bg: '#aeb9b4', fg: '#0d0e0c', index: '07 / PROFILE', title: 'About' },
    contact: { bg: '#0a0d0b', fg: '#f3f1eb', index: '08 / CONTACT', title: 'Contact' },
  };

  const navigateChapter = (link, event) => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#') || href === '#top') return;
    const target = document.querySelector(href);
    const key = href.slice(1);
    const theme = sectionThemes[key];
    if (!target || !theme || !transition || reducedMotion.matches || sectionTransitioning) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (typeof event.button === 'number' && event.button !== 0)) return;

    event.preventDefault();
    sectionTransitioning = true;
    transition.style.setProperty('--st-bg', theme.bg);
    transition.style.setProperty('--st-fg', theme.fg);
    if (transitionTitle) transitionTitle.textContent = theme.title;
    if (transitionIndex) transitionIndex.textContent = theme.index;

    transition.classList.remove('is-exiting');
    transition.classList.add('is-entering');

    setTimeout(() => {
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      scrollTo(0, Math.max(0, target.offsetTop - 67));
      history.pushState(null, '', href);
      document.documentElement.style.scrollBehavior = previous;
      updateNavigationState();

      requestAnimationFrame(() => {
        transition.classList.remove('is-entering');
        transition.classList.add('is-exiting');
      });

      setTimeout(() => {
        transition.classList.remove('is-exiting');
        sectionTransitioning = false;
      }, 440);
    }, 390);
  };

  navLinks.forEach((link) => link.addEventListener('click', (event) => navigateChapter(link, event)));

  /* Process thread reacts to the idea currently being inspected. */
  const processItems = [...document.querySelectorAll('.process-track li')];
  const processNode = document.querySelector('.process-thread b');
  processItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      if (!processNode || reducedMotion.matches) return;
      processNode.style.animation = 'none';
      processNode.style.left = `${processItems.length > 1 ? (index / (processItems.length - 1)) * 95 : 0}%`;
    });
    item.addEventListener('mouseleave', () => {
      if (!processNode || reducedMotion.matches) return;
      processNode.style.removeProperty('left');
      processNode.style.removeProperty('animation');
    });
  });
})();


/* =========================================================
   V5 INTERACTIONS
   ========================================================= */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* Lumina system microscope: real paths are traceable by hover/tap. */
  const lab = document.querySelector('[data-architecture]');
  if (lab) {
    const packet = lab.querySelector('[data-arch-packet]');
    const paths = Object.fromEntries(
      [...lab.querySelectorAll('[data-arch-path]')].map((path) => [path.dataset.archPath, path]),
    );
    const nodes = [...lab.querySelectorAll('[data-arch-node]')];
    const readIndex = lab.querySelector('[data-arch-index]');
    const readTitle = lab.querySelector('[data-arch-title]');
    const readCopy = lab.querySelector('[data-arch-copy]');

    const routes = {
      public: {
        index: '01 / INPUT', title: 'Public UI',
        copy: 'A user request enters through the React / TypeScript interface and is sent to the FastAPI core.',
        paths: ['public-api', 'api-rules', 'rules-output'],
      },
      admin: {
        index: '02 / OPERATIONS', title: 'Skin Admin',
        copy: 'The operational client reaches the same API core without sharing frontend state with the public experience.',
        paths: ['admin-api', 'api-rules', 'rules-output'],
      },
      api: {
        index: '03 / CORE', title: 'FastAPI',
        copy: 'FastAPI is the product boundary: validation, orchestration and service rules stay centralized here.',
        paths: ['api-ai', 'api-rules', 'api-data'],
      },
      ai: {
        index: '04 / INTERPRETATION', title: 'AI providers',
        copy: 'Generative models interpret unstructured photo or text and return structured profile information.',
        paths: ['api-ai', 'ai-rules', 'rules-output'],
      },
      rules: {
        index: '05 / DECISION', title: 'Deterministic rules',
        copy: 'Compatibility is decided in testable backend rules after the probabilistic interpretation step.',
        paths: ['api-rules', 'rules-output'],
      },
      data: {
        index: '06 / STATE', title: 'SQLite',
        copy: 'Product, media and application state remain available to the API independently of the AI provider.',
        paths: ['api-data', 'data-output'],
      },
      output: {
        index: '07 / RESULT', title: 'Compatible products',
        copy: 'The output is a ranked and explainable product set produced from structured profile data and backend rules.',
        paths: ['rules-output', 'data-output'],
      },
    };

    let animationToken = 0;
    let activeKey = 'public';
    let timer = null;
    let userLocked = false;
    const cycle = ['public', 'api', 'ai', 'rules', 'data', 'output', 'admin'];

    const moveAlongPath = (path, duration, token) => new Promise((resolve) => {
      if (!path || !packet || reducedMotion.matches || token !== animationToken) return resolve();
      const total = path.getTotalLength();
      const start = performance.now();
      packet.classList.add('is-moving');

      const tick = (now) => {
        if (token !== animationToken) return resolve();
        const t = Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const point = path.getPointAtLength(total * eased);
        packet.setAttribute('cx', point.x);
        packet.setAttribute('cy', point.y);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    const trace = async (key, shouldAnimate = true) => {
      const route = routes[key];
      if (!route) return;
      activeKey = key;
      animationToken += 1;
      const token = animationToken;

      nodes.forEach((node) => {
        const active = node.dataset.archNode === key;
        node.classList.toggle('is-active', active);
        node.classList.toggle('is-dim', !active);
      });

      Object.values(paths).forEach((path) => {
        path.classList.add('is-muted');
        path.classList.remove('is-hot');
      });
      route.paths.forEach((name) => {
        paths[name]?.classList.remove('is-muted');
        paths[name]?.classList.add('is-hot');
      });

      if (readIndex) readIndex.textContent = route.index;
      if (readTitle) readTitle.textContent = route.title;
      if (readCopy) readCopy.textContent = route.copy;

      if (!packet) return;
      packet.classList.remove('is-moving');
      if (!shouldAnimate || reducedMotion.matches) return;
      for (const name of route.paths) {
        if (token !== animationToken) break;
        await moveAlongPath(paths[name], 520, token);
      }
      if (token === animationToken) {
        setTimeout(() => {
          if (token === animationToken) packet.classList.remove('is-moving');
        }, 180);
      }
    };

    const stopAuto = () => { if (timer) clearInterval(timer); timer = null; };
    const startAuto = () => {
      stopAuto();
      if (reducedMotion.matches || userLocked) return;
      timer = setInterval(() => {
        const next = cycle[(cycle.indexOf(activeKey) + 1) % cycle.length];
        trace(next);
      }, 4300);
    };

    nodes.forEach((node) => {
      const key = node.dataset.archNode;
      const inspect = () => { userLocked = true; stopAuto(); trace(key); };
      node.addEventListener('mouseenter', inspect);
      node.addEventListener('focus', inspect);
      node.addEventListener('click', inspect);
    });

    trace('public', false);
    startAuto();
  }

  /* Stack is an evidence navigator, not a static logo wall. */
  const stackLab = document.querySelector('[data-stack-lab]');
  if (stackLab) {
    const items = [...stackLab.querySelectorAll('.stack-item')];
    const kind = stackLab.querySelector('[data-stack-kind]');
    const name = stackLab.querySelector('[data-stack-name]');
    const copy = stackLab.querySelector('[data-stack-copy]');
    const proof = stackLab.querySelector('[data-stack-proof]');

    const activate = (item) => {
      items.forEach((entry) => entry.classList.toggle('is-active', entry === item));
      if (kind) kind.textContent = item.dataset.stackKind || '';
      if (name) name.textContent = item.dataset.stackName || '';
      if (copy) copy.textContent = item.dataset.stackCopy || '';
      if (proof) proof.textContent = item.dataset.stackProof || '';
    };

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => activate(item));
      item.addEventListener('focus', () => activate(item));
      item.addEventListener('click', () => activate(item));
    });
  }
})();
