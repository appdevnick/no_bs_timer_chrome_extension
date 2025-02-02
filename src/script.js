document.addEventListener('DOMContentLoaded', () => {
  const hoursInput = document.getElementById('hours-input');
  const minutesInput = document.getElementById('minutes-input');
  const secondsInput = document.getElementById('seconds-input');
  
  const hoursDisplay = document.getElementById('hours');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  
  const startButton = document.getElementById('start-btn');
  const pauseButton = document.getElementById('pause-btn');
  const resetButton = document.getElementById('reset-btn');
  
  let intervalId;
  let totalSeconds = 0;
  let isRunning = false;
  
  function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    hoursDisplay.textContent = hours.toString().padStart(2, '0');
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
  }
  
  function startTimer() {
    if (isRunning) return;
    
    // Get initial values from inputs
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds <= 0) return;
    
    isRunning = true;
    intervalId = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        isRunning = false;
        return;
      }
      
      totalSeconds--;
      updateDisplay();
    }, 1000);
  }
  
  function pauseTimer() {
    if (!isRunning) return;
    
    clearInterval(intervalId);
    isRunning = false;
  }
  
  function resetTimer() {
    clearInterval(intervalId);
    isRunning = false;
    
    // Reset to input values
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    updateDisplay();
  }
  
  // Initial display setup
  resetTimer();
  
  // Event listeners
  startButton.addEventListener('click', startTimer);
  pauseButton.addEventListener('click', pauseTimer);
  resetButton.addEventListener('click', resetTimer);
});
