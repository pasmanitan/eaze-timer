// register service worker for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    initServiceWorker();
  });
}

function initServiceWorker() {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service worker is registered successfully"))
    .catch((error) =>
      console.error(`failed to register service worker, error: ${error}`),
    );
}

// ELEMENTS

const form = document.getElementById("form");
const timer = document.querySelector("#timer");
const timerLabel = document.querySelector("#timerLabel");
const jingle = document.querySelector("#jingle");
const resetElement = document.querySelector("#resetElement");

// STATE HANDLERS

let handleInterval = null;
let timerOn = false;
let labelState = "eaze timer";

// FUNCTIONS

function updateDisplay(h, m, s) {
  timer.value =
    `${h < 10 ? "0" + h : h}:` +
    `${m < 10 ? "0" + m : m}:` +
    `${s < 10 ? "0" + s : s}`;
  document.title = timer.value;
}

function startTimer() {
  let values = form.elements["timer"].value.trim().split(":");
  let hrs = 0;
  let mins = 0;
  let secs = 0;

  if (values.length === 3) {
    [hrs, mins, secs] = values.map((n) => Number(n) || 0);
  } else if (values.length === 2) {
    [mins, secs] = values.map((n) => Number(n) || 0);
  } else if (values.length === 1) {
    secs = Number(values[0]) || 0;
  }

  let totalSeconds = hrs * 3600 + mins * 60 + secs;

  if (handleInterval === null && totalSeconds > 0) {
    timerOn = true;
    labelState = "[t]oggle";
    timer.style.textDecoration = "none";
    resetElement.style.display = "block";
    timer.blur();
    handleInterval = setInterval(() => {
      totalSeconds--;

      if (totalSeconds <= 0) {
        resetTimer();
        jingle.play();
        return;
      }

      hrs = Math.floor(totalSeconds / 3600);
      mins = Math.floor((totalSeconds % 3600) / 60);
      secs = totalSeconds % 60;

      updateDisplay(hrs, mins, secs);
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(handleInterval);
  timerOn = false;
  handleInterval = null;
  timer.style.textDecoration = "line-through";
}

function resetTimer() {
  stopTimer();
  timer.value = "";
  timerLabel.textContent = "eaze timer";
  labelState = "eaze timer";
  document.title = "eaze";
  timer.style.textDecoration = "none";
  resetElement.style.display = "none";
}

function toggleTimer() {
  if (timerOn) {
    stopTimer();
  } else {
    startTimer();
  }
}
// START TIMER ON SUBMISSION
form.addEventListener("submit", (e) => {
  e.preventDefault();
  startTimer();
});

// PREVENT ANCILLARY INPUT ONLY NUMS & COLON
timer.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9:]/g, "");
});

// KEYBOARD SHORTCUTS

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "t") {
    e.preventDefault();
    toggleTimer();
  }
  if (e.key === "r") {
    resetTimer();
  }

  if (e.key === "f") {
    e.preventDefault();
    if (timer.matches(":focus") === true) {
      timer.blur();
    } else {
      timer.focus();
    }
  }
});

// timerLabel CHANGING EVENT LISTENERS

timer.addEventListener("focus", () => {
  timerLabel.textContent = "[f]ocus";
  resetElement.style.display = "none";
});

timer.addEventListener("focusout", () => {
  timerLabel.textContent = `${labelState}`;
  if (labelState === "[t]oggle") {
    resetElement.style.display = "block";
  }
});

timerLabel.addEventListener("mouseenter", () => {
  if (labelState === "eaze timer") {
    timerLabel.textContent = "made by paz";
  }
});

timerLabel.addEventListener("mouseleave", () => {
  timerLabel.textContent = `${labelState}`;
});

timerLabel.addEventListener("click", () => {
  timer.blur();
  if (timerLabel.textContent === "made by paz") {
    window.open("https://pasmanitan.vercel.app", "_blank");
  }
  if (labelState === "[t]oggle") {
    toggleTimer();
  }
});

resetElement.addEventListener("click", () => {
  timer.blur();
  resetTimer();
});
