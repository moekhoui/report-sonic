# Report Sonic Pricing System Setup Guide

This guide will help you set up the complete pricing and subscription system for Report Sonic.

## 🎯 Features Implemented

### Pricing Tiers
- **FREE TIER - $0/month**
  - 5 reports per month (hard limit)
  - 100,000 total cells monthly quota
  - Max 10,000 cells per report
  - PDF only (watermarked)

- **STARTER PLAN - $9/month**
  - 25 reports per month (hard limit)
  - 500,000 total cells monthly quota
  - Max 50,000 cells per report
  - All export formats

- **PROFESSIONAL PLAN - $29/month**
  - 100 reports per month (hard limit)
  - 2,000,000 total cells monthly quota
  - Max 200,000 cells per report
  - White-label exports
  - Overage: $0.10 per 10,000 additional cells

### Key Components
✅ Database schema with usage tracking  
✅ Cell calculation system  
✅ Limit checking middleware  
✅ Usage tracking and analytics  
✅ Stripe payment integration  
✅ Subscription management UI  
✅ Real-time usage display  
✅ Limit exceeded notifications  

## 🚀 Setup Instructions

### 1. Database Setup

The database schema has been updated with new fields:
- `subscription_plan` enum: 'free', 'starter', 'professional'
- `monthly_cells_used` integer (resets monthly)
- `monthly_reports_used` integer (resets monthly)
- `total_cells_used` integer (lifetime)
- `last_reset_date` date (for monthly resets)

Run the database initialization:
```bash
# The initDatabase() function will create the new tables automatically
npm run dev
```

### 2. Stripe Setup

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - Publishable Key: `pk_test_your_stripe_publishable_key_here`
   - Secret Key: `sk_test_your_stripe_secret_key_here`

3. **Create Products and Prices**:
   - Go to Stripe Dashboard → Products
   - Create "Starter Plan" with $9/month recurring
   - Create "Professional Plan" with $29/month recurring
   - Copy the Price IDs and update your environment variables

4. **Set up Webhooks**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy webhook secret to environment variables

### 3. Environment Variables

Add these to your `.env.local` file:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_STARTER_PRICE_ID=price_starter_monthly
STRIPE_PROFESSIONAL_PRICE_ID=price_professional_monthly
```

### 4. Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

## 📁 Files Created/Modified

### New Files:
- `src/utils/pricingCalculator.ts` - Cell calculations and pricing logic
- `src/middleware/limitCheck.ts` - Limit checking middleware
- `src/lib/stripe.ts` - Stripe integration
- `src/components/UsageDisplay.tsx` - Usage overview component
- `src/components/PricingPlans.tsx` - Pricing plans display
- `src/components/LimitExceededModal.tsx` - Limit exceeded modal
- `src/components/DashboardHeader.tsx` - Dashboard with usage display
- `src/components/UsageNotification.tsx` - Usage notifications
- `pages/subscription.tsx` - Subscription management page
- `pages/api/stripe/create-checkout-session.ts` - Stripe checkout
- `pages/api/stripe/create-portal-session.ts` - Billing portal
- `pages/api/stripe/webhook.ts` - Stripe webhooks
- `pages/api/user/profile.ts` - User profile API
- `pages/api/reports/generate.ts` - Report generation with limits

### Modified Files:
- `src/lib/mysql.ts` - Updated database schema
- `src/lib/models/UserMySQL.ts` - Added usage tracking methods
- `src/types/index.ts` - Updated type definitions
- `pages/dashboard.tsx` - Integrated usage display
- `env.example` - Added Stripe configuration

## 🔧 How It Works

### Cell Calculation
```typescript
function calculateCells(fileData) {
  const rows = fileData.length
  const columns = fileData.length > 0 ? Object.keys(fileData[0]).length : 0
  return rows * columns
}
```

### Limit Checking
Before any report generation:
1. Calculate cells needed for the file
2. Check user's current usage against plan limits
3. Verify report count limits
4. Block if limits exceeded with upgrade prompt

### Usage Tracking
- Increments `monthly_reports_used` on each report generation
- Increments `monthly_cells_used` by calculated cell count
- Tracks in `usage_logs` table for analytics
- Resets monthly usage automatically

### Subscription Management
- Stripe checkout for new subscriptions
- Billing portal for existing customers
- Webhook handlers for subscription changes
- Automatic plan updates in database

## 🎨 User Experience

### Dashboard
- Real-time usage display with progress bars
- Clear indication of remaining quota
- Upgrade prompts when approaching limits

### Subscription Page
- Plan comparison with features
- Current usage statistics
- Easy upgrade/downgrade options
- Billing management portal

### Notifications
- Warning when approaching limits (80%+ usage)
- Error when limits exceeded (100% usage)
- Upgrade prompts with clear benefits

## 🚀 Testing

### Test the System:
1. Create a free account
2. Upload a small CSV file (under 10K cells)
3. Generate a report
4. Check usage display updates
5. Try to exceed limits
6. Test upgrade flow

### Test Stripe Integration:
1. Use Stripe test cards
2. Complete checkout flow
3. Verify webhook events
4. Check subscription status updates

## 📊 Monitoring

### Usage Analytics
- Track user behavior in `usage_logs` table
- Monitor conversion rates from free to paid
- Analyze usage patterns for plan optimization

### Key Metrics
- Monthly Active Users (MAU)
- Conversion rate (free → paid)
- Average Revenue Per User (ARPU)
- Churn rate
- Usage distribution across plans

## 🔒 Security

- All API endpoints require authentication
- Stripe webhooks verified with signatures
- Usage limits enforced server-side
- No sensitive data in client-side code

## 🎯 Next Steps

1. **Deploy to Production**: Update Stripe keys for live mode
2. **Set up Monitoring**: Add analytics tracking
3. **Email Notifications**: Send usage alerts via email
4. **Advanced Features**: 
   - Annual billing discounts
   - Team plans
   - Custom enterprise plans
   - Usage-based billing for overages

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure Stripe webhooks are configured properly
4. Check database connection and schema

The pricing system is now fully implemented and ready for production use! 🎉
