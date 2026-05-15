(function () {
  var REDIRECT_URL = 'https://viet69.be';
  var TOTAL_MS = 5000;
  var INTERVAL_MS = 50;

  var bar = document.getElementById('progressBar');
  var countdownEl = document.getElementById('countdown');

  if (!bar || !countdownEl) return;

  // Detect back/forward navigation — reliable across origins
  var navEntries = performance.getEntriesByType('navigation');
  var isBackNav =
    navEntries.length > 0 && navEntries[0].type === 'back_forward';

  if (isBackNav) {
    bar.style.width = '100%';
    countdownEl.textContent = '✓';
    return;
  }

  var elapsed = 0;

  var timer = setInterval(function () {
    elapsed += INTERVAL_MS;
    var pct = Math.min((elapsed / TOTAL_MS) * 100, 100);
    bar.style.width = pct + '%';

    var remaining = Math.ceil((TOTAL_MS - elapsed) / 1000);
    countdownEl.textContent = remaining > 0 ? remaining : 0;

    if (elapsed >= TOTAL_MS) {
      clearInterval(timer);
      window.location.href = REDIRECT_URL;
    }
  }, INTERVAL_MS);
})();
