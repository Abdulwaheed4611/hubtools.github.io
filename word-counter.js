class WordCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.charCountNoSpaces = document.getElementById('charCountNoSpaces');
        this.paragraphCount = document.getElementById('paragraphCount');
        this.sentenceCount = document.getElementById('sentenceCount');
        this.readingTime = document.getElementById('readingTime');
        this.speakingTime = document.getElementById('speakingTime');
        
        this.init();
    }
    
    init() {
        // Load saved text from localStorage
        const savedText = localStorage.getItem('wordCounter_text');
        if (savedText) {
            this.textInput.value = savedText;
            this.updateCounts();
        }
        
        // Event listeners
        this.textInput.addEventListener('input', () => {
            this.updateCounts();
            this.saveText();
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.textInput.value = '';
            this.updateCounts();
            this.saveText();
            this.textInput.focus();
        });
        
        this.copyBtn.addEventListener('click', () => {
            const text = this.textInput.value;
            if (text.trim() === '') {
                showAlert('No text to copy!', 'warning');
                return;
            }
            copyToClipboard(text, this.copyBtn);
        });
        
        // Initial count update
        this.updateCounts();
    }
    
    updateCounts() {
        const text = this.textInput.value;
        
        // Word count
        const words = this.countWords(text);
        this.wordCount.textContent = formatNumber(words);
        
        // Character counts
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        this.charCount.textContent = formatNumber(chars);
        this.charCountNoSpaces.textContent = formatNumber(charsNoSpaces);
        
        // Paragraph count
        const paragraphs = this.countParagraphs(text);
        this.paragraphCount.textContent = formatNumber(paragraphs);
        
        // Sentence count
        const sentences = this.countSentences(text);
        this.sentenceCount.textContent = formatNumber(sentences);
        
        // Reading and speaking time
        const readingTimeMin = this.calculateReadingTime(words);
        const speakingTimeMin = this.calculateSpeakingTime(words);
        this.readingTime.textContent = this.formatTime(readingTimeMin);
        this.speakingTime.textContent = this.formatTime(speakingTimeMin);
    }
    
    countWords(text) {
        if (text.trim() === '') return 0;
        
        // Split by whitespace and filter out empty strings
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }
    
    countParagraphs(text) {
        if (text.trim() === '') return 0;
        
        // Split by double line breaks or single line breaks
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        return paragraphs.length;
    }
    
    countSentences(text) {
        if (text.trim() === '') return 0;
        
        // Split by sentence endings (., !, ?, but not abbreviations)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return sentences.length;
    }
    
    calculateReadingTime(words) {
        // Average reading speed: 200-250 words per minute
        const wordsPerMinute = 225;
        return words / wordsPerMinute;
    }
    
    calculateSpeakingTime(words) {
        // Average speaking speed: 150-180 words per minute
        const wordsPerMinute = 165;
        return words / wordsPerMinute;
    }
    
    formatTime(minutes) {
        if (minutes < 1) {
            const seconds = Math.round(minutes * 60);
            return seconds <= 0 ? '0 sec' : `${seconds} sec`;
        }
        
        const roundedMinutes = Math.round(minutes);
        if (roundedMinutes === 1) {
            return '1 min';
        }
        return `${roundedMinutes} min`;
    }
    
    saveText() {
        localStorage.setItem('wordCounter_text', this.textInput.value);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordCounter();
});

