
class MediaController {
    constructor() {
        this.currentMedia = null;
        this.isPlaying = false;
        this.miniPlayerVisible = false;
        this.init();
    }
    
    init() {
        this.createMiniPlayer();
        this.setupPageVisibilityHandling();
    }
    
    createMiniPlayer() {
        const miniPlayer = document.createElement('div');
        miniPlayer.id = 'mini-player';
        miniPlayer.className = 'mini-player hidden';
        miniPlayer.innerHTML = `
            <div class="mini-player-content">
                <div class="mini-player-info">
                    <div class="mini-player-title">No media playing</div>
                    <div class="mini-player-time">00:00 / 00:00</div>
                </div>
                <div class="mini-player-controls">
                    <button class="mini-control-btn" id="mini-prev">⏮</button>
                    <button class="mini-control-btn" id="mini-play-pause">▶️</button>
                    <button class="mini-control-btn" id="mini-next">⏭</button>
                    <button class="mini-control-btn" id="mini-close">✕</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(miniPlayer);
        this.setupMiniPlayerEvents();
    }
    
    setupMiniPlayerEvents() {
        document.getElementById('mini-play-pause').addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        document.getElementById('mini-prev').addEventListener('click', () => {
            this.seekBy(-10);
        });
        
        document.getElementById('mini-next').addEventListener('click', () => {
            this.seekBy(10);
        });
        
        document.getElementById('mini-close').addEventListener('click', () => {
            this.hideMiniPlayer();
            this.stopMedia();
        });
    }
    
    setupPageVisibilityHandling() {
        // Prevent automatic pausing when tab becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (this.currentMedia && this.isPlaying) {
                // Ensure media continues playing in background
                this.currentMedia.play().catch(() => {
                    // Ignore autoplay restrictions
                });
            }
        });
    }
    
    setMedia(mediaElement, filename) {
        // Stop previous media
        if (this.currentMedia) {
            this.currentMedia.pause();
        }
        
        this.currentMedia = mediaElement;
        this.setupMediaEvents(filename);
        this.updateMiniPlayerInfo(filename);
        this.showMiniPlayer();
    }
    
    setupMediaEvents(filename) {
        if (!this.currentMedia) return;
        
        this.currentMedia.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.currentMedia.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        this.currentMedia.addEventListener('timeupdate', () => {
            this.updateTimeDisplay();
        });
        
        this.currentMedia.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        // Prevent automatic pausing due to page visibility
        this.currentMedia.addEventListener('pause', (e) => {
            if (document.hidden && this.isPlaying) {
                // Resume if paused due to visibility change
                setTimeout(() => {
                    this.currentMedia.play().catch(() => {});
                }, 100);
            }
        });
    }
    
    togglePlayPause() {
        if (!this.currentMedia) return;
        
        if (this.isPlaying) {
            this.currentMedia.pause();
        } else {
            this.currentMedia.play().catch(() => {
                console.warn('Autoplay prevented');
            });
        }
    }
    
    seekBy(seconds) {
        if (!this.currentMedia) return;
        this.currentMedia.currentTime = Math.max(0, this.currentMedia.currentTime + seconds);
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('mini-play-pause');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }
    }
    
    updateTimeDisplay() {
        if (!this.currentMedia) return;
        
        const current = this.formatTime(this.currentMedia.currentTime);
        const duration = this.formatTime(this.currentMedia.duration || 0);
        const timeDisplay = document.querySelector('.mini-player-time');
        
        if (timeDisplay) {
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    }
    
    updateMiniPlayerInfo(filename) {
        const titleDisplay = document.querySelector('.mini-player-title');
        if (titleDisplay) {
            titleDisplay.textContent = filename || 'Unknown Media';
        }
    }
    
    showMiniPlayer() {
        const miniPlayer = document.getElementById('mini-player');
        if (miniPlayer) {
            miniPlayer.classList.remove('hidden');
            this.miniPlayerVisible = true;
        }
    }
    
    hideMiniPlayer() {
        const miniPlayer = document.getElementById('mini-player');
        if (miniPlayer) {
            miniPlayer.classList.add('hidden');
            this.miniPlayerVisible = false;
        }
    }
    
    stopMedia() {
        if (this.currentMedia) {
            this.currentMedia.pause();
            this.currentMedia.currentTime = 0;
            this.currentMedia = null;
            this.isPlaying = false;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Global media controller instance
window.mediaController = new MediaController();
