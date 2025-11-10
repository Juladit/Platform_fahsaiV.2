// Check authentication
if (!requireAuth()) {
    window.location.href = 'index.html';
}

const currentUser = getCurrentUser();

// DOM Elements
const loadingState = document.getElementById('loadingState');
const activitiesContainer = document.getElementById('activitiesContainer');
const emptyState = document.getElementById('emptyState');
const activitiesGrid = document.getElementById('activitiesGrid');
const tabsContainer = document.getElementById('tabsContainer');
const pageSubtitle = document.getElementById('pageSubtitle');
const emptyStateMessage = document.getElementById('emptyStateMessage');

// State - Set default tab based on user role
let currentTab = (currentUser.role === 'organizer' || currentUser.role === 'admin') ? 'created' : 'registered';
let allActivities = [];
let attendanceStats = {};

// Initialize tabs based on user role
function initializeTabs() {
    const isStudent = currentUser.role === 'student';
    const isOrganizer = currentUser.role === 'organizer';
    const isAdmin = currentUser.role === 'admin';
    
    const tabs = [];
    
    if (isStudent || isOrganizer) {
        tabs.push({ id: 'registered', label: '📝 Registered', subtitle: 'Activities you\'re participating in' });
    }
    
    if (isOrganizer || isAdmin) {
        tabs.push({ id: 'created', label: '🎯 Created', subtitle: 'Activities you\'ve created' });
    }
    
    // Render tabs
    tabsContainer.innerHTML = tabs.map(tab => `
        <button class="tab ${tab.id === currentTab ? 'active' : ''}" onclick="switchTab('${tab.id}')">
            ${tab.label}
        </button>
    `).join('');
    
    // Update subtitle
    const activeTab = tabs.find(t => t.id === currentTab);
    if (activeTab) {
        pageSubtitle.textContent = activeTab.subtitle;
    }
}

// Switch tab
window.switchTab = function(tabId) {
    currentTab = tabId;
    initializeTabs();
    displayActivities();
};

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Load registered activities
async function loadRegisteredActivities() {
    try {
        const response = await API.registrations.getMyRegistrations();
        
        if (response.ok) {
            return response.data.data.registrations || [];
        }
        return [];
    } catch (error) {
        console.error('Load registered activities error:', error);
        return [];
    }
}

// Load created activities
async function loadCreatedActivities() {
    try {
        const response = await API.activities.getAll();
        
        if (response.ok) {
            const activities = response.data.data.activities || [];
            // Filter to only show user's own activities
            const myActivities = activities.filter(a => a.created_by === currentUser.id);
            return myActivities;
        }
        return [];
    } catch (error) {
        console.error('Load created activities error:', error);
        return [];
    }
}

// Load attendance stats
async function loadAttendanceStats() {
    try {
        const response = await API.attendance.getMyStats();
        
        if (response.ok) {
            const stats = response.data.data.stats || [];
            // Convert array to object keyed by activity_id
            attendanceStats = stats.reduce((acc, stat) => {
                acc[stat.activity_id] = stat;
                return acc;
            }, {});
        }
    } catch (error) {
        console.error('Load attendance stats error:', error);
    }
}

// Load all data
async function loadAllData() {
    loadingState.style.display = 'block';
    activitiesContainer.style.display = 'none';
    emptyState.style.display = 'none';
    
    try {
        // Load data based on current tab
        if (currentTab === 'registered') {
            const registrations = await loadRegisteredActivities();
            allActivities = registrations.map(r => r.activity);
            await loadAttendanceStats();
        } else if (currentTab === 'created') {
            allActivities = await loadCreatedActivities();
        }
        
        displayActivities();
        
    } catch (error) {
        console.error('Load data error:', error);
    } finally {
        loadingState.style.display = 'none';
    }
}

// Display activities
function displayActivities() {
    if (allActivities.length === 0) {
        activitiesContainer.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (currentTab === 'registered') {
            emptyStateMessage.textContent = "You haven't registered for any activities yet.";
        } else {
            emptyStateMessage.textContent = "You haven't created any activities yet.";
        }
        return;
    }
    
    activitiesContainer.style.display = 'block';
    emptyState.style.display = 'none';
    
    activitiesGrid.innerHTML = allActivities.map(activity => 
        createActivityCard(activity)
    ).join('');
}

// Create activity card
function createActivityCard(activity) {
    const stats = attendanceStats[activity.id];
    const showAttendance = currentTab === 'registered' && stats;
    
    // Use poster if available, otherwise fallback to default image
    const posterUrl = activity.poster_url || activity.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop';
    
    return `
        <div class="activity-card" onclick="window.location.href='activity-details.html?id=${activity.id}'">
            <div class="card-image">
                <img src="${posterUrl}" alt="${activity.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px 8px 0 0;">
                <span class="status-badge status-${activity.status}" style="position: absolute; top: 10px; right: 10px;">${activity.status}</span>
            </div>
            
            <div style="padding: 20px;">
                <div class="activity-card-header">
                    <h3 class="activity-card-title">${activity.title}</h3>
                </div>
                
                ${activity.description ? `
                    <div class="activity-card-description">${activity.description}</div>
                ` : ''}
                
                <div class="activity-card-meta">
                    <div class="meta-item">
                        <span>📅</span>
                        <span>${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}</span>
                    </div>
                    <div class="meta-item">
                        <span>📍</span>
                        <span>${activity.location || 'TBA'}</span>
                    </div>
                    ${!activity.is_announcement_only ? `
                    <div class="meta-item">
                        <span>👥</span>
                        <span>${activity.current_participants || 0} / ${activity.max_participants}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${showAttendance ? `
                    <div class="attendance-bar">
                        <div class="attendance-bar-label">
                            <span>Attendance: ${stats.attended || 0} / ${stats.total_events || 0} events</span>
                            <span><strong>${stats.attendance_rate || 0}%</strong></span>
                        </div>
                        <div class="attendance-bar-fill">
                            <div class="attendance-bar-progress" style="width: ${stats.attendance_rate || 0}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                ${currentTab === 'created' ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                        <div style="display: flex; gap: 10px; font-size: 13px;">
                            ${activity.approval_status === 'pending' ? `
                                <span class="status-badge status-pending">Pending Approval</span>
                            ` : activity.approval_status === 'approved' ? `
                                <span class="status-badge status-approved">Approved</span>
                            ` : activity.approval_status === 'rejected' ? `
                                <span class="status-badge status-rejected">Rejected</span>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <div class="card-actions" onclick="event.stopPropagation()">
                    <a href="activity-details.html?id=${activity.id}" class="btn-small btn-primary">
                        View Details
                    </a>
                    ${currentTab === 'created' ? `
                        <a href="activity-form.html?id=${activity.id}" class="btn-small btn-secondary">
                            Edit Activity
                        </a>
                        <button onclick="deleteActivity('${activity.id}', '${activity.title.replace(/'/g, "\\'")}', event)" class="btn-small btn-danger" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                ` : currentTab === 'registered' ? `
                    <a href="qr-scanner.html" class="btn-small btn-secondary">
                        📱 Scan QR
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Delete activity (organizer only)
window.deleteActivity = async function(activityId, activityTitle, event) {
    if (event) {
        event.stopPropagation();
    }
    
    // Only organizers can delete their own activities
    if (currentUser.role !== 'organizer' && currentUser.role !== 'admin') {
        alert('Only organizers can delete their own activities');
        return;
    }
    
    const confirmed = confirm(`Are you sure you want to delete "${activityTitle}"?\n\nThis will:\n- Delete the activity\n- Cancel all registrations\n- Delete all events\n- Remove all related data\n\nThis action cannot be undone!`);
    
    if (!confirmed) {
        return;
    }
    
    try {
        const response = await API.activities.delete(activityId);
        
        if (response.ok) {
            alert('Activity deleted successfully');
            // Reload activities
            await loadAllData();
        } else {
            throw new Error(response.data?.message || 'Failed to delete activity');
        }
    } catch (error) {
        console.error('Delete activity error:', error);
        alert('Failed to delete activity: ' + error.message);
    }
};

// Initialize
async function init() {
    initializeTabs();
    await loadAllData();
}

init();
