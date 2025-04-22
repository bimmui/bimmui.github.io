Splitting();

var callback = function(){
  document.body.className += ' ' + 'loaded';
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

/*  ===  MUSIC CONTROLLER  ===================================  */

/* one looping Audio object per slide */
const tracks = [
  new Audio('audio/slide1.mp3'),
  new Audio('audio/slide2.mp3'),
  new Audio('audio/slide3.mp3'),
  new Audio('audio/slide4.mp3'),
  new Audio('audio/slide5.mp3'),
  new Audio('audio/slide6.mp3'),
  new Audio('audio/slide7.mp3'),
  new Audio('audio/slide8.mp3'),
  new Audio('audio/slide9.mp3')
];
tracks.forEach(t => {
  t.loop   = true;  // keep playing while the slide is up
  t.volume = 0;     // start silent – we’ll fade in
});

/* helpers --------------------------------------------------- */
function fade(audio, targetVol, ms = 1500, cb) {
  const steps   = 30;
  const step    = (targetVol - audio.volume) / steps;
  const delay   = ms / steps;
  const tween   = setInterval(() => {
    audio.volume = Math.min(1, Math.max(0, audio.volume + step));
    if ((step > 0 ? audio.volume >= targetVol : audio.volume <= targetVol)) {
      clearInterval(tween);
      if (cb) cb();
    }
  }, delay);
}

function playSlide(i) {
  currentTrack = tracks[i];
  currentTrack.currentTime = 0;
  currentTrack.play();
  fade(currentTrack, 1);          // fade‑in to full volume
}

function stopSlide(track = currentTrack) {
  fade(track, 0, 800, () => {
    track.pause();
    track.currentTime = 0;
  });
}

/* wiring ---------------------------------------------------- */
const checkbox = document.querySelector('body > input[type="checkbox"]');   // “Enter / Back”
const radios    = document.querySelectorAll('#wrapper input[name="rad"]');  // slides

let currentIndex  = 0;            // rad1 is checked in the markup
let currentTrack  = tracks[0];    // keep reference for fade‑out

/* Enter / Back flip */
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {         // ENTER (flip to back)
    playSlide(currentIndex);
  } else {                        // BACK (flip to front)
    stopSlide();
  }
});

/* Slide changes */
radios.forEach((r, i) => {
  r.addEventListener('change', () => {
    if (!r.checked) return;       // ignore the un‑checking event
    if (i === currentIndex) return;

    /* update slide index */
    const oldTrack = currentTrack;
    currentIndex   = i;

    /* if we’re on the back side, cross‑fade */
    if (checkbox.checked) {
      stopSlide(oldTrack);
      playSlide(i);
    }
  });
});

/* preload first track so it’s ready when Enter is hit */
tracks[0].load();