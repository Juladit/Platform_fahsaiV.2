// Check if user is logged in
const token = localStorage.getItem('authToken');
const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

if (!token || !currentUser) {
    console.log('No auth token or user found, redirecting to login');
    window.location.href = 'index.html';
}

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api';

// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const cameraSelect = document.getElementById('cameraSelect');
const resultBox = document.getElementById('resultBox');
const attendanceInfo = document.getElementById('attendanceInfo');
const loadingOverlay = document.getElementById('loadingOverlay');

// QR Scanner instance
let html5QrcodeScanner = null;
let isScanning = false;

// Show loading
function showLoading() {
    loadingOverlay.classList.add('show');
}

// Hide loading
function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Show result message
function showResult(message, isSuccess = true) {
    resultBox.className = 'result-box show';
    resultBox.classList.add(isSuccess ? 'result-success' : 'result-error');
    
    const icon = isSuccess ? '✅' : '❌';
    const title = isSuccess ? 'Success' : 'Error';
    
    resultBox.innerHTML = `
        <h3>${icon} ${title}</h3>
        <p>${message}</p>
    `;
    
    // Auto-hide after 5 seconds if error
    if (!isSuccess) {
        setTimeout(() => {
            resultBox.classList.remove('show');
        }, 5000);
    }
}

// Hide result
function hideResult() {
    resultBox.classList.remove('show');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Check in to event
async function checkInToEvent(qrData) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/attendance/check-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ qrData })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Check-in failed');
        }
        
        // Show success message
        showResult('Check-in successful! Your attendance has been recorded.', true);
        
        // Display attendance details
        displayAttendanceInfo(data.data.attendance);
        
        // Stop scanner
        stopScanner();
        
        // Play success sound (optional)
        playSuccessSound();
        
    } catch (error) {
        console.error('Check-in error:', error);
        showResult(error.message || 'Failed to check in. Please try again.', false);
    } finally {
        hideLoading();
    }
}

// Display attendance info
function displayAttendanceInfo(attendance) {
    attendanceInfo.style.display = 'block';
    
    document.getElementById('activityName').textContent = attendance.activity?.title || '-';
    document.getElementById('eventTitle').textContent = attendance.event?.event_title || '-';
    document.getElementById('eventDate').textContent = attendance.event?.event_date 
        ? formatDate(attendance.event.event_date) 
        : '-';
    document.getElementById('eventLocation').textContent = attendance.event?.location || '-';
    document.getElementById('checkinTime').textContent = attendance.check_in_time 
        ? formatDate(attendance.check_in_time) 
        : '-';
}

// Play success sound
function playSuccessSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// QR Code success callback
function onScanSuccess(decodedText, decodedResult) {
    console.log('QR Code detected:', decodedText);
    
    // Vibrate if supported
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Stop scanner immediately to prevent multiple scans
    if (html5QrcodeScanner) {
        html5QrcodeScanner.pause(true);
    }
    
    // Process QR code
    try {
        // Try to parse as JSON (our QR codes are JSON)
        const qrData = JSON.parse(decodedText);
        
        // Validate QR data structure
        if (!qrData.eventId && !qrData.activityId) {
            throw new Error('Invalid QR code format');
        }
        
        // Check in to event
        checkInToEvent(decodedText);
        
    } catch (error) {
        console.error('QR parse error:', error);
        showResult('Invalid QR code. Please scan an event QR code.', false);
        
        // Resume scanner after error
        setTimeout(() => {
            if (html5QrcodeScanner && isScanning) {
                html5QrcodeScanner.resume();
            }
        }, 2000);
    }
}

// QR Code error callback
function onScanError(errorMessage) {
    // Don't log every scan error (too noisy)
    // Only log if it's not a "No QR code found" error
    if (!errorMessage.includes('No MultiFormat Readers')) {
        console.warn('Scan error:', errorMessage);
    }
}

// Get available cameras
async function getCameras() {
    try {
        const devices = await Html5Qrcode.getCameras();
        
        if (devices && devices.length > 0) {
            // Populate camera select
            cameraSelect.innerHTML = '<option value="">Select Camera...</option>';
            
            devices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.id;
                option.textContent = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
            
            // Show camera select if multiple cameras
            if (devices.length > 1) {
                cameraSelect.style.display = 'block';
            }
            
            return devices;
        }
        
        return [];
        
    } catch (error) {
        console.error('Error getting cameras:', error);
        return [];
    }
}

// Start scanner
async function startScanner() {
    try {
        hideResult();
        attendanceInfo.style.display = 'none';
        
        if (!html5QrcodeScanner) {
            html5QrcodeScanner = new Html5Qrcode("reader");
        }
        
        // Get selected camera or use default
        const cameras = await getCameras();
        
        if (cameras.length === 0) {
            showResult('No camera found. Please check camera permissions.', false);
            return;
        }
        
        const selectedCamera = cameraSelect.value || cameras[cameras.length - 1].id;
        
        // Start scanning
        await html5QrcodeScanner.start(
            selectedCamera,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            onScanSuccess,
            onScanError
        );
        
        isScanning = true;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        
    } catch (error) {
        console.error('Start scanner error:', error);
        showResult('Failed to start camera. Please check permissions.', false);
    }
}

// Stop scanner
async function stopScanner() {
    try {
        if (html5QrcodeScanner && isScanning) {
            await html5QrcodeScanner.stop();
            isScanning = false;
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Stop scanner error:', error);
    }
}

// Event listeners
startBtn.addEventListener('click', startScanner);
stopBtn.addEventListener('click', stopScanner);

// Camera select change
cameraSelect.addEventListener('change', async () => {
    if (isScanning) {
        await stopScanner();
        await startScanner();
    }
});

// Request camera permissions on load
window.addEventListener('load', async () => {
    try {
        // Request camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        
        // Get available cameras
        await getCameras();
        
    } catch (error) {
        console.error('Camera permission error:', error);
        showResult('Camera access denied. Please allow camera access to use the scanner.', false);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopScanner();
});
