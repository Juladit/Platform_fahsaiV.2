// Upcoming Events Component
window.UpcomingEvents = (function() {
    let allEvents = [];

    // Initialize and load all upcoming events
    async function init(activityId = null) {
        await loadUpcomingEvents(activityId);
        
        // Listen for event updates
        window.addEventListener('eventsUpdated', (e) => {
            loadUpcomingEvents(e.detail?.activityId);
        });
    }

    // Load upcoming events (optionally filtered by activity)
    async function loadUpcomingEvents(activityId = null) {
        try {
            let events = [];
            
            if (activityId) {
                // Load events for specific activity
                const response = await API.events.getActivityEvents(activityId);
                console.log('Upcoming events response:', response);
                if (response.ok && response.data?.success) {
                    const eventData = response.data.data;
                    events = Array.isArray(eventData) ? eventData : (eventData?.events || []);
                }
            } else {
                // Load all events from all approved activities
                const activitiesResponse = await API.activities.getAll();
                if (activitiesResponse.ok && activitiesResponse.data?.success) {
                    const activities = activitiesResponse.data.data || [];
                    const approvedActivities = activities.filter(a => a.approval_status === 'approved');
                    
                    // Fetch events for all approved activities
                    const eventPromises = approvedActivities.map(activity => 
                        API.events.getActivityEvents(activity.id)
                            .then(res => {
                                if (res.ok && res.data?.success) {
                                    const eventData = res.data.data;
                                    const activityEvents = Array.isArray(eventData) ? eventData : (eventData?.events || []);
                                    return activityEvents.map(event => ({
                                        ...event,
                                        activity_title: activity.title
                                    }));
                                }
                                return [];
                            })
                            .catch(() => [])
                    );
                    
                    const allEventArrays = await Promise.all(eventPromises);
                    events = allEventArrays.flat();
                }
            }

            // Ensure events is an array before filtering
            if (!Array.isArray(events)) {
                console.error('Events is not an array:', events);
                events = [];
            }

            // Filter to only upcoming events (end date in the future or ongoing)
            const now = new Date();
            allEvents = events.filter(event => new Date(event.end_date) >= now);

            // Sort by start date (closest first)
            allEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

            renderUpcomingEvents();
        } catch (error) {
            console.error('Error loading upcoming events:', error);
        }
    }

    // Render upcoming events
    function renderUpcomingEvents() {
        const container = document.getElementById('upcoming-events-list');
        if (!container) return;

        if (allEvents.length === 0) {
            container.innerHTML = `
                <div class="empty-events">
                    <i class="fas fa-calendar-check"></i>
                    <p>No upcoming events</p>
                </div>
            `;
            return;
        }

        container.innerHTML = allEvents.map(event => {
            const startDate = new Date(event.start_date);
            const endDate = new Date(event.end_date);
            const dateStr = formatEventDates(startDate, endDate);
            const isOngoing = new Date() >= startDate && new Date() <= endDate;

            return `
                <div class="upcoming-event-card" onclick="UpcomingEvents.showEventDetail('${event.id}')">
                    ${isOngoing ? '<div class="event-badge ongoing">Ongoing</div>' : ''}
                    <div class="upcoming-event-title">${escapeHtml(event.title)}</div>
                    ${event.activity_title ? `
                        <div class="upcoming-event-activity">
                            <i class="fas fa-calendar-day"></i> ${escapeHtml(event.activity_title)}
                        </div>
                    ` : ''}
                    <div class="upcoming-event-date">
                        <i class="far fa-calendar"></i> ${dateStr}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Format event dates
    function formatEventDates(start, end) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: '2-digit' };
        
        const startDateStr = start.toLocaleDateString('en-US', options);
        const endDateStr = end.toLocaleDateString('en-US', options);
        const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);
        const endTimeStr = end.toLocaleTimeString('en-US', timeOptions);

        if (startDateStr === endDateStr) {
            return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
        }
        return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
    }

    // Show event detail
    function showEventDetail(eventId) {
        const event = allEvents.find(e => e.id === eventId);
        if (!event) return;

        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const dateStr = formatEventDates(startDate, endDate);

        const modalContent = `
            <div class="event-detail-modal event-modal show" id="event-detail-modal">
                <div class="event-modal-content">
                    <div class="event-modal-header">
                        <h3>${escapeHtml(event.title)}</h3>
                        <button class="btn-close-modal" onclick="UpcomingEvents.closeEventDetail()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="event-detail-content">
                        ${event.activity_title ? `
                            <div class="event-detail-row">
                                <div class="event-detail-label">Activity</div>
                                <div class="event-detail-value">
                                    <i class="fas fa-calendar-day"></i> ${escapeHtml(event.activity_title)}
                                </div>
                            </div>
                        ` : ''}
                        <div class="event-detail-row">
                            <div class="event-detail-label">Date & Time</div>
                            <div class="event-detail-value">
                                <i class="far fa-calendar"></i> ${dateStr}
                            </div>
                        </div>
                        ${event.description ? `
                            <div class="event-detail-row">
                                <div class="event-detail-label">Description</div>
                                <div class="event-detail-value event-detail-description">
                                    ${escapeHtml(event.description).replace(/\n/g, '<br>')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existing = document.getElementById('event-detail-modal');
        if (existing) existing.remove();

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalContent);
    }

    // Close event detail
    function closeEventDetail() {
        const modal = document.getElementById('event-detail-modal');
        if (modal) modal.remove();
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    return {
        init,
        showEventDetail,
        closeEventDetail,
        refresh: () => loadUpcomingEvents()
    };
})();
