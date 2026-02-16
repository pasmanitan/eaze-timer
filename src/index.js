// ELEMENTS

const form = document.getElementById("form");
const timer = document.querySelector("#timer");
const tlab = document.querySelector("#timer_label");
const jingle = document.querySelector("#jingle");

// STATE HANDLERS

let si = null;
let ton = false;

// FUNCTIONS

function updateDisplay(h, m, s) {
  timer.value =
    `${h < 10 ? "0" + h : h}:` +
    `${m < 10 ? "0" + m : m}:` +
    `${s < 10 ? "0" + s : s}`;
  document.title = timer.value;
}

function startTimer() {
  let vals = form.elements["timer"].value.trim().split(":");
  let hrs = 0;
  let mins = 0;
  let secs = 0;

  if (vals.length === 3) {
    [hrs, mins, secs] = vals.map((n) => Number(n) || 0);
  } else if (vals.length === 2) {
    [mins, secs] = vals.map((n) => Number(n) || 0);
  } else if (vals.length === 1) {
    secs = Number(vals[0]) || 0;
  }

  if (si === null && (hrs > 0 || mins > 0 || secs > 0)) {
    ton = true;
    tlab.textContent = "[t]oggle [r]eset";
    timer.blur();
    si = setInterval(() => {
      if (hrs === 0 && mins === 0 && secs === 0) {
        resetTimer();
        jingle.play();
        return;
      }
      if (secs === 0) {
        if (mins > 0) {
          mins--;
          secs = 59;
        } else if (hrs > 0) {
          hrs--;
          mins = 59;
          secs = 59;
        }
      } else {
        secs--;
      }
      updateDisplay(hrs, mins, secs);
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(si);
  ton = false;
  si = null;
}

function resetTimer() {
  stopTimer();
  timer.value = "";
  tlab.textContent = "eaze timer";
  document.title = "eaze";
}

// EVENT LISTENERS

form.addEventListener("submit", (e) => {
  e.preventDefault();
  startTimer();
});

timer.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9:]/g, "");
});

timer.addEventListener("focus", (e) => {
  tlab.textContent = "[f]ocus";
});

timer.addEventListener("focusout", (e) => {
  if (!ton) {
    tlab.textContent = "eaze timer";
  } else {
    tlab.textContent = "[t]oggle [r]eset";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "t") {
    e.preventDefault();
    if (ton) {
      stopTimer();
    } else {
      startTimer();
    }
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
