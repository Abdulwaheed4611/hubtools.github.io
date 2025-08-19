class AgeCalculator {
    constructor() {
        this.birthDate = document.getElementById('birthDate');
        this.targetDate = document.getElementById('targetDate');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.todayBtn = document.getElementById('todayBtn');
        
        this.resultsSection = document.getElementById('resultsSection');
        this.milestonesSection = document.getElementById('milestonesSection');
        this.birthdaySection = document.getElementById('birthdaySection');
        
        this.exactAge = document.getElementById('exactAge');
        this.totalMonths = document.getElementById('totalMonths');
        this.totalWeeks = document.getElementById('totalWeeks');
        this.totalDays = document.getElementById('totalDays');
        this.totalHours = document.getElementById('totalHours');
        this.totalMinutes = document.getElementById('totalMinutes');
        this.totalSeconds = document.getElementById('totalSeconds');
        
        this.milestonesList = document.getElementById('milestonesList');
        this.nextBirthday = document.getElementById('nextBirthday');
        this.daysUntilBirthday = document.getElementById('daysUntilBirthday');
        this.dayOfWeekBorn = document.getElementById('dayOfWeekBorn');
        this.nextBirthdayDay = document.getElementById('nextBirthdayDay');
        
        this.init();
    }
    
    init() {
        // Set target date to today by default
        this.targetDate.value = this.formatDate(new Date());
        
        // Load saved data
        this.loadSavedData();
        
        // Event listeners
        this.birthDate.addEventListener('change', () => {
            this.saveData();
            if (this.birthDate.value) {
                this.calculateAge();
            }
        });
        
        this.targetDate.addEventListener('change', () => {
            this.saveData();
            if (this.birthDate.value) {
                this.calculateAge();
            }
        });
        
        this.calculateBtn.addEventListener('click', () => {
            if (!this.birthDate.value) {
                showAlert('Please enter your birth date', 'error');
                return;
            }
            this.calculateAge();
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.clearInputs();
            this.hideResults();
            this.saveData();
        });
        
        this.todayBtn.addEventListener('click', () => {
            this.targetDate.value = this.formatDate(new Date());
            this.saveData();
            if (this.birthDate.value) {
                this.calculateAge();
            }
        });
        
        // Calculate if birth date exists
        if (this.birthDate.value) {
            this.calculateAge();
        }
    }
    
    calculateAge() {
        const birthDate = new Date(this.birthDate.value);
        const targetDate = new Date(this.targetDate.value || new Date());
        
        if (birthDate > targetDate) {
            showAlert('Birth date cannot be in the future!', 'error');
            return;
        }
        
        if (birthDate.getTime() === targetDate.getTime()) {
            showAlert('Birth date and target date cannot be the same!', 'error');
            return;
        }
        
        const age = this.calculateExactAge(birthDate, targetDate);
        this.displayResults(age, birthDate, targetDate);
        this.calculateMilestones(age, birthDate);
        this.calculateNextBirthday(birthDate, targetDate);
        
        this.showResults();
    }
    
    calculateExactAge(birthDate, targetDate) {
        const years = targetDate.getFullYear() - birthDate.getFullYear();
        const months = targetDate.getMonth() - birthDate.getMonth();
        const days = targetDate.getDate() - birthDate.getDate();
        
        let ageYears = years;
        let ageMonths = months;
        let ageDays = days;
        
        if (ageDays < 0) {
            ageMonths--;
            const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
            ageDays += lastMonth.getDate();
        }
        
        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }
        
        // Calculate total values
        const totalMs = targetDate.getTime() - birthDate.getTime();
        const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(totalMs / (1000 * 60));
        const totalSeconds = Math.floor(totalMs / 1000);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = ageYears * 12 + ageMonths;
        
        return {
            years: ageYears,
            months: ageMonths,
            days: ageDays,
            totalDays,
            totalWeeks,
            totalMonths,
            totalHours,
            totalMinutes,
            totalSeconds
        };
    }
    
    displayResults(age, birthDate, targetDate) {
        this.exactAge.textContent = `${age.years} years, ${age.months} months, ${age.days} days`;
        this.totalMonths.textContent = formatNumber(age.totalMonths);
        this.totalWeeks.textContent = formatNumber(age.totalWeeks);
        this.totalDays.textContent = formatNumber(age.totalDays);
        this.totalHours.textContent = formatNumber(age.totalHours);
        this.totalMinutes.textContent = formatNumber(age.totalMinutes);
        this.totalSeconds.textContent = formatNumber(age.totalSeconds);
    }
    
    calculateMilestones(age, birthDate) {
        const milestones = [];
        
        // Age milestones
        if (age.years >= 18) milestones.push({ text: 'Legal adult', icon: 'fas fa-gavel', achieved: true });
        if (age.years >= 21) milestones.push({ text: 'Legal drinking age (US)', icon: 'fas fa-wine-glass', achieved: true });
        if (age.years >= 25) milestones.push({ text: 'Car insurance rates typically decrease', icon: 'fas fa-car', achieved: true });
        if (age.years >= 30) milestones.push({ text: 'Entered your 30s', icon: 'fas fa-birthday-cake', achieved: true });
        if (age.years >= 40) milestones.push({ text: 'Life begins at 40!', icon: 'fas fa-star', achieved: true });
        if (age.years >= 50) milestones.push({ text: 'Half a century old', icon: 'fas fa-medal', achieved: true });
        if (age.years >= 65) milestones.push({ text: 'Retirement age in many countries', icon: 'fas fa-rocking-chair', achieved: true });
        
        // Time-based milestones
        if (age.totalDays >= 365) milestones.push({ text: 'Lived for 1 year', icon: 'fas fa-calendar', achieved: true });
        if (age.totalDays >= 1000) milestones.push({ text: 'Lived for 1,000 days', icon: 'fas fa-trophy', achieved: true });
        if (age.totalDays >= 5000) milestones.push({ text: 'Lived for 5,000 days', icon: 'fas fa-gem', achieved: true });
        if (age.totalDays >= 10000) milestones.push({ text: 'Lived for 10,000 days', icon: 'fas fa-crown', achieved: true });
        if (age.totalHours >= 100000) milestones.push({ text: 'Lived for 100,000 hours', icon: 'fas fa-clock', achieved: true });
        if (age.totalMinutes >= 1000000) milestones.push({ text: 'Lived for 1 million minutes', icon: 'fas fa-stopwatch', achieved: true });
        
        // Upcoming milestones
        const upcomingMilestones = [];
        if (age.years < 18) upcomingMilestones.push({ text: 'Legal adult', years: 18, icon: 'fas fa-gavel' });
        if (age.years < 21) upcomingMilestones.push({ text: 'Legal drinking age (US)', years: 21, icon: 'fas fa-wine-glass' });
        if (age.years < 30) upcomingMilestones.push({ text: 'Enter your 30s', years: 30, icon: 'fas fa-birthday-cake' });
        if (age.years < 40) upcomingMilestones.push({ text: 'Life begins at 40!', years: 40, icon: 'fas fa-star' });
        if (age.years < 50) upcomingMilestones.push({ text: 'Half a century old', years: 50, icon: 'fas fa-medal' });
        if (age.years < 65) upcomingMilestones.push({ text: 'Retirement age', years: 65, icon: 'fas fa-rocking-chair' });
        
        this.displayMilestones(milestones, upcomingMilestones);
    }
    
    displayMilestones(achieved, upcoming) {
        let html = '';
        
        if (achieved.length > 0) {
            html += '<h4 style="color: var(--success-color); margin-bottom: 15px;"><i class="fas fa-check-circle"></i> Milestones Achieved</h4>';
            achieved.forEach(milestone => {
                html += `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: var(--success-color);">
                        <i class="${milestone.icon}"></i>
                        <span>${milestone.text}</span>
                    </div>
                `;
            });
        }
        
        if (upcoming.length > 0) {
            html += '<h4 style="color: var(--info-color); margin: 20px 0 15px 0;"><i class="fas fa-hourglass-half"></i> Upcoming Milestones</h4>';
            upcoming.slice(0, 3).forEach(milestone => {
                html += `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: var(--info-color);">
                        <i class="${milestone.icon}"></i>
                        <span>${milestone.text} (${milestone.years} years old)</span>
                    </div>
                `;
            });
        }
        
        this.milestonesList.innerHTML = html || '<p style="color: var(--text-muted);">No milestones to display</p>';
    }
    
    calculateNextBirthday(birthDate, targetDate) {
        const today = new Date(targetDate);
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday <= today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        
        const dayOfWeekBorn = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
        const nextBirthdayDay = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });
        
        this.nextBirthday.textContent = nextBirthday.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.daysUntilBirthday.textContent = `${daysUntil} days`;
        this.dayOfWeekBorn.textContent = dayOfWeekBorn;
        this.nextBirthdayDay.textContent = nextBirthdayDay;
    }
    
    showResults() {
        this.resultsSection.classList.remove('hidden');
        this.milestonesSection.classList.remove('hidden');
        this.birthdaySection.classList.remove('hidden');
    }
    
    hideResults() {
        this.resultsSection.classList.add('hidden');
        this.milestonesSection.classList.add('hidden');
        this.birthdaySection.classList.add('hidden');
    }
    
    clearInputs() {
        this.birthDate.value = '';
        this.targetDate.value = this.formatDate(new Date());
    }
    
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    saveData() {
        const data = {
            birthDate: this.birthDate.value,
            targetDate: this.targetDate.value
        };
        localStorage.setItem('ageCalculator_data', JSON.stringify(data));
    }
    
    loadSavedData() {
        const data = JSON.parse(localStorage.getItem('ageCalculator_data') || '{}');
        
        if (data.birthDate) this.birthDate.value = data.birthDate;
        if (data.targetDate) this.targetDate.value = data.targetDate;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgeCalculator();
});

