// Check authentication
if (!requireAuth()) {
    window.location.href = 'index.html';
}

const currentUser = getCurrentUser();
const urlParams = new URLSearchParams(window.location.search);
const activityId = urlParams.get('id');

if (!activityId) {
    window.location.href = 'dashboard.html';
}

// DOM Elements
const loadingState = document.getElementById('loadingState');
const contentContainer = document.getElementById('contentContainer');
const alertContainer = document.getElementById('alertContainer');

// Activity details elements
const activityTitle = document.getElementById('activityTitle');
const activityDates = document.getElementById('activityDates');
const activityLocation = document.getElementById('activityLocation');
const activityParticipants = document.getElementById('activityParticipants');
const statusBadge = document.getElementById('statusBadge');
const activityDescription = document.getElementById('activityDescription');
const activityType = document.getElementById('activityType');
const activityFaculty = document.getElementById('activityFaculty');
const activityCreator = document.getElementById('activityCreator');
const maxParticipants = document.getElementById('maxParticipants');
const actionButtons = document.getElementById('actionButtons');
const eventsContainer = document.getElementById('eventsContainer');
const attendanceCard = document.getElementById('attendanceCard');

// State
let activity = null;
let registration = null;
let events = [];

// Show alert
function showAlert(message, type = 'info') {
    const alertClass = `alert-${type}`;
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format datetime
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Load activity details
async function loadActivityDetails() {
    try {
        const response = await API.activities.getById(activityId);
        
        if (!response.ok) {
            throw new Error(response.data.message || 'Failed to load activity');
        }
        
        activity = response.data.data.activity;
        displayActivityDetails();
        
    } catch (error) {
        console.error('Load activity error:', error);
        showAlert('Failed to load activity details', 'error');
    }
}

// Load events
async function loadEvents() {
    try {
        const response = await API.events.getActivityEvents(activityId);
        
        if (response.ok) {
            events = response.data.data.events || [];
            displayEvents();
        }
    } catch (error) {
        console.error('Load events error:', error);
    }
}

// Check registration status
async function checkRegistration() {
    try {
        const response = await API.registrations.getMyRegistrations();
        
        if (response.ok) {
            const registrations = response.data.data.registrations || [];
            // Only consider active registrations (not cancelled)
            registration = registrations.find(r => 
                r.activity_id === activityId && r.registration_status === 'registered'
            );
            updateActionButtons();
            updateNotificationToggle();
            
            if (registration) {
                loadAttendanceStats();
            }
        }
    } catch (error) {
        console.error('Check registration error:', error);
    }
}

// Load attendance stats
async function loadAttendanceStats() {
    try {
        const response = await API.attendance.getMyStats();
        
        if (response.ok) {
            const stats = response.data.data.stats || [];
            const activityStats = stats.find(s => s.activity_id === activityId);
            
            if (activityStats) {
                displayAttendanceStats(activityStats);
            }
        }
    } catch (error) {
        console.error('Load attendance stats error:', error);
    }
}

// Display activity details
function displayActivityDetails() {
    // Display poster if available
    const posterContainer = document.getElementById('activityPosterContainer');
    const posterImg = document.getElementById('activityPoster');
    if (activity.poster_url) {
        posterImg.src = activity.poster_url;
        posterContainer.style.display = 'block';
    } else {
        posterContainer.style.display = 'none';
    }

    activityTitle.textContent = activity.title;
    activityDates.textContent = `${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}`;
    activityLocation.textContent = activity.location || 'TBA';
    // Hide participant counts for announcement-only activities
    if (activity.is_announcement_only) {
        if (activityParticipants && activityParticipants.parentElement) {
            activityParticipants.parentElement.style.display = 'none';
        }
    } else {
        if (activityParticipants && activityParticipants.parentElement) {
            activityParticipants.parentElement.style.display = '';
        }
        activityParticipants.textContent = `${activity.current_participants || 0} / ${activity.max_participants} participants`;
    }
    
    // Status badge
    statusBadge.textContent = activity.status;
    statusBadge.className = `status-badge status-${activity.status}`;
    
    activityDescription.textContent = activity.description || 'No description available';
    activityType.textContent = activity.activity_type || '-';
    activityFaculty.textContent = activity.faculty || '-';
    activityCreator.textContent = activity.creator?.username || '-';
    maxParticipants.textContent = activity.max_participants;
    
    loadingState.style.display = 'none';
    contentContainer.style.display = 'block';
}

// Display events
function displayEvents() {
    if (events.length === 0) {
        eventsContainer.innerHTML = '<div class="empty-state">No upcoming events scheduled</div>';
        return;
    }
    
    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.event_date) >= now);
    
    if (upcomingEvents.length === 0) {
        eventsContainer.innerHTML = '<div class="empty-state">No upcoming events</div>';
        return;
    }
    
    eventsContainer.innerHTML = upcomingEvents.map(event => `
        <div class="event-card">
            <div class="event-title">${event.event_title}</div>
            <div class="event-details">
                <div class="event-detail">
                    <span>📅</span>
                    <span>${formatDateTime(event.event_date)}</span>
                </div>
                <div class="event-detail">
                    <span>⏱️</span>
                    <span>${event.duration_minutes} minutes</span>
                </div>
                ${event.location ? `
                    <div class="event-detail">
                        <span>📍</span>
                        <span>${event.location}</span>
                    </div>
                ` : ''}
            </div>
            ${event.event_description ? `<p style="margin-top: 10px; color: #666; font-size: 14px;">${event.event_description}</p>` : ''}
        </div>
    `).join('');
}

// Display attendance stats
function displayAttendanceStats(stats) {
    attendanceCard.style.display = 'block';
    
    document.getElementById('totalEvents').textContent = stats.total_events || 0;
    document.getElementById('attendedEvents').textContent = stats.attended || 0;
    document.getElementById('absentEvents').textContent = stats.absent || 0;
    document.getElementById('attendanceRate').textContent = `${stats.attendance_rate || 0}%`;
}

// Update action buttons
function updateActionButtons() {
    actionButtons.innerHTML = '';
    
    const isOwner = activity.created_by === currentUser.id;
    const isAdmin = currentUser.role === 'admin';
    const isOrganizer = currentUser.role === 'organizer';
    const isFull = activity.current_participants >= activity.max_participants;
    const isClosed = activity.status === 'closed' || activity.status === 'completed';
    const isAnnouncementOnly = activity.is_announcement_only;
    
    // Show announcement badge if applicable
    if (isAnnouncementOnly) {
        const announcementBadge = document.createElement('div');
        announcementBadge.style.cssText = 'background:#667eea;color:white;padding:10px 20px;border-radius:8px;text-align:center;font-weight:500;margin-bottom:15px;';
        announcementBadge.innerHTML = '<i class="fas fa-bullhorn"></i> This is an announcement only - no registration required';
        actionButtons.appendChild(announcementBadge);
    }
    
    // Check registration period
    const now = new Date();
    let registrationStatus = null;
    
    if (!isAnnouncementOnly && activity.registration_start_date) {
        const regStart = new Date(activity.registration_start_date);
        const regEnd = activity.registration_end_date ? new Date(activity.registration_end_date) : null;
        
        if (now < regStart) {
            registrationStatus = 'not_started';
            const timeUntilOpen = Math.ceil((regStart - now) / (1000 * 60 * 60 * 24));
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = 'background:#fff3cd;color:#856404;padding:10px 20px;border-radius:8px;text-align:center;font-weight:500;margin-bottom:15px;';
            statusDiv.innerHTML = `<i class="fas fa-clock"></i> Registration opens in ${timeUntilOpen} day${timeUntilOpen !== 1 ? 's' : ''}`;
            actionButtons.appendChild(statusDiv);
        } else if (regEnd && now > regEnd) {
            registrationStatus = 'closed';
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = 'background:#f8d7da;color:#721c24;padding:10px 20px;border-radius:8px;text-align:center;font-weight:500;margin-bottom:15px;';
            statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> Registration period has ended';
            actionButtons.appendChild(statusDiv);
        }
    }
    
    // QR Scanner button (if registered and not announcement-only)
    if (registration && !isAnnouncementOnly) {
        const qrBtn = document.createElement('a');
        qrBtn.href = 'qr-scanner.html';
        qrBtn.className = 'btn btn-secondary';
        qrBtn.innerHTML = '📱 Scan QR Code';
        actionButtons.appendChild(qrBtn);
    }
    
    // Register/Unregister button (only if not announcement-only)
    if (!isOwner && currentUser.role === 'student' && !isAnnouncementOnly) {
        if (registration) {
            const unregisterBtn = document.createElement('button');
            unregisterBtn.className = 'btn btn-danger';
            unregisterBtn.innerHTML = '❌ Unregister';
            unregisterBtn.onclick = handleUnregister;
            actionButtons.appendChild(unregisterBtn);
        } else if (registrationStatus === 'not_started' || registrationStatus === 'closed') {
            // Registration period hasn't started or has ended
            const disabledBtn = document.createElement('button');
            disabledBtn.className = 'btn btn-primary';
            disabledBtn.disabled = true;
            disabledBtn.textContent = registrationStatus === 'not_started' ? 'Registration Not Open' : 'Registration Closed';
            actionButtons.appendChild(disabledBtn);
        } else if (!isClosed && !isFull) {
            const registerBtn = document.createElement('button');
            registerBtn.className = 'btn btn-primary';
            registerBtn.innerHTML = '✅ Register';
            registerBtn.onclick = handleRegister;
            actionButtons.appendChild(registerBtn);
        } else if (isFull) {
            const fullBtn = document.createElement('button');
            fullBtn.className = 'btn btn-primary';
            fullBtn.disabled = true;
            fullBtn.textContent = 'Activity Full';
            actionButtons.appendChild(fullBtn);
        }
    }
    
    // External link button (if available)
    if (activity.external_link) {
        const externalLinkBtn = document.createElement('a');
        externalLinkBtn.href = activity.external_link;
        externalLinkBtn.target = '_blank';
        externalLinkBtn.rel = 'noopener noreferrer';
        externalLinkBtn.className = 'btn btn-secondary';
        externalLinkBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Learn More';
        externalLinkBtn.style.textDecoration = 'none';
        externalLinkBtn.style.display = 'inline-flex';
        externalLinkBtn.style.alignItems = 'center';
        externalLinkBtn.style.gap = '8px';
        actionButtons.appendChild(externalLinkBtn);
    }
    
    // Edit button (owner or admin)
    if (isOwner || isAdmin) {
        const editBtn = document.createElement('a');
        editBtn.href = `activity-form.html?id=${activityId}`;
        editBtn.className = 'btn btn-secondary';
        editBtn.innerHTML = '✏️ Edit Activity';
        actionButtons.appendChild(editBtn);
    }
    
    // Manage participants (owner or admin)
    if ((isOwner || isAdmin) && (isOrganizer || isAdmin)) {
        const manageBtn = document.createElement('button');
        manageBtn.className = 'btn btn-secondary';
        manageBtn.innerHTML = '👥 Manage Participants';
        manageBtn.onclick = () => openParticipantsModal();
        actionButtons.appendChild(manageBtn);
    }
}

// Handle register
async function handleRegister() {
    try {
        const response = await API.registrations.register(activityId);
        
        if (!response.ok) {
            throw new Error(response.data.message || 'Registration failed');
        }
        
        showAlert('Successfully registered for this activity!', 'success');
        registration = response.data.data.registration;
        updateActionButtons();
        
        // Reload activity to update participant count
        await loadActivityDetails();
        
    } catch (error) {
        console.error('Register error:', error);
        showAlert(error.message || 'Failed to register', 'error');
    }
}

// Handle unregister
async function handleUnregister() {
    if (!confirm('Are you sure you want to unregister from this activity?')) {
        return;
    }
    
    if (!registration || !registration.id) {
        showAlert('Registration not found', 'error');
        return;
    }
    
    try {
        console.log('Canceling registration:', registration.id);
        const response = await API.registrations.cancel(registration.id);
        
        if (!response.ok) {
            throw new Error(response.data.message || 'Unregistration failed');
        }
        
        showAlert('Successfully unregistered from this activity', 'info');
        registration = null;
        attendanceCard.style.display = 'none';
        updateActionButtons();
        
        // Reload activity to update participant count
        await loadActivityDetails();
        
    } catch (error) {
        console.error('Unregister error:', error);
        showAlert(error.message || 'Failed to unregister', 'error');
    }
}

// Update notification toggle based on registration status
function updateNotificationToggle() {
    const container = document.querySelector('.notification-toggle-container');
    
    if (!container) {
        // Create container if doesn't exist
        const actionBtns = document.querySelector('.action-buttons');
        if (actionBtns && registration) {
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'notification-toggle-container';
            toggleContainer.innerHTML = `
                <label class="notification-toggle">
                    <input type="checkbox" id="notificationToggle" ${registration.notifications_enabled !== false ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                    <span class="toggle-label">
                        <i class="fas fa-bell"></i>
                        Notifications for this activity
                    </span>
                </label>
            `;
            actionBtns.parentNode.insertBefore(toggleContainer, actionBtns.nextSibling);
            
            // Add event listener
            document.getElementById('notificationToggle').addEventListener('change', toggleNotifications);
        }
    } else {
        // Update existing toggle
        if (registration) {
            container.style.display = 'block';
            const toggle = document.getElementById('notificationToggle');
            if (toggle) {
                toggle.checked = registration.notifications_enabled !== false;
            }
        } else {
            container.style.display = 'none';
        }
    }
}

// Toggle notifications for this activity
async function toggleNotifications(e) {
    try {
        const enabled = e.target.checked;
        const response = await API.notifications.toggleActivity(activityId, enabled);
        
        if (response.ok) {
            showAlert(`Notifications ${enabled ? 'enabled' : 'disabled'} for this activity`, 'success');
            // Update registration object
            if (registration) {
                registration.notifications_enabled = enabled;
            }
        } else {
            // Revert toggle on error
            e.target.checked = !enabled;
            throw new Error(response.data.message || 'Failed to update notification preference');
        }
    } catch (error) {
        showAlert(error.message || 'Failed to update notifications', 'error');
    }
}

// Initialize
async function init() {
    await loadActivityDetails();
    await checkRegistration();
    
    // Initialize event managers
    EventManager.init(activityId);
    UpcomingEvents.init(activityId);
    
    // Show event management section only if user is creator or admin
    const isCreator = activity && activity.created_by === currentUser.id;
    const isAdmin = currentUser.role === 'admin';
    
    if (isCreator || isAdmin) {
        document.getElementById('event-management-container').style.display = 'block';
    }
    
    // Show upcoming events only for registered students or organizers/admins
    const upcomingEventsSection = document.querySelector('.upcoming-events-section');
    if (upcomingEventsSection) {
        if (currentUser.role === 'student' && !registration) {
            // Hide events for students who haven't registered
            upcomingEventsSection.style.display = 'none';
        } else {
            upcomingEventsSection.style.display = 'block';
        }
    }
}

// Manage Participants Modal Functions
async function openParticipantsModal() {
    const modal = document.getElementById('participantsModal');
    const loadingState = document.getElementById('participantsLoadingState');
    const content = document.getElementById('participantsContent');
    const emptyState = document.getElementById('participantsEmptyState');
    
    modal.style.display = 'flex';
    loadingState.style.display = 'block';
    content.style.display = 'none';
    emptyState.style.display = 'none';
    
    try {
        // Fetch participants
        const response = await API.registrations.getActivityRegistrations(activityId);
        
        if (response.ok && response.data) {
            const participants = response.data.data.registrations || [];
            
            loadingState.style.display = 'none';
            
            if (participants.length === 0) {
                emptyState.style.display = 'block';
            } else {
                content.style.display = 'block';
                document.getElementById('totalParticipantsCount').textContent = participants.length;
                renderParticipants(participants);
            }
        } else {
            throw new Error('Failed to load participants');
        }
    } catch (error) {
        console.error('Load participants error:', error);
        loadingState.innerHTML = `
            <i class="fas fa-exclamation-circle" style="font-size: 32px; color: #ef4444;"></i>
            <p style="margin-top: 16px; color: #ef4444;">Failed to load participants</p>
            <button onclick="openParticipantsModal()" style="margin-top: 12px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Retry</button>
        `;
    }
}

function renderParticipants(participants) {
    const participantsList = document.getElementById('participantsList');
    
    participantsList.innerHTML = participants.map((p, index) => {
        // Get user data from nested object
        const user = p.user || {};
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const username = user.username || 'N/A';
        const email = user.email || 'No email';
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : username;
        
        return `
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px;">
                        ${index + 1}
                    </div>
                    <div>
                        <h4 style="margin: 0; color: #1a202c; font-size: 16px; font-weight: 600;">
                            ${fullName}
                        </h4>
                        <p style="margin: 2px 0 0 0; color: #718096; font-size: 14px;">
                            <i class="fas fa-envelope" style="margin-right: 4px;"></i>${email}
                        </p>
                    </div>
                </div>
                <div style="display: flex; gap: 16px; margin-left: 52px; font-size: 13px;">
                    <span style="color: #718096;">
                        <i class="fas fa-user" style="margin-right: 4px;"></i>Username: <strong>${username}</strong>
                    </span>
                    <span style="color: #718096;">
                        <i class="fas fa-calendar" style="margin-right: 4px;"></i>Registered: <strong>${formatDate(p.registered_at)}</strong>
                    </span>
                    <span style="padding: 2px 8px; background: ${p.registration_status === 'registered' ? '#d4edda' : '#fff3cd'}; color: ${p.registration_status === 'registered' ? '#155724' : '#856404'}; border-radius: 4px; font-size: 12px; font-weight: 600;">
                        ${p.registration_status === 'registered' ? '✓ Registered' : '⏳ Pending'}
                    </span>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="removeParticipant('${p.id}', '${fullName.replace(/'/g, "\\'")}')" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; transition: all 0.3s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                    <i class="fas fa-user-minus"></i> Remove
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function removeParticipant(registrationId, participantName) {
    const confirmed = confirm(`Are you sure you want to remove ${participantName} from this activity?\n\nThis action cannot be undone.`);
    
    if (!confirmed) return;
    
    try {
        const response = await API.registrations.remove(registrationId);
        
        if (response.ok) {
            alert(`${participantName} has been removed successfully`);
            // Reload participants list
            openParticipantsModal();
            // Reload activity data to update participant count
            loadActivityDetails();
        } else {
            throw new Error(response.data?.message || 'Failed to remove participant');
        }
    } catch (error) {
        console.error('Remove participant error:', error);
        alert('Failed to remove participant: ' + error.message);
    }
}

function closeParticipantsModal() {
    document.getElementById('participantsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('participantsModal');
    if (event.target === modal) {
        closeParticipantsModal();
    }
};

init();
