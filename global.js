// Global JavaScript for Online Tools Hub
class ToolsHub {
    constructor() {
        this.tools = [
            {
                id: 'word-counter',
                name: 'Word Counter',
                description: 'Count words, characters, paragraphs and reading time in your text.',
                icon: 'fas fa-file-word',
                url: 'word-counter.html',
                category: 'text'
            },
            {
                id: 'password-generator',
                name: 'Password Generator',
                description: 'Generate secure passwords with customizable length and character sets.',
                icon: 'fas fa-key',
                url: 'password-generator.html',
                category: 'security'
            },
            {
                id: 'bmi-calculator',
                name: 'BMI Calculator',
                description: 'Calculate your Body Mass Index and get health recommendations.',
                icon: 'fas fa-weight',
                url: 'bmi-calculator.html',
                category: 'health'
            },
            {
                id: 'age-calculator',
                name: 'Age Calculator',
                description: 'Calculate your exact age in years, months, days, hours and minutes.',
                icon: 'fas fa-calendar',
                url: 'age-calculator.html',
                category: 'utility'
            },
            {
                id: 'json-formatter',
                name: 'JSON Formatter',
                description: 'Format, validate and minify JSON data with syntax highlighting.',
                icon: 'fas fa-code',
                url: 'json-formatter.html',
                category: 'development'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupDarkMode();
        this.setupSearch();
        this.renderTools();
        this.setupShareButtons();
    }
    
    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateDarkModeIcon(savedTheme);
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateDarkModeIcon(newTheme);
            });
        }
    }
    
    updateDarkModeIcon(theme) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTools(e.target.value);
            });
        }
    }
    
    filterTools(searchTerm) {
        const filteredTools = this.tools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.renderTools(filteredTools);
    }
    
    renderTools(toolsToRender = this.tools) {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;
        
        toolsGrid.innerHTML = '';
        
        if (toolsToRender.length === 0) {
            toolsGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h3>No tools found</h3>
                    <p>Try adjusting your search term</p>
                </div>
            `;
            return;
        }
        
        toolsToRender.forEach(tool => {
            const toolCard = document.createElement('a');
            toolCard.href = tool.url;
            toolCard.className = 'tool-card';
            toolCard.innerHTML = `
                <i class="${tool.icon} tool-icon"></i>
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
            `;
            toolsGrid.appendChild(toolCard);
        });
    }
    
    setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareUrl = '';
                if (button.classList.contains('share-twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                } else if (button.classList.contains('share-facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                } else if (button.classList.contains('share-whatsapp')) {
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
    
    // Utility functions for tools
    copyToClipboard(text, buttonElement = null) {
        navigator.clipboard.writeText(text).then(() => {
            this.showAlert('Copied to clipboard!', 'success');
            if (buttonElement) {
                const originalText = buttonElement.innerHTML;
                buttonElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    buttonElement.innerHTML = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
            this.showAlert('Failed to copy to clipboard', 'error');
        });
    }
    
    showAlert(message, type = 'success') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        const container = document.querySelector('.tool-main') || document.querySelector('.main-content');
        container.insertBefore(alert, container.firstChild);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
    
    saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
    
    loadFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return defaultValue;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.toolsHub = new ToolsHub();
});

// Make utility functions globally available
window.copyToClipboard = (text, button) => window.toolsHub.copyToClipboard(text, button);
window.showAlert = (message, type) => window.toolsHub.showAlert(message, type);
window.formatNumber = (num) => window.toolsHub.formatNumber(num);

