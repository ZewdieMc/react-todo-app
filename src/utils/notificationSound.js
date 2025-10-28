// Utility for playing notification sounds
class NotificationSound {
  constructor() {
    this.audioContext = null;
    this.isEnabled = localStorage.getItem('notificationSoundEnabled') !== 'false';
  }

  // Initialize Web Audio API
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Generate a pleasant notification beep using Web Audio API
  playBeep(frequency = 800, duration = 0.2) {
    if (!this.isEnabled) return;

    this.initAudioContext();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration,
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Play a pleasant multi-tone notification
  playNotification() {
    if (!this.isEnabled) return;

    // Play a pleasant two-tone notification
    this.playBeep(600, 0.15);
    setTimeout(() => this.playBeep(800, 0.15), 150);
  }

  // Play success sound
  playSuccess() {
    if (!this.isEnabled) return;

    this.playBeep(523.25, 0.1); // C5
    setTimeout(() => this.playBeep(659.25, 0.1), 100); // E5
    setTimeout(() => this.playBeep(783.99, 0.15), 200); // G5
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('notificationSoundEnabled', enabled.toString());
  }

  isNotificationEnabled() {
    return this.isEnabled;
  }
}

const notificationSound = new NotificationSound();
export default notificationSound;
