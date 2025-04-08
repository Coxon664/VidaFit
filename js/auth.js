const Auth = {
    async login(email, password) {
        try {
            // For demo purposes, we'll use a simple validation
            if (email && password) {
                const user = {
                    email,
                    name: email.split('@')[0],
                    lastLogin: new Date().toISOString()
                };
                localStorage.setItem('user', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    async logout() {
        try {
            localStorage.removeItem('user');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    },

    isLoggedIn() {
        return !!localStorage.getItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

window.Auth = Auth;

// Add this to your existing auth.js file
document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
});