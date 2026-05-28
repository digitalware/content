(function (window) {
  'use strict';

  var GLOBAL_CONFIG_KEY = 'globalConfig';
  var GLOBAL_CONFIG_VERSION_KEY = 'globalConfigVersion';
  var GLOBAL_CONFIG_VERSION = 'all-on-default-v1';
  var TAB_ID_SESSION_KEY = 'tabId';
  var TAB_CONFIG_PREFIX = 'weather_tab_config_';

  var DEFAULT_CONFIG = Object.freeze({
    mainWeather: true,
    airQuality: true,
    weatherCards: true,
    fiveDayForecast: true
  });

  var CONFIG_KEYS = Object.keys(DEFAULT_CONFIG);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeConfig(config) {
    var source = config && typeof config === 'object' ? config : {};
    var normalized = {};

    CONFIG_KEYS.forEach(function (key) {
      normalized[key] = typeof source[key] === 'boolean' ? source[key] : DEFAULT_CONFIG[key];
    });

    return normalized;
  }

  function getStorageItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('Storage read failed:', key, error);
      return null;
    }
  }

  function setStorageItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Storage write failed:', key, error);
      return false;
    }
  }

  function readJSON(key) {
    try {
      var raw = getStorageItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Storage read failed:', key, error);
      return null;
    }
  }

  function writeJSON(key, value) {
    setStorageItem(key, JSON.stringify(value));
    return value;
  }

  function getStoredGlobalConfigVersion() {
    return getStorageItem(GLOBAL_CONFIG_VERSION_KEY);
  }

  function getTabConfigKey(tabId) {
    if (!tabId) return '';
    return TAB_CONFIG_PREFIX + tabId;
  }

  function loadGlobalConfig() {
    var saved = readJSON(GLOBAL_CONFIG_KEY);
    var version = getStoredGlobalConfigVersion();
    var normalized = normalizeConfig(saved);

    if (!saved || version !== GLOBAL_CONFIG_VERSION) {
      normalized = getDefaultConfig();
      saveGlobalConfig(normalized);
    }

    window.globalConfig = normalized;
    return normalized;
  }

  function saveGlobalConfig(config) {
    var normalized = normalizeConfig(config);
    writeJSON(GLOBAL_CONFIG_KEY, normalized);
    setStorageItem(GLOBAL_CONFIG_VERSION_KEY, GLOBAL_CONFIG_VERSION);
    window.globalConfig = normalized;
    return normalized;
  }

  function loadTabConfig(tabId) {
    var key = getTabConfigKey(tabId);
    if (!key) return null;

    var saved = readJSON(key);
    return saved ? normalizeConfig(saved) : null;
  }

  function saveTabConfig(tabId, config) {
    var key = getTabConfigKey(tabId);
    if (!key) {
      throw new Error('tabId is required to save tab config.');
    }

    return writeJSON(key, normalizeConfig(config));
  }

  function getDefaultConfig() {
    return clone(DEFAULT_CONFIG);
  }

  window.WeatherStorageManager = {
    GLOBAL_CONFIG_KEY: GLOBAL_CONFIG_KEY,
    GLOBAL_CONFIG_VERSION_KEY: GLOBAL_CONFIG_VERSION_KEY,
    TAB_ID_SESSION_KEY: TAB_ID_SESSION_KEY,
    TAB_CONFIG_PREFIX: TAB_CONFIG_PREFIX,
    CONFIG_KEYS: CONFIG_KEYS.slice(),
    getDefaultConfig: getDefaultConfig,
    getTabConfigKey: getTabConfigKey,
    normalizeConfig: normalizeConfig,
    loadGlobalConfig: loadGlobalConfig,
    saveGlobalConfig: saveGlobalConfig,
    loadTabConfig: loadTabConfig,
    saveTabConfig: saveTabConfig
  };
})(window);
