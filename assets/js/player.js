// Read-aloud player in the site's colours (MARKET-69). Replaces the browser's own controls of every
// <figure class="listen"> audio with a play button, a seek bar and the time. Without JavaScript the
// native controls stay.
(function () {
  var de = document.documentElement.lang === "de";
  var L = de ? { play: "Abspielen", pause: "Pause", seek: "Position" } : { play: "Play", pause: "Pause", seek: "Position" };
  function fmt(s) {
    if (!isFinite(s)) return "–:––";
    s = Math.floor(s);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  document.querySelectorAll("figure.listen audio").forEach(function (audio) {
    var bar = document.createElement("div");
    bar.className = "listen__bar";
    bar.innerHTML = '<button type="button" class="listen__play"><svg viewBox="0 0 16 16" aria-hidden="true">' +
      '<path class="i-play" d="M4 2.5v11l9-5.5z"/><path class="i-pause" d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg></button>' +
      '<input type="range" class="listen__seek" min="0" max="0" step="1" value="0">' +
      '<span class="listen__time">0:00 / –:––</span>';
    var btn = bar.querySelector("button"), seek = bar.querySelector("input"), time = bar.querySelector("span");
    btn.setAttribute("aria-label", L.play);
    seek.setAttribute("aria-label", L.seek);
    function show() {
      var d = audio.duration, t = audio.currentTime;
      if (isFinite(d)) seek.max = Math.floor(d);
      seek.value = Math.floor(t);
      seek.style.setProperty("--p", (isFinite(d) && d > 0 ? (t / d) * 100 : 0) + "%");
      time.textContent = fmt(t) + " / " + fmt(d);
    }
    btn.addEventListener("click", function () { audio.paused ? audio.play() : audio.pause(); });
    seek.addEventListener("input", function () { audio.currentTime = Number(seek.value); show(); });
    audio.addEventListener("play", function () { bar.classList.add("is-playing"); btn.setAttribute("aria-label", L.pause); });
    audio.addEventListener("pause", function () { bar.classList.remove("is-playing"); btn.setAttribute("aria-label", L.play); });
    ["timeupdate", "loadedmetadata", "durationchange", "ended"].forEach(function (e) { audio.addEventListener(e, show); });
    audio.removeAttribute("controls");
    audio.hidden = true;
    audio.parentNode.insertBefore(bar, audio);
  });
})();
