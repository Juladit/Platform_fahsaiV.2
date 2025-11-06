// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api';

// DOM Elements
const signupForm = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const errorAlert = document.getElementById('errorAlert');
const successAlert = document.getElementById('successAlert');

// Form inputs
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const studentIdInput = document.getElementById('studentId');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const roleSelect = document.getElementById('role');

// Password strength
const passwordStrength = document.getElementById('passwordStrength');
const passwordStrengthBar = document.getElementById('passwordStrengthBar');

// Show alert message
function showAlert(message, type = 'error') {
    const alert = type === 'error' ? errorAlert : successAlert;
    const otherAlert = type === 'error' ? successAlert : errorAlert;
    
    alert.textContent = message;
    alert.classList.add('show');
    otherAlert.classList.remove('show');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hide alerts
function hideAlerts() {
    errorAlert.classList.remove('show');
    successAlert.classList.remove('show');
}

// Show field error
function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);
    
    input.classList.add('error');
    error.textContent = message;
    error.classList.add('show');
}

// Clear field error
function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);
    
    input.classList.remove('error');
    error.classList.remove('show');
}

// Clear all field errors
function clearAllFieldErrors() {
    const fields = ['firstName', 'lastName', 'studentId', 'username', 'email', 'phone', 'password', 'confirmPassword', 'role'];
    fields.forEach(field => clearFieldError(field));
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check password strength
function checkPasswordStrength(password) {
    if (!password) {
        passwordStrength.classList.remove('show');
        return;
    }
    
    passwordStrength.classList.add('show');
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Update strength bar
    passwordStrengthBar.className = 'password-strength-bar';
    
    if (strength <= 2) {
        passwordStrengthBar.classList.add('weak');
    } else if (strength <= 4) {
        passwordStrengthBar.classList.add('medium');
    } else {
        passwordStrengthBar.classList.add('strong');
    }
}

// Validate form
function validateForm() {
    clearAllFieldErrors();
    hideAlerts();
    let isValid = true;
    
    // First name
    if (!firstNameInput.value.trim()) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }
    
    // Last name
    if (!lastNameInput.value.trim()) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Student ID
    if (!studentIdInput.value.trim()) {
        showFieldError('studentId', 'Student ID is required');
        isValid = false;
    } else if (studentIdInput.value.trim().length < 5) {
        showFieldError('studentId', 'Student ID must be at least 5 characters');
        isValid = false;
    }
    
    // Username
    if (!usernameInput.value.trim()) {
        showFieldError('username', 'Username is required');
        isValid = false;
    } else if (usernameInput.value.trim().length < 3) {
        showFieldError('username', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    // Email
    if (!emailInput.value.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password
    if (!passwordInput.value) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (passwordInput.value.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Confirm password
    if (!confirmPasswordInput.value) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Role
    if (!roleSelect.value) {
        showFieldError('role', 'Please select a role');
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
async function handleSignup(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    try {
        const formData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            studentId: studentIdInput.value.trim(),
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim() || undefined,
            password: passwordInput.value,
            role: roleSelect.value
        };
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        // Success
        showAlert('Account created successfully! Redirecting to login...', 'success');
        
        // Clear form
        signupForm.reset();
        passwordStrength.classList.remove('show');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific error messages
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('username')) {
            showFieldError('username', 'Username is already taken');
        } else if (errorMessage.includes('email')) {
            showFieldError('email', 'Email is already registered');
        } else if (errorMessage.includes('student')) {
            showFieldError('studentId', 'Student ID is already registered');
        } else {
            showAlert(error.message || 'Failed to create account. Please try again.');
        }
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
}

// Event listeners
signupForm.addEventListener('submit', handleSignup);

// Password strength check
passwordInput.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});

// Clear password strength when field is cleared
passwordInput.addEventListener('blur', () => {
    if (!passwordInput.value) {
        passwordStrength.classList.remove('show');
    }
});

// Clear field errors on input
[firstNameInput, lastNameInput, studentIdInput, usernameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, roleSelect].forEach(input => {
    input.addEventListener('input', () => {
        clearFieldError(input.id);
        hideAlerts();
    });
});

// Auto-format student ID (optional)
studentIdInput.addEventListener('input', (e) => {
    // Remove non-alphanumeric characters
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
});

// Phone number formatting (optional)
phoneInput.addEventListener('input', (e) => {
    // Remove non-numeric characters
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});
