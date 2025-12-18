// Cyber Mirror 2.0 - Popravljen JavaScript

// ===== GLOBAL FUNCTIONS =====

// Show modal function
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show notification function
function showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add close event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Add styles if not present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 1.25rem;
                right: 1rem;
                background: rgba(10, 14, 23, 0.95);
                border-left: 0.25rem solid var(--primary);
                padding: 0.9rem 1rem;
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.8rem;
                min-width: min(20rem, 90%);
                max-width: min(25rem, 95%);
                z-index: 1000;
                animation: slideIn 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 255, 157, 0.12);
                box-shadow: 0 0.6rem 1.8rem rgba(0, 0, 0, 0.28);
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-success { border-left-color: var(--primary); }
            .notification-error { border-left-color: var(--danger); }
            .notification-warning { border-left-color: var(--warning); }
            .notification-info { border-left-color: var(--info); }
            .notification-icon i { font-size: clamp(1rem, 2.6vw, 1.5rem); }
            .notification-success .notification-icon i { color: var(--primary); }
            .notification-error .notification-icon i { color: var(--danger); }
            .notification-warning .notification-icon i { color: var(--warning); }
            .notification-info .notification-icon i { color: var(--info); }
            .notification-content h4 { margin-bottom: 0.25rem; color: white; font-size: clamp(1rem,2.2vw,1.1rem); }
            .notification-content p { color: #a0aec0; font-size: clamp(0.8rem, 1.6vw, 0.95rem); margin: 0; }
            .notification-close {
                background: none;
                border: none;
                color: #a0aec0;
                font-size: clamp(1rem,2.2vw,1.4rem);
                cursor: pointer;
                margin-left: auto;
            }
        `;
        document.head.appendChild(styles);
    }
}

// ===== INDEX.HTML FUNCTIONS =====

// Start Escape Room from index.html
function startEscapeRoom() {
    // Show start modal
    showModal('startModal');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('startModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Confirm start and go to escape room
function confirmStart() {
    // Get user inputs
    const userName = document.getElementById('userName')?.value || 'Cyber Explorer';
    const difficulty = document.querySelector('.difficulty-option.active')?.dataset.level || 'medium';
    
    // Save user data to localStorage
    const userData = {
        name: userName,
        difficulty: difficulty,
        startTime: new Date().toISOString(),
        score: 0
    };
    
    localStorage.setItem('cyberMirrorUser', JSON.stringify(userData));
    
    // Show loading notification
    showNotification('Učitavanje...', 'Pripremamo Escape Room za vas!', 'info');
    
    // Redirect to escape room after delay
    setTimeout(() => {
        window.location.href = 'escape-room.html';
    }, 1500);
}

// Show demo
function showDemo() {
    showNotification('Demo Mode', 'Pokrećemo demo verziju Escape Room-a', 'info');
    
    // Set demo data
    const demoData = {
        name: 'Ammar Puščul',
        difficulty: 'easy',
        isDemo: true,
        startTime: new Date().toISOString()
    };
    
    localStorage.setItem('cyberMirrorUser', JSON.stringify(demoData));
    
    setTimeout(() => {
        window.location.href = 'escape-room.html?demo=true';
    }, 1000);
}

// Go to dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// ===== ESCAPE ROOM FUNCTIONS =====

// Initialize escape room
function initEscapeRoom() {
    console.log('Initializing Escape Room...');
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('cyberMirrorUser')) || {};
    console.log('User data:', userData);
    
    // Setup event listeners
    setupEscapeRoomListeners();
    
    // Start the first challenge
    startChallenge(1);
}

// Setup all event listeners for escape room
function setupEscapeRoomListeners() {
    console.log('Setting up escape room listeners...');
    
    // Password selection
    const passwordCards = document.querySelectorAll('.password-card');
    passwordCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            passwordCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
        });
    });
    
    // Password builder buttons
    const builderButtons = document.querySelectorAll('.builder-btn');
    builderButtons.forEach(button => {
        if (!button.classList.contains('danger')) {
            button.addEventListener('click', function() {
                const text = this.textContent.trim();
                addToPassword(text);
            });
        }
    });
    
    // Clear password button
    const clearBtn = document.querySelector('.builder-btn.danger');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearPassword);
    }
    
    // Submit password button
    const submitPasswordBtn = document.querySelector('[onclick="submitPassword()"]');
    if (submitPasswordBtn) {
        submitPasswordBtn.removeAttribute('onclick');
        submitPasswordBtn.addEventListener('click', submitPassword);
    }
    
    // Show hint buttons
    const hintButtons = document.querySelectorAll('[onclick*="showHint"]');
    hintButtons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        const hintType = onclick.match(/showHint\('(\w+)'\)/)?.[1];
        if (hintType) {
            button.removeAttribute('onclick');
            button.addEventListener('click', () => showHint(hintType));
        }
    });
    
    // Next scenario button
    const nextScenarioBtn = document.getElementById('nextScenario');
    if (nextScenarioBtn) {
        nextScenarioBtn.addEventListener('click', nextScenario);
    }
    
    // Back to home button
    const backToHomeBtn = document.getElementById('backToHome');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // View dashboard button
    const viewDashboardBtn = document.getElementById('viewDashboardBtn');
    if (viewDashboardBtn) {
        viewDashboardBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
    
    // Email tabs
    const emailTabs = document.querySelectorAll('.email-tab');
    emailTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const emailNum = this.textContent.match(/Email (\d)/)?.[1];
            if (emailNum) {
                showEmail(parseInt(emailNum));
            }
        });
    });
    
    // WiFi network selection
    const wifiNetworks = document.querySelectorAll('.wifi-network');
    wifiNetworks.forEach(network => {
        network.addEventListener('click', function() {
            wifiNetworks.forEach(n => n.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Submit WiFi button
    const submitWifiBtn = document.querySelector('[onclick="submitWifi()"]');
    if (submitWifiBtn) {
        submitWifiBtn.removeAttribute('onclick');
        submitWifiBtn.addEventListener('click', submitWifi);
    }
    
    // Go to profile button
    const goToProfileBtn = document.querySelector('[onclick="goToProfile()"]');
    if (goToProfileBtn) {
        goToProfileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
    
    // Retry escape room button
    const retryBtn = document.querySelector('[onclick="retryEscapeRoom()"]');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            window.location.href = 'escape-room.html';
        });
    }
}

// Start a specific challenge
function startChallenge(challengeNumber) {
    console.log(`Starting challenge ${challengeNumber}`);
    
    // Hide all challenges
    document.querySelectorAll('.challenge').forEach(challenge => {
        challenge.classList.remove('active');
    });
    
    // Show selected challenge
    const challenge = document.getElementById(`challenge${challengeNumber}`);
    if (challenge) {
        challenge.classList.add('active');
    }
    
    // Update progress steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        const stepNum = parseInt(step.dataset.step);
        if (stepNum === challengeNumber) {
            step.classList.add('active');
        }
    });
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = ((challengeNumber - 1) / 3) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    // Start timer for this challenge
    startChallengeTimer(challengeNumber);
}

// Start timer for a challenge
function startChallengeTimer(challengeNumber) {
    const timerElement = document.getElementById(`challenge${challengeNumber}Timer`);
    if (!timerElement) return;
    
    // Set initial time based on challenge
    const times = { 1: 60, 2: 90, 3: 120 };
    let timeLeft = times[challengeNumber] || 60;
    timerElement.textContent = timeLeft;
    
    // Clear any existing timer
    if (timerElement.timerInterval) {
        clearInterval(timerElement.timerInterval);
    }
    
    // Start new timer
    timerElement.timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        // Warning when time is low
        if (timeLeft <= 10) {
            timerElement.style.color = '#ff4757';
        }
        
        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timerElement.timerInterval);
            showNotification('Vrijeme je isteklo!', 'Prešli ste na sljedeći izazov.', 'warning');
            
            // Auto-submit and move to next challenge
            if (challengeNumber < 3) {
                setTimeout(() => startChallenge(challengeNumber + 1), 1000);
            } else {
                setTimeout(completeEscapeRoom, 1000);
            }
        }
    }, 1000);
}

// Password builder functions
function addToPassword(text) {
    const passwordDisplay = document.getElementById('builtPassword');
    if (passwordDisplay) {
        if (passwordDisplay.textContent === 'Vaša lozinka će se pojaviti ovdje') {
            passwordDisplay.textContent = text;
        } else {
            passwordDisplay.textContent += text;
        }
    }
}

function clearPassword() {
    const passwordDisplay = document.getElementById('builtPassword');
    if (passwordDisplay) {
        passwordDisplay.textContent = 'Vaša lozinka će se pojaviti ovdje';
    }
}

// Submit password challenge
function submitPassword() {
    const selectedCard = document.querySelector('.password-card.selected');
    if (!selectedCard) {
        showNotification('Greška', 'Morate odabrati lozinku!', 'error');
        return;
    }
    
    const isCorrect = selectedCard.dataset.password === 'strong';
    
    if (isCorrect) {
        showNotification('Tačno!', 'Odabrali ste jaku lozinku!', 'success');
        updateScore(100);
    } else {
        showNotification('Pogrešno!', 'Ova lozinka nije dovoljno jaka.', 'error');
        updateScore(50);
    }
    
    // Mark step as completed
    document.querySelector('.step[data-step="1"]').classList.add('completed');
    
    // Move to next challenge after delay
    setTimeout(() => startChallenge(2), 1500);
}

// Show hint
function showHint(type) {
    let hintText = '';
    
    switch(type) {
        case 'password':
            hintText = 'Jaka lozinka treba imati: više od 12 znakova, velika i mala slova, brojeve i simbole. Primjer: "Maja#2023!"';
            break;
        case 'phishing':
            hintText = 'Provjerite: pošiljaoca, gramatiku, URL-ove i urgentni ton. Phishing emaili često sadrže greške i traže hitne akcije.';
            break;
        case 'wifi':
            hintText = 'Sigurne WiFi mreže: imaju WPA2/WPA3 zaštitu, ime lokala + "Guest", traže password. Izbjegavajte "Open" mreže.';
            break;
        default:
            hintText = 'Hint nije dostupan.';
    }
    
    showNotification('Hint', hintText, 'info');
}

// Show email
function showEmail(number) {
    const emails = {
        1: {
            subject: 'Urgent: Your Account Will Be Suspended',
            from: 'Facebook Security <security@facebook-mail.com>',
            body: `Dear Facebook User,\n\nOur system has detected unusual activity on your account. To prevent suspension, please verify your identity immediately.\n\nClick here to verify: facebook-verify-now.com\n\nThis is URGENT. Failure to verify within 24 hours will result in permanent account suspension.\n\nSincerely,\nFacebook Security Team`
        },
        2: {
            subject: 'New Device Detected - Review Activity',
            from: 'Netflix <no-reply@netflix.com>',
            body: `Hi there,\n\nWe noticed a new sign-in to your Netflix account from a new device.\n\nDevice: Chrome on Windows 10\nLocation: Sarajevo, Bosnia and Herzegovina\nTime: Today, 14:32\n\nIf this was you, you can ignore this message.\n\nIf this wasn't you, please review your account:\nhttps://netflix.com/account/security\n\nThanks,\nThe Netflix Team`
        },
        3: {
            subject: 'Vaš paket čeka isporuku',
            from: 'Paket služba <info@post-tracker-hr.com>',
            body: `Poštovani,\n\nVaš paket br. PT-784512 čeka isporuku. Da bismo potvrdili adresu, molimo kliknite na link ispod:\n\nhttps://post-tracker-hr.com/track/confirm-address\n\nAko ne potvrdite adresu u narednih 48 sati, paket će biti vraćen pošiljaocu.\n\nS poštovanjem,\nPaket služba`
        }
    };
    
    const email = emails[number];
    if (!email) return;
    
    const emailViewer = document.getElementById('emailViewer');
    if (emailViewer) {
        emailViewer.innerHTML = `
            <div class="email-header">
                <div><strong>From:</strong> ${email.from}</div>
                <div><strong>Subject:</strong> ${email.subject}</div>
            </div>
            <div class="email-body">
                <pre>${email.body}</pre>
            </div>
        `;
    }
    
    // Update active tab
    document.querySelectorAll('.email-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.email-tab:nth-child(${number})`).classList.add('active');
}

// Submit phishing challenge
function submitPhishing() {
    // For demo, assume email 1 is phishing
    const activeTab = document.querySelector('.email-tab.active');
    const isCorrect = activeTab && activeTab.textContent.includes('Email 1');
    
    if (isCorrect) {
        showNotification('Tačno!', 'Prepoznali ste phishing email!', 'success');
        updateScore(100);
    } else {
        showNotification('Pogrešno!', 'Ovo nije phishing email.', 'error');
        updateScore(50);
    }
    
    // Mark step as completed
    document.querySelector('.step[data-step="2"]').classList.add('completed');
    
    // Move to next challenge
    setTimeout(() => startChallenge(3), 1500);
}

// Submit WiFi challenge
function submitWifi() {
    const selectedWifi = document.querySelector('.wifi-network.selected');
    if (!selectedWifi) {
        showNotification('Greška', 'Morate odabrati WiFi mrežu!', 'error');
        return;
    }
    
    const isCorrect = selectedWifi.classList.contains('safe');
    
    if (isCorrect) {
        showNotification('Tačno!', 'Odabrali ste sigurnu WiFi mrežu!', 'success');
        updateScore(100);
    } else {
        showNotification('Pogrešno!', 'Ova WiFi mreža nije sigurna.', 'error');
        updateScore(50);
    }
    
    // Mark step as completed
    document.querySelector('.step[data-step="3"]').classList.add('completed');
    
    // Complete escape room
    setTimeout(completeEscapeRoom, 1500);
}

// Update score
function updateScore(points) {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        const currentScore = parseInt(scoreElement.textContent) || 0;
        const newScore = currentScore + points;
        scoreElement.textContent = newScore;
        
        // Save to localStorage
        const userData = JSON.parse(localStorage.getItem('cyberMirrorUser')) || {};
        userData.score = (userData.score || 0) + points;
        localStorage.setItem('cyberMirrorUser', JSON.stringify(userData));
        
        // Animate score update
        scoreElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// Complete escape room
function completeEscapeRoom() {
    console.log('Completing escape room...');
    
    // Hide all challenges
    document.querySelectorAll('.challenge').forEach(challenge => {
        challenge.style.display = 'none';
    });
    
    // Show completion screen
    const completionScreen = document.getElementById('completionScreen');
    if (completionScreen) {
        completionScreen.style.display = 'block';
        
        // Update completion stats
        const scoreElement = document.getElementById('score');
        const totalScore = scoreElement ? parseInt(scoreElement.textContent) : 0;
        
        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('totalTime').textContent = '4:32'; // Demo value
        document.getElementById('accuracy').textContent = Math.min(100, Math.round((totalScore / 300) * 100)) + '%';
        
        // Save completion data
        const completionData = {
            completed: true,
            score: totalScore,
            completedAt: new Date().toISOString()
        };
        localStorage.setItem('escapeRoomCompletion', JSON.stringify(completionData));
        
        // Add confetti effect
        createConfetti();
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#00ff9d', '#6c63ff', '#00d2ff', '#ff4757', '#ffb142'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 0.8rem;
            height: 0.8rem;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -2rem;
            left: ${Math.random() * 100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Navigation functions
function goToProfile() {
    window.location.href = 'profile.html';
}

function retryEscapeRoom() {
    window.location.href = 'escape-room.html';
}

function nextScenario() {
    showNotification('Sljedeći scenario', 'Učitavanje novog scenarija...', 'info');
    // In a real app, this would load a new scenario
}

// ===== INITIALIZATION =====

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    
    // Initialize page-specific functionality
    switch(currentPage) {
        case 'index.html':
        case '':
            // Initialize home page
            initHomePage();
            break;
            
        case 'escape-room.html':
            // Initialize escape room
            initEscapeRoom();
            break;
            
        case 'profile.html':
            // Initialize profile page
            initProfilePage();
            break;
            
        case 'dashboard.html':
            // Initialize dashboard
            initDashboard();
            break;
            
        case 'phishing-test.html':
            // Initialize phishing test
            initPhishingTest();
            break;
    }
    
    // Setup modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Setup difficulty selection
    document.querySelectorAll('.difficulty-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Mobile hamburger toggle
    const hamburger = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close nav when a nav link is clicked (mobile)
        mainNav.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('click', function() {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});

// Home page initialization
function initHomePage() {
    console.log('Initializing home page...');
    
    // Setup start button
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startEscapeRoom);
    }
    
    // Setup demo button
    const demoBtn = document.querySelector('[onclick="showDemo()"]');
    if (demoBtn) {
        demoBtn.addEventListener('click', showDemo);
    }
    
    // Setup dashboard button
    const dashboardBtn = document.querySelector('[onclick="goToDashboard()"]');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', goToDashboard);
    }
}

// Profile page initialization
function initProfilePage() {
    console.log('Initializing profile page...');
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('cyberMirrorUser')) || {};
    const escapeData = JSON.parse(localStorage.getItem('escapeRoomCompletion')) || {};
    
    // Update profile info
    document.getElementById('userName').textContent = userData.name || 'Cyber Korisnik';
    document.getElementById('cyberScore').textContent = userData.score || 85;
    
    // Setup navigation buttons
    document.querySelectorAll('[onclick*="goTo"]').forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick.includes('goToEscapeRoom')) {
            button.addEventListener('click', () => window.location.href = 'escape-room.html');
        } else if (onclick.includes('goToDashboard')) {
            button.addEventListener('click', () => window.location.href = 'dashboard.html');
        } else if (onclick.includes('continueToTest')) {
            button.addEventListener('click', () => window.location.href = 'phishing-test.html');
        }
    });
}

// Dashboard initialization
function initDashboard() {
    console.log('Initializing dashboard...');
    // Dashboard specific initialization
}

// Phishing test initialization
function initPhishingTest() {
    console.log('Initializing phishing test...');
    // Phishing test specific initialization
}

// ===== GLOBAL NAVIGATION =====
window.startEscapeRoom = startEscapeRoom;
window.showDemo = showDemo;
window.goToDashboard = goToDashboard;
window.closeModal = closeModal;
window.confirmStart = confirmStart;
window.showHint = showHint;
window.submitPassword = submitPassword;
window.showEmail = showEmail;
window.submitPhishing = submitPhishing;
window.submitWifi = submitWifi;
window.goToProfile = goToProfile;
window.retryEscapeRoom = retryEscapeRoom;
window.nextScenario = nextScenario;
// ===== ESCAPE ROOM VISUAL FUNCTIONS =====

// Initialize escape room visuals
function initEscapeRoomVisuals() {
    console.log('Initializing escape room visuals...');
    
    // Setup password cards
    setupPasswordCards();
    
    // Setup WiFi networks
    setupWiFiNetworks();
    
    // Setup email tabs
    setupEmailTabs();
    
    // Setup progress bar
    setupProgressBar();
}

function setupPasswordCards() {
    const passwordCards = document.querySelectorAll('.password-card');
    passwordCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selection from all cards
            passwordCards.forEach(c => {
                c.classList.remove('selected');
                c.style.transform = 'translateY(0)';
            });
            
            // Select this card
            this.classList.add('selected');
            this.style.transform = 'translateY(-5px)';
            
            // Add visual feedback
            this.style.boxShadow = '0 10px 20px rgba(0, 255, 157, 0.2)';
            
            // Add animation class
            this.classList.add('selected');
        });
    });
}

function setupWiFiNetworks() {
    const wifiNetworks = document.querySelectorAll('.wifi-network');
    wifiNetworks.forEach(network => {
        network.addEventListener('click', function() {
            // Remove selection from all networks
            wifiNetworks.forEach(n => {
                n.classList.remove('selected');
                n.style.transform = 'translateY(0)';
            });
            
            // Select this network
            this.classList.add('selected');
            this.style.transform = 'translateY(-3px)';
            
            // Visual feedback based on safety
            if (this.classList.contains('safe')) {
                this.style.boxShadow = '0 5px 15px rgba(0, 255, 157, 0.2)';
            } else if (this.classList.contains('suspicious')) {
                this.style.boxShadow = '0 5px 15px rgba(255, 177, 66, 0.2)';
            } else {
                this.style.boxShadow = '0 5px 15px rgba(255, 71, 87, 0.2)';
            }
        });
    });
}

function setupEmailTabs() {
    const emailTabs = document.querySelectorAll('.email-tab');
    emailTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            emailTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Load email content
            const emailNum = this.textContent.match(/Email (\d)/)?.[1];
            if (emailNum) {
                loadEmailContent(parseInt(emailNum));
            }
        });
    });
    
    // Load first email by default
    if (emailTabs.length > 0) {
        emailTabs[0].click();
    }
}

function loadEmailContent(emailNumber) {
    const emails = {
        1: {
            subject: 'Urgent: Your Account Will Be Suspended',
            from: 'Facebook Security <security@facebook-mail.com>',
            body: `Dear Facebook User,

Our system has detected unusual activity on your account. To prevent suspension, please verify your identity immediately.

Click here to verify: facebook-verify-now.com

This is URGENT. Failure to verify within 24 hours will result in permanent account suspension.

Sincerely,
Facebook Security Team`
        },
        2: {
            subject: 'New Device Detected - Review Activity',
            from: 'Netflix <no-reply@netflix.com>',
            body: `Hi there,

We noticed a new sign-in to your Netflix account from a new device.

Device: Chrome on Windows 10
Location: Sarajevo, Bosnia and Herzegovina
Time: Today, 14:32

If this was you, you can ignore this message.

If this wasn't you, please review your account:
https://netflix.com/account/security

Thanks,
The Netflix Team`
        },
        3: {
            subject: 'Vaš paket čeka isporuku',
            from: 'Paket služba <info@post-tracker-hr.com>',
            body: `Poštovani,

Vaš paket br. PT-784512 čeka isporuku. Da bismo potvrdili adresu, molimo kliknite na link ispod:

https://post-tracker-hr.com/track/confirm-address

Ako ne potvrdite adresu u narednih 48 sati, paket će biti vraćen pošiljaocu.

S poštovanjem,
Paket služba`
        }
    };
    
    const email = emails[emailNumber];
    if (!email) return;
    
    const emailViewer = document.getElementById('emailViewer');
    if (emailViewer) {
        emailViewer.innerHTML = `
            <div class="email-header">
                <div><strong>From:</strong> ${email.from}</div>
                <div><strong>Subject:</strong> ${email.subject}</div>
            </div>
            <div class="email-body">
                <pre>${email.body}</pre>
            </div>
            <div class="email-analysis">
                <p class="analysis-note"><i class="fas fa-search"></i> Analizirajte ovaj email koristeći alate ispod</p>
            </div>
        `;
    }
}

function setupProgressBar() {
    // Animate progress bar on challenge start
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.transition = 'width 0.5s ease';
    }
}

// ===== CHALLENGE COMPLETION VISUALS =====

function showChallengeComplete(challengeNum, isCorrect) {
    const challenge = document.getElementById(`challenge${challengeNum}`);
    if (!challenge) return;
    
    // Add completion animation
    challenge.style.position = 'relative';
    challenge.style.overflow = 'hidden';
    
    // Create completion overlay
    const overlay = document.createElement('div');
    overlay.className = `completion-overlay ${isCorrect ? 'success' : 'error'}`;
    overlay.innerHTML = `
        <div class="completion-message">
            <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
            <h3>${isCorrect ? 'Tačno!' : 'Pogrešno!'}</h3>
            <p>${isCorrect ? 'Osvojili ste 100 bodova!' : 'Osvojili ste 50 bodova'}</p>
        </div>
    `;
    
    // Add styles for overlay
    if (!document.querySelector('#overlay-styles')) {
        const styles = document.createElement('style');
        styles.id = 'overlay-styles';
        styles.textContent = `
            .completion-overlay {
                position: absolute;
                inset: 0;
                background: rgba(10, 14, 23, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                animation: fadeIn 0.5s ease;
            }
            .completion-overlay.success {
                border: 0.2rem solid var(--primary);
            }
            .completion-overlay.error {
                border: 0.2rem solid var(--danger);
            }
            .completion-message {
                text-align: center;
                padding: clamp(1rem, 2.5vw, 2rem);
            }
            .completion-message i {
                font-size: clamp(2rem, 6vw, 4rem);
                margin-bottom: 0.75rem;
            }
            .completion-overlay.success .completion-message i {
                color: var(--primary);
            }
            .completion-overlay.error .completion-message i {
                color: var(--danger);
            }
            .completion-message h3 {
                font-size: clamp(1.2rem, 3vw, 2rem);
                margin-bottom: 0.5rem;
            }
            .completion-message p {
                color: #a0aec0;
                font-size: clamp(0.95rem, 1.6vw, 1.1rem);
            }
        `;
        document.head.appendChild(styles);
    }
    
    challenge.appendChild(overlay);
    
    // Remove overlay after animation
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => overlay.remove(), 500);
    }, 1500);
}

// ===== UPDATE ESCAPE ROOM INITIALIZATION =====

// Zamijeni postojeću initEscapeRoom funkciju sa ovom:
function initEscapeRoom() {
    console.log('Initializing Escape Room with visuals...');
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('cyberMirrorUser')) || {};
    console.log('User data:', userData);
    
    // Initialize visuals
    initEscapeRoomVisuals();
    
    // Setup event listeners
    setupEscapeRoomListeners();
    
    // Setup challenge navigation
    setupChallengeNavigation();
    
    // Start the first challenge
    startChallenge(1);
    
    // Start main timer
    startMainTimer();
}

function setupChallengeNavigation() {
    // Progress steps click events
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.dataset.step);
            if (this.classList.contains('completed') || this.classList.contains('active')) {
                startChallenge(stepNum);
            }
        });
    });
}

function startMainTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    let totalSeconds = 15 * 60; // 15 minutes
    updateTimerDisplay(timerElement, totalSeconds);
    
    const timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay(timerElement, totalSeconds);
        
        // Warning at 5 minutes
        if (totalSeconds === 5 * 60) {
            showNotification('Upozorenje!', 'Preostaje vam 5 minuta!', 'warning');
            timerElement.style.color = 'var(--warning)';
            timerElement.classList.add('pulse');
        }
        
        // Warning at 1 minute
        if (totalSeconds === 60) {
            showNotification('HITNO!', 'Preostaje vam 1 minut!', 'error');
            timerElement.style.color = 'var(--danger)';
        }
        
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            showNotification('Vrijeme je isteklo!', 'Niste završili Escape Room na vrijeme.', 'error');
            endEscapeRoom(false);
        }
    }, 1000);
}

function updateTimerDisplay(element, totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===== ADD THESE FUNCTIONS TO EXISTING SCRIPT =====

// Add these to your existing script.js file

// Update the submitPassword function:
window.submitPassword = function() {
    const selectedCard = document.querySelector('.password-card.selected');
    if (!selectedCard) {
        showNotification('Greška', 'Morate odabrati lozinku!', 'error');
        return;
    }
    
    const isCorrect = selectedCard.dataset.password === 'strong';
    
    // Show completion animation
    showChallengeComplete(1, isCorrect);
    
    if (isCorrect) {
        showNotification('Tačno!', 'Odabrali ste jaku lozinku! +100 bodova', 'success');
        updateScore(100);
    } else {
        showNotification('Pogrešno!', 'Ova lozinka nije dovoljno jaka. +50 bodova', 'error');
        updateScore(50);
    }
    
    // Mark step as completed
    const step1 = document.querySelector('.step[data-step="1"]');
    step1.classList.remove('active');
    step1.classList.add('completed');
    if (isCorrect) {
        step1.classList.add('correct');
    } else {
        step1.classList.add('incorrect');
    }
    
    // Move to next challenge after delay
    setTimeout(() => startChallenge(2), 2000);
};

// Update the submitPhishing function:
window.submitPhishing = function() {
    const activeTab = document.querySelector('.email-tab.active');
    const isCorrect = activeTab && activeTab.textContent.includes('Email 1');
    
    // Show completion animation
    showChallengeComplete(2, isCorrect);
    
    if (isCorrect) {
        showNotification('Tačno!', 'Prepoznali ste phishing email! +100 bodova', 'success');
        updateScore(100);
    } else {
        showNotification('Pogrešno!', 'Ovo nije phishing email. +50 bodova', 'error');
        updateScore(50);
    }
    
    // Mark step as completed
    const step2 = document.querySelector('.step[data-step="2"]');
    step2.classList.remove('active');
    step2.classList.add('completed');
    if (isCorrect) {
        step2.classList.add('correct');
    } else {
        step2.classList.add('incorrect');
    }
    
    // Move to next challenge
    setTimeout(() => startChallenge(3), 2000);
};

// Update the submitWifi function:
window.submitWifi = function() {
    const selectedWifi = document.querySelector('.wifi-network.selected');
    if (!selectedWifi) {
        showNotification('Greška', 'Morate odabrati WiFi mrežu!', 'error');
        return;
    }
    
    const isCorrect = selectedWifi.classList.contains('safe');
    
    // Show completion animation
    showChallengeComplete(3, isCorrect);
    
    if (isCorrect) {
        showNotification('Tačno!', 'Odabrali ste sigurnu WiFi mrežu! +100 bodova', 'success');
        updateScore(100);
    } else {
        showNotification('Pogrešno!', 'Ova WiFi mreža nije sigurna. +50 bodova', 'error');
        updateScore(50);
    }
    
    // Mark step as completed
    const step3 = document.querySelector('.step[data-step="3"]');
    step3.classList.remove('active');
    step3.classList.add('completed');
    if (isCorrect) {
        step3.classList.add('correct');
    } else {
        step3.classList.add('incorrect');
    }
    
    // Complete escape room
    setTimeout(completeEscapeRoom, 2000);
};
// ===== PROFILE PAGE FUNCTIONS =====

function initProfilePage() {
    console.log('Initializing profile page...');
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('cyberMirrorUser')) || {};
    const escapeData = JSON.parse(localStorage.getItem('escapeRoomCompletion')) || {};
    
    // Update profile info
    updateProfileInfo(userData, escapeData);
    
    // Initialize chart if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initProfileChart();
    }
    
    // Setup profile type based on score
    setupProfileType(userData.score || 85);
    
    // Setup event listeners
    setupProfileEventListeners();
}

function updateProfileInfo(userData, escapeData) {
    // Update user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.name || 'Cyber Korisnik';
    }
    
    // Update cyber score
    const cyberScoreElement = document.getElementById('cyberScore');
    if (cyberScoreElement) {
        cyberScoreElement.textContent = userData.score || 85;
        
        // Animate score update
        cyberScoreElement.style.animation = 'countUp 0.5s ease';
        setTimeout(() => {
            cyberScoreElement.style.animation = '';
        }, 500);
    }
    
    // Update profile badge
    const profileBadge = document.getElementById('profileBadge');
    if (profileBadge) {
        const score = userData.score || 85;
        if (score >= 90) {
            profileBadge.textContent = 'Level 5';
            profileBadge.style.background = 'var(--primary)';
        } else if (score >= 70) {
            profileBadge.textContent = 'Level 4';
            profileBadge.style.background = 'var(--secondary)';
        } else if (score >= 50) {
            profileBadge.textContent = 'Level 3';
            profileBadge.style.background = 'var(--warning)';
        } else {
            profileBadge.textContent = 'Level 2';
            profileBadge.style.background = 'var(--danger)';
        }
    }
}

function initProfileChart() {
    const canvas = document.getElementById('scoreChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Get scores from localStorage or use defaults
    const escapeData = JSON.parse(localStorage.getItem('escapeRoomCompletion')) || {};
    let scores = [95, 88, 92]; // Default scores
    
    if (escapeData.challenges) {
        scores = escapeData.challenges.map(challenge => 
            Math.round((challenge.score / 100) * 100)
        );
    }
    
    // Create chart
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Lozinka', 'Phishing', 'WiFi'],
            datasets: [{
                data: scores,
                backgroundColor: [
                    'rgba(0, 255, 157, 0.8)',
                    'rgba(108, 99, 255, 0.8)',
                    'rgba(0, 210, 255, 0.8)'
                ],
                borderWidth: 2,
                borderColor: 'var(--dark)',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function setupProfileType(score) {
    let profileType = '';
    let profileDescription = '';
    let avatarClass = '';
    let avatarIcon = '';
    
    if (score >= 90) {
        profileType = 'Cyber Guardian';
        profileDescription = 'Iznimno siguran i analitičan korisnik';
        avatarClass = 'cyber-guardian';
        avatarIcon = 'user-shield';
    } else if (score >= 70) {
        profileType = 'Target Practitioner';
        profileDescription = 'Dobar instinkt, brzo uči';
        avatarClass = 'target-practitioner';
        avatarIcon = 'user-check';
    } else if (score >= 50) {
        profileType = 'Risk Taker';
        profileDescription = 'Ponekad riskira, ali uči iz grešaka';
        avatarClass = 'risk-taker';
        avatarIcon = 'user-clock';
    } else {
        profileType = 'Phishing Magnet';
        profileDescription = 'Potrebna dodatna edukacija';
        avatarClass = 'phishing-magnet';
        avatarIcon = 'user-slash';
    }
    
    // Update profile type display
    const profileTypeElement = document.getElementById('profileType');
    if (profileTypeElement) {
        profileTypeElement.innerHTML = `
            <h3>${profileType}</h3>
            <p>${profileDescription}</p>
        `;
    }
    
    // Update avatar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.className = `profile-avatar ${avatarClass}`;
        profileAvatar.innerHTML = `<i class="fas fa-${avatarIcon}"></i>`;
    }
    
    // Update meter
    const typeMeter = document.getElementById('typeMeter');
    if (typeMeter) {
        typeMeter.style.width = `${score}%`;
    }
    
    // Update active type card
    document.querySelectorAll('.type-card').forEach(card => {
        card.classList.remove('active');
        const cardType = card.querySelector('.type-name').textContent;
        if (cardType === profileType) {
            card.classList.add('active');
        }
    });
}

function setupProfileEventListeners() {
    // Profile type cards
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.type-card').forEach(c => {
                c.classList.remove('active');
            });
            this.classList.add('active');
            
            const typeName = this.querySelector('.type-name').textContent;
            updateSelectedProfileType(typeName);
        });
    });
    
    // Recommendation buttons
    document.querySelectorAll('.rec-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            
            if (action.includes('Trening')) {
                showNotification('Trening', 'Započinje trening socijalnog inženjeringa...', 'info');
                // In a real app, this would navigate to training module
                setTimeout(() => {
                    window.location.href = 'escape-room.html?training=social';
                }, 1000);
            } else if (action.includes('Pročitaj')) {
                window.open('https://www.cert.ba/edukativni-materijali', '_blank');
            }
        });
    });
    
    // Navigation buttons
    const navButtons = {
        'goToEscapeRoom': 'escape-room.html',
        'continueToTest': 'phishing-test.html',
        'goToDashboard': 'dashboard.html'
    };
    
    Object.keys(navButtons).forEach(funcName => {
        const elements = document.querySelectorAll(`[onclick*="${funcName}"]`);
        elements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = navButtons[funcName];
            });
        });
    });
}

function updateSelectedProfileType(typeName) {
    // Update avatar based on selected type
    const profileAvatar = document.getElementById('profileAvatar');
    const types = {
        'Cyber Guardian': { class: 'cyber-guardian', icon: 'user-shield' },
        'Target Practitioner': { class: 'target-practitioner', icon: 'user-check' },
        'Risk Taker': { class: 'risk-taker', icon: 'user-clock' },
        'Phishing Magnet': { class: 'phishing-magnet', icon: 'user-slash' }
    };
    
    if (types[typeName] && profileAvatar) {
        profileAvatar.className = `profile-avatar ${types[typeName].class}`;
        profileAvatar.innerHTML = `<i class="fas fa-${types[typeName].icon}"></i>`;
        
        // Update profile type text
        const profileTypeElement = document.getElementById('profileType');
        if (profileTypeElement) {
            const description = types[typeName].description || 'Opis profila';
            profileTypeElement.innerHTML = `
                <h3>${typeName}</h3>
                <p>${description}</p>
            `;
        }
    }
}

// Add to your existing page initialization
// In script.js, add this to the DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'profile.html') {
        initProfilePage();
    }
});
