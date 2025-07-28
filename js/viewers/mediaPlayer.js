class MediaPlayer {
    static async render(file, container, mediaType) {
        const objectURL = URL.createObjectURL(file);

        // Clean up URL when window is closed
        container.closest('.file-window').addEventListener('beforeunload', () => {
            URL.revokeObjectURL(objectURL);
        });

        if (mediaType === 'video') {
            container.innerHTML = `
                <div class="video-viewer">
                    <div class="video-container">
                        <video id="video-${Date.now()}" class="enhanced-video" preload="metadata">
                            <source src="${objectURL}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <div class="video-controls">
                            <div class="controls-row">
                                <button class="control-btn play-pause-btn">▶️</button>
                                <button class="control-btn rewind-btn">⏮</button>
                                <button class="control-btn forward-btn">⏭</button>
                                <div class="seek-container">
                                    <input type="range" class="seek-bar" min="0" max="100" value="0">
                                    <span class="time-display">00:00 / 00:00</span>
                                </div>
                                <button class="control-btn loop-btn" title="Loop">🔁</button>
                                <select class="speed-control">
                                    <option value="0.5">0.5x</option>
                                    <option value="1" selected>1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                                <div class="volume-container">
                                    <button class="control-btn volume-btn">🔊</button>
                                    <input type="range" class="volume-bar" min="0" max="100" value="100">
                                </div>
                                <button class="control-btn background-btn" title="Continue in background">🎵</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (mediaType === 'audio') {
            container.innerHTML = `
                <div class="audio-viewer">
                    <div class="audio-info">
                        <h3>${file.name}</h3>
                        <p>Size: ${FileHandler.formatFileSize(file.size)}</p>
                    </div>
                    <div class="audio-container">
                        <audio id="audio-${Date.now()}" class="enhanced-audio" preload="metadata">
                            <source src="${objectURL}" type="${file.type}">
                            Your browser does not support the audio tag.
                        </audio>
                        <div class="audio-controls">
                            <div class="controls-row">
                                <button class="control-btn play-pause-btn">▶️</button>
                                <button class="control-btn rewind-btn">⏮</button>
                                <button class="control-btn forward-btn">⏭</button>
                                <div class="seek-container">
                                    <input type="range" class="seek-bar" min="0" max="100" value="0">
                                    <span class="time-display">00:00 / 00:00</span>
                                </div>
                                <button class="control-btn loop-btn" title="Loop">🔁</button>
                                <select class="speed-control">
                                    <option value="0.5">0.5x</option>
                                    <option value="1" selected>1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                                <div class="volume-container">
                                    <button class="control-btn volume-btn">🔊</button>
                                    <input type="range" class="volume-bar" min="0" max="100" value="100">
                                </div>
                                <button class="control-btn background-btn" title="Continue in background">🎵</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Setup enhanced controls
        this.setupEnhancedControls(container, file.name);
    }

    static setupEnhancedControls(container, filename) {
        const mediaElement = container.querySelector('video, audio');
        const playPauseBtn = container.querySelector('.play-pause-btn');
        const rewindBtn = container.querySelector('.rewind-btn');
        const forwardBtn = container.querySelector('.forward-btn');
        const seekBar = container.querySelector('.seek-bar');
        const timeDisplay = container.querySelector('.time-display');
        const loopBtn = container.querySelector('.loop-btn');
        const speedControl = container.querySelector('.speed-control');
        const volumeBtn = container.querySelector('.volume-btn');
        const volumeBar = container.querySelector('.volume-bar');
        const backgroundBtn = container.querySelector('.background-btn');

        if (!mediaElement) return;

        let isLooping = false;
        let isMuted = false;

        // Play/Pause
        playPauseBtn.addEventListener('click', () => {
            if (mediaElement.paused) {
                mediaElement.play();
            } else {
                mediaElement.pause();
            }
        });

        // Rewind/Forward
        rewindBtn.addEventListener('click', () => {
            mediaElement.currentTime = Math.max(0, mediaElement.currentTime - 10);
        });

        forwardBtn.addEventListener('click', () => {
            mediaElement.currentTime = Math.min(mediaElement.duration, mediaElement.currentTime + 10);
        });

        // Seek bar
        seekBar.addEventListener('input', () => {
            const time = (seekBar.value / 100) * mediaElement.duration;
            mediaElement.currentTime = time;
        });

        // Loop toggle
        loopBtn.addEventListener('click', () => {
            isLooping = !isLooping;
            mediaElement.loop = isLooping;
            loopBtn.style.opacity = isLooping ? '1' : '0.5';
        });

        // Speed control
        speedControl.addEventListener('change', () => {
            mediaElement.playbackRate = parseFloat(speedControl.value);
        });

        // Volume controls
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            mediaElement.muted = isMuted;
            volumeBtn.textContent = isMuted ? '🔇' : '🔊';
        });

        volumeBar.addEventListener('input', () => {
            mediaElement.volume = volumeBar.value / 100;
            if (mediaElement.volume > 0 && isMuted) {
                isMuted = false;
                mediaElement.muted = false;
                volumeBtn.textContent = '🔊';
            }
        });

        // Background playback
        backgroundBtn.addEventListener('click', () => {
            window.mediaController.setMedia(mediaElement, filename);
        });

        // Media events
        mediaElement.addEventListener('play', () => {
            playPauseBtn.textContent = '⏸️';
        });

        mediaElement.addEventListener('pause', () => {
            playPauseBtn.textContent = '▶️';
        });

        mediaElement.addEventListener('timeupdate', () => {
            if (mediaElement.duration) {
                const progress = (mediaElement.currentTime / mediaElement.duration) * 100;
                seekBar.value = progress;

                const current = this.formatTime(mediaElement.currentTime);
                const duration = this.formatTime(mediaElement.duration);
                timeDisplay.textContent = `${current} / ${duration}`;
            }
        });

        // Keyboard shortcuts
        container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    playPauseBtn.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    rewindBtn.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    forwardBtn.click();
                    break;
                case 'l':
                    e.preventDefault();
                    loopBtn.click();
                    break;
                case 'm':
                    e.preventDefault();
                    volumeBtn.click();
                    break;
            }
        });

        // Make container focusable for keyboard events
        container.setAttribute('tabindex', '0');
    }

    static formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}