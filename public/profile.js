// Check authentication
if (!requireAuth()) {
    window.location.href = 'index.html';
}

const currentUser = getCurrentUser();

// DOM Elements
const profileAvatar = document.getElementById('profileAvatar');
const profileAvatarIcon = document.getElementById('profileAvatarIcon');
const profileAvatarImg = document.getElementById('profileAvatarImg');
const avatarUploadInput = document.getElementById('avatarUploadInput');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileRole = document.getElementById('profileRole');
const infoUsername = document.getElementById('infoUsername');
const infoEmail = document.getElementById('infoEmail');
const infoFullName = document.getElementById('infoFullName');
const infoMemberSince = document.getElementById('infoMemberSince');
const passwordAlert = document.getElementById('passwordAlert');
const changePasswordForm = document.getElementById('changePasswordForm');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordStrength = document.getElementById('passwordStrength');
const passwordStrengthBar = document.getElementById('passwordStrengthBar');
const toggleButtons = document.querySelectorAll('.toggle-password-btn');

// Load user profile
async function loadProfile() {
    try {
        const response = await API.profile.get();
        
        if (response.ok && response.data) {
            const user = response.data.data.user;
            
            // Update profile avatar
            if (user.avatar_url) {
                profileAvatarImg.src = user.avatar_url;
                profileAvatarImg.style.display = 'block';
                profileAvatarIcon.style.display = 'none';
            } else {
                const initials = getInitials(user.first_name, user.last_name, user.username);
                profileAvatarIcon.textContent = initials;
                profileAvatarIcon.style.display = 'block';
                profileAvatarImg.style.display = 'none';
            }
            
            const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;
            profileName.textContent = fullName;
            profileEmail.textContent = user.email;
            profileRole.textContent = user.role;
            
            // Update info grid
            infoUsername.textContent = user.username;
            infoEmail.textContent = user.email;
            infoFullName.textContent = fullName;
            
            // Format member since date
            if (user.created_at) {
                const date = new Date(user.created_at);
                infoMemberSince.textContent = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showAlert('Failed to load profile information', 'error');
    }
}

// Get initials from name
function getInitials(firstName, lastName, username) {
    if (firstName && lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    } else if (firstName) {
        return firstName.charAt(0).toUpperCase();
    } else if (username) {
        return username.substring(0, 2).toUpperCase();
    }
    return 'U';
}

// Password strength checker
newPasswordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
        passwordStrength.style.display = 'none';
        return;
    }
    
    passwordStrength.style.display = 'block';
    
    // Calculate strength
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Update strength bar
    passwordStrengthBar.className = 'password-strength-bar';
    if (strength <= 2) {
        passwordStrengthBar.classList.add('strength-weak');
    } else if (strength <= 4) {
        passwordStrengthBar.classList.add('strength-medium');
    } else {
        passwordStrengthBar.classList.add('strength-strong');
    }
});

// Change password form submission
changePasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('All fields are required', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters long', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword === currentPassword) {
        showAlert('New password must be different from current password', 'error');
        return;
    }
    
    // Disable button and show loading
    changePasswordBtn.disabled = true;
    changePasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Changing Password...';
    
    try {
        const response = await API.profile.changePassword({
            currentPassword,
            newPassword
        });
        
        if (response.ok) {
            showAlert('Password changed successfully! You can now use your new password to login.', 'success');
            changePasswordForm.reset();
            passwordStrength.style.display = 'none';
            
            // Optionally log out user after password change
            setTimeout(() => {
                const shouldLogout = confirm('Password changed successfully! Would you like to log out now?');
                if (shouldLogout) {
                    logout();
                    window.location.href = 'index.html';
                }
            }, 1500);
        } else {
            const errorMessage = response.data?.message || 'Failed to change password';
            showAlert(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Change password error:', error);
        showAlert('An error occurred while changing password. Please try again.', 'error');
    } finally {
        changePasswordBtn.disabled = false;
        changePasswordBtn.innerHTML = '<i class="fas fa-key"></i> Change Password';
    }
});

// Show alert message
function showAlert(message, type = 'info') {
    passwordAlert.innerHTML = `
        <div class="alert alert-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            passwordAlert.innerHTML = '';
        }, 5000);
    }
}

// Avatar upload handler
avatarUploadInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Profile photo must be less than 2MB', 'error');
        avatarUploadInput.value = '';
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file', 'error');
        avatarUploadInput.value = '';
        return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async function(event) {
        const base64Image = event.target.result;
        
        try {
            // Show loading state
            profileAvatar.style.opacity = '0.6';
            
            // Upload avatar
            const response = await API.profile.updateAvatar(base64Image);
            
            if (response.ok) {
                // Update avatar display
                profileAvatarImg.src = base64Image;
                profileAvatarImg.style.display = 'block';
                profileAvatarIcon.style.display = 'none';
                
                showAlert('Profile photo updated successfully!', 'success');
                
                // Update local storage if needed (for header display)
                const updatedUser = { ...currentUser, avatar_url: base64Image };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                const errorMessage = response.data?.message || 'Failed to upload profile photo';
                showAlert(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            showAlert('An error occurred while uploading photo. Please try again.', 'error');
        } finally {
            profileAvatar.style.opacity = '1';
            avatarUploadInput.value = '';
        }
    };
    
    reader.onerror = function() {
        showAlert('Failed to read image file', 'error');
        avatarUploadInput.value = '';
    };
    
    reader.readAsDataURL(file);
});

// Initialize
loadProfile();

// Password visibility toggles
toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = `<i class="fas fa-${isPassword ? 'eye-slash' : 'eye'}"></i>`;
    });
});
