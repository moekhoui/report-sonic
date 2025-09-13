# ReportSonic - AI-Powered Reporting SaaS

ReportSonic is an AI-powered reporting SaaS that allows consultants, agencies, and small businesses to upload raw data and instantly generate branded, professional reports in PDF or Word format.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth
- 📊 **Data Upload**: CSV, Google Sheets, and API integration
- 🤖 **AI Analysis**: Automatic data insights and recommendations
- 📈 **Charts & Visualizations**: Interactive charts and graphs
- 🎨 **Branding**: Custom logos, colors, and templates
- 📄 **Export Options**: PDF and Word document generation
- 💳 **Subscription Billing**: Stripe integration with multiple tiers

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Payments**: Stripe
- **Charts**: Recharts
- **Document Generation**: docx, pdf-lib, jsPDF

## 🚀 Quick Deploy to Vercel (Free!)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/report-sonic)

### Option 2: Manual Deploy
1. **Fork this repository** on GitHub
2. **Go to [Vercel](https://vercel.com)** and sign up
3. **Import your forked repository**
4. **Add environment variables** (see below)
5. **Deploy!** ✨

### Environment Variables for Vercel
```env
MONGODB_URI=mongodb+srv://reportsonic:reportsonic123@cluster0.mongodb.net/reportsonic?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🆓 Free Tier Includes
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **MongoDB Atlas**: 512MB storage, shared clusters
- **No credit card required!**

## Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free)

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd report-sonic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the variables above

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── mongodb.ts        # MongoDB connection
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features to Implement

1. **Data Upload System**
   - CSV file upload with validation
   - Google Sheets integration
   - API data fetching

2. **AI Integration**
   - Data analysis and insights generation
   - Report content generation
   - Chart recommendations

3. **Report Generation**
   - Template system
   - Branding customization
   - PDF/Word export

4. **Subscription Management**
   - Stripe integration
   - Plan management
   - Usage tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
