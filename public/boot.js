// Runs before first paint. Reveal targets are hidden only when scripts run, and the page
// fails open (everything visible) if the main module never boots. Kept as an external
// file so the production CSP (script-src 'self') needs no inline-script exception.
document.documentElement.classList.add("js");
setTimeout(function () {
  if (!window.__nebulaBooted) document.documentElement.classList.remove("js");
}, 4000);
