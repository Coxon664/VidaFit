// Main application file for VidaFit

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check for periodic sync support
      if ('periodicSync' in registration) {
        const status = await navigator.permissions.query({
          name: 'periodic-background-sync'
        });
        
        if (status.state === 'granted') {
          try {
            await registration.periodicSync.register('daily-notifications', {
              minInterval: 24 * 60 * 60 * 1000 // 24 hours
            });
          } catch (error) {
            console.log('Periodic Sync could not be registered:', error);
          }
        }
      }
    } catch (error) {
      console.log('ServiceWorker registration failed: ', error);
    }
  });
}

// Handle app installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.classList.remove('d-none');
  }
});

// Handle app installed
window.addEventListener('appinstalled', (evt) => {
  console.log('VidaFit has been installed');
  // Hide install button after installation
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.classList.add('d-none');
  }
});

// Request notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setupPushNotifications();
    }
  }
};

// Set up push notifications
const setupPushNotifications = async () => {
  // This would typically involve a server-side component
  // For demo purposes, we'll just schedule a local notification
  
  // Check if we can use service worker for notifications
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Schedule a notification for tomorrow
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
      const delay = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        registration.showNotification('VidaFit Reminder', {
          body: 'Time for your daily workout! Stay consistent to reach your goals.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [100, 50, 100],
          data: {
            url: window.location.href
          }
        });
      }, delay);
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }
};

// Update the initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize UI first
        UI.init();
        UI.showPage('welcome');
        
        // Initialize other modules
        await ExerciseModule.initializeExercises();
        await NotificationManager.init();
    } catch (error) {
        console.error('Initialization error:', error);
        UI.showNotification('Error initializing app. Basic functionality still available.', 'warning');
    }
});

// Remove or comment out the service worker registration for now
// Will need to be served from a proper web server to work
// Add global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (typeof UI !== 'undefined') {
        UI.showNotification('An error occurred. Some features might be limited.', 'warning');
    }
});

// Add this to your app.js file

// Handle workout completion and progress tracking
document.addEventListener('DOMContentLoaded', () => {
    const finishWorkoutBtn = document.getElementById('finish-workout-btn');
    
    if (finishWorkoutBtn) {
        finishWorkoutBtn.addEventListener('click', () => {
            // Navigate to progress page
            UI.showPage('progress');
            
            // Update progress with latest workout
            updateProgressWithLatestWorkout();
        });
    }
    
    // Auto-redirect from complete page to progress page
    function startProgressRedirect() {
        const progressBar = document.getElementById('redirect-progress');
        let width = 0;
        
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                UI.showPage('progress');
                updateProgressWithLatestWorkout();
            } else {
                width += 1;
                progressBar.style.width = width + '%';
            }
        }, 30); // Will complete in about 3 seconds
    }
    
    // Function to update progress page with latest workout data
    function updateProgressWithLatestWorkout() {
        // Get the latest workout from storage
        const latestWorkout = getLatestWorkoutData();
        
        if (latestWorkout) {
            // Update workout history list
            updateWorkoutHistoryList(latestWorkout);
            
            // Update calendar
            updateWorkoutCalendar(latestWorkout.date);
            
            // Show feedback based on workout
            showWorkoutFeedback(latestWorkout);
        }
    }
    
    // Mock function to get latest workout data (replace with actual implementation)
    function getLatestWorkoutData() {
        // This would normally come from your database
        // For now, we'll create mock data
        return {
            date: new Date(),
            exercises: [
                { name: "Push-ups", sets: 3, reps: 10, completed: true },
                { name: "Squats", sets: 3, reps: 15, completed: true },
                { name: "Plank", duration: "30s", sets: 3, completed: true }
            ],
            duration: "15 minutes",
            caloriesBurned: 120
        };
    }
    
    // Update the workout history list with the latest workout
    function updateWorkoutHistoryList(workout) {
        const historyList = document.getElementById('workout-history-list');
        
        // Clear placeholder if it exists
        const placeholder = historyList.querySelector('.text-center');
        if (placeholder) {
            historyList.innerHTML = '';
        }
        
        // Create a new history item
        const historyItem = document.createElement('div');
        historyItem.className = 'list-group-item';
        
        const date = new Date(workout.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        historyItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">Workout on ${formattedDate}</h5>
                <small>${workout.duration}</small>
            </div>
            <p class="mb-1">Completed ${workout.exercises.length} exercises</p>
            <small>Calories burned: ${workout.caloriesBurned}</small>
            <div class="mt-2">
                <button class="btn btn-sm btn-outline-primary view-details-btn">View Details</button>
            </div>
        `;
        
        // Add to the top of the list
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Add event listener to view details button
        const viewDetailsBtn = historyItem.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', () => {
            showWorkoutDetails(workout);
        });
    }
    
    // Update the calendar with the workout date
    function updateWorkoutCalendar(date) {
        // This would be implemented with a proper calendar library
        // For now, we'll just update the month display
        const currentMonth = document.getElementById('current-month');
        if (currentMonth) {
            const workoutDate = new Date(date);
            currentMonth.textContent = workoutDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long'
            });
        }
        
        // In a real implementation, you would mark the date on the calendar
    }
    
    // Show feedback based on the workout
    function showWorkoutFeedback(workout) {
        const feedbackContainer = document.getElementById('workout-feedback');
        
        if (feedbackContainer) {
            // Clear placeholder
            feedbackContainer.innerHTML = '';
            
            // Generate personalized feedback
            const feedback = document.createElement('div');
            feedback.className = 'feedback-item';
            
            // Calculate completion percentage
            const completedExercises = workout.exercises.filter(ex => ex.completed).length;
            const completionPercentage = (completedExercises / workout.exercises.length) * 100;
            
            // Generate appropriate feedback message
            let feedbackMessage = '';
            let feedbackIcon = '';
            
            if (completionPercentage === 100) {
                feedbackMessage = 'Great job completing your entire workout! Keep up the excellent work.';
                feedbackIcon = '<i class="fas fa-trophy text-warning fa-2x mb-3"></i>';
            } else if (completionPercentage >= 75) {
                feedbackMessage = 'Good effort! You completed most of your workout. Try to finish all exercises next time.';
                feedbackIcon = '<i class="fas fa-star text-primary fa-2x mb-3"></i>';
            } else {
                feedbackMessage = 'You\'ve made a start! Try to complete more exercises in your next session.';
                feedbackIcon = '<i class="fas fa-seedling text-success fa-2x mb-3"></i>';
            }
            
            // Add a tip based on the workout
            const tips = [
                'Remember to stay hydrated during your workouts.',
                'Try to increase your reps or weight slightly in your next session.',
                'Make sure to stretch after your workout to improve recovery.',
                'Consistency is key - aim for regular workouts rather than occasional intense sessions.',
                'Get enough sleep to help your muscles recover properly.'
            ];
            
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            
            feedback.innerHTML = `
                <div class="text-center">
                    ${feedbackIcon}
                </div>
                <h5 class="feedback-title">Workout Feedback</h5>
                <p>${feedbackMessage}</p>
                <div class="tip-box mt-3 p-2 bg-light rounded">
                    <strong>Tip:</strong> ${randomTip}
                </div>
            `;
            
            feedbackContainer.appendChild(feedback);
        }
    }
    
    // Show detailed workout information
    function showWorkoutDetails(workout) {
        // This would show a modal or expand the list item with details
        console.log('Showing details for workout:', workout);
        
        // For now, we'll just log to console, but you could implement a modal here
    }
    
    // When the complete page is shown, start the redirect
    document.addEventListener('pageShown', (event) => {
        if (event.detail.pageId === 'complete-page') {
            startProgressRedirect();
        }
    });
});