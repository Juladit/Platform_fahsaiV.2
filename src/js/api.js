// API Configuration and Helper Functions
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        // Handle unauthorized (token expired or invalid)
        if (response.status === 401) {
            logout();
            return null;
        }
        
        return {
            ok: response.ok,
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// API Methods
const API = {
    // Authentication
    auth: {
        login: (username, password) => 
            apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            }),
        
        register: (userData) => 
            apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            }),
        
        getMe: () => apiRequest('/auth/me'),
        
        logout: logout
    },
    
    // Activities
    activities: {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/activities${queryString ? '?' + queryString : ''}`);
        },
        
        getById: (id) => apiRequest(`/activities/${id}`),
        
        create: (activityData) => 
            apiRequest('/activities', {
                method: 'POST',
                body: JSON.stringify(activityData)
            }),
        
        update: (id, activityData) => 
            apiRequest(`/activities/${id}`, {
                method: 'PUT',
                body: JSON.stringify(activityData)
            }),
        
        delete: (id) => 
            apiRequest(`/activities/${id}`, {
                method: 'DELETE'
            })
    },
    
    // Registrations
    registrations: {
        register: (activityId) => 
            apiRequest('/registrations/register', {
                method: 'POST',
                body: JSON.stringify({ activity_id: activityId })
            }),
        
        cancel: (activityId) => 
            apiRequest('/registrations/cancel', {
                method: 'POST',
                body: JSON.stringify({ activity_id: activityId })
            }),
        
        getMyRegistrations: () => apiRequest('/registrations/my-registrations'),
        
        getActivityRegistrations: (activityId) => 
            apiRequest(`/registrations/activity/${activityId}`)
    },
    
    // Profile
    profile: {
        get: () => apiRequest('/profile'),
        
        update: (profileData) => 
            apiRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            }),
        
        updateAvatar: (base64Image) => 
            apiRequest('/profile/avatar', {
                method: 'POST',
                body: JSON.stringify({ avatar: base64Image })
            }),
        
        changePassword: (currentPassword, newPassword) => 
            apiRequest('/profile/password', {
                method: 'PUT',
                body: JSON.stringify({ 
                    current_password: currentPassword, 
                    new_password: newPassword 
                })
            }),
        
        getStats: () => apiRequest('/profile/stats')
    }
};

// Check authentication on protected pages
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, getCurrentUser, isAuthenticated, requireAuth, logout };
}
