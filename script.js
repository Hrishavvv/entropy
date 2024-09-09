let isRunning = false;
let timer = document.getElementById('timer');
let indicator = document.getElementById('indicator');
let concentrationBox = document.getElementById('concentration-box');
let breakCount = document.getElementById('break-count');
let toggleModeBtn = document.getElementById('toggle-mode');
let resetButton = document.getElementById('reset-button');
let totalTimeBox = document.getElementById('total-time-box');
let totalTime = document.getElementById('total-time');
let body = document.body;

let startTime, elapsedTime = 0, timerInterval, breaks = 0;
let accumulatedTime = localStorage.getItem('totalTime') ? parseInt(localStorage.getItem('totalTime')) : 0;
totalTime.textContent = timeFormatter(accumulatedTime);

// Format time into 00:00:00
function timeFormatter(time) {
  let hours = Math.floor(time / (60 * 60));
  let minutes = Math.floor((time % (60 * 60)) / 60);
  let seconds = time % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update timer function
function updateTimer() {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  timer.textContent = timeFormatter(elapsedTime);

  // Update concentration level based on elapsed time
  if (accumulatedTime + elapsedTime >= 3600) {
    concentrationBox.textContent = 'A';
  } else if (accumulatedTime + elapsedTime >= 1800) {
    concentrationBox.textContent = 'B';
  } else {
    concentrationBox.textContent = 'C';
  }

  // Update total time dynamically
  totalTime.textContent = timeFormatter(accumulatedTime + elapsedTime);
}

// Start/Stop timer when clicked
timer.addEventListener('click', function() {
  toggleTimer();
});

// Start/Stop timer
function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    accumulatedTime += elapsedTime;
    localStorage.setItem('totalTime', accumulatedTime);
    breaks++;
    breakCount.textContent = breaks;
  } else {
    startTime = Date.now() - elapsedTime * 1000;
    timerInterval = setInterval(updateTimer, 1000);
    isRunning = true;
  }
  toggleIndicator();
}

// Reset timer
resetButton.addEventListener('click', function() {
  resetTimer();
});

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  accumulatedTime += elapsedTime;
  localStorage.setItem('totalTime', accumulatedTime);
  elapsedTime = 0;
  timer.textContent = '00:00:00';
  totalTime.textContent = timeFormatter(accumulatedTime);
  toggleIndicator();
}

// Show/hide play/pause icon
function toggleIndicator() {
  indicator.classList.remove('hidden');
  setTimeout(() => {
    indicator.classList.add('hidden');
  }, 500);
}

// Toggle between light and dark modes
toggleModeBtn.addEventListener('click', function() {
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  }
  toggleModeIcons();
});

// Set correct toggle icon for light/dark mode
function toggleModeIcons() {
  const toggleOff = toggleModeBtn.querySelector('.fa-toggle-off');
  const toggleOn = toggleModeBtn.querySelector('.fa-toggle-on');
  if (body.classList.contains('dark-mode')) {
    toggleOff.classList.add('hidden');
    toggleOn.classList.remove('hidden');
  } else {
    toggleOff.classList.remove('hidden');
    toggleOn.classList.add('hidden');
  }
}

// Initialize mode based on system preferences
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  body.classList.add('dark-mode');
} else {
  body.classList.add('light-mode');
}
toggleModeIcons();

// Detect spacebar key press to toggle timer
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    toggleTimer();
  }
});
