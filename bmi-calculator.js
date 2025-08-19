class BMICalculator {
    constructor() {
        this.metricUnits = document.getElementById('metricUnits');
        this.imperialUnits = document.getElementById('imperialUnits');
        this.metricInputs = document.getElementById('metricInputs');
        this.imperialInputs = document.getElementById('imperialInputs');
        
        this.weightKg = document.getElementById('weightKg');
        this.heightCm = document.getElementById('heightCm');
        this.weightLbs = document.getElementById('weightLbs');
        this.heightFt = document.getElementById('heightFt');
        this.heightIn = document.getElementById('heightIn');
        
        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.bmiValue = document.getElementById('bmiValue');
        this.bmiCategory = document.getElementById('bmiCategory');
        this.idealWeight = document.getElementById('idealWeight');
        this.bmiVisualization = document.getElementById('bmiVisualization');
        this.healthRecommendations = document.getElementById('healthRecommendations');
        
        this.init();
    }
    
    init() {
        // Load saved data
        this.loadSavedData();
        
        // Unit toggle
        this.metricUnits.addEventListener('change', () => {
            if (this.metricUnits.checked) {
                this.metricInputs.classList.remove('hidden');
                this.imperialInputs.classList.add('hidden');
            }
        });
        
        this.imperialUnits.addEventListener('change', () => {
            if (this.imperialUnits.checked) {
                this.metricInputs.classList.add('hidden');
                this.imperialInputs.classList.remove('hidden');
            }
        });
        
        // Real-time calculation on input
        [this.weightKg, this.heightCm, this.weightLbs, this.heightFt, this.heightIn].forEach(input => {
            input.addEventListener('input', () => {
                this.saveData();
                if (this.hasValidInputs()) {
                    this.calculateBMI();
                }
            });
        });
        
        this.calculateBtn.addEventListener('click', () => {
            if (this.hasValidInputs()) {
                this.calculateBMI();
            } else {
                showAlert('Please enter valid height and weight values', 'error');
            }
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.clearInputs();
            this.hideResults();
            this.saveData();
        });
        
        // Calculate on page load if data exists
        if (this.hasValidInputs()) {
            this.calculateBMI();
        }
    }
    
    hasValidInputs() {
        if (this.metricUnits.checked) {
            return this.weightKg.value && this.heightCm.value && 
                   parseFloat(this.weightKg.value) > 0 && parseFloat(this.heightCm.value) > 0;
        } else {
            return this.weightLbs.value && this.heightFt.value && 
                   parseFloat(this.weightLbs.value) > 0 && parseFloat(this.heightFt.value) > 0;
        }
    }
    
    calculateBMI() {
        let weightInKg, heightInM;
        
        if (this.metricUnits.checked) {
            weightInKg = parseFloat(this.weightKg.value);
            heightInM = parseFloat(this.heightCm.value) / 100;
        } else {
            // Convert imperial to metric
            const weightLbs = parseFloat(this.weightLbs.value);
            const heightFt = parseFloat(this.heightFt.value) || 0;
            const heightIn = parseFloat(this.heightIn.value) || 0;
            
            weightInKg = weightLbs * 0.453592;
            heightInM = (heightFt * 12 + heightIn) * 0.0254;
        }
        
        const bmi = weightInKg / (heightInM * heightInM);
        
        this.displayResults(bmi, weightInKg, heightInM);
    }
    
    displayResults(bmi, weightInKg, heightInM) {
        this.bmiValue.textContent = bmi.toFixed(1);
        
        const category = this.getBMICategory(bmi);
        this.bmiCategory.textContent = category.name;
        this.bmiCategory.style.color = category.color;
        
        const idealWeightRange = this.calculateIdealWeight(heightInM);
        this.idealWeight.textContent = idealWeightRange;
        
        this.createBMIVisualization(bmi);
        this.displayHealthRecommendations(category);
        
        this.resultsSection.classList.remove('hidden');
    }
    
    getBMICategory(bmi) {
        if (bmi < 18.5) {
            return { name: 'Underweight', color: '#17a2b8', advice: 'Consider gaining weight through healthy eating and exercise.' };
        } else if (bmi < 25) {
            return { name: 'Normal weight', color: '#28a745', advice: 'Maintain your current weight with a balanced diet and regular exercise.' };
        } else if (bmi < 30) {
            return { name: 'Overweight', color: '#ffc107', advice: 'Consider losing weight through diet and exercise.' };
        } else if (bmi < 35) {
            return { name: 'Obese Class I', color: '#dc3545', advice: 'Weight loss is recommended. Consult with a healthcare provider.' };
        } else if (bmi < 40) {
            return { name: 'Obese Class II', color: '#dc3545', advice: 'Significant weight loss is recommended. Seek medical guidance.' };
        } else {
            return { name: 'Obese Class III', color: '#dc3545', advice: 'Medical intervention may be necessary. Consult with healthcare professionals.' };
        }
    }
    
    calculateIdealWeight(heightInM) {
        // Using WHO recommended BMI range of 18.5-24.9
        const minWeight = 18.5 * heightInM * heightInM;
        const maxWeight = 24.9 * heightInM * heightInM;
        
        if (this.metricUnits.checked) {
            return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`;
        } else {
            const minWeightLbs = minWeight * 2.20462;
            const maxWeightLbs = maxWeight * 2.20462;
            return `${minWeightLbs.toFixed(1)} - ${maxWeightLbs.toFixed(1)} lbs`;
        }
    }
    
    createBMIVisualization(bmi) {
        const ranges = [
            { min: 0, max: 18.5, label: 'Underweight', color: '#17a2b8' },
            { min: 18.5, max: 25, label: 'Normal', color: '#28a745' },
            { min: 25, max: 30, label: 'Overweight', color: '#ffc107' },
            { min: 30, max: 35, label: 'Obese I', color: '#dc3545' },
            { min: 35, max: 40, label: 'Obese II', color: '#dc3545' },
            { min: 40, max: 50, label: 'Obese III', color: '#dc3545' }
        ];
        
        const maxBMI = Math.max(bmi, 50);
        const position = (bmi / maxBMI) * 100;
        
        this.bmiVisualization.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>BMI Scale:</strong>
            </div>
            <div style="position: relative; height: 30px; background: linear-gradient(to right, #17a2b8 0%, #17a2b8 15%, #28a745 15%, #28a745 30%, #ffc107 30%, #ffc107 45%, #dc3545 45%); border-radius: 15px; margin-bottom: 10px;">
                <div style="position: absolute; top: -5px; left: ${Math.min(position, 95)}%; width: 40px; height: 40px; background: white; border: 3px solid #333; border-radius: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">
                    ${bmi.toFixed(1)}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40+</span>
            </div>
        `;
    }
    
    displayHealthRecommendations(category) {
        this.healthRecommendations.innerHTML = `
            <div style="background: var(--bg-secondary); padding: 15px; border-radius: var(--border-radius); border-left: 4px solid ${category.color};">
                <h4 style="margin-bottom: 10px; color: ${category.color};">Health Recommendation</h4>
                <p style="margin: 0; line-height: 1.5;">${category.advice}</p>
                <p style="margin-top: 10px; font-size: 0.9rem; color: var(--text-muted);">
                    <i class="fas fa-info-circle"></i> 
                    Remember: BMI is a general indicator and doesn't account for muscle mass, bone density, or fat distribution. Always consult with healthcare professionals for personalized advice.
                </p>
            </div>
        `;
    }
    
    clearInputs() {
        this.weightKg.value = '';
        this.heightCm.value = '';
        this.weightLbs.value = '';
        this.heightFt.value = '';
        this.heightIn.value = '';
    }
    
    hideResults() {
        this.resultsSection.classList.add('hidden');
    }
    
    saveData() {
        const data = {
            units: this.metricUnits.checked ? 'metric' : 'imperial',
            weightKg: this.weightKg.value,
            heightCm: this.heightCm.value,
            weightLbs: this.weightLbs.value,
            heightFt: this.heightFt.value,
            heightIn: this.heightIn.value
        };
        localStorage.setItem('bmiCalculator_data', JSON.stringify(data));
    }
    
    loadSavedData() {
        const data = JSON.parse(localStorage.getItem('bmiCalculator_data') || '{}');
        
        if (data.units === 'imperial') {
            this.imperialUnits.checked = true;
            this.metricInputs.classList.add('hidden');
            this.imperialInputs.classList.remove('hidden');
        }
        
        if (data.weightKg) this.weightKg.value = data.weightKg;
        if (data.heightCm) this.heightCm.value = data.heightCm;
        if (data.weightLbs) this.weightLbs.value = data.weightLbs;
        if (data.heightFt) this.heightFt.value = data.heightFt;
        if (data.heightIn) this.heightIn.value = data.heightIn;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BMICalculator();
});

