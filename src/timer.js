class Timer {
  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.totalSeconds = 0;
    this.intervalId = null;
    this.isPaused = false;

    // DOM Elements
    this.hoursDisplay = document.getElementById('hours');
    this.minutesDisplay = document.getElementById('minutes');
    this.secondsDisplay = document.getElementById('seconds');
    
    this.hoursInput = document.getElementById('hours-input');
    this.minutesInput = document.getElementById('minutes-input');
    this.secondsInput = document.getElementById('seconds-input');
    
    this.startBtn = document.getElementById('start-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.resetBtn = document.getElementById('reset-btn');
    
    this.notificationSound = document.getElementById('notification-sound');
    this.themeToggle = document.getElementById('checkbox');

    this.setupEventListeners();
    this.initializeTheme();
  }

  initializeTheme() {
    // Check for saved theme preference
    chrome.storage.sync.get('theme', ({ theme }) => {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        this.themeToggle.checked = true;
      }
    });
  }

  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());
    
    // Theme toggle event listener
    this.themeToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        chrome.storage.sync.set({ theme: 'dark' });
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        chrome.storage.sync.set({ theme: 'light' });
      }
    });
  }

  start() {
    // If timer is already running, do nothing
    if (this.intervalId) return;

    // Get input values or use previous values
    this.hours = parseInt(this.hoursInput.value) || this.hours;
    this.minutes = parseInt(this.minutesInput.value) || this.minutes;
    this.seconds = parseInt(this.secondsInput.value) || this.seconds;

    // Calculate total seconds
    this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;

    // Start the timer
    this.intervalId = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        this.updateDisplay();
      } else {
        this.timerComplete();
      }
    }, 1000);

    // Disable start button and inputs
    this.startBtn.disabled = true;
    this.hoursInput.disabled = true;
    this.minutesInput.disabled = true;
    this.secondsInput.disabled = true;
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.startBtn.disabled = false;
      this.hoursInput.disabled = false;
      this.minutesInput.disabled = false;
      this.secondsInput.disabled = false;
    }
  }

  reset() {
    // Stop the timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Reset values
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.totalSeconds = 0;

    // Reset display
    this.updateDisplay();

    // Reset inputs
    this.hoursInput.value = '';
    this.minutesInput.value = '';
    this.secondsInput.value = '';

    // Enable start button and inputs
    this.startBtn.disabled = false;
    this.hoursInput.disabled = false;
    this.minutesInput.disabled = false;
    this.secondsInput.disabled = false;
  }

  updateDisplay() {
    // Calculate hours, minutes, seconds
    this.hours = Math.floor(this.totalSeconds / 3600);
    this.minutes = Math.floor((this.totalSeconds % 3600) / 60);
    this.seconds = this.totalSeconds % 60;

    // Pad with zeros
    this.hoursDisplay.textContent = this.pad(this.hours);
    this.minutesDisplay.textContent = this.pad(this.minutes);
    this.secondsDisplay.textContent = this.pad(this.seconds);
  }

  timerComplete() {
    // Stop the timer
    clearInterval(this.intervalId);
    this.intervalId = null;

    // Create notification
    this.createNotification();

    // Reset UI
    this.reset();
  }

  createNotification() {
    // Check notification sound preference
    const sound = this.notificationSound.value;
    
    // Create browser notification
    if (Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: 'Your timer has finished.',
        icon: 'icons/icon128.png'
      });

      // Play sound based on selection
      this.playNotificationSound(sound);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Complete!', {
            body: 'Your timer has finished.',
            icon: 'icons/icon128.png'
          });
          
          this.playNotificationSound(sound);
        }
      });
    }
  }

  playNotificationSound(sound) {
    let audioSrc = '';
    switch(sound) {
      case 'bell':
        audioSrc = 'sounds/bell.mp3';
        break;
      case 'chime':
        audioSrc = 'sounds/chime.mp3';
        break;
      case 'default':
        audioSrc = 'sounds/beep.mp3';
        break;
      default:
        return; // No sound
    }

    const audio = new Audio(audioSrc);
    audio.play();
  }

  pad(num) {
    return num.toString().padStart(2, '0');
  }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Timer();
});
