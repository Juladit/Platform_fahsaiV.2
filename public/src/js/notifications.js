// Shared Notification System for All Pages
let notifications = [];

// Load notifications
async function loadNotifications() {
    try {
        const res = await API.notifications.getAll();
        if (res && res.ok && res.data && res.data.data) {
            notifications = res.data.data.notifications || [];
            const unreadCount = res.data.data.unreadCount || 0;
            
            updateNotificationBadge(unreadCount);
            renderNotifications();
        }
    } catch (error) {
        console.error('Load notifications error:', error);
    }
}

// Update notification badge
function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Render notifications
function renderNotifications() {
    const list = document.getElementById('notificationList');
    if (!list) return;
    
    if (notifications.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#9ca3af;"><i class="fas fa-bell-slash" style="font-size:24px;"></i><p style="margin-top:10px;">No notifications</p></div>';
        return;
    }
    
    list.innerHTML = '';
    notifications.forEach(function(notif) {
        const item = createNotificationItem(notif);
        list.appendChild(item);
    });
}

// Create notification item
function createNotificationItem(notif) {
    const div = document.createElement('div');
    div.className = 'notification-item' + (notif.is_read ? '' : ' unread');
    div.setAttribute('data-id', notif.id);
    
    const timeAgo = getTimeAgo(new Date(notif.created_at));
    
    div.innerHTML = `
        <div class="notification-title">${escapeHtml(notif.title)}</div>
        <div class="notification-message">${escapeHtml(notif.message || '')}</div>
        <div class="notification-time">${timeAgo}</div>
        <div class="notification-actions">
            <button class="notification-delete-btn" data-id="${notif.id}">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    // Click to mark as read and navigate if has activity
    div.addEventListener('click', async function(e) {
        if (e.target.closest('.notification-delete-btn')) return;
        
        if (!notif.is_read) {
            await API.notifications.markAsRead(notif.id);
            await loadNotifications();
        }
        
        if (notif.related_activity_id) {
            window.location.href = `activity-details.html?id=${notif.related_activity_id}`;
        }
    });
    
    // Delete button
    const deleteBtn = div.querySelector('.notification-delete-btn');
    deleteBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        if (confirm('Delete this notification?')) {
            await API.notifications.delete(notif.id);
            await loadNotifications();
        }
    });
    
    return div;
}

// Get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    return date.toLocaleDateString();
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle notification dropdown
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Setup notification listeners
function setupNotificationListeners() {
    const notificationBtn = document.getElementById('notificationBtn');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            toggleNotificationDropdown();
        });
    }
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', async function() {
            await API.notifications.markAllAsRead();
            await loadNotifications();
        });
    }
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('notificationDropdown');
        const btn = document.getElementById('notificationBtn');
        if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// Initialize notifications
async function initNotifications() {
    await loadNotifications();
    setupNotificationListeners();
    
    // Poll for new notifications every 30 seconds
    setInterval(loadNotifications, 30000);
}

// Auto-initialize if API is available
if (typeof API !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotifications);
    } else {
        initNotifications();
    }
}
