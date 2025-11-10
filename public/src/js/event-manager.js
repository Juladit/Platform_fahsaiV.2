// Event Manager Component
window.EventManager = (function() {
    let currentActivityId = null;
    let currentEditingEvent = null;
    let events = [];

    // Initialize event manager for an activity
    function init(activityId) {
        currentActivityId = activityId;
        loadEvents();
    }

    // Load events for the activity
    async function loadEvents() {
        try {
            const response = await API.events.getActivityEvents(currentActivityId);
            console.log('Event manager response:', response);
            if (response.ok && response.data?.success) {
                // Handle nested response structure: response.data.data.events
                const eventData = response.data.data;
                events = Array.isArray(eventData) ? eventData : (eventData?.events || []);
                console.log('Loaded events:', events);
                renderEventsList();
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    // Render events list
    function renderEventsList() {
        const container = document.getElementById('events-list');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = `
                <div class="empty-events">
                    <i class="fas fa-calendar-alt"></i>
                    <p>No events scheduled yet</p>
                </div>
            `;
            return;
        }

        // Sort events by start date
        const sortedEvents = [...events].sort((a, b) => 
            new Date(a.start_date) - new Date(b.start_date)
        );

        container.innerHTML = sortedEvents.map(event => {
            const startDate = new Date(event.start_date);
            const endDate = new Date(event.end_date);
            const dateStr = formatEventDates(startDate, endDate);

            return `
                <div class="event-item" onclick="EventManager.showEventDetail('${event.id}')">
                    <div class="event-info">
                        <div class="event-title">${escapeHtml(event.title)}</div>
                        <div class="event-dates">
                            <i class="far fa-calendar"></i> ${dateStr}
                        </div>
                    </div>
                    <div class="event-actions" onclick="event.stopPropagation()">
                        <button class="btn-icon edit" onclick="EventManager.editEvent('${event.id}')" title="Edit event">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="EventManager.deleteEvent('${event.id}')" title="Delete event">
                            <i class="fas fa-trash"></i>
                        </button>
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

    // Show add event modal
    function showAddEventModal() {
        currentEditingEvent = null;
        document.getElementById('event-modal-title').textContent = 'Add New Event';
        document.getElementById('event-form').reset();
        document.getElementById('event-modal').classList.add('show');
    }

    // Show edit event modal
    function editEvent(eventId) {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        currentEditingEvent = event;
        document.getElementById('event-modal-title').textContent = 'Edit Event';
        
        // Format dates for input (datetime-local format)
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-start-date').value = formatDateTimeLocal(startDate);
        document.getElementById('event-end-date').value = formatDateTimeLocal(endDate);
        
        document.getElementById('event-modal').classList.add('show');
    }

    // Format date for datetime-local input
    function formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Close event modal
    function closeEventModal() {
        document.getElementById('event-modal').classList.remove('show');
        currentEditingEvent = null;
    }

    // Save event (create or update)
    async function saveEvent(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const formData = {
                title: document.getElementById('event-title').value,
                description: document.getElementById('event-description').value,
                startDate: new Date(document.getElementById('event-start-date').value).toISOString(),
                endDate: new Date(document.getElementById('event-end-date').value).toISOString()
            };

            // Validation
            if (new Date(formData.endDate) <= new Date(formData.startDate)) {
                alert('End date must be after start date');
                submitBtn.disabled = false;
                submitBtn.textContent = currentEditingEvent ? 'Update Event' : 'Add Event';
                return;
            }

            let response;
            if (currentEditingEvent) {
                // Update existing event
                response = await API.events.update(currentEditingEvent.id, formData);
            } else {
                // Create new event
                formData.activityId = currentActivityId;
                response = await API.events.create(formData);
            }

            if (response.ok && response.data?.success) {
                closeEventModal();
                await loadEvents();
                
                // Trigger event for upcoming events section to refresh
                window.dispatchEvent(new CustomEvent('eventsUpdated', { 
                    detail: { activityId: currentActivityId } 
                }));
            } else {
                alert(response.data?.message || 'Failed to save event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = currentEditingEvent ? 'Update Event' : 'Add Event';
        }
    }

    // Delete event
    async function deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await API.events.delete(eventId);
            if (response.ok && response.data?.success) {
                await loadEvents();
                
                // Trigger event for upcoming events section to refresh
                window.dispatchEvent(new CustomEvent('eventsUpdated', { 
                    detail: { activityId: currentActivityId } 
                }));
            } else {
                alert(response.data?.message || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
        }
    }

    // Show event detail modal
    function showEventDetail(eventId) {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const dateStr = formatEventDates(startDate, endDate);

        const modalContent = `
            <div class="event-detail-modal event-modal show" id="event-detail-modal">
                <div class="event-modal-content">
                    <div class="event-modal-header">
                        <h3>${escapeHtml(event.title)}</h3>
                        <button class="btn-close-modal" onclick="EventManager.closeEventDetail()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="event-detail-content">
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

    // Close event detail modal
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
        showAddEventModal,
        editEvent,
        deleteEvent,
        closeEventModal,
        saveEvent,
        showEventDetail,
        closeEventDetail,
        getEvents: () => events
    };
})();
