(function (window, document) {
  'use strict';

  function initializeGlobalConfigAdmin() {
    var storage = window.WeatherStorageManager;
    if (!storage) {
      throw new Error('WeatherStorageManager must be loaded before global-config-admin.js.');
    }

    var controls = Array.prototype.slice.call(
      document.querySelectorAll('[data-global-config-toggle]')
    );
    var status = document.querySelector('[data-global-config-status]');

    if (!controls.length) return;

    function setStatus(message) {
      if (!status) return;
      status.textContent = message;
    }

    function syncControls(config) {
      var normalized = storage.normalizeConfig(config);

      controls.forEach(function (control) {
        var key = control.getAttribute('data-global-config-toggle');
        control.checked = Boolean(normalized[key]);
      });
    }

    function saveFromControls() {
      var nextConfig = storage.loadGlobalConfig();

      controls.forEach(function (control) {
        var key = control.getAttribute('data-global-config-toggle');
        nextConfig[key] = control.checked;
      });

      storage.saveGlobalConfig(nextConfig);
      setStatus('저장 완료: 새 브라우저 탭부터 적용됩니다.');
    }

    controls.forEach(function (control) {
      control.addEventListener('change', saveFromControls);
    });

    syncControls(storage.loadGlobalConfig());
    setStatus('현재 기본 설정입니다. 기존 날씨 탭은 변경되지 않습니다.');

    window.addEventListener('storage', function (event) {
      if (event.key !== storage.GLOBAL_CONFIG_KEY) return;
      syncControls(storage.loadGlobalConfig());
      setStatus('다른 관리자 탭에서 변경된 기본 설정을 반영했습니다.');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGlobalConfigAdmin);
  } else {
    initializeGlobalConfigAdmin();
  }
})(window, document);
