# 🔑 How to Get All Environment Variables for ReportSonic

## 1. NEXTAUTH_URL
**What it is:** The URL of your deployed app
**Where to get it:** From Vercel after deployment

### Steps:
1. Deploy your app to Vercel
2. Vercel will give you a URL like: `https://report-sonic-abc123.vercel.app`
3. Use that URL as your NEXTAUTH_URL

### Example:
```
NEXTAUTH_URL=https://report-sonic-abc123.vercel.app
```

---

## 2. NEXTAUTH_SECRET
**What it is:** A secret key for NextAuth.js encryption
**Where to get it:** Generate it yourself

### Steps:
1. Go to: https://generate-secret.vercel.app/32
2. Copy the generated secret
3. Or run this command: `openssl rand -base64 32`

### Example:
```
NEXTAUTH_SECRET=your-32-character-secret-key-here
```

---

## 3. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
**What it is:** For Google OAuth login
**Where to get it:** Google Cloud Console

### Steps:
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-app.vercel.app/api/auth/callback/google` (for production)
7. Copy Client ID and Client Secret

### Example:
```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

---

## 4. STRIPE_PUBLISHABLE_KEY & STRIPE_SECRET_KEY
**What it is:** For payment processing
**Where to get it:** Stripe Dashboard

### Steps:
1. Go to: https://dashboard.stripe.com/
2. Sign up or log in
3. Go to "Developers" → "API Keys"
4. Copy "Publishable key" and "Secret key"

### Example:
```
STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## 5. STRIPE_WEBHOOK_SECRET
**What it is:** For Stripe webhook verification
**Where to get it:** Stripe Dashboard

### Steps:
1. Go to Stripe Dashboard → "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Add URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `customer.subscription.updated`
5. Copy the webhook secret

### Example:
```
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## 🚀 Quick Setup (Minimal Required Variables)

For basic functionality, you only need:

```
MONGODB_URI=mongodb+srv://khouildimy_db_user:2A5hvPZkkDbqJL9@report-sonic.zagspw2.mongodb.net/reportsonic?retryWrites=true&w=majority&appName=report-sonic
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

## 🎯 Recommended Setup Order

1. **Deploy to Vercel first** (get NEXTAUTH_URL)
2. **Generate NEXTAUTH_SECRET** (required for auth)
3. **Add Google OAuth** (optional, for user login)
4. **Add Stripe** (optional, for payments)

## 💡 Pro Tips

- **Start with minimal variables** and add more as needed
- **Use test keys** for development
- **Keep secrets secure** - never commit them to Git
- **Use Vercel's environment variables** for production
