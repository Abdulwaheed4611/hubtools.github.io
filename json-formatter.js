class JSONFormatter {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.indentSize = document.getElementById('indentSize');
        
        this.formatBtn = document.getElementById('formatBtn');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.validateBtn = document.getElementById('validateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyOutputBtn = document.getElementById('copyOutputBtn');
        
        this.jsonStatus = document.getElementById('jsonStatus');
        this.jsonSize = document.getElementById('jsonSize');
        this.outputStatus = document.getElementById('outputStatus');
        this.outputSize = document.getElementById('outputSize');
        
        this.treeSection = document.getElementById('treeSection');
        this.jsonTree = document.getElementById('jsonTree');
        this.analysisSection = document.getElementById('analysisSection');
        this.jsonAnalysis = document.getElementById('jsonAnalysis');
        
        this.init();
    }
    
    init() {
        // Load saved data
        this.loadSavedData();
        
        // Event listeners
        this.jsonInput.addEventListener('input', () => {
            this.updateInputStats();
            this.saveData();
            this.autoValidate();
        });
        
        this.indentSize.addEventListener('change', () => {
            this.saveData();
            if (this.jsonOutput.value) {
                this.formatJSON();
            }
        });
        
        this.formatBtn.addEventListener('click', () => this.formatJSON());
        this.minifyBtn.addEventListener('click', () => this.minifyJSON());
        this.validateBtn.addEventListener('click', () => this.validateJSON());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        this.copyOutputBtn.addEventListener('click', () => {
            const output = this.jsonOutput.value;
            if (!output) {
                showAlert('No output to copy!', 'warning');
                return;
            }
            copyToClipboard(output, this.copyOutputBtn);
        });
        
        // Initial stats update
        this.updateInputStats();
        
        // Auto-validate on load if there's content
        if (this.jsonInput.value.trim()) {
            this.autoValidate();
        }
    }
    
    autoValidate() {
        const input = this.jsonInput.value.trim();
        if (!input) {
            this.jsonStatus.textContent = 'Ready';
            this.jsonStatus.className = '';
            return;
        }
        
        try {
            JSON.parse(input);
            this.jsonStatus.textContent = 'Valid JSON';
            this.jsonStatus.className = 'json-valid';
        } catch (error) {
            this.jsonStatus.textContent = `Invalid: ${error.message}`;
            this.jsonStatus.className = 'json-invalid';
        }
    }
    
    validateJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON data to validate', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            showAlert('JSON is valid!', 'success');
            this.jsonStatus.textContent = 'Valid JSON';
            this.jsonStatus.className = 'json-valid';
            
            this.generateTreeView(parsed);
            this.analyzeJSON(parsed);
        } catch (error) {
            showAlert(`Invalid JSON: ${error.message}`, 'error');
            this.jsonStatus.textContent = `Invalid: ${error.message}`;
            this.jsonStatus.className = 'json-invalid';
            
            this.hideAnalysis();
        }
    }
    
    formatJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON data to format', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const indentSpaces = parseInt(this.indentSize.value) || 2;
            const formatted = JSON.stringify(parsed, null, indentSpaces);
            
            this.jsonOutput.value = formatted;
            this.updateOutputStats();
            this.outputStatus.textContent = 'Formatted';
            this.outputStatus.className = 'json-valid';
            
            showAlert('JSON formatted successfully!', 'success');
            
            this.generateTreeView(parsed);
            this.analyzeJSON(parsed);
        } catch (error) {
            showAlert(`Error formatting JSON: ${error.message}`, 'error');
        }
    }
    
    minifyJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            showAlert('Please enter JSON data to minify', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            this.jsonOutput.value = minified;
            this.updateOutputStats();
            this.outputStatus.textContent = 'Minified';
            this.outputStatus.className = 'json-valid';
            
            showAlert('JSON minified successfully!', 'success');
            
            this.generateTreeView(parsed);
            this.analyzeJSON(parsed);
        } catch (error) {
            showAlert(`Error minifying JSON: ${error.message}`, 'error');
        }
    }
    
    generateTreeView(obj, level = 0) {
        let html = '';
        const indent = '  '.repeat(level);
        
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                html += `${indent}<span style="color: var(--text-muted);">[</span>\n`;
                obj.forEach((item, index) => {
                    html += this.generateTreeView(item, level + 1);
                    if (index < obj.length - 1) {
                        html += `<span style="color: var(--text-muted);">,</span>`;
                    }
                    html += '\n';
                });
                html += `${indent}<span style="color: var(--text-muted);">]</span>`;
            } else {
                html += `${indent}<span style="color: var(--text-muted);">{</span>\n`;
                const entries = Object.entries(obj);
                entries.forEach(([key, value], index) => {
                    html += `${indent}  <span class="json-key">"${key}"</span><span style="color: var(--text-muted);">:</span> `;
                    html += this.generateTreeView(value, level + 1).trim();
                    if (index < entries.length - 1) {
                        html += `<span style="color: var(--text-muted);">,</span>`;
                    }
                    html += '\n';
                });
                html += `${indent}<span style="color: var(--text-muted);">}</span>`;
            }
        } else {
            html += this.formatValue(obj);
        }
        
        if (level === 0) {
            this.jsonTree.innerHTML = html;
            this.treeSection.classList.remove('hidden');
        }
        
        return html;
    }
    
    formatValue(value) {
        if (typeof value === 'string') {
            return `<span class="json-string">"${value}"</span>`;
        } else if (typeof value === 'number') {
            return `<span class="json-number">${value}</span>`;
        } else if (typeof value === 'boolean') {
            return `<span class="json-boolean">${value}</span>`;
        } else if (value === null) {
            return `<span class="json-null">null</span>`;
        } else {
            return String(value);
        }
    }
    
    analyzeJSON(obj) {
        const analysis = this.performAnalysis(obj);
        
        let html = `
            <div class="result-item">
                <span class="result-label">Type:</span>
                <span class="result-value">${analysis.type}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Properties/Items:</span>
                <span class="result-value">${formatNumber(analysis.count)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Max Depth:</span>
                <span class="result-value">${analysis.depth}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Data Types:</span>
                <span class="result-value">${Object.entries(analysis.types).map(([type, count]) => `${type}: ${count}`).join(', ')}</span>
            </div>
        `;
        
        if (analysis.keys.length > 0) {
            html += `
                <div class="result-item">
                    <span class="result-label">Keys:</span>
                    <span class="result-value">${analysis.keys.slice(0, 5).join(', ')}${analysis.keys.length > 5 ? '...' : ''}</span>
                </div>
            `;
        }
        
        this.jsonAnalysis.innerHTML = html;
        this.analysisSection.classList.remove('hidden');
    }
    
    performAnalysis(obj, depth = 0) {
        const result = {
            type: Array.isArray(obj) ? 'Array' : typeof obj === 'object' && obj !== null ? 'Object' : typeof obj,
            count: 0,
            depth: depth,
            types: {},
            keys: []
        };
        
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                result.count = obj.length;
                obj.forEach(item => {
                    const itemAnalysis = this.performAnalysis(item, depth + 1);
                    result.depth = Math.max(result.depth, itemAnalysis.depth);
                    Object.keys(itemAnalysis.types).forEach(type => {
                        result.types[type] = (result.types[type] || 0) + itemAnalysis.types[type];
                    });
                });
            } else {
                result.count = Object.keys(obj).length;
                result.keys = Object.keys(obj);
                Object.entries(obj).forEach(([key, value]) => {
                    const valueAnalysis = this.performAnalysis(value, depth + 1);
                    result.depth = Math.max(result.depth, valueAnalysis.depth);
                    Object.keys(valueAnalysis.types).forEach(type => {
                        result.types[type] = (result.types[type] || 0) + valueAnalysis.types[type];
                    });
                });
            }
        } else {
            const type = obj === null ? 'null' : typeof obj;
            result.types[type] = (result.types[type] || 0) + 1;
        }
        
        return result;
    }
    
    hideAnalysis() {
        this.treeSection.classList.add('hidden');
        this.analysisSection.classList.add('hidden');
    }
    
    updateInputStats() {
        const text = this.jsonInput.value;
        this.jsonSize.textContent = `${formatNumber(text.length)} characters`;
    }
    
    updateOutputStats() {
        const text = this.jsonOutput.value;
        this.outputSize.textContent = `${formatNumber(text.length)} characters`;
    }
    
    clearAll() {
        this.jsonInput.value = '';
        this.jsonOutput.value = '';
        this.updateInputStats();
        this.updateOutputStats();
        this.jsonStatus.textContent = 'Ready';
        this.jsonStatus.className = '';
        this.outputStatus.textContent = 'No output';
        this.outputStatus.className = '';
        this.hideAnalysis();
        this.saveData();
        this.jsonInput.focus();
    }
    
    saveData() {
        const data = {
            input: this.jsonInput.value,
            indentSize: this.indentSize.value
        };
        localStorage.setItem('jsonFormatter_data', JSON.stringify(data));
    }
    
    loadSavedData() {
        const data = JSON.parse(localStorage.getItem('jsonFormatter_data') || '{}');
        
        if (data.input) this.jsonInput.value = data.input;
        if (data.indentSize) this.indentSize.value = data.indentSize;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JSONFormatter();
});

