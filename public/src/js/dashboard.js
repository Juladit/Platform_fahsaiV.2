let currentUser = null;
let allActivities = [];

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    await loadUser();
    setupNav();
    await loadActivities();
    setupListeners();
});

async function loadUser() {
    try {
        const res = await API.auth.getMe();
        if (res && res.ok && res.data && res.data.data && res.data.data.user) {
            currentUser = res.data.data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateProfile();
        }
    } catch (e) {
        console.error('Load user error:', e);
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
            updateProfile();
        }
    }
}

function updateProfile() {
    const name = currentUser.first_name && currentUser.last_name
        ? currentUser.first_name + ' ' + currentUser.last_name
        : currentUser.username;
    
    document.getElementById('headerProfileName').textContent = name;
    
    const img = document.getElementById('headerProfileImg');
    if (currentUser.avatar_url) {
        img.src = currentUser.avatar_url;
    } else {
        const initials = name.split(' ').map(function(n) { return n[0]; }).join('');
        img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(initials) + '&background=667eea&color=fff&size=40';
    }
    
    updateModal();
}

function updateModal() {
    const name = currentUser.first_name && currentUser.last_name
        ? currentUser.first_name + ' ' + currentUser.last_name
        : currentUser.username;
    
    document.getElementById('modalProfileName').textContent = name;
    document.getElementById('modalProfileEmail').textContent = currentUser.email || '';
    document.getElementById('modalProfileRole').textContent = (currentUser.role || 'student').toUpperCase();
    document.getElementById('modalStudentId').textContent = currentUser.student_id || '-';
    
    const img = document.getElementById('modalProfileImg');
    if (currentUser.avatar_url) {
        img.src = currentUser.avatar_url;
    } else {
        const initials = name.split(' ').map(function(n) { return n[0]; }).join('');
        img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(initials) + '&background=667eea&color=fff&size=128';
    }
}

function setupNav() {
    const role = currentUser && currentUser.role ? currentUser.role : 'student';
    
    // Set user role on body element for CSS-based nav visibility
    document.body.setAttribute('data-user-role', role);
}

async function loadActivities() {
    try {
        const grid = document.getElementById('activityGrid');
        grid.innerHTML = '<div style=\"text-align:center;padding:60px 20px;color:#667eea;\"><i class=\"fas fa-spinner fa-spin\" style=\"font-size:32px;\"></i><p>Loading...</p></div>';
        
        const res = await API.activities.getAll();
        console.log('Dashboard response:', res);
        
        // Backend returns { success: true, data: { activities, total, limit, offset } }
        // API client wraps it as { ok: true, data: { success, data: { activities } } }
        if (res && res.ok && res.data && res.data.data) {
            allActivities = res.data.data.activities || [];
            console.log('All activities before filtering:', allActivities);
            console.log('Current user role:', currentUser ? currentUser.role : 'no user');
            console.log('Current user ID:', currentUser ? currentUser.id : 'no user');
            
            // Log approval statuses
            allActivities.forEach(function(a) {
                console.log('Activity:', a.title, '- Status:', a.approval_status, '- Created by:', a.created_by);
            });
            
            // Filter based on role and approval status
            if (currentUser.role === 'student') {
                // Students only see approved activities
                allActivities = allActivities.filter(function(a) { 
                    console.log('Student filter - Activity:', a.title, 'approval_status:', a.approval_status, 'matches:', a.approval_status === 'approved');
                    return a.approval_status === 'approved'; 
                });
            } else if (currentUser.role === 'organizer') {
                // Organizers see approved activities OR their own activities (any status)
                allActivities = allActivities.filter(function(a) { 
                    const isApproved = a.approval_status === 'approved';
                    const isOwn = a.created_by === currentUser.id;
                    console.log('Organizer filter - Activity:', a.title, 'approved:', isApproved, 'own:', isOwn, 'passes:', isApproved || isOwn);
                    return isApproved || isOwn;
                });
            }
            // Admin sees all activities (no filter)
            
            console.log('Filtered activities:', allActivities);
            renderActivities();
        } else {
            console.log('Response not OK or missing data:', res);
            grid.innerHTML = '<div style=\"text-align:center;padding:60px;color:#999;\"><h3>No activities available</h3></div>';
        }
    } catch (e) {
        console.error('Load activities error:', e);
        document.getElementById('activityGrid').innerHTML = '<div style=\"text-align:center;padding:60px;color:#999;\"><h3>Connection error</h3><p>Server may be offline</p></div>';
    }
}

function renderActivities() {
    const grid = document.getElementById('activityGrid');
    
    if (allActivities.length === 0) {
        grid.innerHTML = '<div style=\"text-align:center;padding:60px;color:#999;\"><h3>No activities found</h3></div>';
        return;
    }
    
    grid.innerHTML = '';
    allActivities.forEach(function(activity) {
        const card = createCard(activity);
        grid.appendChild(card);
    });
}

function createCard(a) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    const date = new Date(a.start_date || a.event_date);
    const endDate = new Date(a.end_date);
    const fdate = date.toLocaleDateString('en-GB');
    const ftime = date.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});
    
    const now = new Date();
    const spots = a.max_participants - (a.current_participants || 0);
    let status = '';
    
    // Show announcement badge for announcement-only activities
    if (a.is_announcement_only) {
        status = '<div class=\"status-tag\" style=\"background:#667eea;color:white;\"><i class=\"fas fa-bullhorn\"></i> Announcement</div>';
    }
    // Show approval status for pending activities
    else if (a.approval_status === 'pending') {
        status = '<div class=\"status-tag\" style=\"background:#fff3cd;color:#856404;\">Pending Approval</div>';
    } else if (a.approval_status === 'rejected') {
        status = '<div class=\"status-tag\" style=\"background:#f8d7da;color:#721c24;\">Rejected</div>';
    } else if (endDate < now) {
        status = '<div class=\"status-tag closed\">Ended</div>';
    } else if (spots <= 0) {
        status = '<div class=\"status-tag full\">Full</div>';
    } else if (spots <= 5) {
        status = '<div class=\"status-tag limited\">Limited Spots</div>';
    } else {
        status = '<div class=\"status-tag open\">Open</div>';
    }
    
    // Use poster if available, otherwise fallback to default image
    const img = a.poster_url || a.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop';
    
    let cardContent = '<div class=\"card-image\"><img src=\"' + img + '\" alt=\"' + a.title + '\">' + status + '</div>';
    cardContent += '<div class=\"card-content\">';
    cardContent += '<h3 class=\"card-title\">' + a.title + '</h3>';
    cardContent += '<div class=\"card-details\">';
    cardContent += '<div class=\"detail-item\"><i class=\"fas fa-calendar\"></i><span>' + fdate + '</span></div>';
    cardContent += '<div class=\"detail-item\"><i class=\"fas fa-clock\"></i><span>' + ftime + '</span></div>';
    cardContent += '<div class=\"detail-item\"><i class=\"fas fa-map-marker-alt\"></i><span>' + (a.location || 'TBA') + '</span></div>';
    cardContent += '<div class=\"detail-item\"><i class=\"fas fa-users\"></i><span>' + (a.current_participants || 0) + '/' + a.max_participants + '</span></div>';
    cardContent += '</div>';
    
    // Add external link button if available
    if (a.external_link) {
        cardContent += '<div style=\"margin-top:15px;\">';
        cardContent += '<a href=\"' + a.external_link + '\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"btn\" style=\"display:inline-flex;align-items:center;gap:8px;width:100%;justify-content:center;background:#667eea;color:white;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;text-decoration:none;\" onclick=\"event.stopPropagation();\"><i class=\"fas fa-external-link-alt\"></i> Learn More</a>';
        cardContent += '</div>';
    }
    
    // Add delete button for admin
    if (currentUser && currentUser.role === 'admin') {
        cardContent += '<div style=\"margin-top:15px;padding-top:15px;border-top:1px solid #f1f5f9;\">';
        cardContent += '<button onclick=\"event.stopPropagation(); deleteActivity(\'' + a.id + '\', \'' + a.title + '\');\" class=\"btn\" style=\"width:100%;background:#ef4444;color:white;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;\"><i class=\"fas fa-trash\"></i> Delete Activity</button>';
        cardContent += '</div>';
    }
    
    cardContent += '</div>';
    
    card.innerHTML = cardContent;
    
    // Make card clickable (except the delete button which has stopPropagation)
    card.onclick = function(e) { 
        if (!e.target.closest('button')) {
            window.location.href = 'activity-details.html?id=' + a.id; 
        }
    };
    
    return card;
}

// Delete activity (admin only)
window.deleteActivity = async function(activityId, activityTitle) {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Only administrators can delete activities');
        return;
    }
    
    if (!confirm('Are you sure you want to delete "' + activityTitle + '"?\n\nThis action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await API.activities.delete(activityId);
        
        if (response && response.ok) {
            alert('Activity deleted successfully');
            // Reload activities
            await loadActivities();
        } else {
            throw new Error(response.data?.message || 'Failed to delete activity');
        }
    } catch (error) {
        console.error('Delete activity error:', error);
        alert('Error deleting activity: ' + error.message);
    }
};

function setupListeners() {
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('mobileOverlay').classList.toggle('show');
    });
    
    document.getElementById('mobileOverlay').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('mobileOverlay').classList.remove('show');
    });
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        applyFilters();
    });
    
    // Filter listeners
    document.getElementById('filterType').addEventListener('change', function() {
        applyFilters();
    });
    
    document.getElementById('filterStatus').addEventListener('change', function() {
        applyFilters();
    });
    
    document.getElementById('clearFilters').addEventListener('click', function() {
        document.getElementById('filterType').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('searchInput').value = '';
        applyFilters();
    });
    
    // Notification listeners are now handled by notifications.js
    
    // Profile button - navigate to profile page
    document.getElementById('userProfileBtn').addEventListener('click', function() {
        window.location.href = 'profile.html';
    });
    
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    let filtered = allActivities;
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(function(a) {
            return a.title.toLowerCase().includes(searchTerm) || 
                   (a.description && a.description.toLowerCase().includes(searchTerm));
        });
    }
    
    // Type filter
    if (typeFilter) {
        filtered = filtered.filter(function(a) {
            return a.activity_type === typeFilter;
        });
    }
    
    // Status filter
    if (statusFilter) {
        filtered = filtered.filter(function(a) {
            const now = new Date();
            const startDate = new Date(a.start_date);
            const endDate = new Date(a.end_date);
            
            if (statusFilter === 'upcoming') {
                return startDate > now;
            } else if (statusFilter === 'ongoing') {
                return startDate <= now && endDate >= now;
            } else if (statusFilter === 'past') {
                return endDate < now;
            }
            return true;
        });
    }
    
    // Render filtered activities
    const grid = document.getElementById('activityGrid');
    grid.innerHTML = '';
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#9ca3af;grid-column: 1 / -1;"><i class="fas fa-search" style="font-size:32px;"></i><p>No activities found matching your filters</p></div>';
    } else {
        filtered.forEach(function(a) { grid.appendChild(createCard(a)); });
    }
}

function closeModal() {
    document.getElementById('profileModal').style.display = 'none';
}
