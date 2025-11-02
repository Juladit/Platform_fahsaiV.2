// Dashboard functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Load user profile and activities
    await loadUserProfile();
    await loadActivities();

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const searchInput = document.querySelector('.search-input');
    const paginationBtns = document.querySelectorAll('.pagination-btn, .page-number');
    const paginationContainer = document.querySelector('.pagination');
    const pageNumbersContainer = document.querySelector('.pagination-numbers');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        mobileOverlay.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('show');
        document.body.classList.remove('menu-open');
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('show');
            document.body.classList.remove('menu-open');
        }
    });

    // Search functionality - will be re-attached after activities load
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const activityCards = document.querySelectorAll('.activity-card');
        
        activityCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const details = card.querySelector('.card-details')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || details.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Clear search
    searchInput.addEventListener('focus', function() {
        if (this.value) {
            this.select();
        }
    });

    // Note: Activity card interactions are now handled in attachActivityCardListeners()
    // after activities are loaded from the API

    // Navigation menu interactions
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // If link has a real destination, navigate there
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                // Allow default navigation
                return;
            }
            
            e.preventDefault();
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            // Add active class to clicked item
            this.closest('.nav-item').classList.add('active');
            // Show message for demo
            const pageName = this.querySelector('span').textContent;
            showMessage(`Navigating to: ${pageName}`, 'info');
        });
    });

    // Pagination functionality
    // Determine total pages based on number of cards (12 per page demo)
    const cardsPerPage = 12;
    const totalCards = document.querySelectorAll('.activity-card').length;
    const totalPages = Math.max(1, Math.ceil(totalCards / cardsPerPage));

    // If we only have 1 page, show only page 1 and hide prev/next
    if (totalPages === 1 && paginationContainer && pageNumbersContainer) {
        pageNumbersContainer.innerHTML = '<a href="#" class="page-number active">1</a>';
        const prev = document.querySelector('.pagination-btn.prev');
        const next = document.querySelector('.pagination-btn.next');
        if (prev) prev.style.display = 'none';
        if (next) next.style.display = 'none';
    }

    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('page-number')) {
                // Remove active class from all page numbers
                document.querySelectorAll('.page-number').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Add active class to clicked page
                this.classList.add('active');
                
                const pageNum = this.textContent;
                showMessage(`Loading page ${pageNum}...`, 'info');
                
                // Simulate page loading
                simulatePageLoad();
            } else if (this.classList.contains('prev')) {
                showMessage('Loading previous page...', 'info');
                simulatePageLoad();
            } else if (this.classList.contains('next')) {
                showMessage('Loading next page...', 'info');
                simulatePageLoad();
            }
        });
    });

    // User profile click - navigate to profile page
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        // Remove all existing listeners by cloning the element
        const newUserProfile = userProfile.cloneNode(true);
        userProfile.parentNode.replaceChild(newUserProfile, userProfile);
        
        newUserProfile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Profile clicked, navigating to profile.html');
            
            // Don't navigate if we're already on the profile page
            if (!window.location.pathname.includes('profile.html')) {
                window.location.href = 'profile.html';
            }
        });
    }

    // Logout functionality
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to log out?')) {
                showMessage('Logging out...', 'info');
                setTimeout(() => {
                    logout(); // Use API logout function
                }, 1000);
            }
        });
    }

    // Simulate page loading
    function simulatePageLoad() {
        const cards = document.querySelectorAll('.activity-card');
        cards.forEach((card, index) => {
            card.classList.add('loading');
            setTimeout(() => {
                card.classList.remove('loading');
            }, index * 100);
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

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Search shortcut (Ctrl/Cmd + K)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Close mobile menu with Escape
        if (e.key === 'Escape') {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('show');
            document.body.classList.remove('menu-open');
        }
    });

    // Add touch support for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Improve touch interactions
        activityCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Add scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(100px)';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .activity-card {
            animation: fadeIn 0.5s ease;
        }
        
        .menu-open {
            overflow: hidden;
        }
        
        .scroll-to-top:hover {
            background: #b91c1c !important;
            transform: translateY(-2px) !important;
        }
    `;
    document.head.appendChild(style);
});

// Load user profile from API
async function loadUserProfile() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            logout();
            return;
        }

        // Update profile picture and name in UI
        const profileImages = document.querySelectorAll('.profile-img');
        const profileNames = document.querySelectorAll('.profile-name');
        
        profileImages.forEach(img => {
            if (currentUser.avatar_url) {
                img.src = currentUser.avatar_url;
            }
        });
        
        profileNames.forEach(el => {
            el.textContent = currentUser.full_name || currentUser.username || 'User';
        });

    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load activities from API
async function loadActivities() {
    try {
        const activityGrid = document.querySelector('.activity-grid');
        if (!activityGrid) return;

        // Show loading state
        activityGrid.innerHTML = '<div class="loading-spinner">Loading activities...</div>';

        const response = await API.activities.getAll();
        
        if (response && response.ok && response.data.success) {
            const activities = response.data.data.activities;
            
            if (activities.length === 0) {
                activityGrid.innerHTML = `
                    <div class="empty-state">
                        <h3>No activities available</h3>
                        <p>Check back later for new activities!</p>
                    </div>
                `;
                return;
            }

            // Clear loading and render activities
            activityGrid.innerHTML = '';
            activities.forEach(activity => {
                const card = createActivityCard(activity);
                activityGrid.appendChild(card);
            });

            // Re-attach event listeners to new cards
            attachActivityCardListeners();
        } else {
            activityGrid.innerHTML = `
                <div class="error-state">
                    <h3>Failed to load activities</h3>
                    <p>Please try refreshing the page</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading activities:', error);
        const activityGrid = document.querySelector('.activity-grid');
        if (activityGrid) {
            activityGrid.innerHTML = `
                <div class="error-state">
                    <h3>Connection error</h3>
                    <p>Make sure the server is running</p>
                </div>
            `;
        }
    }
}

// Create activity card HTML
function createActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.setAttribute('data-id', activity.id);
    card.setAttribute('data-date', activity.event_date);

    const eventDate = new Date(activity.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-GB');
    const formattedTime = eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });

    // Determine status tag
    let statusTag = '';
    const now = new Date();
    const spotsLeft = activity.max_participants - activity.current_participants;
    
    if (eventDate < now) {
        statusTag = '<div class="status-tag closed">Ended</div>';
    } else if (spotsLeft <= 0) {
        statusTag = '<div class="status-tag full">Full</div>';
    } else if (spotsLeft <= 5) {
        statusTag = '<div class="status-tag limited">Limited Spots</div>';
    } else {
        statusTag = '<div class="status-tag open">Open for Registration</div>';
    }

    card.innerHTML = `
        <div class="card-image">
            <img src="${activity.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'}" alt="${activity.title}">
            ${statusTag}
        </div>
        <div class="card-content">
            <h3 class="card-title">${activity.title}</h3>
            <div class="card-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${formattedTime}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${activity.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${activity.current_participants}/${activity.max_participants}</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

// Attach event listeners to activity cards
function attachActivityCardListeners() {
    const activityCards = document.querySelectorAll('.activity-card');
    
    activityCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Click to view details or navigate to calendar
        card.addEventListener('click', function() {
            const date = this.getAttribute('data-date');
            const activityId = this.getAttribute('data-id');
            
            if (date) {
                window.location.href = `calendar.html?date=${date}&activity=${activityId}`;
            }
        });
    });

    // Update search functionality for dynamically loaded cards
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            activityCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const details = card.querySelector('.card-details').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || details.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Load profile data from localStorage (legacy function - keeping for compatibility)
function loadProfileData() {
    loadUserProfile();
}
