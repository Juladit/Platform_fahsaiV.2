const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Get user's registrations
 * GET /api/registrations
 */
const getUserRegistrations = async (req, res) => {
    try {
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select(`
                *,
                activity:activities(*)
            `)
            .eq('user_id', req.user.id)
            .order('registered_at', { ascending: false });

        if (error) {
            console.error('Get registrations error:', error);
            return errorResponse(res, 'Failed to fetch registrations', 500);
        }

        return successResponse(res, { registrations });

    } catch (error) {
        console.error('GetUserRegistrations error:', error);
        return errorResponse(res, 'Failed to fetch registrations', 500);
    }
};

/**
 * Register for an activity
 * POST /api/registrations
 */
const registerForActivity = async (req, res) => {
    try {
        const { activityId } = req.body;
        const userId = req.user.id;

        // Check if activity exists and is open
        const { data: activity, error: activityError } = await supabase
            .from('activities')
            .select('*')
            .eq('id', activityId)
            .single();

        if (activityError || !activity) {
            return errorResponse(res, 'Activity not found', 404);
        }

        if (activity.status !== 'open') {
            return errorResponse(res, 'Activity is not open for registration', 400);
        }

        // Check if activity is full
        if (activity.max_participants && activity.current_participants >= activity.max_participants) {
            return errorResponse(res, 'Activity is full', 400);
        }

        // Check if already registered
        const { data: existingRegistration } = await supabase
            .from('registrations')
            .select('*')
            .eq('user_id', userId)
            .eq('activity_id', activityId)
            .single();

        if (existingRegistration) {
            if (existingRegistration.registration_status === 'registered') {
                return errorResponse(res, 'Already registered for this activity', 400);
            }
            
            // If previously cancelled, update to registered
            const { data: registration, error } = await supabase
                .from('registrations')
                .update({
                    registration_status: 'registered',
                    cancelled_at: null
                })
                .eq('id', existingRegistration.id)
                .select()
                .single();

            if (error) {
                console.error('Re-registration error:', error);
                return errorResponse(res, 'Failed to register', 500);
            }

            return successResponse(res, { registration }, 'Successfully registered for activity', 201);
        }

        // Create new registration
        const { data: registration, error } = await supabase
            .from('registrations')
            .insert({
                user_id: userId,
                activity_id: activityId,
                registration_status: 'registered'
            })
            .select()
            .single();

        if (error) {
            console.error('Registration error:', error);
            return errorResponse(res, 'Failed to register for activity', 500);
        }

        return successResponse(res, { registration }, 'Successfully registered for activity', 201);

    } catch (error) {
        console.error('RegisterForActivity error:', error);
        return errorResponse(res, 'Failed to register for activity', 500);
    }
};

/**
 * Cancel registration
 * DELETE /api/registrations/:id
 */
const cancelRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if registration exists and belongs to user
        const { data: registration } = await supabase
            .from('registrations')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .single();

        if (!registration) {
            return errorResponse(res, 'Registration not found', 404);
        }

        if (registration.registration_status === 'cancelled') {
            return errorResponse(res, 'Registration already cancelled', 400);
        }

        // Update registration status
        const { error } = await supabase
            .from('registrations')
            .update({
                registration_status: 'cancelled',
                cancelled_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Cancel registration error:', error);
            return errorResponse(res, 'Failed to cancel registration', 500);
        }

        return successResponse(res, null, 'Registration cancelled successfully');

    } catch (error) {
        console.error('CancelRegistration error:', error);
        return errorResponse(res, 'Failed to cancel registration', 500);
    }
};

/**
 * Get all registrations for an activity (Admin only)
 * GET /api/registrations/activity/:activityId
 */
const getActivityRegistrations = async (req, res) => {
    try {
        const { activityId } = req.params;

        const { data: registrations, error } = await supabase
            .from('registrations')
            .select(`
                *,
                user:users(id, username, first_name, last_name, email, phone)
            `)
            .eq('activity_id', activityId)
            .order('registered_at', { ascending: false });

        if (error) {
            console.error('Get activity registrations error:', error);
            return errorResponse(res, 'Failed to fetch registrations', 500);
        }

        return successResponse(res, { registrations });

    } catch (error) {
        console.error('GetActivityRegistrations error:', error);
        return errorResponse(res, 'Failed to fetch registrations', 500);
    }
};

module.exports = {
    getUserRegistrations,
    registerForActivity,
    cancelRegistration,
    getActivityRegistrations
};
