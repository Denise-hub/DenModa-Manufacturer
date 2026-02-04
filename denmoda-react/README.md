# DenModa - Official Website

A modern, responsive React-based website for DenModa, a premium handcrafted sandals manufacturing business. Features include product showcase, order management, WhatsApp integration, and a comprehensive admin panel.

**Live Site:** [https://denmoda.web.app](https://denmoda.web.app)

## Features

- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Product Showcase**: Dynamic product catalog with filtering and detailed views
- **Order Management**: Integrated order form with WhatsApp integration
- **Admin Dashboard**: Complete content management system for site administration
- **WhatsApp Integration**: Seamless order placement via WhatsApp with pre-filled messages
- **Visitor Analytics**: Track website visits with email notifications
- **SEO Optimized**: Comprehensive meta tags, structured data, and sitemap
- **Firebase Backend**: Secure, scalable cloud infrastructure
- **Image Management**: Cloudinary integration for optimized image delivery

## Tech Stack

- **Frontend**: React 18, React Router 6, Bootstrap 5
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Image Storage**: Cloudinary
- **Email**: EmailJS for notifications
- **Animations**: AOS (Animate On Scroll)
- **SEO**: React Helmet Async

## Project Structure

```
denmoda-react/
├── public/
│   ├── index.html          # Main HTML with SEO meta tags
│   ├── sitemap.xml         # SEO sitemap
│   ├── robots.txt          # Search engine directives
│   └── assets/             # Static assets (images, logos)
├── src/
│   ├── config/             # Configuration files
│   │   ├── firebase.js     # Firebase initialization
│   │   └── cloudinary.js   # Cloudinary configuration
│   ├── services/           # Business logic layer
│   │   ├── firestoreService.js  # Database operations
│   │   └── authService.js       # Authentication
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js
│   │   ├── DataContext.js
│   │   ├── LanguageContext.js
│   │   └── ThemeContext.js
│   ├── components/
│   │   ├── admin/          # Admin panel components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Reusable components
│   │   ├── layout/         # Header, Footer
│   │   └── sections/       # Page sections
│   ├── pages/              # Main page components
│   ├── hooks/              # Custom React hooks
│   ├── styles/
│   │   └── main.css        # Global styles
│   ├── App.js              # Main app component
│   └── index.js            # Application entry point
├── firebase.json           # Firebase hosting configuration
├── firestore.rules         # Database security rules
└── package.json
```

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Firebase account
- Cloudinary account (for image uploads)
- EmailJS account (for email notifications)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Denise-hub/DenModa-Manufacturer.git
cd DenModa-Manufacturer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Admin Configuration
REACT_APP_ADMIN_EMAIL=your_admin_email@example.com
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (Google provider)
4. Initialize Firebase in your project:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select:
- Firestore (for database)
- Hosting (for deployment)
- Use existing project

### 5. Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Create an unsigned upload preset:
   - Go to Settings > Upload > Upload presets
   - Create new preset named `denmoda_uploads`
   - Set signing mode to "Unsigned"
   - Save preset

### 6. Run Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

The site will be available at your Firebase hosting URL (e.g., `https://your-project.web.app`)

## Admin Panel

### Access

1. Navigate to `/login` on the website
2. Sign in with Google using the admin email
3. Access the admin dashboard at `/admin`

### Features

- **Dashboard**: Analytics and overview
- **Products**: Manage product catalog
- **Orders**: View and manage customer orders
- **Messages**: Handle contact form submissions
- **Content Management**: Update hero, about, services, team, FAQ sections
- **Settings**: Configure site-wide settings and SEO

### Order Management

- View all customer orders
- Update order status (Pending → Confirmed → Delivered → Cancelled)
- Contact customers directly via WhatsApp
- Filter orders by status
- View order statistics

## Key Features

### WhatsApp Integration

- Footer and contact section WhatsApp links with pre-filled welcome messages
- Product order form that opens WhatsApp with complete order details
- Admin panel integration to contact customers via WhatsApp

### Order Form

- Compact, responsive design
- All fields visible without scrolling
- Customer information collection (name, phone, preferred size)
- Automatic order saving to database
- Email notifications to admin

### Visitor Tracking

- Automatic visitor tracking on page load
- Email notifications to admin for new visitors
- Device and referrer information tracking

### Responsive Design

- Fully responsive across all screen sizes
- Mobile-optimized admin panel
- Touch-friendly interface
- No horizontal scrolling on any device

## Security

### Firestore Rules

Only authenticated admin users can write to the database. All data is readable by everyone (public website).

### Admin Access

Admin access is restricted to the email specified in `REACT_APP_ADMIN_EMAIL` environment variable.

## Customization

### Brand Colors

Edit CSS variables in `src/styles/main.css`:

```css
:root {
  --primary-color: #58eecd;
  --secondary-color: #3c74db;
  --dark-color: #1a2b4b;
}
```

### WhatsApp Phone Number

Update the phone number in:
- `src/components/sections/Products.js`
- `src/components/layout/Footer.js`
- `src/components/sections/Contact.js`

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Firebase Authentication Issues

- Verify Google provider is enabled in Firebase Console
- Check authorized domains in Firebase Authentication settings
- Ensure admin email matches `REACT_APP_ADMIN_EMAIL`

### Cloudinary Upload Fails

- Verify Cloud Name and Upload Preset in `.env`
- Ensure upload preset is set to "Unsigned"
- Check Cloudinary dashboard for usage limits

### Sitemap Not Accessible

- Verify `sitemap.xml` exists in `public/` folder
- Check Firebase hosting configuration in `firebase.json`
- Ensure proper Content-Type headers are set

## Contributing

This is a private project for DenModa. For issues or questions, contact the development team.

## License

© 2025 DenModa. All Rights Reserved.

## Support

For technical support or inquiries:
- Email: denmoda.manufacturing@gmail.com
- Website: [https://denmoda.web.app](https://denmoda.web.app)

## Changelog

### Latest Updates (January 2025)

- Enhanced WhatsApp integration with pre-filled messages
- Improved order form with responsive design
- Added visitor tracking with email notifications
- Comprehensive admin panel for order management
- Full mobile responsiveness across all components
- SEO optimizations with proper meta tags and sitemap
- Performance improvements with non-blocking email notifications
