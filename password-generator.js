class PasswordGenerator {
    constructor() {
        this.lengthSlider = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        this.excludeAmbiguous = document.getElementById('excludeAmbiguous');
        
        this.generateBtn = document.getElementById('generateBtn');
        this.generatedPassword = document.getElementById('generatedPassword');
        this.copyPasswordBtn = document.getElementById('copyPasswordBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.passwordStrength = document.getElementById('passwordStrength');
        this.passwordHistory = document.getElementById('passwordHistory');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        this.characters = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.similarChars = '0O1lI|';
        this.ambiguousChars = '{}[]()/\\~`,';
        
        this.init();
    }
    
    init() {
        // Load saved settings
        this.loadSettings();
        
        // Event listeners
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            this.saveSettings();
        });
        
        [this.includeLowercase, this.includeUppercase, this.includeNumbers, 
         this.includeSymbols, this.excludeSimilar, this.excludeAmbiguous].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.saveSettings());
        });
        
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.refreshBtn.addEventListener('click', () => this.generatePassword());
        
        this.copyPasswordBtn.addEventListener('click', () => {
            const password = this.generatedPassword.value;
            if (!password) {
                showAlert('No password to copy!', 'warning');
                return;
            }
            copyToClipboard(password, this.copyPasswordBtn);
        });
        
        this.clearHistoryBtn.addEventListener('click', () => {
            localStorage.removeItem('passwordGenerator_history');
            this.loadPasswordHistory();
            showAlert('Password history cleared', 'success');
        });
        
        // Load password history
        this.loadPasswordHistory();
        
        // Generate initial password
        this.generatePassword();
    }
    
    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        let charset = '';
        
        // Build character set
        if (this.includeLowercase.checked) {
            charset += this.characters.lowercase;
        }
        if (this.includeUppercase.checked) {
            charset += this.characters.uppercase;
        }
        if (this.includeNumbers.checked) {
            charset += this.characters.numbers;
        }
        if (this.includeSymbols.checked) {
            charset += this.characters.symbols;
        }
        
        // Exclude characters if selected
        if (this.excludeSimilar.checked) {
            charset = charset.split('').filter(char => !this.similarChars.includes(char)).join('');
        }
        if (this.excludeAmbiguous.checked) {
            charset = charset.split('').filter(char => !this.ambiguousChars.includes(char)).join('');
        }
        
        if (charset.length === 0) {
            showAlert('Please select at least one character type!', 'error');
            return;
        }
        
        // Generate password
        let password = '';
        
        // Ensure at least one character from each selected type
        const requiredChars = [];
        if (this.includeLowercase.checked) {
            let chars = this.characters.lowercase;
            if (this.excludeSimilar.checked) chars = chars.split('').filter(char => !this.similarChars.includes(char)).join('');
            if (this.excludeAmbiguous.checked) chars = chars.split('').filter(char => !this.ambiguousChars.includes(char)).join('');
            if (chars.length > 0) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        if (this.includeUppercase.checked) {
            let chars = this.characters.uppercase;
            if (this.excludeSimilar.checked) chars = chars.split('').filter(char => !this.similarChars.includes(char)).join('');
            if (this.excludeAmbiguous.checked) chars = chars.split('').filter(char => !this.ambiguousChars.includes(char)).join('');
            if (chars.length > 0) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        if (this.includeNumbers.checked) {
            let chars = this.characters.numbers;
            if (this.excludeSimilar.checked) chars = chars.split('').filter(char => !this.similarChars.includes(char)).join('');
            if (chars.length > 0) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        if (this.includeSymbols.checked) {
            let chars = this.characters.symbols;
            if (this.excludeAmbiguous.checked) chars = chars.split('').filter(char => !this.ambiguousChars.includes(char)).join('');
            if (chars.length > 0) requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        
        // Fill remaining length with random characters
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        // Replace some characters with required ones
        requiredChars.forEach((char, index) => {
            if (index < length) {
                const pos = Math.floor(Math.random() * length);
                password = password.substring(0, pos) + char + password.substring(pos + 1);
            }
        });
        
        this.generatedPassword.value = password;
        this.updatePasswordStrength(password);
        this.addToHistory(password);
    }
    
    updatePasswordStrength(password) {
        const score = this.calculatePasswordStrength(password);
        const strengthText = this.getStrengthText(score);
        const strengthColor = this.getStrengthColor(score);
        
        this.passwordStrength.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>Strength:</span>
                <div style="background: var(--bg-tertiary); border-radius: 10px; overflow: hidden; flex: 1; height: 10px;">
                    <div style="background: ${strengthColor}; height: 100%; width: ${score}%; transition: all 0.3s ease;"></div>
                </div>
                <span style="color: ${strengthColor}; font-weight: bold;">${strengthText}</span>
            </div>
        `;
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length bonus
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 15;
        if (password.length >= 16) score += 10;
        
        // Character diversity bonus
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^a-zA-Z0-9]/.test(password)) score += 20;
        
        return Math.min(100, score);
    }
    
    getStrengthText(score) {
        if (score < 30) return 'Weak';
        if (score < 60) return 'Fair';
        if (score < 80) return 'Good';
        return 'Strong';
    }
    
    getStrengthColor(score) {
        if (score < 30) return '#dc3545';
        if (score < 60) return '#ffc107';
        if (score < 80) return '#17a2b8';
        return '#28a745';
    }
    
    addToHistory(password) {
        let history = JSON.parse(localStorage.getItem('passwordGenerator_history') || '[]');
        history.unshift({
            password: password,
            timestamp: new Date().toLocaleString(),
            length: password.length,
            strength: this.getStrengthText(this.calculatePasswordStrength(password))
        });
        
        // Keep only last 10 passwords
        history = history.slice(0, 10);
        localStorage.setItem('passwordGenerator_history', JSON.stringify(history));
        
        this.loadPasswordHistory();
    }
    
    loadPasswordHistory() {
        const history = JSON.parse(localStorage.getItem('passwordGenerator_history') || '[]');
        
        if (history.length === 0) {
            this.passwordHistory.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No passwords generated yet</p>';
            return;
        }
        
        this.passwordHistory.innerHTML = history.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--border-radius); margin-bottom: 5px; font-family: monospace; font-size: 0.9rem;">
                <div style="flex: 1; overflow: hidden; text-overflow: ellipsis;">
                    <div style="font-weight: bold;">${item.password}</div>
                    <div style="color: var(--text-muted); font-size: 0.8rem;">${item.timestamp} • ${item.length} chars • ${item.strength}</div>
                </div>
                <button onclick="copyToClipboard('${item.password}', this)" class="btn btn-success" style="padding: 5px 10px; font-size: 0.8rem;" title="Copy password">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `).join('');
    }
    
    saveSettings() {
        const settings = {
            length: this.lengthSlider.value,
            includeLowercase: this.includeLowercase.checked,
            includeUppercase: this.includeUppercase.checked,
            includeNumbers: this.includeNumbers.checked,
            includeSymbols: this.includeSymbols.checked,
            excludeSimilar: this.excludeSimilar.checked,
            excludeAmbiguous: this.excludeAmbiguous.checked
        };
        localStorage.setItem('passwordGenerator_settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('passwordGenerator_settings') || '{}');
        
        if (settings.length) {
            this.lengthSlider.value = settings.length;
            this.lengthValue.textContent = settings.length;
        }
        if (settings.hasOwnProperty('includeLowercase')) this.includeLowercase.checked = settings.includeLowercase;
        if (settings.hasOwnProperty('includeUppercase')) this.includeUppercase.checked = settings.includeUppercase;
        if (settings.hasOwnProperty('includeNumbers')) this.includeNumbers.checked = settings.includeNumbers;
        if (settings.hasOwnProperty('includeSymbols')) this.includeSymbols.checked = settings.includeSymbols;
        if (settings.hasOwnProperty('excludeSimilar')) this.excludeSimilar.checked = settings.excludeSimilar;
        if (settings.hasOwnProperty('excludeAmbiguous')) this.excludeAmbiguous.checked = settings.excludeAmbiguous;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});

