
class InstagramViewer {
    static async render(url, container) {
        try {
            const postId = this.extractPostId(url);
            
            container.innerHTML = `
                <div class="instagram-viewer">
                    <div class="instagram-disclaimer">
                        <strong>Instagram Content Detected</strong><br>
                        Instagram videos cannot be played directly due to platform restrictions and privacy policies.
                    </div>
                    
                    <div class="instagram-options">
                        <h3>Available Options:</h3>
                        
                        <div class="option-card">
                            <h4>🔗 Open in Instagram</h4>
                            <p>View the content directly on Instagram's platform</p>
                            <a href="${url}" target="_blank" rel="noopener" class="browse-btn">
                                Open on Instagram
                            </a>
                        </div>
                        
                        <div class="option-card">
                            <h4>📱 Instagram Embed</h4>
                            <p>Instagram's official embed (may require login)</p>
                            <div class="embed-container">
                                <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14">
                                    <a href="${url}" target="_blank" rel="noopener">View this post on Instagram</a>
                                </blockquote>
                                <script async src="//www.instagram.com/embed.js"></script>
                            </div>
                        </div>
                        
                        <div class="option-card">
                            <h4>ℹ️ Third-Party Tools</h4>
                            <p>Use external services to download Instagram content (at your own risk)</p>
                            <small style="color: #666;">
                                Note: Always respect copyright and Instagram's Terms of Service
                            </small>
                        </div>
                    </div>
                    
                    <div class="legal-notice">
                        <strong>Legal Notice:</strong> Instagram content is protected by copyright. 
                        Only download or view content you own or have permission to access.
                        OmniPlay is not affiliated with Instagram/Meta.
                    </div>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<div class="error-message">Error processing Instagram URL: ${error.message}</div>`;
        }
    }
    
    static extractPostId(url) {
        const patterns = [
            /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
            /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
            /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    static isInstagramUrl(url) {
        return /(?:instagram\.com)/.test(url) && 
               (/\/p\/|\/reel\/|\/tv\//.test(url));
    }
}
