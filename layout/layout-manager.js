(function (window, document) {
  'use strict';

  var SECTION_KEYS = ['mainWeather', 'airQuality', 'weatherCards', 'fiveDayForecast'];
  var SECTION_KEY_ALIASES = {
    'main-weather': 'mainWeather',
    main: 'mainWeather',
    weather: 'mainWeather',
    air: 'airQuality',
    'air-quality': 'airQuality',
    cards: 'weatherCards',
    'weather-cards': 'weatherCards',
    forecast: 'fiveDayForecast',
    'five-day-forecast': 'fiveDayForecast',
    '5day': 'fiveDayForecast'
  };

  var sectionState = new WeakMap();
  var initialized = false;

  function normalizeSectionKey(key) {
    if (!key) return '';
    return SECTION_KEY_ALIASES[key] || key;
  }

  function getStorageManager() {
    return window.WeatherStorageManager;
  }

  function getCurrentConfig(config) {
    var storage = getStorageManager();
    if (storage) return storage.normalizeConfig(config || window.tabInstanceConfig || {});

    var normalized = {};
    SECTION_KEYS.forEach(function (key) {
      normalized[key] = config && typeof config[key] === 'boolean' ? config[key] : true;
    });
    return normalized;
  }

  function ensureParkingArea() {
    var parkingArea = document.getElementById('weather-inactive-sections');
    if (parkingArea) return parkingArea;

    parkingArea = document.createElement('div');
    parkingArea.id = 'weather-inactive-sections';
    parkingArea.className = 'weather-layout-park';
    parkingArea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(parkingArea);
    return parkingArea;
  }

  function registerSection(element) {
    if (!element || sectionState.has(element)) return sectionState.get(element);

    var rawKey = element.getAttribute('data-weather-section');
    var key = normalizeSectionKey(rawKey);

    if (SECTION_KEYS.indexOf(key) === -1) return null;

    var marker = document.createComment('weather-section:' + key);
    element.parentNode.insertBefore(marker, element);

    var state = {
      key: key,
      marker: marker,
      parked: false
    };

    sectionState.set(element, state);
    return state;
  }

  function getRegisteredSections() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-weather-section]'))
      .map(function (element) {
        return {
          element: element,
          state: registerSection(element)
        };
      })
      .filter(function (entry) {
        return Boolean(entry.state);
      });
  }

  function restoreSection(element, state) {
    if (!state.parked) return;

    state.marker.parentNode.insertBefore(element, state.marker.nextSibling);
    element.removeAttribute('aria-hidden');
    state.parked = false;
  }

  function parkSection(element, state, parkingArea) {
    if (state.parked) return;

    element.setAttribute('aria-hidden', 'true');
    parkingArea.appendChild(element);
    state.parked = true;
  }

  function childCountsForArea(area) {
    var visibleChildren = Array.prototype.filter.call(area.children, function (child) {
      if (child.id === 'weather-inactive-sections') return false;

      if (child.hasAttribute('data-weather-section')) {
        var state = sectionState.get(child);
        return !state || !state.parked;
      }

      if (child.hasAttribute('data-weather-layout-shell')) {
        return !child.classList.contains('weather-layout-shell-empty');
      }

      return child.querySelector('[data-weather-section]:not([aria-hidden="true"])') ||
        child.querySelector('[data-weather-layout-shell]:not(.weather-layout-shell-empty)');
    });

    return visibleChildren.length;
  }

  function layoutChildrenForArea(area) {
    var count = 0;

    Array.prototype.forEach.call(area.childNodes, function (child) {
      if (child.nodeType === 8) {
        if (child.nodeValue.indexOf('weather-section:') === 0) count += 1;
        return;
      }

      if (child.nodeType !== 1) return;
      if (child.id === 'weather-inactive-sections') return;
      if (child.hasAttribute('data-weather-section')) return;

      if (child.hasAttribute('data-weather-layout-shell') ||
        child.querySelector('[data-weather-section]') ||
        child.querySelector('[data-weather-layout-shell]')) {
        count += 1;
      }
    });

    return count;
  }

  function updateLayoutClass(target, count, prefix) {
    var classPrefix = prefix || 'weather-layout';
    var classesToRemove = [
      classPrefix + '-empty',
      classPrefix + '-single',
      classPrefix + '-two',
      classPrefix + '-grid'
    ];

    classesToRemove.forEach(function (className) {
      target.classList.remove(className);
    });

    target.setAttribute('data-active-sections', String(count));

    if (!prefix && target.hasAttribute('data-weather-layout-area')) {
      var total = target.getAttribute('data-layout-total-sections');

      if (total === null) {
        total = String(layoutChildrenForArea(target));
        target.setAttribute('data-layout-total-sections', total);
      }

      target.classList.toggle('weather-layout-reflow', count < Number(total));
    }

    if (count === 0) {
      target.classList.add(classPrefix + '-empty');
    } else if (count === 1) {
      target.classList.add(classPrefix + '-single');
    } else if (count === 2) {
      target.classList.add(classPrefix + '-two');
    } else {
      target.classList.add(classPrefix + '-grid');
    }
  }

  function updateShellStates() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-weather-layout-shell]'), function (shell) {
      var hasVisibleSection = shell.querySelector('[data-weather-section]:not([aria-hidden="true"])');
      shell.classList.toggle('weather-layout-shell-empty', !hasVisibleSection);
    });
  }

  function updateAreaStates() {
    updateShellStates();

    Array.prototype.forEach.call(document.querySelectorAll('[data-weather-layout-area]'), function (area) {
      updateLayoutClass(area, childCountsForArea(area));
    });

    var visibleTotal = document.querySelectorAll('[data-weather-section]:not([aria-hidden="true"])').length;
    updateLayoutClass(document.body, visibleTotal, 'weather-page-layout');
    document.body.classList.add('weather-layout-ready');
  }

  function applySectionVisibility(config) {
    var normalizedConfig = getCurrentConfig(config);
    var parkingArea = ensureParkingArea();

    getRegisteredSections().forEach(function (entry) {
      if (normalizedConfig[entry.state.key]) {
        restoreSection(entry.element, entry.state);
      } else {
        parkSection(entry.element, entry.state, parkingArea);
      }
    });

    updateAreaStates();
    return normalizedConfig;
  }

  function renderLayout(config) {
    var appliedConfig = applySectionVisibility(config);
    document.documentElement.setAttribute('data-weather-layout-initialized', 'true');
    return appliedConfig;
  }

  function initializeLayout() {
    if (initialized) return;
    initialized = true;

    var tabState = window.WeatherTabState;
    var instance = tabState ? tabState.createTabInstance() : {
      tabId: null,
      tabInstanceConfig: getCurrentConfig({})
    };

    window.tabId = instance.tabId;
    window.tabInstanceConfig = instance.tabInstanceConfig;

    renderLayout(instance.tabInstanceConfig);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLayout);
  } else {
    initializeLayout();
  }

  window.renderLayout = renderLayout;
  window.applySectionVisibility = applySectionVisibility;

  window.WeatherLayoutManager = {
    renderLayout: renderLayout,
    applySectionVisibility: applySectionVisibility
  };
})(window, document);
