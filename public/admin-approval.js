// Check authentication and admin role
if (!requireAuth()) {
    window.location.href = 'index.html';
}

const currentUser = getCurrentUser();

if (currentUser.role !== 'admin') {
    alert('Access denied. Admin only.');
    window.location.href = 'dashboard.html';
}

// DOM Elements
const loadingState = document.getElementById('loadingState');
const contentContainer = document.getElementById('contentContainer');
const emptyState = document.getElementById('emptyState');
const alertContainer = document.getElementById('alertContainer');
const statsGrid = document.getElementById('statsGrid');
const pendingActivitiesList = document.getElementById('pendingActivitiesList');
const allActivitiesList = document.getElementById('allActivitiesList');
const usersList = document.getElementById('usersList');
const pendingTab = document.getElementById('pendingTab');
const allTab = document.getElementById('allTab');
const usersTab = document.getElementById('usersTab');

// State
let currentTabName = 'pending';
let statistics = {};
let pendingActivities = [];
let allActivities = [];
let allUsers = [];

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

// Switch tab
window.switchTab = function(tabName) {
    currentTabName = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide content
    pendingTab.style.display = tabName === 'pending' ? 'block' : 'none';
    allTab.style.display = tabName === 'all' ? 'block' : 'none';
    usersTab.style.display = tabName === 'users' ? 'block' : 'none';
    
    // Load data if needed
    if (tabName === 'all' && allActivities.length === 0) {
        loadAllActivities();
    } else if (tabName === 'users' && allUsers.length === 0) {
        loadAllUsers();
    }
};

// Load statistics
async function loadStatistics() {
    try {
        const response = await API.admin.getStatistics();
        
        if (response.ok) {
            statistics = response.data.data.statistics;
            displayStatistics();
        }
    } catch (error) {
        console.error('Load statistics error:', error);
    }
}

// Display statistics
function displayStatistics() {
    const stats = [
        { label: 'Total Users', value: statistics.users?.total || 0, icon: '👥' },
        { label: 'Pending Activities', value: statistics.activities?.pending || 0, icon: '⏳' },
        { label: 'Approved Activities', value: statistics.activities?.approved || 0, icon: '✅' },
        { label: 'Total Events', value: statistics.events || 0, icon: '📅' }
    ];
    
    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.icon} ${stat.label}</div>
        </div>
    `).join('');
}

// Load pending activities
async function loadPendingActivities() {
    try {
        const response = await API.admin.getPendingActivities();
        
        if (response.ok) {
            pendingActivities = response.data.data.activities || [];
            displayPendingActivities();
        }
    } catch (error) {
        console.error('Load pending activities error:', error);
        showAlert('Failed to load pending activities', 'error');
    }
}

// Display pending activities
function displayPendingActivities() {
    if (pendingActivities.length === 0) {
        pendingActivitiesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <h3>No Pending Activities</h3>
                <p>All activities have been reviewed</p>
            </div>
        `;
        return;
    }
    
    pendingActivitiesList.innerHTML = pendingActivities.map(activity => 
        createActivityItem(activity, true)
    ).join('');
}

// Load all activities
async function loadAllActivities() {
    try {
        const response = await API.activities.getAll();
        
        if (response.ok) {
            allActivities = response.data.data.activities || [];
            displayAllActivities();
        }
    } catch (error) {
        console.error('Load all activities error:', error);
    }
}

// Display all activities
function displayAllActivities() {
    if (allActivities.length === 0) {
        allActivitiesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No Activities</h3>
                <p>No activities have been created yet</p>
            </div>
        `;
        return;
    }
    
    allActivitiesList.innerHTML = allActivities.map(activity => 
        createActivityItem(activity, false)
    ).join('');
}

// Create activity item HTML
function createActivityItem(activity, showActions) {
    const creator = activity.users || {};
    const creatorInitial = creator.first_name?.charAt(0) || creator.username?.charAt(0) || 'U';
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    return `
        <div class="activity-item">
            <div class="organizer-info">
                <div class="organizer-avatar">${creatorInitial}</div>
                <div>
                    <div style="font-weight: 600; color: #333;">
                        ${creator.first_name || ''} ${creator.last_name || ''} (@${creator.username || 'unknown'})
                    </div>
                    <div style="color: #666; font-size: 12px;">
                        ${creator.email || ''} ${creator.student_id ? '• ' + creator.student_id : ''}
                    </div>
                </div>
            </div>
            
            <div class="activity-header">
                <h3 class="activity-title">${activity.title}</h3>
            </div>
            
            <div class="activity-meta">
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
                <div class="meta-item">
                    <span>🏷️</span>
                    <span>${activity.activity_type || 'N/A'}</span>
                </div>
                ${activity.faculty ? `
                    <div class="meta-item">
                        <span>🎓</span>
                        <span>${activity.faculty}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="activity-description">
                ${activity.description || 'No description provided'}
            </div>
            
            <div class="activity-actions">
                <button class="btn btn-view" onclick="window.open('activity-details.html?id=${activity.id}', '_blank')">
                    👁️ View Details
                </button>
                ${showActions ? `
                    <button class="btn btn-approve" onclick="approveActivity('${activity.id}')">
                        ✅ Approve
                    </button>
                    <button class="btn btn-reject" onclick="rejectActivity('${activity.id}')">
                        ❌ Reject
                    </button>
                ` : `
                    <span style="padding: 10px; font-size: 12px; color: #666;">
                        Status: <strong>${activity.approval_status || 'pending'}</strong>
                    </span>
                `}
            </div>
        </div>
    `;
}

// Approve activity
window.approveActivity = async function(activityId) {
    if (!confirm('Approve this activity?')) {
        return;
    }
    
    try {
        const response = await API.admin.approveActivity(activityId);
        console.log('Approve response:', response);
        
        // Handle different response formats
        const isSuccess = response && (response.ok || response.success || 
                         (response.data && (response.data.ok || response.data.success)));
        
        if (!isSuccess && response && response.data && response.data.message) {
            throw new Error(response.data.message);
        }
        
        showAlert('Activity approved successfully!', 'success');
        
        // Remove from pending list and refresh
        pendingActivities = pendingActivities.filter(a => a.id !== activityId);
        displayPendingActivities();
        
        // Reload all activities if that tab is open
        if (currentTabName === 'all') {
            await loadAllActivities();
        }
        
        // Reload statistics
        await loadStatistics();
        
    } catch (error) {
        console.error('Approve error:', error);
        showAlert(error.message || 'Failed to approve activity', 'error');
    }
};

// Reject activity
window.rejectActivity = async function(activityId) {
    const reason = prompt('Rejection reason (optional):');
    
    if (reason === null) {
        return; // User cancelled
    }
    
    try {
        const response = await API.admin.rejectActivity(activityId, reason);
        console.log('Reject response:', response);
        
        // Handle different response formats
        const isSuccess = response && (response.ok || response.success || 
                         (response.data && (response.data.ok || response.data.success)));
        
        if (!isSuccess && response && response.data && response.data.message) {
            throw new Error(response.data.message);
        }
        
        showAlert('Activity rejected successfully!', 'success');
        
        // Remove from pending list and refresh
        pendingActivities = pendingActivities.filter(a => a.id !== activityId);
        displayPendingActivities();
        
        // Reload all activities if that tab is open
        if (currentTabName === 'all') {
            await loadAllActivities();
        }
        
        // Reload statistics
        await loadStatistics();
        
    } catch (error) {
        console.error('Reject error:', error);
        showAlert(error.message || 'Failed to reject activity', 'error');
    }
};

// Load all users
async function loadAllUsers() {
    try {
        const response = await API.admin.getAllUsers();
        
        if (response.ok) {
            allUsers = response.data.data.users || [];
            displayUsers();
        }
    } catch (error) {
        console.error('Load users error:', error);
    }
}

// Display users
function displayUsers() {
    if (allUsers.length === 0) {
        usersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>No Users</h3>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = allUsers.map(user => {
        const initial = user.first_name?.charAt(0) || user.username?.charAt(0) || 'U';
        const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="activity-item">
                <div class="organizer-info" style="margin-bottom: 0;">
                    <div class="organizer-avatar">${initial}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #333;">
                            ${user.first_name || ''} ${user.last_name || ''} (@${user.username})
                        </div>
                        <div style="color: #666; font-size: 12px;">
                            ${user.email} ${user.student_id ? '• ' + user.student_id : ''} • Role: <strong>${user.role}</strong>
                        </div>
                        <div style="color: #999; font-size: 12px;">
                            Joined: ${createdDate}
                        </div>
                    </div>
                    <div>
                        <select onchange="changeUserRole('${user.id}', this.value)" style="padding: 8px; border-radius: 6px; border: 2px solid #e0e0e0;">
                            <option value="">Change role...</option>
                            <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                            <option value="organizer" ${user.role === 'organizer' ? 'selected' : ''}>Organizer</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Change user role
window.changeUserRole = async function(userId, newRole) {
    if (!newRole || !confirm(`Change user role to ${newRole}?`)) {
        loadAllUsers(); // Reset select
        return;
    }
    
    try {
        const response = await API.admin.updateUserRole(userId, newRole);
        
        if (!response.ok) {
            throw new Error(response.data.message || 'Failed to update role');
        }
        
        showAlert('User role updated successfully!', 'success');
        await loadAllUsers();
        
    } catch (error) {
        console.error('Change role error:', error);
        showAlert(error.message || 'Failed to update role', 'error');
        await loadAllUsers();
    }
};

// Initialize
async function init() {
    loadingState.style.display = 'block';
    
    try {
        await loadStatistics();
        await loadPendingActivities();
        
        loadingState.style.display = 'none';
        contentContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Init error:', error);
        loadingState.style.display = 'none';
    }
}

init();
