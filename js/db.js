const DB = {
    dbName: 'vidafit-db',
    
    async init() {
        try {
            // Check if IndexedDB is available
            if (!window.indexedDB) {
                console.warn('IndexedDB not supported, falling back to localStorage');
                return;
            }

            this.db = await idb.openDB(this.dbName, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains('profile')) {
                        db.createObjectStore('profile');
                    }
                    if (!db.objectStoreNames.contains('workouts')) {
                        db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
                    }
                }
            });
        } catch (error) {
            console.warn('Error initializing IndexedDB:', error);
        }
    },

    async saveProfile(profileData) {
        try {
            await this.init();
            await this.db.put('profile', profileData, 'userProfile');
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            return true;
        } catch (error) {
            console.error('Error saving profile:', error);
            throw error;
        }
    },

    async getProfile() {
        try {
            await this.init();
            let profile = await this.db.get('profile', 'userProfile');
            if (!profile) {
                const localProfile = localStorage.getItem('userProfile');
                profile = localProfile ? JSON.parse(localProfile) : null;
            }
            return profile;
        } catch (error) {
            console.error('Error getting profile:', error);
            throw error;
        }
    },
    
    async saveWorkout(workout) {
        try {
            await this.init();
            const user = Auth.getCurrentUser();
            if (user) {
                await this.db.put('workouts', workout, `workout_${user.email}`);
                localStorage.setItem(`workout_${user.email}`, JSON.stringify(workout));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving workout:', error);
            return false;
        }
    },

    async getWorkout() {
        try {
            await this.init();
            const user = Auth.getCurrentUser();
            if (user) {
                let workout = await this.db.get('workouts', `workout_${user.email}`);
                if (!workout) {
                    // Default workout when none is found
                    workout = [
                        {
                            name: "Jumping Jacks",
                            duration: 30,
                            image: "images/exercises/jumping-jacks.png",
                            instructions: "Jump while raising your arms and spreading your legs."
                        },
                        {
                            name: "Push-ups",
                            duration: 45,
                            image: "images/exercises/pushups.png",
                            instructions: "Keep your body straight while lowering and raising it with your arms."
                        },
                        {
                            name: "Squats",
                            duration: 40,
                            image: "images/exercises/squats.png",
                            instructions: "Stand with feet shoulder-width apart, lower your body as if sitting back."
                        },
                        {
                            name: "Plank",
                            duration: 60,
                            image: "images/exercises/plank.png",
                            instructions: "Hold your body straight and parallel to the ground."
                        }
                    ];
                    // Save the default workout
                    await this.saveWorkout(workout);
                }
                return workout;
            }
            return null;
        } catch (error) {
            console.error('Error getting workout:', error);
            return null;
        }
    }
};

// Initialize DB when the script loads
DB.init().catch(console.error);

window.DB = DB;