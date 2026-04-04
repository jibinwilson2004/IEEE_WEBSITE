# EmailJS Setup Guide for IEEE MBITS Join Form

This guide will help you set up auto-reply emails for the join form.

## Steps to Configure EmailJS:

### 1. Create an EmailJS Account
- Visit https://www.emailjs.com/
- Sign up for a free account

### 2. Add Email Service
- Go to **Email Services** in your dashboard
- Click **Add Service**
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the authentication steps

### 3. Create Email Template
- Go to **Email Templates**
- Click **Create New Template**
- Use the following template:

**Template Name:** `ieee_join_reply` (or your preferred name)

**Email Subject:**
```
Welcome to IEEE MBITS!
```

**HTML Content:**
```html
<p>Hi {{user_name}},</p>

<p>Thank you for reaching out to us! We have received your request, and we'll reach out to you within 2 days and will help you to sort out your query on <strong>{{user_query}}</strong>.</p>

<p>Best regards,<br>
IEEE SB MBITS</p>
```

**Template Variables Used:**
- `{{user_name}}` - Full Name
- `{{user_query}}` - User's Query/Message
- `{{to_email}}` - Recipient Email (handled by EmailJS)

### 4. Get Your Credentials
From your EmailJS dashboard, copy:
1. **Public Key** - Found in Account → API Keys
2. **Service ID** - Found in Email Services
3. **Template ID** - Found in Email Templates

### 5. Update join.html
Replace these placeholders in `join.html` line ~265:

```javascript
emailjs.init({
    publicKey: 'YOUR_PUBLIC_KEY_HERE', // Replace with actual public key
    blockHeadless: true
});

emailjs.send('YOUR_SERVICE_ID_HERE', 'YOUR_TEMPLATE_ID_HERE', {
    // Parameters are automatically mapped
});
```

**Example:**
```javascript
emailjs.init({
    publicKey: 'abcd1234efgh5678ijkl90',
    blockHeadless: true
});

emailjs.send('service_abc123def456', 'template_xyz789', {
    to_email: email,
    user_name: fullName,
    user_query: message || 'Joining IEEE MBITS'
});
```

## Important Notes:

1. **Keep credentials secure** - Never commit your public key to public repositories
2. **Monthly limits** - EmailJS free plan allows 200 emails/month
3. **Test first** - Send a test email to yourself before going live
4. **Error handling** - Current setup shows success message even if email fails (graceful fallback)

## Testing:

1. Open `join.html` in your browser
2. Fill in the form with test data
3. Submit and check your email for the auto-reply

## Troubleshooting:

- **Email not received?** Check spam/junk folder
- **CORS error?** Ensure EmailJS public key is correct
- **Template not found?** Verify Service ID and Template ID match exactly
- **Check console** - Open browser DevTools (F12) → Console tab for error messages

## Support:

- EmailJS Docs: https://www.emailjs.com/docs/
- IEEE MBITS: Check with your administrator for support
