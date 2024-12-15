class LoadingScreen {
    constructor() {
        this.overlay = null;
        this.initialize();
    }

    initialize() {
        // Create loading overlay if it doesn't exist
        if (!document.getElementById('loadingOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            
            const text = document.createElement('div');
            text.className = 'loading-text';
            text.textContent = 'Loading...';
            
            overlay.appendChild(spinner);
            overlay.appendChild(text);
            document.body.appendChild(overlay);
            
            this.overlay = overlay;
        }
    }

    show(message = 'Loading...') {
        if (this.overlay) {
            const textElement = this.overlay.querySelector('.loading-text');
            if (textElement) {
                textElement.textContent = message;
            }
            this.overlay.style.display = 'flex';
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }
}

// Create a global instance
const loadingScreen = new LoadingScreen();

// Export a global function to wrap async operations with loading screen
window.withLoading = async function(asyncFn, message = 'Loading...') {
    try {
        loadingScreen.show(message);
        const result = await asyncFn();
        return result;
    } finally {
        loadingScreen.hide();
    }
};
