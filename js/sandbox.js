(function () {
  'use strict';

  var STORAGE_KEY = 'trimble-prototype-sandbox';
  var ACTIVE_FEATURE = 'dxpbk-1321';
  var VALID_UPSELL = ['3-cards', '2-cards', '1-card', '0-cards'];
  var VALID_CARD_TYPES = ['generic-plp', 'product-pdp'];
  var VALID_STAGES = ['stage-1', 'stage-2', 'stage-3'];
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

  /** Stage 1 / 2 section visibility by purchase type (Stage 3 bypasses this matrix). */
  var SECTION_VISIBILITY_MATRIX = {
    'stage-1': {
      'saas-paid': { section1: true, section2: true, section3: true },
      'free-trial': { section1: true, section2: true, section3: false },
      'auto-convert': { section1: true, section2: true, section3: false },
      'trimble-credits': { section1: true, section2: true, section3: false },
      'partial-term': { section1: true, section2: true, section3: true },
    },
    'stage-2': {
      'saas-paid': { section1: true, section2: true, section3: true },
      'free-trial': { section1: true, section2: true, section3: false },
      'auto-convert': { section1: true, section2: true, section3: false },
      'trimble-credits': { section1: true, section2: true, section3: true },
      'partial-term': { section1: true, section2: true, section3: true },
    },
  };

  var STAGE2_CREDITS_UTILITY_LOCK_TITLE =
    'Locked to 2 Directory Gateway cards for Trimble Credits in Stage 2';

  var STAGE2_TRIMBLE_CREDITS_CARDS = [
    {
      id: 'stage2-credits-software-catalog',
      eyebrow: 'Ecosystem discovery',
      title: 'Trimble Software Catalog',
      description:
        'Explore cloud applications and desktop tools that utilize processing credits.',
      buttonText: 'Explore software',
      ariaLabel: 'Explore software in the Trimble Software Catalog',
      destination: 'Navigates to Software Product Listing Page (PLP)',
    },
    {
      id: 'stage2-credits-onboarding',
      eyebrow: 'Product enablement',
      title: 'Onboarding courses',
      description:
        'Master consumption management and workflows with on-demand Trimble Learn modules.',
      buttonText: 'Explore courses',
      ariaLabel: 'Explore onboarding courses on Trimble Learn',
      destination: 'Navigates to Training Product Listing Page (PLP)',
    },
  ];

  var T1_PDP_DESTINATION = 'Navigates to Product Detail Page (PDP)';
  var T2_PDP_DESTINATION = 'Navigates to Marketplace Product Detail Page (PDP)';
  var T3_PDP_DESTINATION = 'Navigates to Course Detail Page (PDP)';
  var NORTH_STAR_DESTINATION =
    'Simulates 1-Click purchase drawn down from Trimble Credits';

  /** T1 SaaS add-ons, T2 marketplace extensions, T3 learn courses */
  var TIER_MOCK = {
    'T1-A': {
      eyebrow: 'SOFTWARE ADD-ON',
      title: 'V-Ray for SketchUp',
      description:
        'Photorealistic rendering plugin for real-time visualization, advanced lighting, and high-fidelity presentations.',
      cta: 'View details',
      destination: T1_PDP_DESTINATION,
    },
    'T1-B': {
      eyebrow: 'SOFTWARE ADD-ON',
      title: 'SketchUp Pro extension pack',
      description:
        'Advanced modeling tools, cloud library sync, and team sharing for high-volume design workflows.',
      cta: 'View details',
      destination: T1_PDP_DESTINATION,
    },
    'T1-C': {
      eyebrow: 'SOFTWARE ADD-ON',
      title: 'Trimble Connect advanced seats',
      description:
        'Expand cloud collaboration capacity with additional named users and project workspace storage.',
      cta: 'View details',
      destination: T1_PDP_DESTINATION,
    },
    'T2-A': {
      eyebrow: 'CERTIFIED EXTENSION',
      title: 'Trimble Connect sync plugin',
      description:
        'Automate desktop file synchronization directly to cloud collaboration workspaces for your entire team.',
      cta: 'Explore extension',
      destination: T2_PDP_DESTINATION,
    },
    'T2-B': {
      eyebrow: 'CERTIFIED EXTENSION',
      title: 'Field data sync for AutoCAD',
      description:
        'Push survey and layout points from the field into your CAD environment with validated coordinate transforms.',
      cta: 'Explore extension',
      destination: T2_PDP_DESTINATION,
    },
    'T2-C': {
      eyebrow: 'CERTIFIED EXTENSION',
      title: 'ProjectSight integration bridge',
      description:
        'Bi-directional RFIs, submittals, and document links between ProjectSight and your authoring tools.',
      cta: 'Explore extension',
      destination: T2_PDP_DESTINATION,
    },
    'T3-A': {
      eyebrow: 'ONBOARDING COURSE',
      title: 'Connected workflows masterclass',
      description:
        'Comprehensive 4-hour video course on model coordination, clash detection, and Trimble ID permissions.',
      cta: 'View course details',
      destination: T3_PDP_DESTINATION,
    },
    'T3-B': {
      eyebrow: 'ONBOARDING COURSE',
      title: 'Trimble ID admin essentials',
      description:
        'Self-paced modules on user provisioning, SSO configuration, and license delegation for account owners.',
      cta: 'View course details',
      destination: T3_PDP_DESTINATION,
    },
    'T3-C': {
      eyebrow: 'ONBOARDING COURSE',
      title: 'Field layout fundamentals',
      description:
        'Hands-on lessons for stakeout workflows, data prep, and quality checks using Trimble field software.',
      cta: 'View course details',
      destination: T3_PDP_DESTINATION,
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
    '<strong>Trial Expiration &amp; Reminders</strong>' +
    '<ul class="order-receipt__trial-list">' +
    '<li><span class="order-receipt__trial-list-label">\u26A0\uFE0F IMPORTANT (Trial Version):</span> ' +
    'We recommend using test projects or environments for all trials. ' +
    'To prevent potential data loss, please do not use trial licenses for active production projects.</li>' +
    '<li><span class="order-receipt__trial-list-label">No automatic renewal:</span> Your access ends in 30 days.</li>' +
    '<li><span class="order-receipt__trial-list-label">Email notification:</span> We will message you 3 days before your trial expires.</li>' +
    '</ul>';

  var RECEIPT_BODY_AUTO_CONVERT =
    '<strong>Trial Conversion &amp; Reminders</strong>' +
    '<ul class="order-receipt__trial-list">' +
    '<li><span class="order-receipt__trial-list-label">Auto-Conversion:</span> ' +
    'Your trial converts to a paid subscription on December 1, 2026.</li>' +
    '<li><span class="order-receipt__trial-list-label">Secure Continuous Access:</span> ' +
    'Your stored payment method will be automatically billed $399.00 USD / user / month, plus applicable tax, based on your selected plan.</li>' +
    '<li>We will send an automated reminder notice to your Trimble ID email address before your trial expires.</li>' +
    '</ul>';

  var RECEIPT_ADDON_AUTO_CONVERT =
    'First Billing Date: November 29, 2026. Manage or cancel renewal in Trimble Admin Console.';

  var RECEIPT_BODY_TRIMBLE_CREDITS =
    'You will receive an email with your purchase details at ' +
    '<a href="mailto:name@email.com">name@email.com</a>. Please retain this confirmation as ' +
    'your proof of purchase. Payment will show up on your statement as &lsquo;Trimble.&rsquo;';

  var RECEIPT_BODY_PARTIAL_TERM =
    'You will receive an email with your purchase details at ' +
    '<a href="mailto:name@email.com">name@email.com</a>. Please retain this confirmation as ' +
    'your proof of purchase. Payment will show up on your statement as &lsquo;Trimble.&rsquo;';

  var VALID_PURCHASE = [
    'saas-paid',
    'free-trial',
    'auto-convert',
    'trimble-credits',
    'partial-term',
  ];
  var VALID_PROMO = ['applied', 'none'];
  var PURCHASE_ALLOWS_PROMO = 'saas-paid';

  var TAX_LABEL_WITH_TITLE =
    'Estimated Tax <span class="tax-info-icon" title="Estimated tax calculated based on your jurisdiction" aria-hidden="true">\u24D8</span>';

  var ORDER_DETAILS_SCHEMAS = {
    'saas-paid': {
      title: 'Order Details',
      item: {
        name: 'SketchUp Pro',
        subtext: '',
        qty: 1,
        unitPrice: '$399.00',
      },
      summaryRows: [
        { label: 'Subtotal', value: '$399.00' },
        { label: 'Promotions', value: '-' },
        { label: TAX_LABEL_WITH_TITLE, value: '$27.93' },
      ],
      newSubtotal: null,
      total: '$426.93',
    },
    'saas-promo': {
      title: 'Order Details',
      item: {
        name: 'SketchUp Pro',
        subtext: 'PROMO20 (20% Off)',
        subtextIndent: true,
        qty: 1,
        unitPrice: '$399.00',
      },
      summaryRows: [
        { label: 'Subtotal', value: '$399.00' },
        {
          label: 'Promotions (PROMO20)',
          value: '-$79.80',
          isDiscount: true,
        },
        { label: TAX_LABEL_WITH_TITLE, value: '$22.34' },
      ],
      newSubtotal: null,
      total: '$341.54',
    },
    'partial-term': {
      title: 'Order Details',
      item: {
        name: 'Trimble Connect Pro',
        subtext: '',
        qty: 1,
        unitPrice: '$349.00',
      },
      summaryRows: [
        { label: 'Subtotal', value: '$349.00' },
        {
          label:
            'Partial-term Adjustment <span class="tax-info-icon" title="Prorated charge based on contract renewal date" aria-hidden="true">\u24D8</span>' +
            '<div class="proration-subtext">Calculated using renewal date of March 1, 2027</div>',
          value: '-$235.22',
          isDiscount: true,
          isAdjustmentRow: true,
        },
        { label: 'New Subtotal', value: '$113.78', isNewSubtotal: true },
        { label: 'Promotions', value: '-' },
        { label: TAX_LABEL_WITH_TITLE, value: '$7.96' },
      ],
      total: '$121.74',
    },
    'free-trial': {
      title: 'Order Details',
      item: {
        name: 'SketchUp Pro',
        subtext: '30-day Trial',
        qty: 1,
        unitPrice: '$0.00',
      },
      summaryRows: [
        { label: 'Subtotal', value: '$0.00' },
        { label: 'Promotions', value: '-' },
        {
          label: 'Estimated Tax <span class="tax-info-icon" aria-hidden="true">\u24D8</span>',
          value: '$0.00',
        },
      ],
      total: '$0.00',
    },
    'auto-convert': {
      title: 'Order Details',
      item: {
        name: 'SketchUp Pro',
        subtext:
          '30-day Trial<br>Next billing date: December 1, 2026<br>Future Charges: $399.00 USD / user',
        qty: 1,
        unitPrice: '$0.00',
      },
      summaryRows: [
        { label: 'Subtotal', value: '$0.00' },
        { label: 'Promotions', value: '-' },
        {
          label: 'Estimated Tax <span class="tax-info-icon" aria-hidden="true">\u24D8</span>',
          value: '$0.00',
        },
      ],
      total: '$0.00',
    },
    'trimble-credits': {
      title: 'Order Details',
      item: {
        name: 'Trimble Credits',
        subtext: '10,000 Credits',
        qty: 1,
        unitPrice: '$100.00',
      },
      summaryRows: [
        { label: 'Subtotal', value: '$100.00' },
        { label: 'Promotions', value: '-' },
        {
          label: 'Estimated Tax <span class="tax-info-icon" aria-hidden="true">\u24D8</span>',
          value: '$7.00',
        },
      ],
      total: '$107.00',
    },
  };

  var NORTH_STAR_TOAST_MSG =
    'North Star Action: Instantly provisioned and charged to Trimble Credits without re-entering checkout.';

  var northStarToastTimer = null;
  var prototypeRoutingToastTimer = null;

  var defaults = {
    feature: ACTIVE_FEATURE,
    role: 'account-owner',
    purchase: 'saas-paid',
    promo: 'applied',
    upsell: '3-cards',
    stage: 'stage-1',
    cardType: 'generic-plp',
    matrix: 'optimal',
    linkToggle: 'show',
    collapsed: false,
    stageNoteExpanded: true,
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

  function normalizeStage(value) {
    if (VALID_STAGES.indexOf(value) === -1) {
      return 'stage-1';
    }
    return value;
  }

  function setControlGroupLocked(selectEl, groupEl, locked) {
    if (!selectEl) {
      return;
    }
    if (locked) {
      selectEl.setAttribute('aria-disabled', 'true');
      selectEl.disabled = true;
      if (groupEl) {
        groupEl.classList.add('sandbox-control-disabled');
      }
    } else {
      selectEl.disabled = false;
      selectEl.setAttribute('aria-disabled', 'false');
      if (groupEl) {
        groupEl.classList.remove('sandbox-control-disabled');
      }
    }
  }

  function setCardTypeOptionStates(cardTypeSelect, disableProductPdp) {
    if (!cardTypeSelect) {
      return;
    }
    var productOption = cardTypeSelect.querySelector('option[value="product-pdp"]');
    if (productOption) {
      productOption.disabled = disableProductPdp;
    }
  }

  function restoreHeaderLinkDefault() {
    var link = document.getElementById('section-3-marketplace-link');
    if (!link) {
      return;
    }
    var defaultLabel = link.getAttribute('data-default-label') || 'Browse Marketplace \u2192';
    link.innerHTML = defaultLabel;
  }

  function applyHeaderLinkNorthStar() {
    var link = document.getElementById('section-3-marketplace-link');
    if (!link) {
      return;
    }
    link.textContent = 'Explore Connected Solutions ->';
  }

  function showNorthStarToast() {
    var toast = document.getElementById('sandbox-north-star-toast');
    if (!toast) {
      return;
    }
    toast.textContent = NORTH_STAR_TOAST_MSG;
    toast.hidden = false;
    announce(NORTH_STAR_TOAST_MSG);
    if (northStarToastTimer) {
      window.clearTimeout(northStarToastTimer);
    }
    northStarToastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 6000);
  }

  function getResolvedDirectoryCards(purchaseType) {
    var cards = {
      sketchupExt: {
        id: 'ext-warehouse',
        eyebrow: 'EXTENSIONS',
        title: 'Extend your 3D models',
        description:
          'Customize your workflow with specialized tools and third-party extensions built for SketchUp.',
        buttonText: 'Explore extensions',
        ariaLabel: 'Explore extensions on the SketchUp Extension Warehouse',
        destination: 'Navigates to SketchUp Extension Warehouse',
      },
      trimbleSoftware: {
        id: 'trimble-software',
        eyebrow: 'SOFTWARE CATALOG',
        title: 'Connect your workflows',
        description:
          'Explore our connected portfolio of design, construction, and geospatial software solutions.',
        buttonText: 'View all software',
        ariaLabel: 'View all software solutions in the Trimble Software Catalog',
        destination: 'Navigates to Software Product Listing Page (PLP)',
      },
      trimbleCredits: {
        id: 'trimble-credits',
        eyebrow: 'TRIMBLE CREDITS',
        title: 'Power on-demand compute',
        description:
          'Access flexible, prepaid credits to unlock on-demand cloud processing, rendering, and data services.',
        buttonText: 'Explore credits',
        ariaLabel: 'Learn more about purchasing and using Trimble Credits',
        destination: 'Navigates to Trimble Credits Product Detail Page (PDP)',
      },
      trimbleMarketplace: {
        id: 'trimble-marketplace',
        eyebrow: 'MARKETPLACE',
        title: 'Discover partner apps',
        description:
          'Discover certified partner apps and integrations to extend your connected Trimble ecosystem.',
        buttonText: 'Explore apps',
        ariaLabel: 'Browse certified partner applications on Trimble Marketplace',
        destination: 'Navigates to Marketplace Product Listing Page (PLP)',
      },
      trimbleLearn: {
        id: 'trimble-learn',
        eyebrow: 'TRAINING',
        title: 'Master your software',
        description:
          'Accelerate adoption with on-demand tutorials, live sessions, and certified learning paths.',
        buttonText: 'Start learning',
        ariaLabel: 'Explore training courses and tutorials on Trimble Learn',
        destination: 'Navigates to Training Product Listing Page (PLP)',
      },
    };

    switch (normalizePurchase(purchaseType)) {
      case 'saas-paid':
        return [cards.sketchupExt, cards.trimbleSoftware, cards.trimbleCredits];
      case 'free-trial':
        return [cards.sketchupExt, cards.trimbleSoftware, cards.trimbleLearn];
      case 'auto-convert':
        return [cards.sketchupExt, cards.trimbleSoftware, cards.trimbleCredits];
      case 'trimble-credits':
        return [cards.trimbleSoftware, cards.trimbleMarketplace, cards.trimbleLearn];
      case 'partial-term':
        return [cards.trimbleSoftware, cards.trimbleCredits, cards.trimbleMarketplace];
      default:
        return [cards.sketchupExt, cards.trimbleSoftware, cards.trimbleCredits];
    }
  }

  function directoryCardToContent(card) {
    if (!card) {
      return null;
    }
    return {
      id: card.id,
      eyebrow: card.eyebrow,
      title: card.title,
      description: card.description,
      cta: card.buttonText,
      ariaLabel: card.ariaLabel,
      destination: card.destination,
    };
  }

  function upsellModeToVisibleCount(upsellMode) {
    var mode = normalizeUpsell(upsellMode);
    if (mode === '0-cards') {
      return 0;
    }
    if (mode === '1-card') {
      return 1;
    }
    if (mode === '2-cards') {
      return 2;
    }
    return 3;
  }

  function buildGenericDirectoryContentSet(state) {
    return getResolvedDirectoryCards(state.purchase).map(directoryCardToContent);
  }

  function isStage2TrimbleCreditsScenario(state) {
    return (
      normalizeStage(state.stage) === 'stage-2' &&
      normalizePurchase(state.purchase) === 'trimble-credits'
    );
  }

  function getSandboxCardTypeSelect() {
    return (
      document.getElementById('sandbox-card-type') ||
      document.getElementById('sandbox-card-type-select')
    );
  }

  function getSandboxVisibleCardsSelect() {
    return (
      document.getElementById('sandbox-visible-cards') ||
      document.getElementById('sandbox-upsell-select')
    );
  }

  function buildSection3DirectoryContentSet(state) {
    if (isStage2TrimbleCreditsScenario(state)) {
      return STAGE2_TRIMBLE_CREDITS_CARDS.map(directoryCardToContent);
    }
    return buildGenericDirectoryContentSet(state);
  }

  var STAGE_EXPLANATIONS = {
    'stage-1': {
      title: 'STAGE 1: MVP SCOPE (BASELINE PRODUCTION)',
      summary:
        'Delivers core transactional confirmation and deterministic discovery gateways based on cart SKU telemetry.',
      features: [
        { label: 'Section 3 Cards', value: 'Deterministic Directory Gateways (Max 3 visible)' },
        { label: 'Header Text Link', value: 'Hidden / Suppressed (Reduces MVP scope)' },
        { label: 'Matrix Mix Engine', value: 'Locked / Disabled (No algorithmic cross-sell in MVP)' },
        {
          label: 'Target Action Routing',
          value: 'Links to broad Catalog PLPs and Extension Warehouse',
        },
      ],
      showDirectoryMatrix: true,
      hint:
        '\uD83D\uDCA1 <strong>Evaluation Guide:</strong> Switch <em>Purchase Type</em> in Tier 1 to test how Section 3 dynamically recalculates card combinations across <strong>SaaS Subscription</strong>, <strong>Free Trial</strong>, <strong>Trimble Credits</strong>, and <strong>SaaS Partial Term Adjustment</strong> (Trimble Connect Pro).',
    },
    'stage-2': {
      title: 'STAGE 2: ENHANCED SCOPE (DYNAMIC MERCHANDISING)',
      summary:
        'Introduces cart-aware cross-selling, dynamic SKU add-ons, and full Matrix Mix permutation testing.',
      features: [
        { label: 'Section 3 Cards', value: 'Targeted Product Recommendations (PDP Add-Ons)' },
        {
          label: 'Header Text Link',
          value: 'Active: "Explore Connected Solutions" (Links to Marketplace)',
        },
        {
          label: 'Matrix Mix Engine',
          value: 'Unlocked: 8 discrete T1 / T2 / T3 commercial permutations',
        },
        {
          label: 'Target Action Routing',
          value: 'Deep links directly to specific Product Detail Pages (PDPs)',
        },
      ],
      showDirectoryMatrix: false,
      hint:
        '\uD83D\uDCA1 <strong>Evaluator Focus:</strong> Use the <em>Matrix Mix</em> dropdown to evaluate commercial conversion balance between SaaS add-ons, partner extensions, and training modules.',
    },
    'stage-3': {
      title: 'STAGE 3: NORTH STAR SCOPE (1-CLICK ECOSYSTEM EXPANSION)',
      summary:
        'Showcases frictionless post-purchase account expansion powered by unified TID entitlements and instant credit drawdowns.',
      features: [
        { label: 'Section 3 Cards', value: '1-Click Interactive Provisioning Cards' },
        { label: 'Header Text Link', value: 'Active: Contextual Ecosystem Discovery' },
        {
          label: 'Matrix Mix Engine',
          value: 'Unlocked with 1-click instantaneous checkout simulation',
        },
        {
          label: 'Target Action Routing',
          value:
            'Simulates instant license allocation charged to Trimble Credits or card on file',
        },
      ],
      showDirectoryMatrix: false,
      hint:
        '\uD83D\uDCA1 <strong>Evaluator Focus:</strong> Click the action buttons on Section 3 cards to test zero-friction 1-click license additions without returning to cart or checkout.',
    },
  };

  function getDirectoryMatrixRowStatuses(purchaseType) {
    var purchase = normalizePurchase(purchaseType);
    var extStatus = {
      pill: 'ACTIVE IN GRID',
      pillClass: 'tier-pill-active',
      rule: 'Active (Cart contains SketchUp Pro)',
    };
    var softStatus = {
      pill: 'ACTIVE IN GRID',
      pillClass: 'tier-pill-active',
      rule: 'Active (Core portfolio catalog)',
    };
    var credStatus = {
      pill: 'ACTIVE IN GRID',
      pillClass: 'tier-pill-active',
      rule: 'Active (Consumption expansion)',
    };
    var mktStatus = {
      pill: 'STANDBY',
      pillClass: 'tier-pill-standby',
      rule: 'Standby (Promoted when T1 or T3 suppressed)',
    };
    var lrnStatus = {
      pill: 'STANDBY',
      pillClass: 'tier-pill-standby',
      rule: 'Standby (Universal fallback anchor)',
    };

    if (purchase === 'free-trial') {
      credStatus = {
        pill: 'STANDBY',
        pillClass: 'tier-pill-standby',
        rule: 'Standby (Disabled on free trial)',
      };
      lrnStatus = {
        pill: 'ACTIVE IN GRID',
        pillClass: 'tier-pill-active',
        rule: 'Active (Onboarding & training priority)',
      };
    } else if (purchase === 'trimble-credits') {
      extStatus = {
        pill: 'STANDBY',
        pillClass: 'tier-pill-standby',
        rule: 'Standby (Non-SketchUp transaction)',
      };
      credStatus = {
        pill: 'SUPPRESSED',
        pillClass: 'tier-pill-suppressed',
        rule: 'Suppressed (Item purchased is credits)',
      };
      mktStatus = {
        pill: 'ACTIVE IN GRID',
        pillClass: 'tier-pill-active',
        rule: 'Active (Ecosystem integrations)',
      };
      lrnStatus = {
        pill: 'ACTIVE IN GRID',
        pillClass: 'tier-pill-active',
        rule: 'Active (Workflow enablement)',
      };
    } else if (purchase === 'partial-term') {
      extStatus = {
        pill: 'STANDBY',
        pillClass: 'tier-pill-standby',
        rule: 'Standby (Item purchased is Trimble Connect)',
      };
      mktStatus = {
        pill: 'ACTIVE IN GRID',
        pillClass: 'tier-pill-active',
        rule: 'Active (Enterprise integrations)',
      };
      lrnStatus = {
        pill: 'STANDBY',
        pillClass: 'tier-pill-standby',
        rule: 'Standby (Training deferred for partial-term SKU)',
      };
    }

    return [
      { name: 'Extension Warehouse', status: extStatus },
      { name: 'Trimble Software', status: softStatus },
      { name: 'Trimble Credits', status: credStatus },
      { name: 'Trimble Marketplace', status: mktStatus },
      { name: 'Trimble Learn', status: lrnStatus },
    ];
  }

  function buildDirectoryMatrixColumnHtml(purchaseType) {
    var rows = getDirectoryMatrixRowStatuses(purchaseType);
    var html = '<div class="sandbox-dev-col">';
    html += '<h4 class="sandbox-dev-subtitle">Directory Gateway Resolution (Max 3 Rendered)</h4>';
    html += '<ul class="sandbox-tier-list">';
    rows.forEach(function (row) {
      html +=
        '<li><span class="tier-pill ' +
        row.status.pillClass +
        '">' +
        row.status.pill +
        '</span> <strong>' +
        row.name +
        ':</strong> <span class="rule-text">' +
        row.status.rule +
        '</span></li>';
    });
    html += '</ul></div>';
    return html;
  }

  function setStageNoteBodyExpanded(expanded) {
    var body = document.getElementById('stage-note-body');
    var toggle = document.getElementById('stage-note-toggle-btn');
    if (!body || !toggle) {
      return;
    }
    body.hidden = !expanded;
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    toggle.textContent = expanded ? 'Hide Dev Notes' : 'Show Dev Notes';
  }

  function updateStageDevNote(stageKey, purchaseType) {
    var key = normalizeStage(stageKey);
    var noteData = STAGE_EXPLANATIONS[key] || STAGE_EXPLANATIONS['stage-1'];
    var titleEl = document.getElementById('stage-note-title');
    var summaryEl = document.getElementById('stage-note-summary');
    var detailsEl = document.getElementById('stage-note-details');
    var hintEl = document.getElementById('stage-note-hint');
    var purchaseSelect = document.getElementById('sandbox-purchase-select');
    var activePurchase = normalizePurchase(
      purchaseType || (purchaseSelect && purchaseSelect.value) || 'saas-paid'
    );

    if (titleEl) {
      titleEl.textContent = noteData.title;
    }
    if (summaryEl) {
      summaryEl.textContent = noteData.summary;
    }
    if (hintEl) {
      hintEl.innerHTML = noteData.hint;
    }

    if (detailsEl) {
      var html = '<div class="sandbox-dev-columns">';
      html += '<div class="sandbox-dev-col">';
      html += '<h4 class="sandbox-dev-subtitle">Stage Capabilities</h4>';
      html += '<ul class="sandbox-tier-list">';
      noteData.features.forEach(function (feat) {
        html +=
          '<li><span class="tier-pill tier-pill-label">' +
          feat.label +
          ':</span> <span class="rule-text">' +
          feat.value +
          '</span></li>';
      });
      html += '</ul></div>';

      if (noteData.showDirectoryMatrix) {
        html += buildDirectoryMatrixColumnHtml(activePurchase);
      }

      html += '</div>';
      detailsEl.innerHTML = html;
    }
  }

  function applyCardButtonDestination(btn, destination) {
    if (!btn) {
      return;
    }
    btn.removeAttribute('onclick');
    btn.onclick = null;
    if (destination) {
      btn.setAttribute('data-destination', destination);
    } else {
      btn.removeAttribute('data-destination');
    }
  }

  function configureCardButtons(state) {
    var cards = getUpsellCards();
    var stage = normalizeStage(state.stage);
    var cardType = normalizeCardType(state.cardType);
    var tierKeys =
      cardType === 'product-pdp' ? MATRIX_MIX[normalizeMatrix(state.matrix)] : null;

    cards.forEach(function (card, index) {
      var btn = card.querySelector('.recommendation-card__footer modus-button');
      if (!btn) {
        return;
      }
      btn.removeAttribute('data-sandbox-north-star');

      if (stage === 'stage-3' && tierKeys && tierKeys[index]) {
        var tierKey = tierKeys[index];
        if (tierKey.indexOf('T1-') === 0) {
          btn.textContent = '1-click add to subscription';
          btn.setAttribute('data-sandbox-north-star', 'true');
          applyCardButtonDestination(btn, NORTH_STAR_DESTINATION);
          return;
        }
        if (tierKey.indexOf('T2-') === 0) {
          btn.textContent = 'Instant provision';
          btn.setAttribute('data-sandbox-north-star', 'true');
          applyCardButtonDestination(btn, NORTH_STAR_DESTINATION);
          return;
        }
      }

      if (cardType === 'generic-plp') {
        var genericSet = buildSection3DirectoryContentSet(state);
        var generic = genericSet[index];
        applyCardButtonDestination(btn, generic ? generic.destination : null);
        return;
      }

      if (tierKeys && tierKeys[index] && TIER_MOCK[tierKeys[index]]) {
        applyCardButtonDestination(btn, TIER_MOCK[tierKeys[index]].destination);
        return;
      }

      applyCardButtonDestination(btn, null);
    });
  }

  function applyStageController(state, silent) {
    var stage = normalizeStage(state.stage);
    updateStageDevNote(stage);
    var cardTypeSelect = getSandboxCardTypeSelect();
    var linkToggle = document.getElementById('sandbox-link-toggle');
    var linkToggleGroup = document.getElementById('sandbox-link-toggle-group');
    var matrixSelect = document.getElementById('sandbox-matrix-select');

    if (stage === 'stage-1') {
      state.linkToggle = 'hide';
      if (linkToggle) {
        linkToggle.value = 'hide';
      }
      setControlGroupLocked(linkToggle, linkToggleGroup, true);

      state.cardType = 'generic-plp';
      if (cardTypeSelect) {
        cardTypeSelect.value = 'generic-plp';
      }
      setCardTypeOptionStates(cardTypeSelect, true);

      state.matrix = 'optimal';
      if (matrixSelect) {
        matrixSelect.value = 'optimal';
      }
      setMatrixControlLocked(true);

      restoreHeaderLinkDefault();
      applyLinkToggle('hide');
      renderSection3Cards(state);

      if (!silent) {
        announce(
          'Switched to Stage 1 MVP: Directory cards active, header text link hidden, matrix mix locked.'
        );
      }
      return;
    }

    setCardTypeOptionStates(cardTypeSelect, false);

    if (stage === 'stage-2') {
      state.linkToggle = 'hide';
      if (linkToggle) {
        linkToggle.value = 'hide';
      }
      setControlGroupLocked(linkToggle, linkToggleGroup, false);

      state.cardType = 'product-pdp';
      if (cardTypeSelect) {
        cardTypeSelect.value = 'product-pdp';
      }

      setMatrixControlLocked(false);
      restoreHeaderLinkDefault();
      applyLinkToggle('hide');
      renderSection3Cards(state);

      if (!silent) {
        announce(
          'Switched to Stage 2 Enhanced: Product-specific matrix recommendations active, header link hidden.'
        );
      }
      return;
    }

    state.linkToggle = 'show';
    if (linkToggle) {
      linkToggle.value = 'show';
    }
    setControlGroupLocked(linkToggle, linkToggleGroup, false);

    state.cardType = 'product-pdp';
    if (cardTypeSelect) {
      cardTypeSelect.value = 'product-pdp';
    }

    setMatrixControlLocked(false);
    applyHeaderLinkNorthStar();
    applyLinkToggle('show');
    renderSection3Cards(state);

    if (!silent) {
      announce('Switched to Stage 3 North Star: 1-click subscription expansion active.');
    }
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
      if (content.id) {
        card.setAttribute('data-generic-card-id', content.id);
      }
      if (cta) {
        cta.textContent = content.cta;
        if (content.ariaLabel) {
          cta.setAttribute('aria-label', content.ariaLabel);
        } else {
          cta.removeAttribute('aria-label');
        }
        applyCardButtonDestination(cta, content.destination || null);
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

  function applySection3LayoutMode(state) {
    var cardGrid = document.getElementById('sandbox-upsell-grid');
    if (!cardGrid) {
      return;
    }
    var cards = getUpsellCards();
    var fixedTwo =
      isStage2TrimbleCreditsScenario(state) && isScenarioSection3Visible(state);

    if (fixedTwo) {
      cardGrid.classList.add('sandbox-upsell-grid--fixed-two');
      cardGrid.style.gridTemplateColumns = DESKTOP_GRID_COLUMNS;
      setCardDisplay(cards[0], true);
      setCardDisplay(cards[1], true);
      if (cards[2]) {
        setCardDisplay(cards[2], false);
        cards[2].setAttribute('aria-hidden', 'true');
        cards[2].setAttribute('inert', '');
      }
      return;
    }

    cardGrid.classList.remove('sandbox-upsell-grid--fixed-two');
    cards.forEach(function (card) {
      card.removeAttribute('aria-hidden');
      card.removeAttribute('inert');
    });
  }

  function applyCardTypeControlForScenario(state) {
    var cardTypeSelect = getSandboxCardTypeSelect();
    var upsellSelect = getSandboxVisibleCardsSelect();
    var cardTypeGroup = cardTypeSelect && cardTypeSelect.closest('.sandbox-control-group');
    var upsellGroup = upsellSelect && upsellSelect.closest('.sandbox-control-group');

    if (isStage2TrimbleCreditsScenario(state)) {
      if (cardTypeSelect) {
        state.cardType = 'generic-plp';
        cardTypeSelect.value = 'generic-plp';
        cardTypeSelect.disabled = true;
        cardTypeSelect.setAttribute('aria-disabled', 'true');
        cardTypeSelect.title = STAGE2_CREDITS_UTILITY_LOCK_TITLE;
        if (cardTypeGroup) {
          cardTypeGroup.classList.add('sandbox-control-disabled');
        }
        setCardTypeOptionStates(cardTypeSelect, true);
      }

      state.upsell = '2-cards';
      if (upsellSelect) {
        upsellSelect.value = '2-cards';
        upsellSelect.disabled = true;
        upsellSelect.setAttribute('aria-disabled', 'true');
        upsellSelect.title = STAGE2_CREDITS_UTILITY_LOCK_TITLE;
        if (upsellGroup) {
          upsellGroup.classList.add('sandbox-control-disabled');
        }
      }
      return;
    }

    if (upsellSelect) {
      upsellSelect.disabled = false;
      upsellSelect.removeAttribute('aria-disabled');
      upsellSelect.title = '';
      upsellSelect.value = normalizeUpsell(state.upsell);
      if (upsellGroup) {
        upsellGroup.classList.remove('sandbox-control-disabled');
      }
    }

    if (!cardTypeSelect) {
      return;
    }

    cardTypeSelect.disabled = false;
    cardTypeSelect.removeAttribute('aria-disabled');
    cardTypeSelect.title = '';
    if (cardTypeGroup) {
      cardTypeGroup.classList.remove('sandbox-control-disabled');
    }

    if (normalizeStage(state.stage) === 'stage-1') {
      state.cardType = 'generic-plp';
      cardTypeSelect.value = 'generic-plp';
      setCardTypeOptionStates(cardTypeSelect, true);
      return;
    }

    setCardTypeOptionStates(cardTypeSelect, false);
    if (normalizeStage(state.stage) === 'stage-2' && state.cardType === 'generic-plp') {
      state.cardType = 'product-pdp';
      cardTypeSelect.value = 'product-pdp';
    }
  }

  function applyScenarioPurchaseMode(state, silent) {
    if (normalizeStage(state.stage) === 'stage-3') {
      applySection3LayoutMode(state);
      applyCardTypeControlForScenario(state);
      return;
    }

    applyCardTypeControlForScenario(state);
    applySection3LayoutMode(state);

    if (!isScenarioSection3Visible(state)) {
      return;
    }

    renderSection3Cards(state, false);

    if (!silent && isStage2TrimbleCreditsScenario(state)) {
      announce(
        'Scenario updated: Stage 2 Enhanced with Trimble Credits active. Card type locked to Directory Gateways and visible cards fixed to 2.'
      );
    }
  }

  function renderSection3Cards(state, announceGenericCards) {
    var cardType = normalizeCardType(state.cardType);
    var stage = normalizeStage(state.stage);

    if (isStage2TrimbleCreditsScenario(state) && isScenarioSection3Visible(state)) {
      setMatrixControlLocked(true);
      populateCards(buildSection3DirectoryContentSet(state));
      configureCardButtons(state);
      applySection3LayoutMode(state);
      return;
    }

    if (cardType === 'generic-plp') {
      setMatrixControlLocked(true);
      populateCards(buildSection3DirectoryContentSet(state));
      if (announceGenericCards) {
        announce(
          'Generic directory cards updated: displaying top 3 recommendations based on purchase context.'
        );
      }
    } else {
      if (stage === 'stage-1') {
        populateCards(buildGenericDirectoryContentSet(state));
      } else {
        setMatrixControlLocked(false);
        populateCards(matrixToContent(state.matrix));
      }
    }

    configureCardButtons(state);
  }

  function resolveScenarioSectionVisibility(stage, purchase) {
    var stageKey = normalizeStage(stage);
    var purchaseKey = normalizePurchase(purchase);

    if (stageKey === 'stage-3') {
      return {
        section1: true,
        section2: true,
        section3: true,
        bypassMatrix: true,
      };
    }

    var stageMap = SECTION_VISIBILITY_MATRIX[stageKey];
    if (!stageMap) {
      return {
        section1: true,
        section2: true,
        section3: true,
        bypassMatrix: false,
      };
    }

    var row = stageMap[purchaseKey] || {
      section1: true,
      section2: true,
      section3: true,
    };

    return {
      section1: row.section1 !== false,
      section2: row.section2 !== false,
      section3: row.section3 !== false,
      bypassMatrix: false,
    };
  }

  function isScenarioSection3Visible(state) {
    return resolveScenarioSectionVisibility(state.stage, state.purchase).section3;
  }

  function announceScenarioSectionVisibility(state, visibility) {
    var stage = normalizeStage(state.stage);
    if (visibility.bypassMatrix) {
      return;
    }

    var purchaseSelect = document.getElementById('sandbox-purchase-select');
    var purchaseLabel = purchaseSelect
      ? getSelectedOptionLabel(purchaseSelect)
      : normalizePurchase(state.purchase);

    if (!visibility.section3) {
      announce(
        'Scenario updated: ' +
          purchaseLabel +
          ' view active. Section 3 directory gateways hidden for ' +
          (stage === 'stage-1' ? 'Stage 1 MVP' : 'Stage 2 Enhanced') +
          '.'
      );
      return;
    }

    if (
      stage === 'stage-2' &&
      normalizePurchase(state.purchase) === 'trimble-credits' &&
      visibility.section3
    ) {
      return;
    }
  }

  function applyScenarioSectionVisibility(state, silent) {
    var visibility = resolveScenarioSectionVisibility(state.stage, state.purchase);
    var section1 = document.getElementById('order-confirmation-section-1');
    var section2 = document.getElementById('order-confirmation-section-2');
    var section3 = document.getElementById('order-confirmation-section-3');

    if (section1) {
      section1.hidden = !visibility.section1;
    }
    if (section2) {
      section2.hidden = !visibility.section2;
    }
    if (section3) {
      section3.hidden = !visibility.section3;
      if (!visibility.section3) {
        section3.style.removeProperty('display');
      }
    }

    if (!silent) {
      announceScenarioSectionVisibility(state, visibility);
    }
    applyScenarioPurchaseMode(state, silent);
  }

  function applyLinkToggle(value) {
    var link = document.getElementById('section-3-marketplace-link');
    if (!link) {
      return;
    }

    if (value === 'hide') {
      link.style.setProperty('display', 'none', 'important');
      return;
    }

    link.style.setProperty('display', 'inline-flex', 'important');
  }

  function applyUpsellState(value, silent, state) {
    var section3Container = document.getElementById('order-confirmation-section-3');
    var cardGrid = document.getElementById('sandbox-upsell-grid');

    if (!section3Container || !cardGrid) {
      return;
    }

    if (state && !isScenarioSection3Visible(state)) {
      section3Container.hidden = true;
      section3Container.style.removeProperty('display');
      return;
    }

    section3Container.hidden = false;

    if (state && isStage2TrimbleCreditsScenario(state)) {
      section3Container.style.removeProperty('display');
      applySection3LayoutMode(state);
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

  function getSelectedRoleLabel(selectEl) {
    if (!selectEl || selectEl.selectedIndex < 0) {
      return '';
    }
    return selectEl.options[selectEl.selectedIndex].textContent.trim();
  }

  function getSelectedOptionLabel(selectEl) {
    return getSelectedRoleLabel(selectEl);
  }

  function normalizePurchase(value) {
    if (VALID_PURCHASE.indexOf(value) === -1) {
      return 'saas-paid';
    }
    return value;
  }

  function normalizePromo(value) {
    if (VALID_PROMO.indexOf(value) === -1) {
      return 'applied';
    }
    return value;
  }

  function purchaseAllowsPromo(purchase) {
    return normalizePurchase(purchase) === PURCHASE_ALLOWS_PROMO;
  }

  function setPromoControlLocked(locked) {
    var promoSelect = document.getElementById('sandbox-promo-select');
    var promoGroup = document.getElementById('sandbox-promo-group');
    if (!promoSelect) {
      return;
    }
    if (locked) {
      promoSelect.disabled = true;
      promoSelect.setAttribute('aria-disabled', 'true');
      if (promoGroup) {
        promoGroup.setAttribute('aria-disabled', 'true');
      }
    } else {
      promoSelect.disabled = false;
      promoSelect.setAttribute('aria-disabled', 'false');
      if (promoGroup) {
        promoGroup.removeAttribute('aria-disabled');
      }
    }
  }

  function syncPromoWithPurchase(state, promoSelect) {
    if (!purchaseAllowsPromo(state.purchase)) {
      state.promo = 'none';
      if (promoSelect) {
        promoSelect.value = 'none';
      }
      setPromoControlLocked(true);
      return;
    }
    setPromoControlLocked(false);
    if (promoSelect && state.promo) {
      promoSelect.value = normalizePromo(state.promo);
      state.promo = promoSelect.value;
    }
  }

  var RECEIPT_HEADING_DEFAULT = 'Thank you for placing your order.';
  var RECEIPT_HEADING_FREE_TRIAL = 'Your trial is active!';
  var RECEIPT_ORDER_NUMBER_HTML = 'Order Number: <strong>000000</strong>';
  var RECEIPT_FREE_TRIAL_ACTIVATION_LINE =
    'You will receive an email with instructions on how to activate your trial.';

  function applyPurchaseState(purchase) {
    var bodyEl = document.getElementById('sandbox-receipt-body');
    var addonEl = document.getElementById('sandbox-receipt-addon');
    var headingEl = document.getElementById('order-thank-you-heading');
    var orderNumberEl = document.getElementById('sandbox-receipt-order-number');

    if (!bodyEl || !addonEl) {
      return;
    }

    purchase = normalizePurchase(purchase);

    if (headingEl) {
      headingEl.textContent =
        purchase === 'free-trial' || purchase === 'auto-convert'
          ? RECEIPT_HEADING_FREE_TRIAL
          : RECEIPT_HEADING_DEFAULT;
    }

    if (orderNumberEl) {
      if (purchase === 'free-trial') {
        orderNumberEl.hidden = false;
        orderNumberEl.textContent = RECEIPT_FREE_TRIAL_ACTIVATION_LINE;
      } else if (purchase === 'auto-convert') {
        orderNumberEl.hidden = true;
        orderNumberEl.textContent = '';
      } else {
        orderNumberEl.hidden = false;
        orderNumberEl.innerHTML = RECEIPT_ORDER_NUMBER_HTML;
      }
    }

    if (purchase === 'free-trial') {
      bodyEl.innerHTML = RECEIPT_BODY_FREE_TRIAL;
      addonEl.hidden = true;
      addonEl.textContent = '';
      return;
    }

    if (purchase === 'auto-convert') {
      bodyEl.innerHTML = RECEIPT_BODY_AUTO_CONVERT;
      addonEl.hidden = true;
      addonEl.textContent = '';
      return;
    }

    if (purchase === 'trimble-credits') {
      bodyEl.innerHTML = RECEIPT_BODY_TRIMBLE_CREDITS;
      addonEl.hidden = true;
      addonEl.textContent = '';
      return;
    }

    if (purchase === 'partial-term') {
      bodyEl.innerHTML = RECEIPT_BODY_PARTIAL_TERM;
      addonEl.hidden = true;
      addonEl.textContent = '';
      return;
    }

    bodyEl.innerHTML = RECEIPT_BODY_PAID;
    addonEl.hidden = true;
    addonEl.textContent = '';
  }

  function resolveOrderDetailsSchemaKey(purchase, promo) {
    var purchaseKey = normalizePurchase(purchase);
    var promoKey = normalizePromo(promo);

    if (purchaseKey === 'free-trial') {
      return 'free-trial';
    }
    if (purchaseKey === 'auto-convert') {
      return 'auto-convert';
    }
    if (purchaseKey === 'trimble-credits') {
      return 'trimble-credits';
    }
    if (purchaseKey === 'partial-term') {
      return 'partial-term';
    }
    if (purchaseKey === 'saas-paid') {
      return promoKey === 'applied' ? 'saas-promo' : 'saas-paid';
    }
    return 'saas-paid';
  }

  function shouldRenderOrderSummaryRow(row) {
    if (!row) {
      return false;
    }
    if (row.label === 'Promotions') {
      var value = String(row.value || '').trim();
      if (value === '-' || value === '$0.00' || value === '$0') {
        return false;
      }
    }
    return true;
  }

  function renderOrderDetailsCard(schemaKey, silent) {
    var schema = ORDER_DETAILS_SCHEMAS[schemaKey] || ORDER_DETAILS_SCHEMAS['saas-paid'];
    var titleEl = document.getElementById('order-details-title');
    var mount = document.getElementById('sandbox-order-details-mount');

    if (!mount) {
      return;
    }

    if (titleEl) {
      titleEl.textContent = schema.title;
    }

    var item = schema.item;
    var parts = [];
    parts.push(
      '<table class="order-table receipt-table" aria-label="Order breakdown and items purchased">'
    );
    parts.push('<caption class="sr-only">Line items in your order</caption>');
    parts.push('<colgroup>');
    parts.push('<col class="receipt-col-item" />');
    parts.push('<col class="receipt-col-qty" />');
    parts.push('<col class="receipt-col-amount" />');
    parts.push('</colgroup>');
    parts.push('<thead><tr>');
    parts.push('<th scope="col" class="receipt-col-item">Item</th>');
    parts.push('<th scope="col" class="receipt-col-qty">QTY</th>');
    parts.push('<th scope="col" class="receipt-col-amount">Unit Price</th>');
    parts.push('</tr></thead>');
    parts.push('<tbody>');
    parts.push('<tr class="receipt-item-row">');
    parts.push('<td class="receipt-col-item">');
    parts.push('<div class="receipt-item-title">' + item.name + '</div>');
    if (item.subtext) {
      var subtextClass = 'receipt-item-subtext';
      if (item.subtextIndent) {
        subtextClass += ' receipt-item-subtext--indent';
      }
      parts.push('<div class="' + subtextClass + '">' + item.subtext + '</div>');
    }
    parts.push('</td>');
    parts.push('<td class="receipt-col-qty">' + item.qty + '</td>');
    parts.push('<td class="receipt-amount">' + item.unitPrice + '</td>');
    parts.push('</tr>');
    parts.push('</tbody>');
    parts.push('<tfoot>');

    schema.summaryRows.filter(shouldRenderOrderSummaryRow).forEach(function (row) {
      var rowClass = 'receipt-summary-row';
      if (row.isNewSubtotal) {
        rowClass = 'receipt-new-subtotal-row';
      } else if (row.isAdjustmentRow) {
        rowClass = 'receipt-summary-row receipt-adjustment-row';
      }
      var valueClass = 'receipt-amount';
      if (row.isDiscount) {
        valueClass += ' receipt-discount-val';
      }
      parts.push('<tr class="' + rowClass + '">');
      parts.push('<th scope="row" class="receipt-summary-label" colspan="2">' + row.label + '</th>');
      parts.push('<td class="' + valueClass + '">');
      if (row.isDiscount) {
        parts.push('<span class="sr-only">Discount: </span>');
      }
      parts.push(row.value);
      parts.push('</td></tr>');
    });

    parts.push('<tr class="receipt-total-row">');
    parts.push('<th scope="row" class="receipt-summary-label" colspan="2">Total (USD)</th>');
    parts.push('<td class="receipt-amount receipt-total-amount">' + schema.total + '</td>');
    parts.push('</tr>');
    parts.push('</tfoot></table>');

    mount.innerHTML = parts.join('');

    if (!silent) {
      announce(
        'Order Details updated to ' + schemaKey + ' schema for ' + schema.item.name + '.'
      );
    }
  }

  function updateOrderDetailsState(state, silent) {
    var schemaKey = resolveOrderDetailsSchemaKey(state.purchase, state.promo);
    renderOrderDetailsCard(schemaKey, silent);
  }

  function applyReceiptContext(state, silent) {
    applyPurchaseState(state.purchase);
    updateOrderDetailsState(state, silent);
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
    var promoSelect = document.getElementById('sandbox-promo-select');
    var upsellSelect = getSandboxVisibleCardsSelect();
    var cardTypeSelect = getSandboxCardTypeSelect();
    var matrixSelect = document.getElementById('sandbox-matrix-select');
    var linkToggle = document.getElementById('sandbox-link-toggle');
    var stageSelect = document.getElementById('sandbox-stage-select');

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
      !linkToggle ||
      !stageSelect
    ) {
      return;
    }

    var state = loadState();
    delete state.persona;
    state.feature = ACTIVE_FEATURE;
    state.upsell = normalizeUpsell(state.upsell);
    state.stage = normalizeStage(state.stage);
    state.matrix = normalizeMatrix(state.matrix);
    state.linkToggle = state.linkToggle === 'hide' ? 'hide' : 'show';
    if (state.stageNoteExpanded === undefined) {
      state.stageNoteExpanded = state.devNoteExpanded !== false;
    }
    state.stageNoteExpanded = state.stageNoteExpanded !== false;

    featureSelect.value = ACTIVE_FEATURE;
    roleSelect.value = state.role || defaults.role;
    state.purchase = normalizePurchase(state.purchase || defaults.purchase);
    state.promo = normalizePromo(state.promo || defaults.promo);
    purchaseSelect.value = state.purchase;
    syncPromoWithPurchase(state, promoSelect);
    upsellSelect.value = state.upsell;
    matrixSelect.value = state.matrix;
    linkToggle.value = state.linkToggle;
    stageSelect.value = state.stage;

    applyStageController(state, true);
    setStageNoteBodyExpanded(state.stageNoteExpanded);
    applyScenarioSectionVisibility(state, true);
    applyUpsellState(state.upsell, true, state);
    applyRoleState(roleSelect.value);
    applyReceiptContext(state, true);
    applyCollapsed(Boolean(state.collapsed), bar, reopenBtn);
    saveState(state);

    var stageNoteToggle = document.getElementById('stage-note-toggle-btn');
    if (stageNoteToggle) {
      stageNoteToggle.addEventListener('click', function () {
        state.stageNoteExpanded = !state.stageNoteExpanded;
        setStageNoteBodyExpanded(state.stageNoteExpanded);
        saveState(state);
      });
    }

    roleSelect.addEventListener('change', function (e) {
      state.role = e.target.value;
      applyRoleState(state.role);
      announce('Role context switched to: ' + getSelectedRoleLabel(e.target));
      saveState(state);
    });

    purchaseSelect.addEventListener('change', function () {
      state.purchase = normalizePurchase(purchaseSelect.value);
      purchaseSelect.value = state.purchase;
      syncPromoWithPurchase(state, promoSelect);
      applyReceiptContext(state, true);
      if (normalizeStage(state.stage) === 'stage-1') {
        updateStageDevNote(state.stage, state.purchase);
      }
      applyScenarioSectionVisibility(state, false);
      applyUpsellState(state.upsell, true, state);
      if (state.purchase === 'partial-term') {
        announce(
          'Purchase type set to SaaS Partial Term Adjustment. Promo codes disabled for proration adjustments.'
        );
      } else if (normalizeStage(state.stage) === 'stage-3') {
        announce('Purchase type switched to: ' + getSelectedOptionLabel(purchaseSelect));
      }
      saveState(state);
    });

    if (promoSelect) {
      promoSelect.addEventListener('change', function () {
        if (promoSelect.disabled) {
          return;
        }
        state.promo = normalizePromo(promoSelect.value);
        promoSelect.value = state.promo;
        applyReceiptContext(state, false);
        announce(
          'Promo code modifier set to: ' +
            (state.promo === 'applied' ? 'PROMO20 Applied' : 'None')
        );
        saveState(state);
      });
    }

    stageSelect.addEventListener('change', function () {
      state.stage = normalizeStage(stageSelect.value);
      stageSelect.value = state.stage;
      applyStageController(state, false);
      applyScenarioSectionVisibility(state, false);
      applyUpsellState(state.upsell, true, state);
      saveState(state);
    });

    upsellSelect.addEventListener('change', function () {
      if (
        upsellSelect.disabled ||
        upsellSelect.getAttribute('aria-disabled') === 'true' ||
        isStage2TrimbleCreditsScenario(state)
      ) {
        return;
      }
      state.upsell = normalizeUpsell(upsellSelect.value);
      upsellSelect.value = state.upsell;
      applyUpsellState(state.upsell, false, state);
      if (normalizeCardType(state.cardType) === 'generic-plp') {
        renderSection3Cards(state);
      }
      saveState(state);
    });

    cardTypeSelect.addEventListener('change', function () {
      if (
        cardTypeSelect.disabled ||
        cardTypeSelect.getAttribute('aria-disabled') === 'true' ||
        isStage2TrimbleCreditsScenario(state)
      ) {
        return;
      }
      if (normalizeStage(state.stage) === 'stage-1') {
        cardTypeSelect.value = 'generic-plp';
        state.cardType = 'generic-plp';
        saveState(state);
        return;
      }
      state.cardType = normalizeCardType(cardTypeSelect.value);
      cardTypeSelect.value = state.cardType;
      renderSection3Cards(state);
      if (state.cardType === 'generic-plp') {
        announce(
          'Card type set to Directory Gateways: displaying broad catalog discovery cards.'
        );
      } else {
        announce(
          'Card type set to Product Recommendations: displaying targeted contextual add-ons.'
        );
      }
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
      if (linkToggle.disabled || linkToggle.getAttribute('aria-disabled') === 'true') {
        return;
      }
      state.linkToggle = linkToggle.value === 'hide' ? 'hide' : 'show';
      linkToggle.value = state.linkToggle;
      if (normalizeStage(state.stage) === 'stage-3' && state.linkToggle === 'show') {
        applyHeaderLinkNorthStar();
      } else if (state.linkToggle === 'show') {
        restoreHeaderLinkDefault();
      }
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

  function findPrototypeRoutingTarget(e) {
    var target = e.target;
    if (target && target.closest) {
      var match = target.closest('[data-destination]');
      if (match) {
        return match;
      }
    }
    if (typeof e.composedPath === 'function') {
      var path = e.composedPath();
      for (var i = 0; i < path.length; i++) {
        var node = path[i];
        if (node && node.getAttribute && node.getAttribute('data-destination')) {
          return node;
        }
      }
    }
    return null;
  }

  function isWithinDataDestinationTrigger(related, trigger) {
    if (!related || !trigger) {
      return false;
    }
    if (trigger === related) {
      return true;
    }
    if (trigger.contains && trigger.contains(related)) {
      return true;
    }
    if (trigger.shadowRoot && related.getRootNode && related.getRootNode() === trigger.shadowRoot) {
      return true;
    }
    return false;
  }

  function wirePrototypeFloatingTooltip() {
    var globalTooltip = document.getElementById('prototype-global-tooltip');
    var activeTooltipTrigger = null;

    function hideGlobalTooltip() {
      if (!globalTooltip) {
        return;
      }
      globalTooltip.classList.remove('is-active', 'tooltip-bottom');
      globalTooltip.setAttribute('aria-hidden', 'true');
      activeTooltipTrigger = null;
    }

    function showGlobalTooltip(target) {
      var destination = target.getAttribute('data-destination');
      if (!destination || !globalTooltip) {
        return;
      }

      activeTooltipTrigger = target;
      globalTooltip.textContent = destination;
      globalTooltip.classList.remove('tooltip-bottom');
      globalTooltip.classList.add('is-active');
      globalTooltip.setAttribute('aria-hidden', 'false');

      var rect = target.getBoundingClientRect();
      var tooltipRect = globalTooltip.getBoundingClientRect();

      var left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      if (left < 8) {
        left = 8;
      }
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      var top = rect.top - tooltipRect.height - 8;
      if (top < 8) {
        top = rect.bottom + 8;
        globalTooltip.classList.add('tooltip-bottom');
      } else {
        globalTooltip.classList.remove('tooltip-bottom');
      }

      globalTooltip.style.left = left + 'px';
      globalTooltip.style.top = top + 'px';
    }

    document.addEventListener('mouseover', function (e) {
      var target = findPrototypeRoutingTarget(e);
      if (target) {
        showGlobalTooltip(target);
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (!activeTooltipTrigger) {
        return;
      }
      var target = findPrototypeRoutingTarget(e);
      if (target !== activeTooltipTrigger) {
        return;
      }
      var related = e.relatedTarget;
      if (isWithinDataDestinationTrigger(related, activeTooltipTrigger)) {
        return;
      }
      hideGlobalTooltip();
    });

    document.addEventListener('focusin', function (e) {
      var target = findPrototypeRoutingTarget(e);
      if (target) {
        showGlobalTooltip(target);
      }
    });

    document.addEventListener('focusout', function (e) {
      var target = findPrototypeRoutingTarget(e);
      if (target && target === activeTooltipTrigger) {
        var related = e.relatedTarget;
        if (isWithinDataDestinationTrigger(related, activeTooltipTrigger)) {
          return;
        }
        hideGlobalTooltip();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideGlobalTooltip();
      }
    });

    window.addEventListener('scroll', hideGlobalTooltip, { passive: true });
    window.addEventListener('resize', hideGlobalTooltip, { passive: true });
  }

  function wirePrototypeRouting() {
    document.body.addEventListener('click', function (e) {
      var target = findPrototypeRoutingTarget(e);
      if (!target) {
        return;
      }

      e.preventDefault();

      var destinationText = target.getAttribute('data-destination');
      var toast = document.getElementById('prototype-routing-toast');

      if (toast && destinationText) {
        toast.textContent = '\u2139 Prototype Route: ' + destinationText;
        toast.classList.add('toast-active');

        if (prototypeRoutingToastTimer) {
          window.clearTimeout(prototypeRoutingToastTimer);
        }
        prototypeRoutingToastTimer = window.setTimeout(function () {
          toast.classList.remove('toast-active');
        }, 3000);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') {
        return;
      }
      var toast = document.getElementById('prototype-routing-toast');
      if (toast) {
        toast.classList.remove('toast-active');
      }
    });
  }

  function bootstrapPrototypeUi() {
    init();
    wirePrototypeFloatingTooltip();
    wirePrototypeRouting();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapPrototypeUi);
  } else {
    bootstrapPrototypeUi();
  }
})();
