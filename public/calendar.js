// Check authentication
if (!requireAuth()) {
    window.location.href = 'index.html';
}

const currentUser = getCurrentUser();

// Update header profile
const fullName = `${currentUser.first_name} ${currentUser.last_name}`;
document.getElementById('headerProfileName').textContent = fullName;

const headerProfileImg = document.getElementById('headerProfileImg');
if (currentUser.avatar_url) {
    headerProfileImg.src = currentUser.avatar_url;
} else {
    const initials = `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase();
    headerProfileImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=667eea&color=fff&bold=true`;
}

// Profile button click
document.getElementById('userProfileBtn').addEventListener('click', () => {
    window.location.href = 'profile.html';
});

// Set user role on body element for CSS-based nav visibility
document.body.setAttribute('data-user-role', currentUser.role || 'student');

// Sidebar toggle for mobile
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');

mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
});

mobileOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    mobileOverlay.classList.remove('active');
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Calendar State
let currentDate = new Date();
let allEvents = [];
let eventsByDate = {}; // { 'YYYY-MM-DD': [events] }

// Initialize
async function init() {
    console.log('Calendar initializing...');
    await loadAllEvents();
    console.log('Events loaded, rendering calendar...');
    renderCalendar();
    
    // Event listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('todayBtn').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });
}

// Load all events from all approved activities
async function loadAllEvents() {
    try {
        console.log('Loading all events...');
        // Get all approved activities
        const activitiesResponse = await API.activities.getAll();
        console.log('Activities response:', activitiesResponse);
        
        if (!activitiesResponse.ok || !activitiesResponse.data?.success) {
            console.error('Failed to load activities');
            return;
        }
        
        // Backend returns { success: true, data: { activities } }
        // API wraps as { ok: true, data: { success, data: { activities } } }
        const activities = activitiesResponse.data.data.activities || [];
        
        console.log('All activities:', activities.length, activities);
        const approvedActivities = activities.filter(a => a.approval_status === 'approved');
        console.log('Approved activities:', approvedActivities.length);
        
        // Fetch events for all approved activities
        const eventPromises = approvedActivities.map(activity => 
            API.events.getActivityEvents(activity.id)
                .then(res => {
                    console.log(`Events for activity ${activity.id}:`, res);
                    if (res.ok && res.data?.success) {
                        const eventData = res.data.data;
                        const activityEvents = Array.isArray(eventData) ? eventData : (eventData?.events || []);
                        console.log(`  Found ${activityEvents.length} events for ${activity.title}`);
                        return activityEvents.map(event => ({
                            ...event,
                            activity_title: activity.title,
                            activity_id: activity.id
                        }));
                    }
                    return [];
                })
                .catch(err => {
                    console.error('Error loading events for activity:', activity.id, err);
                    return [];
                })
        );
        
        const allEventArrays = await Promise.all(eventPromises);
        allEvents = allEventArrays.flat();
        
        console.log('Total events loaded:', allEvents.length);
        console.log('All events:', allEvents);
        
        // Organize events by date
        organizeEventsByDate();
        
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Organize events into date buckets
function organizeEventsByDate() {
    eventsByDate = {};
    
    console.log('Organizing events by date...');
    allEvents.forEach(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        
        console.log(`Event: ${event.title}, Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);
        
        // Add event to each date it spans
        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        
        console.log(`  Start day (midnight): ${startDay.toISOString()}`);
        console.log(`  End day (midnight): ${endDay.toISOString()}`);
        
        // Iterate through each day in the range
        const currentDay = new Date(startDay);
        let daysCount = 0;
        
        while (currentDay <= endDay) {
            const dateKey = formatDateKey(currentDay);
            
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            
            eventsByDate[dateKey].push(event);
            console.log(`  Added to date: ${dateKey}`);
            
            // Move to next day
            currentDay.setDate(currentDay.getDate() + 1);
            daysCount++;
            
            // Safety check to prevent infinite loops
            if (daysCount > 365) {
                console.error('Event spans more than 365 days, breaking loop');
                break;
            }
        }
        
        console.log(`  Event spans ${daysCount} day(s)`);
    });
    
    console.log('Events organized by date:', eventsByDate);
    console.log('Dates with events:', Object.keys(eventsByDate));
}

// Format date as YYYY-MM-DD
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Render calendar
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calendarTitle').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get days from previous month to fill the grid
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const daysFromPrevMonth = startingDayOfWeek;
    
    // Get days from next month to fill the grid
    const totalDaysShown = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;
    const daysFromNextMonth = totalDaysShown - (daysFromPrevMonth + daysInMonth);
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add previous month days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = new Date(year, month - 1, day);
        calendarDays.appendChild(createDayElement(date, true));
    }
    
    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        calendarDays.appendChild(createDayElement(date, false));
    }
    
    // Add next month days
    for (let day = 1; day <= daysFromNextMonth; day++) {
        const date = new Date(year, month + 1, day);
        calendarDays.appendChild(createDayElement(date, true));
    }
}

// Create day element
function createDayElement(date, isOtherMonth) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayEl.classList.add('other-month');
    }
    
    // Check if today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayEl.classList.add('today');
    }
    
    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayEl.appendChild(dayNumber);
    
    // Get events for this date
    const dateKey = formatDateKey(date);
    const eventsForDay = eventsByDate[dateKey] || [];
    
    // Add event dots (max 3)
    if (eventsForDay.length > 0) {
        dayEl.classList.add('has-events');
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'event-dots';
        
        const dotsToShow = Math.min(eventsForDay.length, 3);
        for (let i = 0; i < dotsToShow; i++) {
            const dot = document.createElement('div');
            dot.className = 'event-dot';
            dotsContainer.appendChild(dot);
        }
        
        dayEl.appendChild(dotsContainer);
    }
    
    // Click handler to show events (allow clicking any day)
    dayEl.addEventListener('click', (e) => {
        console.log('Day clicked:', date, 'Events:', eventsForDay.length);
        showEventsModal(date, eventsForDay);
    });
    
    return dayEl;
}

// Show events modal
function showEventsModal(date, events) {
    const modal = document.getElementById('eventModal');
    const modalDate = document.getElementById('modalDate');
    const modalEventsList = document.getElementById('modalEventsList');
    
    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    modalDate.textContent = `Events for ${date.toLocaleDateString('en-US', options)}`;
    
    // Clear previous events
    modalEventsList.innerHTML = '';
    
    if (events.length === 0) {
        modalEventsList.innerHTML = `
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <p>No events scheduled for this day</p>
            </div>
        `;
    } else {
        // Sort events by start time
        const sortedEvents = [...events].sort((a, b) => 
            new Date(a.start_date) - new Date(b.start_date)
        );
        
        sortedEvents.forEach(event => {
            const eventItem = createModalEventItem(event);
            modalEventsList.appendChild(eventItem);
        });
    }
    
    modal.classList.add('show');
}

// Create modal event item
function createModalEventItem(event) {
    const item = document.createElement('div');
    item.className = 'modal-event-item';
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const timeStr = formatEventTime(startDate, endDate);
    
    item.innerHTML = `
        <div class="modal-event-title">${escapeHtml(event.title)}</div>
        ${event.activity_title ? `
            <div class="modal-event-activity">
                <i class="fas fa-calendar-day"></i> ${escapeHtml(event.activity_title)}
            </div>
        ` : ''}
        <div class="modal-event-time">
            <i class="far fa-clock"></i>
            ${timeStr}
        </div>
        ${event.description ? `
            <div class="modal-event-description">
                ${escapeHtml(event.description)}
            </div>
        ` : ''}
    `;
    
    // Click to go to activity details
    if (event.activity_id) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = `activity-details.html?id=${event.activity_id}`;
        });
    }
    
    return item;
}

// Format event time
function formatEventTime(start, end) {
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);
    const endTimeStr = end.toLocaleTimeString('en-US', timeOptions);
    
    const startDateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDateStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (startDateStr === endDateStr) {
        return `${startTimeStr} - ${endTimeStr}`;
    }
    return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
}

// Close modal
function closeEventModal() {
    document.getElementById('eventModal').classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('eventModal');
    if (e.target === modal) {
        closeEventModal();
    }
});

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize calendar
init();
