const ExerciseModule = {
    exercises: [
        {
            name: "Push-ups",
            duration: 30,
            image: "images/rutina2_3.png",
            instructions: "Start in plank position, lower your body until your chest nearly touches the floor, then push back up."
        },
        {
            name: "Squats",
            duration: 30,
            image: "images/rutina1_1.png",
            instructions: "Stand with feet shoulder-width apart, lower your body as if sitting back into a chair."
        },
        {
            name: "Planks",
            duration: 30,
            image: "images/rutina2_1.png",
            instructions: "Hold a push-up position with your forearms on the ground, keeping your body straight."
        }
        // Add more exercises using images from your imagenes folder
    ],

    async initializeExercises() {
        return this.exercises;
    },

    async generateWorkout(profile) {
        // Generate workout based on profile
        const workoutLength = profile?.activityLevel === 'high' ? 6 : 
                            profile?.activityLevel === 'medium' ? 4 : 3;
        
        return this.exercises
            .sort(() => Math.random() - 0.5)
            .slice(0, workoutLength);
    }
};