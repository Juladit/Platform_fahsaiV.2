# 📡 API Documentation

Base URL: `http://localhost:5000/api`

All endpoints (except auth) require Bearer token authentication.

## Authentication

Include token in headers:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "student1",
  "email": "student@mfu.ac.th",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0812345678"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "student1",
      "email": "student@mfu.ac.th",
      "first_name": "John",
      "last_name": "Doe",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@mfu.ac.th",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@mfu.ac.th",
      "role": "admin"
    }
  }
}
```

---

## 📅 Activity Endpoints

### Get All Activities
```http
GET /api/activities?status=open&search=basketball&limit=20&offset=0
```

**Query Parameters:**
- `status` (optional): Filter by status (open, closed, cancelled, completed)
- `search` (optional): Search in title and description
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "title": "Basketball Tournament",
        "description": "Annual basketball competition",
        "start_date": "2025-11-15T09:00:00Z",
        "max_participants": 50,
        "current_participants": 12,
        "status": "open",
        "created_by_user": {
          "username": "admin",
          "first_name": "Admin"
        }
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Activity by ID
```http
GET /api/activities/:id
```

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "activity": {
      "id": "uuid",
      "title": "Basketball Tournament",
      "description": "...",
      "current_participants": 12,
      "registrations": [...]
    }
  }
}
```

### Create Activity (Admin Only)
```http
POST /api/activities
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "Football Tournament",
  "description": "Annual football competition",
  "activityType": "Sports",
  "location": "MFU Stadium",
  "startDate": "2025-12-01T09:00:00Z",
  "endDate": "2025-12-01T17:00:00Z",
  "maxParticipants": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Activity created successfully",
  "data": {
    "activity": { ... }
  }
}
```

### Update Activity (Admin Only)
```http
PUT /api/activities/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "status": "closed",
  "maxParticipants": 150
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Activity updated successfully",
  "data": {
    "activity": { ... }
  }
}
```

### Delete Activity (Admin Only)
```http
DELETE /api/activities/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Activity deleted successfully",
  "data": null
}
```

---

## 📝 Registration Endpoints

### Get My Registrations
```http
GET /api/registrations
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "uuid",
        "registration_status": "registered",
        "registered_at": "2025-11-01T10:00:00Z",
        "activity": {
          "id": "uuid",
          "title": "Basketball Tournament",
          "start_date": "2025-11-15T09:00:00Z"
        }
      }
    ]
  }
}
```

### Register for Activity
```http
POST /api/registrations
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "activityId": "activity-uuid-here"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Successfully registered for activity",
  "data": {
    "registration": {
      "id": "uuid",
      "user_id": "uuid",
      "activity_id": "uuid",
      "registration_status": "registered"
    }
  }
}
```

### Cancel Registration
```http
DELETE /api/registrations/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Registration cancelled successfully",
  "data": null
}
```

### Get Activity Registrations (Admin Only)
```http
GET /api/registrations/activity/:activityId
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "uuid",
        "registration_status": "registered",
        "user": {
          "username": "student1",
          "first_name": "John",
          "email": "student@mfu.ac.th"
        }
      }
    ]
  }
}
```

---

## 👤 Profile Endpoints

### Get Profile
```http
GET /api/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "student1",
      "email": "student@mfu.ac.th",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "0812345678",
      "avatar_url": "...",
      "role": "student"
    }
  }
}
```

### Update Profile
```http
PUT /api/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@mfu.ac.th",
  "phone": "0898765432"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ... }
  }
}
```

### Change Password
```http
PUT /api/profile/password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### Upload Avatar
```http
POST /api/profile/avatar
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "avatarData": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "user": {
      "avatar_url": "data:image/png;base64,..."
    }
  }
}
```

### Get Profile Stats
```http
GET /api/profile/stats
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 5,
      "registered": 3,
      "completed": 1,
      "cancelled": 1
    }
  }
}
```

---

## ❌ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [ ... ] // Optional validation errors
}
```

### Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Example Error Response:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## 🧪 Testing with cURL

### Login Example:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Activities (with token):
```bash
curl http://localhost:5000/api/activities \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Activity (admin):
```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Test Activity",
    "description": "Test description",
    "startDate": "2025-12-01T09:00:00Z",
    "location": "MFU Campus",
    "maxParticipants": 50
  }'
```

---

## 📌 Notes

- All dates should be in ISO 8601 format (e.g., `2025-11-01T09:00:00Z`)
- Tokens expire after 7 days
- Admin/organizer role required for creating/editing/deleting activities
- Maximum file size for avatars: 10MB

---

**Happy coding! 🚀**
