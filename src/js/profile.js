// Profile Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load profile data on page load
    loadProfileData();

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Profile Picture Upload
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');

    avatarUploadBtn.addEventListener('click', function() {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showMessage('Please select a valid image file', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Image size must be less than 5MB', 'error');
                return;
            }
            
            // Read and display the image
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageData = event.target.result;
                profileAvatar.src = imageData;
                
                // Update all profile images on the page
                document.querySelectorAll('.profile-img').forEach(img => {
                    img.src = imageData;
                });
                
                // Save to localStorage
                saveProfilePicture(imageData);
                
                showMessage('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // Personal Info Form
    const personalInfoForm = document.getElementById('personalInfoForm');
    personalInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Basic validation
        if (!firstName || !lastName || !email) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate saving
        const btn = this.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            // Update profile name
            const fullName = `${firstName} ${lastName}`;
            document.querySelector('.profile-full-name').textContent = fullName;
            document.querySelectorAll('.profile-name').forEach(el => {
                el.textContent = fullName;
            });
            
            // Save to localStorage
            saveProfileName(fullName);
            
            showMessage('Personal information updated successfully!', 'success');
        }, 1500);
    });

    // Password Change Form
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    passwordChangeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage('Please fill in all password fields', 'error');
            return;
        }
        
        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            showMessage('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
            return;
        }
        
        // Confirm password match
        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match', 'error');
            return;
        }
        
        // Simulate password change
        const btn = this.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            // Clear form
            this.reset();
            
            showMessage('Password updated successfully!', 'success');
        }, 1500);
    });

    // Password Toggle Buttons
    const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');
    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Toggle Switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.closest('.security-option, .settings-option').querySelector('h4').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showMessage(`${label} ${status}`, 'info');
        });
    });

    // Cancel Buttons
    const cancelBtns = document.querySelectorAll('.btn-secondary');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('form');
            if (form) {
                // Reset form to original values
                form.reset();
                showMessage('Changes cancelled', 'info');
            }
        });
    });

    // Danger Zone Actions
    const deactivateBtn = document.querySelector('.btn-danger-outline');
    const deleteBtn = document.querySelector('.btn-danger');

    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to deactivate your account? You can reactivate it anytime by logging in.')) {
                showMessage('Account deactivation initiated...', 'info');
                setTimeout(() => {
                    showMessage('This is a demo - account would be deactivated', 'info');
                }, 1500);
            }
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const confirmation = prompt('This action is irreversible. Type "DELETE" to confirm:');
            if (confirmation === 'DELETE') {
                showMessage('Account deletion initiated...', 'error');
                setTimeout(() => {
                    showMessage('This is a demo - account would be permanently deleted', 'error');
                }, 1500);
            } else if (confirmation !== null) {
                showMessage('Deletion cancelled - confirmation text did not match', 'info');
            }
        });
    }

    // Message display function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        if (type === 'success') {
            messageDiv.style.background = '#10b981';
        } else if (type === 'error') {
            messageDiv.style.background = '#ef4444';
        } else if (type === 'info') {
            messageDiv.style.background = '#3b82f6';
        }
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 300);
        }, 3000);
    }

    // Form input animations
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save (prevent default browser save)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const activeTab = document.querySelector('.tab-content.active');
            const form = activeTab?.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Add touch support for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});

// Load profile data from localStorage
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    // Update profile picture
    if (profileData.picture) {
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = profileData.picture;
        }
        
        const profileImages = document.querySelectorAll('.profile-img');
        profileImages.forEach(img => {
            img.src = profileData.picture;
        });
    }
    
    // Update profile name
    if (profileData.name) {
        const profileFullName = document.querySelector('.profile-full-name');
        if (profileFullName) {
            profileFullName.textContent = profileData.name;
        }
        
        const profileNames = document.querySelectorAll('.profile-name');
        profileNames.forEach(el => {
            el.textContent = profileData.name;
        });
        
        // Update form fields if they exist
        const nameParts = profileData.name.split(' ');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        
        if (firstNameInput && nameParts.length > 0) {
            firstNameInput.value = nameParts[0];
        }
        if (lastNameInput && nameParts.length > 1) {
            lastNameInput.value = nameParts.slice(1).join(' ');
        }
    }
}

// Save profile picture to localStorage
function saveProfilePicture(imageData) {
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    profileData.picture = imageData;
    localStorage.setItem('userProfile', JSON.stringify(profileData));
}

// Save profile name to localStorage
function saveProfileName(name) {
    const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    profileData.name = name;
    localStorage.setItem('userProfile', JSON.stringify(profileData));
}
