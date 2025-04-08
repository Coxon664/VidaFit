const UI = {
    elements: {
        pages: {},
        forms: {},
        buttons: {},
        containers: {},
        currentWorkout: null,
        currentExerciseIndex: 0,
        timer: null,
        isPaused: false
    },

    init() {
        // Initialize page elements
        this.elements.pages = {
            welcome: document.getElementById('welcome-page'),
            profile: document.getElementById('profile-page'),
            workout: document.getElementById('workout-page'),
            exercise: document.getElementById('exercise-page'),
            complete: document.getElementById('complete-page')
        };

        // Initialize buttons
        const startWorkoutBtn = document.querySelector('[onclick="UI.showPage(\'workout\')"]');
        if (startWorkoutBtn) {
            startWorkoutBtn.removeAttribute('onclick');
            startWorkoutBtn.addEventListener('click', () => this.showWorkoutPlan());
        }

        this.checkAuth();
        this.setupAuthListeners();
        this.setupProfileForm();
        this.initNotificationArea();
        this.initPremiumPlans(); // Add this line to initialize premium plans
        this.addLogoToHeader(); // Add this line to add the logo to the header
    },
    
    // Add this new method to add the logo to the header
    addLogoToHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        
        const appTitle = header.querySelector('.navbar-brand');
        if (!appTitle) return;
        
        // Create logo element
        const logo = document.createElement('img');
        logo.src = 'images/logo.png'; // Make sure this path is correct
        logo.alt = 'VidaFit Logo';
        logo.className = 'me-2';
        logo.style.height = '30px';
        
        // Insert logo before the text in the navbar-brand
        appTitle.insertBefore(logo, appTitle.firstChild);
        
        // If the logo doesn't exist, create a fallback
        logo.onerror = function() {
            // Create a text-based logo as fallback
            this.remove();
            const textLogo = document.createElement('span');
            textLogo.className = 'logo-text me-2';
            textLogo.innerHTML = '<i class="fas fa-heartbeat text-danger"></i>';
            appTitle.insertBefore(textLogo, appTitle.firstChild);
        };
    },

    // Add this new method to initialize premium plans section
    initPremiumPlans() {
        const welcomePage = document.getElementById('welcome-page');
        if (!welcomePage) return;
        
        // Check if premium section already exists
        if (document.getElementById('premium-plans-section')) return;
        
        // Create premium plans section
        const premiumSection = document.createElement('div');
        premiumSection.id = 'premium-plans-section';
        premiumSection.className = 'container mt-5 mb-5';
        premiumSection.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center mb-4">Premium Plans</h2>
                    <p class="text-center lead mb-5">Take your fitness journey to the next level with personalized training</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-header bg-primary text-white text-center">
                            <h3 class="my-0">Basic</h3>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title pricing-card-title text-center">$29.99 <small class="text-muted">/ month</small></h4>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> 2 video sessions per month</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Personalized workout plan</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Email support</li>
                                <li class="mb-2"><i class="fas fa-times text-danger me-2"></i> Nutrition guidance</li>
                                <li class="mb-2"><i class="fas fa-times text-danger me-2"></i> Progress tracking</li>
                            </ul>
                            <button type="button" class="btn btn-lg btn-outline-primary mt-auto w-100">Get Started</button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow border-primary">
                        <div class="card-header bg-primary text-white text-center">
                            <h3 class="my-0">Pro</h3>
                            <span class="badge bg-warning text-dark">Most Popular</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title pricing-card-title text-center">$49.99 <small class="text-muted">/ month</small></h4>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> 4 video sessions per month</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Personalized workout plan</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Priority email support</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Basic nutrition guidance</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Progress tracking</li>
                            </ul>
                            <button type="button" class="btn btn-lg btn-primary mt-auto w-100">Get Started</button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-header bg-primary text-white text-center">
                            <h3 class="my-0">Elite</h3>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title pricing-card-title text-center">$89.99 <small class="text-muted">/ month</small></h4>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> 8 video sessions per month</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Fully customized workout plan</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> 24/7 trainer support</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Advanced nutrition planning</li>
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i> Detailed progress analytics</li>
                            </ul>
                            <button type="button" class="btn btn-lg btn-outline-primary mt-auto w-100">Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card bg-light">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h4>Meet Our Professional Trainers</h4>
                                    <p>Our certified trainers are experts in various fitness disciplines and will help you achieve your goals faster through personalized video sessions.</p>
                                </div>
                                <div class="col-md-4 text-center text-md-end">
                                    <button class="btn btn-primary">View Trainers</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the buttons
        premiumSection.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                if (!Auth.isLoggedIn()) {
                    this.showNotification('Please log in to subscribe to premium plans', 'info');
                    this.showPage('login');
                } else {
                    this.showNotification('Premium feature coming soon!', 'info');
                }
            });
        });
        
        // Insert the premium section before the first section in welcome page or append it
        const firstSection = welcomePage.querySelector('.container');
        if (firstSection) {
            welcomePage.insertBefore(premiumSection, firstSection.nextSibling);
        } else {
            welcomePage.appendChild(premiumSection);
        }
    },

    checkAuth() {
        if (!Auth.isLoggedIn()) {
            this.showPage('welcome');
            document.getElementById('logout-btn').style.display = 'none';
            document.getElementById('auth-section').classList.remove('d-none');
            document.getElementById('user-data').classList.add('d-none');
        } else {
            document.getElementById('logout-btn').style.display = 'flex';
            this.showUserData();
        }
    },

    setupAuthListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (await Auth.login(email, password)) {
                    this.showNotification('Login successful!', 'info');
                    this.showPage('profile');
                    document.getElementById('logout-btn').style.display = 'flex';
                } else {
                    this.showNotification('Login failed. Please try again.', 'error');
                }
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (await Auth.logout()) {
                    this.showNotification('Logged out successfully!', 'info');
                    this.showPage('welcome');
                    logoutBtn.style.display = 'none';
                    document.getElementById('auth-section').classList.remove('d-none');
                    document.getElementById('user-data').classList.add('d-none');
                }
            });
        }
    },

    setupProfileForm() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                try {
                    const profileData = {
                        name: document.getElementById('name').value,
                        age: parseInt(document.getElementById('age').value),
                        weight: parseFloat(document.getElementById('weight').value),
                        height: parseInt(document.getElementById('height').value),
                        activityLevel: document.getElementById('activityLevel').value,
                        goal: document.getElementById('goal').value,
                        dietaryPreference: document.getElementById('dietaryPreference').value
                    };

                    // First, validate the data
                    if (!profileData.name || !profileData.age || !profileData.weight || !profileData.height) {
                        throw new Error('Please fill in all required fields');
                    }

                    // Save profile data
                    const savedProfile = await DB.saveProfile(profileData);
                    if (!savedProfile) {
                        throw new Error('Failed to save profile');
                    }

                    // Generate and save workout
                    if (window.ExerciseModule) {
                        const workout = await ExerciseModule.generateWorkout(profileData);
                        if (workout) {
                            await DB.saveWorkout(workout);
                        }
                    }
                    
                    // Update UI
                    this.showNotification('Profile saved successfully!', 'info');
                    profileForm.reset();
                    
                    // Make sure user data is displayed
                    const userDataSection = document.getElementById('user-data');
                    if (userDataSection) {
                        userDataSection.classList.remove('d-none');
                        await this.showUserData();
                        this.showPage('welcome');
                    }
                } catch (error) {
                    console.error('Error saving profile:', error);
                    this.showNotification(error.message || 'Error saving profile. Please try again.', 'error');
                }
            });
        }
    },

    async showWorkoutPlan() {
        try {
            const workout = await DB.getWorkout();
            if (workout) {
                this.displayWorkout(workout);
                this.showPage('workout');
            } else {
                this.showNotification('No workout found. Please create a profile first.', 'error');
            }
        } catch (error) {
            console.error('Error loading workout:', error);
            this.showNotification('Error loading workout. Please try again.', 'error');
        }
    },

    displayWorkout(workout) {
        const workoutList = document.getElementById('workout-list');
        if (!workoutList || !workout) return;

        workoutList.innerHTML = `
            ${workout.map((exercise, index) => `
                <div class="exercise-item">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <img src="${exercise.image}" alt="${exercise.name}" class="img-fluid rounded exercise-image">
                        </div>
                        <div class="col-md-8">
                            <h3>${index + 1}. ${exercise.name}</h3>
                            <p class="exercise-duration">
                                <i class="fas fa-clock"></i> ${exercise.duration} seconds
                            </p>
                            <p class="exercise-description">${exercise.instructions}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="text-center mt-4">
                <button class="btn btn-primary btn-lg" id="start-workout-btn">
                    <i class="fas fa-play"></i> Start Workout
                </button>
            </div>
        `;

        // Initialize workout data and add event listener
        this.elements.currentWorkout = workout;
        this.elements.currentExerciseIndex = 0;
        
        const startButton = document.getElementById('start-workout-btn');
        startButton.addEventListener('click', () => {
            this.showPage('exercise');
            this.startExercise();
        });
    },

    completeExercise() {
        clearInterval(this.elements.timer);
        this.elements.currentExerciseIndex++;

        if (this.elements.currentExerciseIndex < this.elements.currentWorkout.length) {
            this.startExercise();
        } else {
            this.showPage('complete');
            // Don't reset the workout data
            this.elements.isPaused = false;
            clearInterval(this.elements.timer);
        }
    },

    startExercise() {
        if (!this.elements.currentWorkout) return;
        
        const exercise = this.elements.currentWorkout[this.elements.currentExerciseIndex];
        const exerciseContainer = document.getElementById('exercise-page');
        
        if (exerciseContainer && exercise) {
            exerciseContainer.innerHTML = `
                <div class="exercise-container">
                    <h2>${exercise.name}</h2>
                    <img src="${exercise.image}" alt="${exercise.name}" class="exercise-image mb-4">
                    <p class="exercise-instructions">${exercise.instructions}</p>
                    <div class="timer-container">
                        <div class="timer-display" id="timer">${exercise.duration}</div>
                        <div class="progress w-100 mb-3" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="exercise-controls">
                        <button id="pause-exercise" class="btn btn-primary">
                            <i class="fas fa-pause"></i> Pause
                        </button>
                        <button id="end-exercise" class="btn btn-secondary">
                            <i class="fas fa-stop"></i> End
                        </button>
                    </div>
                </div>
            `;

            this.setupExerciseControls(exercise.duration);
        }
    },

    setupExerciseControls(duration) {
        const pauseBtn = document.getElementById('pause-exercise');
        const endBtn = document.getElementById('end-exercise');
        let timeLeft = duration;
        
        this.elements.timer = setInterval(() => {
            if (!this.elements.isPaused) {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
                const progress = (timeLeft / duration) * 100;
                document.querySelector('.progress-bar').style.width = `${progress}%`;

                if (timeLeft <= 0) {
                    this.completeExercise();
                }
            }
        }, 1000);

        pauseBtn.addEventListener('click', () => {
            this.elements.isPaused = !this.elements.isPaused;
            pauseBtn.innerHTML = this.elements.isPaused ? 
                '<i class="fas fa-play"></i> Resume' : 
                '<i class="fas fa-pause"></i> Pause';
        });

        endBtn.addEventListener('click', () => {
            this.completeExercise();
        });
    },

    async showUserData() {
        const userProfile = await DB.getProfile();
        const userAuth = Auth.getCurrentUser();
        
        if (userProfile && userAuth) {
            const userDataTable = document.getElementById('user-info-table');
            const authSection = document.getElementById('auth-section');
            const userDataSection = document.getElementById('user-data');
            
            userDataTable.innerHTML = `
                <tr>
                    <th>Email:</th>
                    <td>${userAuth.email}</td>
                </tr>
                <tr>
                    <th>Name:</th>
                    <td>${userProfile.name}</td>
                </tr>
                <tr>
                    <th>Age:</th>
                    <td>${userProfile.age}</td>
                </tr>
                <tr>
                    <th>Weight:</th>
                    <td>${userProfile.weight} kg</td>
                </tr>
                <tr>
                    <th>Height:</th>
                    <td>${userProfile.height} cm</td>
                </tr>
                <tr>
                    <th>Activity Level:</th>
                    <td>${userProfile.activityLevel}</td>
                </tr>
                <tr>
                    <th>Goal:</th>
                    <td>${userProfile.goal}</td>
                </tr>
                <tr>
                    <th>Dietary Preference:</th>
                    <td>${userProfile.dietaryPreference}</td>
                </tr>
            `;
            
            authSection.classList.add('d-none');
            userDataSection.classList.remove('d-none');
        }
    },

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('d-none');
        });
        
        // Show the requested page
        const page = document.getElementById(pageId + '-page');
        if (page) {
            page.classList.remove('d-none');
            
            // Load profile data when profile page is shown
            if (pageId === 'profile') {
                this.loadProfileData();
            }
            
            // Dispatch a custom event when a page is shown
            const event = new CustomEvent('pageShown', { 
                detail: { pageId: pageId + '-page' } 
            });
            document.dispatchEvent(event);
        }
    },

    // Add this new method to load profile data into the profile page
    async loadProfileData() {
        const userProfile = await DB.getProfile();
        if (userProfile) {
            // Check if profile data table exists, if not create it
            let profileDataTable = document.getElementById('profile-data-table');
            const profileForm = document.getElementById('profile-form');
            
            if (!profileDataTable) {
                // Create table container
                const tableContainer = document.createElement('div');
                tableContainer.className = 'profile-data-container mt-4';
                tableContainer.innerHTML = `
                    <h3 class="text-center mb-3">Your Profile Data</h3>
                    <table id="profile-data-table" class="table table-striped">
                        <tbody></tbody>
                    </table>
                    <div class="text-center mt-3">
                        <button id="edit-profile-btn" class="btn btn-primary">Edit Profile</button>
                    </div>
                `;
                
                // Insert before the form
                profileForm.parentNode.insertBefore(tableContainer, profileForm);
                profileDataTable = document.getElementById('profile-data-table');
                
                // Add event listener to edit button
                document.getElementById('edit-profile-btn').addEventListener('click', () => {
                    this.toggleProfileEdit(true);
                });
            }
            
            // Populate table with profile data
            const tbody = profileDataTable.querySelector('tbody');
            tbody.innerHTML = `
                <tr>
                    <th>Name</th>
                    <td>${userProfile.name}</td>
                </tr>
                <tr>
                    <th>Age</th>
                    <td>${userProfile.age} years</td>
                </tr>
                <tr>
                    <th>Weight</th>
                    <td>${userProfile.weight} kg</td>
                </tr>
                <tr>
                    <th>Height</th>
                    <td>${userProfile.height} cm</td>
                </tr>
                <tr>
                    <th>Activity Level</th>
                    <td>${userProfile.activityLevel}</td>
                </tr>
                <tr>
                    <th>Fitness Goal</th>
                    <td>${userProfile.goal}</td>
                </tr>
                <tr>
                    <th>Dietary Preference</th>
                    <td>${userProfile.dietaryPreference}</td>
                </tr>
            `;
            
            // Hide the form and show the table
            this.toggleProfileEdit(false);
            
            // Also populate the form fields for when editing is enabled
            document.getElementById('name').value = userProfile.name;
            document.getElementById('age').value = userProfile.age;
            document.getElementById('weight').value = userProfile.weight;
            document.getElementById('height').value = userProfile.height;
            document.getElementById('activityLevel').value = userProfile.activityLevel;
            document.getElementById('goal').value = userProfile.goal;
            document.getElementById('dietaryPreference').value = userProfile.dietaryPreference;
        } else {
            // No profile data, show the form
            this.toggleProfileEdit(true);
        }
    },
    
    // Add this method to toggle between profile view and edit modes
    toggleProfileEdit(editMode) {
        const profileForm = document.getElementById('profile-form');
        const profileDataContainer = document.querySelector('.profile-data-container');
        
        if (editMode) {
            // Show form, hide data table
            profileForm.classList.remove('d-none');
            if (profileDataContainer) {
                profileDataContainer.classList.add('d-none');
            }
        } else {
            // Hide form, show data table
            profileForm.classList.add('d-none');
            if (profileDataContainer) {
                profileDataContainer.classList.remove('d-none');
            }
        }
    },

    initNotificationArea() {
        let notificationArea = document.getElementById('notification-area');
        if (!notificationArea) {
            notificationArea = document.createElement('div');
            notificationArea.id = 'notification-area';
            notificationArea.className = 'notification-area';
            document.body.appendChild(notificationArea);
        }
    },

    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        if (!notificationArea) return;
    
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
    
        notification.classList.add('notification-slide-in');
    
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
    
        notificationArea.appendChild(notification);
    
        setTimeout(() => this.removeNotification(notification), 5000);
    },

    removeNotification(notification) {
        notification.classList.add('notification-slide-out');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }
};

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});

window.UI = UI;