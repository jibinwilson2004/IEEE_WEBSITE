# IEEE MBITS Admin Panel Documentation

## Overview
This project includes a complete admin panel for managing events and gallery images on the IEEE MBITS website.

## Features

### 1. Admin Login
- **URL**: `/admin.html`
- **Default Password**: `admin123`
- Session-based authentication using localStorage

### 2. Admin Dashboard
- **URL**: `/admin-dashboard.html` (redirects from /admin after login)
- Access restricted to authenticated admins only

### 3. Event Management
- Add new events with:
  - Event date (e.g., "Jan 2025")
  - Event title
  - Event description
  - Event image URL (local path or external URL)
- View all current events
- Delete events
- All events stored in browser's localStorage

### 4. Gallery Management
- Add new images with:
  - Image URL (local path or external URL)
  - Alt text/description
- View all gallery images
- Delete images
- All images stored in browser's localStorage

### 5. Admin Settings
- Change admin password
- Export data as JSON file
- Reset all data to default

## How to Access

### First Time Setup
1. Navigate to `http://yoursite.com/admin.html`
2. Use default password: `admin123`
3. After login, change the password in the Settings tab

### Regular Access
1. Go to `http://yoursite.com/admin.html`
2. Enter your admin password
3. Access the dashboard to manage events and gallery

## File Structure

### New Files Added
- `admin.html` - Admin login page
- `admin-dashboard.html` - Admin control panel
- `admin-script.js` - Admin functionality and data management
- `gallery-script.js` - Dynamic gallery loading

### Modified Files
- `script.js` - Updated to load events from localStorage
- `gallery.html` - Updated to load images from localStorage dynamically

## Data Storage

### Events Data Structure
```javascript
{
  date: "Jan 2025",
  image: "events/myevent.jpg",
  title: "Event Title",
  description: "Event description"
}
```

### Gallery Data Structure
```javascript
{
  src: "gallery/image.jpg",
  alt: "Image description"
}
```

All data is stored in the browser's localStorage with the following keys:
- `events` - Array of event objects
- `galleryImages` - Array of image objects
- `adminPassword` - Encrypted admin password
- `adminLoggedIn` - Login session flag

## Adding Events

1. Login to `/admin.html`
2. Click on "Manage Events" tab
3. Fill in the form:
   - **Event Date**: Format like "Jan 2025"
   - **Event Title**: The name of the event
   - **Event Description**: Details about the event
   - **Event Image URL**: Path to the image (e.g., `events/myevent.jpg` or `https://example.com/image.jpg`)
4. Click "Add Event"
5. The event will appear in the "Current Events" list
6. It will automatically display on the Activities page

## Adding Gallery Images

1. Login to `/admin.html`
2. Click on "Manage Gallery" tab
3. Fill in the form:
   - **Image URL**: Path to the image (e.g., `gallery/photo.jpg` or `https://example.com/photo.jpg`)
   - **Image Description**: Alt text for the image
4. Click "Add Image"
5. The image will appear in the gallery preview
6. It will automatically display on the Gallery page

## Important Notes

⚠️ **Browser Storage**: Data is stored in the browser's localStorage. Different browsers and different computers will have different data.

⚠️ **Data Persistence**: If a user clears their browser cache/localStorage, all admin data will be lost. You can export data regularly as a backup.

⚠️ **Security Note**: This is a client-side authentication system suitable for a static website. For a production website with backend, implement server-side authentication.

## Backup and Export

To backup your data:
1. Go to Admin Dashboard > Settings tab
2. Click "Export Data"
3. This downloads a JSON file with all events and gallery images
4. Save this file safely

## Reset to Default

To restore default data:
1. Go to Admin Dashboard > Settings tab
2. Click "Reset to Default"
3. Confirm the action
4. All data will be restored to the original state

## Troubleshooting

### Forgot Password?
- Clear browser cache and localStorage to reset to default password: `admin123`
- Or manually reset in browser dev tools: `localStorage.clear()`

### Events/Images Not Showing?
- Make sure images have correct file paths
- Test image URLs in a new browser tab
- Check browser console for errors (F12)

### Changes Not Persisting?
- Ensure localStorage is not disabled in browser settings
- Check if browser's "Delete cookies on exit" is enabled
- Try a different browser

## Future Enhancements

Potential improvements for the admin panel:
1. Add backend database integration
2. Image upload functionality
3. User role management
4. Event categories and filtering
5. Analytics and statistics
6. Multi-admin support
7. Audit logs

---

**Version**: 1.0
**Created**: June 2025
**Developed for**: IEEE MBITS Student Branch
