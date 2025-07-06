const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const modeButtons = document.querySelectorAll(".mode-button");
const beep = new Audio("sound/beep-3.mp3");
beep.preload = "auto";

const alarmSound = new Audio("sound/beep-2.mp3");
alarmSound.preload = "auto";

const progressCircle = document.querySelector(".progress-ring-circle");

// Get radius and set up stroke-dasharray
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

let duration = 1500; // Default: 25 minutes
let timeLeft = duration;
let timer;
let currentModeLabel = "Pomodoro";
let isRunning = false;

// Request Notification permission on load
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Format time as mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Update the timer display and progress circle
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);

  const progress = timeLeft / duration;
  const offset = circumference * (1 - progress);
  progressCircle.style.strokeDashoffset = offset;

}

startBtn.addEventListener("click", () => {
  beep.play()
    .then(() => {
      console.log("Sound played successfully");
    })
    .catch(err => {
      console.error(" Audio play blocked:", err);
    });
    startTimer();
});


// Start timer
function startTimer() {
  if (isRunning) return;
  console.log("Timer started");

  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      updateDisplay();

      alarmSound.play().catch(err => console.log("Autoplay blocked:", err));
      showNotification("Time's up!", `Your ${currentModeLabel} session has ended.`);
      console.log("Time's up!");
    }
  }, 1000);
}

stopBtn.addEventListener("click", () => {
  beep.play()
    .then(() => {
      console.log("Stop sound played");
    })
    .catch(err => {
      console.error("Stop sound blocked:", err);
    });

  stopTimer();
});


// Stop timer
function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Handle mode change
modeButtons.forEach(button => {
  button.addEventListener("click", () => {
    modeButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    duration = parseInt(button.dataset.time);
    timeLeft = duration;

    currentModeLabel = button.textContent.trim(); // Update mode label

    stopTimer();
    updateDisplay();
  });
});

// Desktop Notification Function
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
    body: body,
    icon: "sound/timer.png"
    });
  }
}
// Initial render
updateDisplay();

