// Check authentication
if (!requireAuth()) {
    window.location.href = 'index.html';
}

const currentUser = getCurrentUser();

// Check if user is organizer or admin
if (currentUser.role !== 'organizer' && currentUser.role !== 'admin') {
    alert('Access denied. Only organizers can create activities.');
    window.location.href = 'dashboard.html';
}

// Get activity ID from URL (for editing)
const urlParams = new URLSearchParams(window.location.search);
const activityId = urlParams.get('id');
const isEditMode = !!activityId;

// DOM Elements
const activityForm = document.getElementById('activityForm');
const submitBtn = document.getElementById('submitBtn');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const alertContainer = document.getElementById('alertContainer');

// Form inputs
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const posterUploadInput = document.getElementById('posterUpload');
const posterPreview = document.getElementById('posterPreview');
const posterPreviewImg = document.getElementById('posterPreviewImg');
const removePosterBtn = document.getElementById('removePosterBtn');
const activityTypeInput = document.getElementById('activityType');
const facultyInput = document.getElementById('faculty');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const locationInput = document.getElementById('location');
const maxParticipantsInput = document.getElementById('maxParticipants');
const statusInput = document.getElementById('status');
const isAnnouncementOnlyInput = document.getElementById('isAnnouncementOnly');
const externalLinkInput = document.getElementById('externalLink');
const registrationStartDateInput = document.getElementById('registrationStartDate');
const registrationEndDateInput = document.getElementById('registrationEndDate');
const registrationPeriodRow = document.getElementById('registrationPeriodRow');

// State
let existingActivity = null;
let posterBase64 = null; // Store poster as base64

// Poster upload handler
posterUploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showAlert('Poster image must be less than 2MB', 'error');
            posterUploadInput.value = '';
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            showAlert('Please upload an image file', 'error');
            posterUploadInput.value = '';
            return;
        }

        // Read file and convert to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            posterBase64 = e.target.result;
            posterPreviewImg.src = posterBase64;
            posterPreview.style.display = 'block';
        };
        reader.onerror = function() {
            showAlert('Error reading file. Please try again.', 'error');
        };
        reader.readAsDataURL(file);
    }
});

// Remove poster handler
removePosterBtn.addEventListener('click', function() {
    posterUploadInput.value = '';
    posterBase64 = null;
    posterPreview.style.display = 'none';
    posterPreviewImg.src = '';
});

// Toggle registration period visibility based on announcement toggle
isAnnouncementOnlyInput.addEventListener('change', function() {
    if (this.checked) {
        registrationPeriodRow.style.display = 'none';
        registrationStartDateInput.value = '';
        registrationEndDateInput.value = '';
    } else {
        registrationPeriodRow.style.display = 'grid';
    }
});

// Show alert
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load existing activity (if editing)
async function loadExistingActivity() {
    if (!isEditMode) return;
    
    try {
        const response = await API.activities.getById(activityId);
        
        if (!response.ok) {
            throw new Error('Failed to load activity');
        }
        
        existingActivity = response.data.data.activity;
        
        // Check ownership
        if (existingActivity.created_by !== currentUser.id && currentUser.role !== 'admin') {
            alert('You can only edit your own activities');
            window.location.href = 'my-activities.html';
            return;
        }
        
        // Populate form
        titleInput.value = existingActivity.title || '';
        descriptionInput.value = existingActivity.description || '';
        activityTypeInput.value = existingActivity.activity_type || '';
        facultyInput.value = existingActivity.faculty || '';
        startDateInput.value = existingActivity.start_date?.split('T')[0] || '';
        endDateInput.value = existingActivity.end_date?.split('T')[0] || '';
        locationInput.value = existingActivity.location || '';
        maxParticipantsInput.value = existingActivity.max_participants || '';
        statusInput.value = existingActivity.status || 'open';
        isAnnouncementOnlyInput.checked = existingActivity.is_announcement_only || false;
        externalLinkInput.value = existingActivity.external_link || '';
        
        // Populate registration dates (convert to datetime-local format)
        if (existingActivity.registration_start_date) {
            const regStart = new Date(existingActivity.registration_start_date);
            registrationStartDateInput.value = regStart.toISOString().slice(0, 16);
        }
        if (existingActivity.registration_end_date) {
            const regEnd = new Date(existingActivity.registration_end_date);
            registrationEndDateInput.value = regEnd.toISOString().slice(0, 16);
        }
        
        // Hide registration period if announcement only
        if (existingActivity.is_announcement_only) {
            registrationPeriodRow.style.display = 'none';
        }
        
        // Load existing poster if available
        if (existingActivity.poster_url) {
            posterBase64 = existingActivity.poster_url;
            posterPreviewImg.src = posterBase64;
            posterPreview.style.display = 'block';
        }
        
        // Update page title
        pageTitle.textContent = '✏️ Edit Activity';
        pageSubtitle.textContent = 'Update activity details';
        submitBtn.textContent = 'Update Activity';
        
    } catch (error) {
        console.error('Load activity error:', error);
        showAlert('Failed to load activity details', 'error');
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate dates
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (endDate < startDate) {
        showAlert('End date must be after start date', 'error');
        return;
    }
    
    // Validate registration dates
    const regStartDate = registrationStartDateInput.value ? new Date(registrationStartDateInput.value) : null;
    const regEndDate = registrationEndDateInput.value ? new Date(registrationEndDateInput.value) : null;
    
    if (regStartDate && regEndDate && regEndDate < regStartDate) {
        showAlert('Registration closing date must be after opening date', 'error');
        return;
    }
    
    // Prepare activity data
    const activityData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        activity_type: activityTypeInput.value,
        faculty: facultyInput.value.trim() || null,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        location: locationInput.value.trim(),
        max_participants: parseInt(maxParticipantsInput.value),
        status: statusInput.value,
        is_announcement_only: isAnnouncementOnlyInput.checked,
        registration_start_date: regStartDate ? regStartDate.toISOString() : null,
        registration_end_date: regEndDate ? regEndDate.toISOString() : null,
        external_link: externalLinkInput.value.trim() || null,
        poster_url: posterBase64 // Include poster base64 data
    };
    
    submitBtn.disabled = true;
    submitBtn.textContent = isEditMode ? 'Updating...' : 'Creating...';
    
    try {
        let savedActivityId = activityId;
        
        // Create or update activity
        if (isEditMode) {
            const response = await API.activities.update(activityId, activityData);
            
            if (!response.ok) {
                throw new Error(response.data.message || 'Failed to update activity');
            }
            
            showAlert('Activity updated successfully!', 'success');
            
        } else {
            const response = await API.activities.create(activityData);
            
            if (!response.ok) {
                throw new Error(response.data.message || 'Failed to create activity');
            }
            
            savedActivityId = response.data.data.activity.id;
            showAlert('Activity created successfully! It is now pending admin approval.', 'success');
        }
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'my-activities.html';
        }, 2000);
        
    } catch (error) {
        console.error('Submit error:', error);
        showAlert(error.message || 'Failed to save activity', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = isEditMode ? 'Update Activity' : 'Create Activity';
    }
}

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
startDateInput.setAttribute('min', today);
endDateInput.setAttribute('min', today);

// Initialize
activityForm.addEventListener('submit', handleSubmit);

if (isEditMode) {
    loadExistingActivity();
}
