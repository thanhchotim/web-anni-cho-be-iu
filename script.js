/**
 * WEB ANNI QUIN - JAVASCRIPT LOGIC & INTERACTIONS (OPTIMIZED)
 * 
 * Features:
 * 1. Ultra-smooth 5-step envelope opening animation & full-page expansion
 *    - Wax seal strictly stays pinned at center-point without drifting or jumping
 *    - Snappy, hardware-accelerated 60fps transitions
 * 2. Real-time Love Counter starting from 6.8.2025
 * 3. Dual-Audio Floating Music Player for "Sandwich & Story" (MONO)
 *    - Interactive scrubber seek bar to jump to any second
 * 4. Automatic image fallback handler
 * 5. Rose petals & sparkling gold particles engine
 */

(function () {
  'use strict';

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const envelopeStage = document.getElementById('envelope-stage');
  const letterStage = document.getElementById('letter-stage');
  const envelopeFlap = document.getElementById('envelope-flap');
  const waxSealWrapper = document.getElementById('wax-seal-wrapper');
  const waxSealBtn = document.getElementById('wax-seal-button');
  const letterPeek = document.getElementById('letter-peek');
  const resealBtn = document.getElementById('reseal-btn');
  const statusLabel = document.getElementById('status-label');
  const statusPulseDot = document.getElementById('status-pulse-dot');
  const roseBorderLeft = document.getElementById('rose-border-left');
  const roseBorderRight = document.getElementById('rose-border-right');

  // Music Player Elements
  const bgAudio = document.getElementById('bg-audio');
  const vinylRecord = document.getElementById('vinyl-record');
  const vinylContainer = document.getElementById('vinyl-container');
  const toggleMusicBtn = document.getElementById('toggle-music-btn');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const musicSeekSlider = document.getElementById('music-seek-slider');
  const songCurrentTime = document.getElementById('song-current-time');
  const songDurationTime = document.getElementById('song-duration-time');

  // Counter Elements
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMins = document.getElementById('count-mins');
  const countSecs = document.getElementById('count-secs');

  let isAnimating = false;
  let isPlaying = false;
  let isSeeking = false;

  // =========================================================================
  // 1. DUAL AUDIO PLAYER ENGINE ("Sandwich & Story" - MONO)
  //    WITH INTERACTIVE SCRUBBER / SEEK BAR
  // =========================================================================
  const AUDIO_PLAYLIST = [
    {
      src: 'assets/sandwich-and-story.mp3',
      type: 'local'
    },
    {
      src: 'assets/Sandwich & Story.mp3',
      type: 'local'
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/NocturneOp9No2.mp3',
      type: 'online'
    }
  ];

  let currentSourceIndex = 0;

  function initAudioEngine() {
    if (!bgAudio) return;

    bgAudio.volume = 0.85;
    setAudioSource(0);

    // Audio Error -> Fallback to next source
    bgAudio.addEventListener('error', function (e) {
      console.warn('Audio source failed:', AUDIO_PLAYLIST[currentSourceIndex]?.src, e);
      if (currentSourceIndex < AUDIO_PLAYLIST.length - 1) {
        currentSourceIndex++;
        setAudioSource(currentSourceIndex);
        if (isPlaying) {
          playAudio();
        }
      }
    });

    // Metadata loaded -> set duration
    bgAudio.addEventListener('loadedmetadata', function () {
      if (!isNaN(bgAudio.duration) && songDurationTime) {
        songDurationTime.textContent = formatTime(bgAudio.duration);
      }
    });

    // Time update -> sync slider and current time
    bgAudio.addEventListener('timeupdate', function () {
      if (!bgAudio.duration) return;
      
      if (!isSeeking && musicSeekSlider) {
        const progressPercent = (bgAudio.currentTime / bgAudio.duration) * 100;
        musicSeekSlider.value = progressPercent;
      }
      
      if (!isSeeking && songCurrentTime) {
        songCurrentTime.textContent = formatTime(bgAudio.currentTime);
      }

      if (songDurationTime && (!songDurationTime.textContent || songDurationTime.textContent === '0:00')) {
        songDurationTime.textContent = formatTime(bgAudio.duration);
      }
    });

    // Draggable seek slider
    if (musicSeekSlider) {
      musicSeekSlider.addEventListener('input', function () {
        isSeeking = true;
        if (bgAudio.duration) {
          const targetSeconds = (musicSeekSlider.value / 100) * bgAudio.duration;
          if (songCurrentTime) {
            songCurrentTime.textContent = formatTime(targetSeconds);
          }
        }
      });

      musicSeekSlider.addEventListener('change', function () {
        if (bgAudio.duration) {
          const targetSeconds = (musicSeekSlider.value / 100) * bgAudio.duration;
          bgAudio.currentTime = targetSeconds;
        }
        isSeeking = false;
      });
    }

    // Loop on finish
    bgAudio.addEventListener('ended', function () {
      bgAudio.currentTime = 0;
      playAudio();
    });
  }

  function setAudioSource(index) {
    if (!bgAudio || index >= AUDIO_PLAYLIST.length) return;
    currentSourceIndex = index;
    bgAudio.src = AUDIO_PLAYLIST[index].src;
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function playAudio() {
    if (!bgAudio) return;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updatePlayerUI(true);
        })
        .catch(err => {
          console.log('Autoplay deferred:', err);
          isPlaying = false;
          updatePlayerUI(false);
        });
    }
  }

  function pauseAudio() {
    if (!bgAudio) return;
    bgAudio.pause();
    isPlaying = false;
    updatePlayerUI(false);
  }

  function toggleAudio() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function toggleMute() {
    if (!bgAudio) return;
    bgAudio.muted = !bgAudio.muted;
    if (muteIcon) {
      muteIcon.textContent = bgAudio.muted ? 'volume_off' : 'volume_up';
    }
  }

  function updatePlayerUI(active) {
    if (vinylRecord) {
      if (active) {
        vinylRecord.classList.remove('vinyl-paused');
      } else {
        vinylRecord.classList.add('vinyl-paused');
      }
    }
    if (playPauseIcon) {
      playPauseIcon.textContent = active ? 'pause' : 'play_arrow';
    }
  }

  // =========================================================================
  // 2. REAL-TIME LOVE COUNTER (BẮT ĐẦU TỪ 6.8.2025)
  // =========================================================================
  const LOVE_START_DATE = new Date(2025, 7, 6, 0, 0, 0);

  function updateLoveCounter() {
    const now = new Date();
    const diffMs = now - LOVE_START_DATE;
    const absDiff = Math.abs(diffMs);

    const totalDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((absDiff / 1000) % 60);

    if (countDays) countDays.textContent = totalDays.toLocaleString('vi-VN');
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMins) countMins.textContent = String(minutes).padStart(2, '0');
    if (countSecs) countSecs.textContent = String(seconds).padStart(2, '0');
  }

  // =========================================================================
  // 3. ENVELOPE OPENING & FULLSCREEN EXPANSION (OPTIMIZED SNAPPY TIMING)
  // =========================================================================
  function openEnvelopeSequence() {
    if (isAnimating) return;
    isAnimating = true;

    // Start music on user click
    playAudio();

    if (statusLabel) statusLabel.textContent = 'Đang mở niêm phong...';
    if (statusPulseDot) statusPulseDot.className = 'w-2 h-2 rounded-full bg-tertiary-fixed animate-ping';

    // BƯỚC 1: Con dấu sáp phát sáng và vỡ nhẹ ngay tại chỗ cố định (không bị trôi toạ độ)
    if (waxSealWrapper) waxSealWrapper.classList.add('seal-broken');

    // BƯỚC 2 (180ms): Nắp phong bì mở 3D lật ngược lên
    setTimeout(() => {
      if (envelopeFlap) envelopeFlap.classList.add('flap-open');
      triggerRosePetals(25);
    }, 180);

    // BƯỚC 3 (450ms): Bức thư trượt nhẹ lên khỏi phong bì
    setTimeout(() => {
      if (letterPeek) letterPeek.classList.add('letter-sliding-out');
    }, 450);

    // BƯỚC 4 (750ms): Bức thư êm ái mở rộng toàn màn hình
    setTimeout(() => {
      if (letterPeek) letterPeek.classList.add('letter-expanding-fullscreen');
      triggerRosePetals(20);
    }, 750);

    // BƯỚC 5 (1100ms): Hoàn tất chuyển trang sang Screen 2
    setTimeout(() => {
      if (envelopeStage) envelopeStage.classList.add('opacity-0');
      if (letterStage) {
        letterStage.classList.remove('hidden');
        void letterStage.offsetWidth;
        letterStage.classList.remove('opacity-0');
      }

      if (roseBorderLeft) roseBorderLeft.style.opacity = '0.92';
      if (roseBorderRight) roseBorderRight.style.opacity = '0.92';

      setTimeout(() => {
        if (envelopeStage) envelopeStage.classList.add('hidden');
        if (letterPeek) letterPeek.classList.remove('letter-expanding-fullscreen');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        isAnimating = false;
      }, 350);
    }, 1100);
  }

  function resealEnvelope() {
    if (isAnimating) return;
    isAnimating = true;

    if (letterStage) letterStage.classList.add('opacity-0');

    setTimeout(() => {
      if (letterStage) letterStage.classList.add('hidden');
      if (envelopeStage) {
        envelopeStage.classList.remove('hidden');
        void envelopeStage.offsetWidth;
        envelopeStage.classList.remove('opacity-0');
      }

      if (letterPeek) letterPeek.classList.remove('letter-sliding-out');

      setTimeout(() => {
        if (envelopeFlap) envelopeFlap.classList.remove('flap-open');
      }, 250);

      setTimeout(() => {
        if (waxSealWrapper) waxSealWrapper.classList.remove('seal-broken');
        if (statusLabel) statusLabel.textContent = 'Mật thư nguyên vẹn';
        if (statusPulseDot) statusPulseDot.className = 'w-2 h-2 rounded-full bg-primary animate-ping';
        isAnimating = false;
      }, 550);
    }, 350);
  }

  // =========================================================================
  // 4. ROMANTIC ROSE PETALS ENGINE
  // =========================================================================
  function triggerRosePetals(count = 25) {
    const petalColors = ['#8c4b55', '#feaab6', '#cba72f', '#ffd9dd', '#6e2334', '#e9c349'];

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'falling-petal z-[10000]';
      const size = Math.random() * 14 + 10;
      const left = Math.random() * 92 + 4;
      const xEnd = (Math.random() - 0.5) * 180;
      const rot = Math.random() * 380;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const isSparkle = Math.random() > 0.65;

      petal.style.width = size + 'px';
      petal.style.height = (isSparkle ? size : size * 1.35) + 'px';
      petal.style.left = left + '%';
      petal.style.top = (Math.random() * 15 + 10) + '%';
      petal.style.borderRadius = isSparkle ? '50%' : '60% 0 60% 60%';
      petal.style.backgroundColor = color;
      petal.style.setProperty('--x-end', xEnd + 'px');
      petal.style.setProperty('--rot', rot + 'deg');
      petal.style.animationDelay = (Math.random() * 0.3) + 's';
      petal.style.animationDuration = (Math.random() * 1.2 + 2) + 's';
      petal.style.filter = isSparkle
        ? 'drop-shadow(0 0 8px #ffe088)'
        : 'drop-shadow(0 3px 6px rgba(110, 35, 52, 0.35))';

      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 3200);
    }
  }

  // =========================================================================
  // 5. POLAROID IMAGE FALLBACK HANDLER
  // =========================================================================
  window.handlePhotoFallback = function (img, index) {
    const fallbackPath = `assets/defaults/photo${index}.jpg`;
    if (img.src.indexOf(fallbackPath) === -1) {
      img.src = fallbackPath;
    }
  };

  // =========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // =========================================================================
  function init() {
    initAudioEngine();

    // Start live love counter
    updateLoveCounter();
    setInterval(updateLoveCounter, 1000);

    // Wax seal button click
    if (waxSealBtn) {
      waxSealBtn.addEventListener('click', openEnvelopeSequence);
    }

    // Reseal button click
    if (resealBtn) {
      resealBtn.addEventListener('click', resealEnvelope);
    }

    // Music Player controls
    if (toggleMusicBtn) {
      toggleMusicBtn.addEventListener('click', toggleAudio);
    }
    if (vinylContainer) {
      vinylContainer.addEventListener('click', toggleAudio);
    }
    if (muteBtn) {
      muteBtn.addEventListener('click', toggleMute);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
