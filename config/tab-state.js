(function (window) {
  'use strict';

  var storage = window.WeatherStorageManager;

  if (!storage) {
    throw new Error('WeatherStorageManager must be loaded before tab-state.js.');
  }

  function generateTabUUID() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
      var random = Math.random() * 16 | 0;
      var value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  function getSessionItem(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Session storage read failed:', key, error);
      return null;
    }
  }

  function setSessionItem(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Session storage write failed:', key, error);
      return false;
    }
  }

  function getCurrentTabId() {
    return getSessionItem(storage.TAB_ID_SESSION_KEY);
  }

  function loadTabConfig(tabId) {
    var targetTabId = tabId || getCurrentTabId();
    return storage.loadTabConfig(targetTabId);
  }

  function saveTabConfig(config, tabId) {
    var targetTabId = tabId || getCurrentTabId();
    return storage.saveTabConfig(targetTabId, config);
  }

  function createTabInstance() {
    var existingTabId = getCurrentTabId();

    if (!existingTabId) {
      var newTabId = generateTabUUID();
      var initialConfig = storage.loadGlobalConfig();

      setSessionItem(storage.TAB_ID_SESSION_KEY, newTabId);
      saveTabConfig(initialConfig, newTabId);

      return {
        tabId: newTabId,
        tabInstanceConfig: initialConfig,
        isNewTabInstance: true
      };
    }

    var existingConfig = loadTabConfig(existingTabId);

    if (existingConfig) {
      return {
        tabId: existingTabId,
        tabInstanceConfig: existingConfig,
        isNewTabInstance: false
      };
    }

    var recoveredConfig = storage.getDefaultConfig();
    saveTabConfig(recoveredConfig, existingTabId);

    return {
      tabId: existingTabId,
      tabInstanceConfig: recoveredConfig,
      isNewTabInstance: false,
      recoveredMissingTabConfig: true
    };
  }

  window.generateTabUUID = generateTabUUID;
  window.createTabInstance = createTabInstance;
  window.loadTabConfig = loadTabConfig;
  window.saveTabConfig = saveTabConfig;

  window.WeatherTabState = {
    generateTabUUID: generateTabUUID,
    createTabInstance: createTabInstance,
    loadTabConfig: loadTabConfig,
    saveTabConfig: saveTabConfig,
    getCurrentTabId: getCurrentTabId
  };
})(window);
