(function () {
  'use strict';

  var STORAGE_KEY = 'trimble-prototype-sandbox';
  var ACTIVE_FEATURE = 'DXPBK-1321';
  var VALID_UPSELL = ['3-cards', '2-cards', '1-card', '0-cards'];
  var VALID_CARD_TYPES = ['generic-plp', 'product-pdp'];
  var VALID_MATRIX = [
    'optimal',
    'saas-heavy',
    'saas-ext',
    'saas-learn',
    'ext-heavy',
    'pure-ext',
    'enablement',
    'pure-learn',
  ];
  var DESKTOP_GRID_COLUMNS = 'repeat(3, minmax(0, 1fr))';
  var OWNER_ROLES = ['account-owner', 'secondary-owner', 'license-admin'];

  var GENERIC_PLP_CARDS = [
    {
      eyebrow: 'TRIMBLE SOFTWARE',
      title: 'Explore Software & Add-Ons',
      description:
        'Expand your operational workflows with specialized cloud solutions, seat expansion options, and premium modules.',
      cta: 'Browse software catalog',
    },
    {
      eyebrow: 'TRIMBLE MARKETPLACE',
      title: 'Discover 100+ Workflow Plugins',
      description:
        'Browse certified third-party integrations, extensions, and workflow plugins designed to enhance your tools.',
      cta: 'Browse marketplace',
    },
    {
      eyebrow: 'TRIMBLE LEARN',
      title: 'Master Your New Software',
      description:
        'Accelerate team onboarding with self-paced video tutorials, live webinars, and accredited certification tracks.',
      cta: 'Explore training courses',
    },
  ];

  /** T1 SaaS add-ons, T2 marketplace extensions, T3 learn courses */
  var TIER_MOCK = {
    'T1-A': {
      eyebrow: 'SOFTWARE ADD-ON',
      title: 'V-Ray for SketchUp',
      description:
        'Photorealistic rendering plugin for real-time visualization, advanced lighting, and high-fidelity presentations.',
      cta: 'View details',
    },
    'T1-B': {
      eyebrow: 'SOFTWARE ADD-ON',
      title: 'SketchUp Pro extension pack',
      description:
        'Advanced modeling tools, cloud library sync, and team sharing for high-volume design workflows.',
      cta: 'View details',
    },
    'T1-C': {
      eyebrow: 'SOFTWARE ADD-ON',
      title: 'Trimble Connect advanced seats',
      description:
        'Expand cloud collaboration capacity with additional named users and project workspace storage.',
      cta: 'View details',
    },
    'T2-A': {
      eyebrow: 'CERTIFIED EXTENSION',
      title: 'Trimble Connect Sync Plugin',
      description:
        'Automate desktop file synchronization directly to cloud collaboration workspaces for your entire team.',
      cta: 'Explore extension',
    },
    'T2-B': {
      eyebrow: 'CERTIFIED EXTENSION',
      title: 'Field data sync for AutoCAD',
      description:
        'Push survey and layout points from the field into your CAD environment with validated coordinate transforms.',
      cta: 'Explore extension',
    },
    'T2-C': {
      eyebrow: 'CERTIFIED EXTENSION',
      title: 'ProjectSight integration bridge',
      description:
        'Bi-directional RFIs, submittals, and document links between ProjectSight and your authoring tools.',
      cta: 'Explore extension',
    },
    'T3-A': {
      eyebrow: 'ONBOARDING COURSE',
      title: 'Connected Workflows Masterclass',
      description:
        'Comprehensive 4-hour video course on model coordination, clash detection, and Trimble ID permissions.',
      cta: 'View course details',
    },
    'T3-B': {
      eyebrow: 'ONBOARDING COURSE',
      title: 'Trimble ID admin essentials',
      description:
        'Self-paced modules on user provisioning, SSO configuration, and license delegation for account owners.',
      cta: 'View course details',
    },
    'T3-C': {
      eyebrow: 'ONBOARDING COURSE',
      title: 'Field layout fundamentals',
      description:
        'Hands-on lessons for stakeout workflows, data prep, and quality checks using Trimble field software.',
      cta: 'View course details',
    },
  };

  var MATRIX_MIX = {
    optimal: ['T1-A', 'T2-A', 'T3-A'],
    'saas-heavy': ['T1-A', 'T1-B', 'T1-C'],
    'saas-ext': ['T1-A', 'T1-B', 'T2-A'],
    'saas-learn': ['T1-A', 'T1-B', 'T3-A'],
    'ext-heavy': ['T2-A', 'T2-B', 'T3-A'],
    'pure-ext': ['T2-A', 'T2-B', 'T2-C'],
    enablement: ['T1-A', 'T3-A', 'T3-B'],
    'pure-learn': ['T3-A', 'T3-B', 'T3-C'],
  };

  var RECEIPT_BODY_PAID =
    'You will receive an email with your purchase details at ' +
    '<a href="mailto:name@email.com">name@email.com</a>. Please retain this confirmation as ' +
    'your proof of purchase. Payment will show up on your statement as &lsquo;Trimble.&rsquo;';

  var RECEIPT_BODY_FREE_TRIAL =
    'You will receive an email with your purchase details at ' +
    '<a href="mailto:name@email.com">name@email.com</a>. Please retain this confirmation as ' +
    'your proof of purchase. Your 30-day evaluation is active. No payment method was charged.';

  var RECEIPT_BODY_AUTO_CONVERT =
    'You will receive an email with your purchase details at ' +
    '<a href="mailto:name@email.com">name@email.com</a>. Please retain this confirmation as ' +
    'your proof of purchase. Payment will show up on your statement as &lsquo;Trimble.&rsquo;';

  var RECEIPT_ADDON_AUTO_CONVERT =
    'First Billing Date: November 29, 2026. Manage or cancel renewal in Trimble Admin Console.';

  var defaults = {
    feature: ACTIVE_FEATURE,
    role: 'account-owner',
    purchase: 'saas-paid',
    upsell: '3-cards',
    cardType: 'generic-plp',
    matrix: 'optimal',
    linkToggle: 'show',
    collapsed: false,
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return Object.assign({}, defaults);
      }
      var parsed = JSON.parse(raw);
      return Object.assign({}, defaults, parsed);
    } catch (err) {
      return Object.assign({}, defaults);
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* ignore */
    }
  }

  function normalizeUpsell(value) {
    if (VALID_UPSELL.indexOf(value) === -1) {
      return '3-cards';
    }
    return value;
  }

  function normalizeCardType(value) {
    if (VALID_CARD_TYPES.indexOf(value) === -1) {
      return 'generic-plp';
    }
    return value;
  }

  function normalizeMatrix(value) {
    if (VALID_MATRIX.indexOf(value) === -1) {
      return 'optimal';
    }
    return value;
  }

  function announce(message) {
    var region = document.getElementById('sandbox-a11y-status');
    if (!region) {
      return;
    }
    region.textContent = '';
    window.setTimeout(function () {
      region.textContent = message;
    }, 50);
  }

  function setCardDisplay(card, visible) {
    if (!card) {
      return;
    }
    if (visible) {
      card.style.setProperty('display', 'flex', 'important');
    } else {
      card.style.setProperty('display', 'none', 'important');
    }
  }

  function getUpsellCards() {
    var cardGrid = document.getElementById('sandbox-upsell-grid');
    if (!cardGrid) {
      return [];
    }
    return Array.prototype.slice.call(cardGrid.querySelectorAll('[data-sandbox-upsell-card]'));
  }

  function populateCards(contentSet) {
    var cards = getUpsellCards();

    cards.forEach(function (card, index) {
      var content = contentSet[index];
      if (!content) {
        return;
      }
      var eyebrow = card.querySelector('.card-eyebrow');
      var title = card.querySelector('.card-title');
      var description = card.querySelector('.card-description');
      var cta = card.querySelector('.recommendation-card__footer modus-button');

      if (eyebrow) {
        eyebrow.textContent = content.eyebrow;
      }
      if (title) {
        title.textContent = content.title;
      }
      if (description) {
        description.textContent = content.description;
      }
      if (cta) {
        cta.textContent = content.cta;
      }
    });
  }

  function matrixToContent(matrixKey) {
    var tierKeys = MATRIX_MIX[normalizeMatrix(matrixKey)];
    if (!tierKeys) {
      return [];
    }
    return tierKeys.map(function (key) {
      return TIER_MOCK[key];
    });
  }

  function setMatrixControlLocked(locked) {
    var matrixGroup = document.getElementById('sandbox-matrix-group');
    var matrixSelect = document.getElementById('sandbox-matrix-select');

    if (!matrixGroup || !matrixSelect) {
      return;
    }

    if (locked) {
      matrixSelect.setAttribute('aria-disabled', 'true');
      matrixGroup.classList.add('sandbox-control-disabled');
    } else {
      matrixSelect.removeAttribute('aria-disabled');
      matrixGroup.classList.remove('sandbox-control-disabled');
    }
  }

  function renderSection3Cards(state) {
    var cardType = normalizeCardType(state.cardType);

    if (cardType === 'generic-plp') {
      setMatrixControlLocked(true);
      populateCards(GENERIC_PLP_CARDS);
      return;
    }

    setMatrixControlLocked(false);
    populateCards(matrixToContent(state.matrix));
  }

  function applyLinkToggle(value) {
    var link = document.getElementById('section-3-marketplace-link');
    if (!link) {
      return;
    }

    if (value === 'hide') {
      link.style.display = 'none';
      return;
    }

    link.style.display = 'inline-flex';
  }

  function applyUpsellState(value, silent) {
    var section3Container = document.getElementById('section-3-upsell');
    var cardGrid = document.getElementById('sandbox-upsell-grid');

    if (!section3Container || !cardGrid) {
      return;
    }

    var mode = normalizeUpsell(value);
    var cards = getUpsellCards();

    if (mode === '0-cards') {
      section3Container.style.setProperty('display', 'none', 'important');
      if (!silent) {
        announce('Recommended add-ons section hidden');
      }
      return;
    }

    section3Container.style.removeProperty('display');
    cardGrid.style.gridTemplateColumns = DESKTOP_GRID_COLUMNS;

    if (mode === '3-cards') {
      setCardDisplay(cards[0], true);
      setCardDisplay(cards[1], true);
      setCardDisplay(cards[2], true);
      if (!silent) {
        announce('Showing all 3 recommended cards');
      }
      return;
    }

    if (mode === '2-cards') {
      setCardDisplay(cards[0], true);
      setCardDisplay(cards[1], true);
      setCardDisplay(cards[2], false);
      if (!silent) {
        announce('Showing 2 recommended cards, left-aligned');
      }
      return;
    }

    if (mode === '1-card') {
      setCardDisplay(cards[0], true);
      setCardDisplay(cards[1], false);
      setCardDisplay(cards[2], false);
      if (!silent) {
        announce('Showing 1 featured recommended card');
      }
    }
  }

  function applyRoleState(role) {
    var ownerActions = document.getElementById('sandbox-owner-team-actions');

    if (!ownerActions) {
      return;
    }

    if (role === 'product-user') {
      ownerActions.hidden = true;
      return;
    }

    if (OWNER_ROLES.indexOf(role) !== -1) {
      ownerActions.hidden = false;
    }
  }

  function applyPurchaseState(purchase) {
    var bodyEl = document.getElementById('sandbox-receipt-body');
    var addonEl = document.getElementById('sandbox-receipt-addon');
    var totalEl = document.getElementById('sandbox-order-total');

    if (!bodyEl || !addonEl || !totalEl) {
      return;
    }

    if (purchase === 'free-trial') {
      bodyEl.innerHTML = RECEIPT_BODY_FREE_TRIAL;
      addonEl.hidden = true;
      addonEl.textContent = '';
      totalEl.textContent = '$0.00';
      return;
    }

    if (purchase === 'auto-convert') {
      bodyEl.innerHTML = RECEIPT_BODY_AUTO_CONVERT;
      addonEl.hidden = false;
      addonEl.textContent = RECEIPT_ADDON_AUTO_CONVERT;
      totalEl.textContent = '$0.00';
      return;
    }

    bodyEl.innerHTML = RECEIPT_BODY_PAID;
    addonEl.hidden = true;
    addonEl.textContent = '';
    totalEl.textContent = '$0,000.00';
  }

  function applyCollapsed(collapsed, bar, reopenBtn) {
    if (collapsed) {
      bar.classList.add('sandbox-collapsed');
      reopenBtn.classList.add('sandbox-btn-visible');
    } else {
      bar.classList.remove('sandbox-collapsed');
      reopenBtn.classList.remove('sandbox-btn-visible');
    }
  }

  function init() {
    var bar = document.getElementById('sandbox-bar');
    var reopenBtn = document.getElementById('sandbox-reopen-btn');
    var collapseBtn = document.getElementById('sandbox-collapse-btn');
    var featureSelect = document.getElementById('sandbox-feature-select');
    var roleSelect = document.getElementById('sandbox-role-select');
    var purchaseSelect = document.getElementById('sandbox-purchase-select');
    var upsellSelect = document.getElementById('sandbox-upsell-select');
    var cardTypeSelect = document.getElementById('sandbox-card-type-select');
    var matrixSelect = document.getElementById('sandbox-matrix-select');
    var linkToggle = document.getElementById('sandbox-link-toggle');

    if (
      !bar ||
      !reopenBtn ||
      !collapseBtn ||
      !featureSelect ||
      !roleSelect ||
      !purchaseSelect ||
      !upsellSelect ||
      !cardTypeSelect ||
      !matrixSelect ||
      !linkToggle
    ) {
      return;
    }

    var state = loadState();
    delete state.persona;
    state.feature = ACTIVE_FEATURE;
    state.upsell = normalizeUpsell(state.upsell);
    state.cardType = normalizeCardType(state.cardType);
    state.matrix = normalizeMatrix(state.matrix);
    state.linkToggle = state.linkToggle === 'hide' ? 'hide' : 'show';

    featureSelect.value = ACTIVE_FEATURE;
    roleSelect.value = state.role || defaults.role;
    purchaseSelect.value = state.purchase || defaults.purchase;
    upsellSelect.value = state.upsell;
    cardTypeSelect.value = state.cardType;
    matrixSelect.value = state.matrix;
    linkToggle.value = state.linkToggle;

    renderSection3Cards(state);
    applyUpsellState(state.upsell, true);
    applyLinkToggle(state.linkToggle);
    applyRoleState(roleSelect.value);
    applyPurchaseState(purchaseSelect.value);
    applyCollapsed(Boolean(state.collapsed), bar, reopenBtn);
    saveState(state);

    roleSelect.addEventListener('change', function () {
      state.role = roleSelect.value;
      applyRoleState(state.role);
      saveState(state);
    });

    purchaseSelect.addEventListener('change', function () {
      state.purchase = purchaseSelect.value;
      applyPurchaseState(state.purchase);
      saveState(state);
    });

    upsellSelect.addEventListener('change', function () {
      state.upsell = normalizeUpsell(upsellSelect.value);
      upsellSelect.value = state.upsell;
      applyUpsellState(state.upsell, false);
      saveState(state);
    });

    cardTypeSelect.addEventListener('change', function () {
      state.cardType = normalizeCardType(cardTypeSelect.value);
      cardTypeSelect.value = state.cardType;
      renderSection3Cards(state);
      saveState(state);
    });

    matrixSelect.addEventListener('change', function () {
      if (matrixSelect.getAttribute('aria-disabled') === 'true') {
        return;
      }
      state.matrix = normalizeMatrix(matrixSelect.value);
      matrixSelect.value = state.matrix;
      if (normalizeCardType(state.cardType) === 'product-pdp') {
        renderSection3Cards(state);
      }
      saveState(state);
    });

    linkToggle.addEventListener('change', function () {
      state.linkToggle = linkToggle.value === 'hide' ? 'hide' : 'show';
      linkToggle.value = state.linkToggle;
      applyLinkToggle(state.linkToggle);
      saveState(state);
    });

    collapseBtn.addEventListener('click', function () {
      state.collapsed = true;
      applyCollapsed(true, bar, reopenBtn);
      saveState(state);
      reopenBtn.focus();
    });

    reopenBtn.addEventListener('click', function () {
      state.collapsed = false;
      applyCollapsed(false, bar, reopenBtn);
      saveState(state);
      collapseBtn.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
