# DocAppointment - Frontend

A modern appointment booking system for doctors and patients built with React and Vite.

## Features

### For Patients
- 🔍 Browse available doctors with their specializations
- 📅 View doctor availability slots
- ✅ Book appointments with preferred doctors
- 📋 View and manage booked appointments
- ❌ Cancel appointments

### For Doctors
- 📊 Dashboard to manage appointments
- ⏰ Create and manage availability slots
- ✅ Confirm or reject appointment requests
- 👤 Update profile (designation & specialization)
- 🗑️ Delete account (for non-practicing doctors)

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file in the root directory
touch .env
```

4. Add environment variables to `.env`:
```env
VITE_API_URL=http://127.0.0.1:5000
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance with interceptors
│   ├── components/
│   │   └── DashboardLayout.jsx  # Main layout with sidebar
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── doctor/
│   │   │   ├── Appointments.jsx
│   │   │   ├── ManageSlots.jsx
│   │   │   └── Profile.jsx
│   │   └── patient/
│   │       ├── DoctorsList.jsx
│   │       └── MyAppointments.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx   # Auth guard component
│   ├── services/
│   │   ├── authService.js       # Authentication API
│   │   ├── appointmentService.js
│   │   ├── doctorService.js
│   │   └── patientService.js
│   ├── App.jsx
│   ├── index.css               # Global styles
│   └── main.jsx
├── .env                        # Environment variables (not in git)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://appointment-booking-api-fpmy.onrender.com` |

## API Endpoints

The frontend communicates with the following backend endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Patient
- `GET /patient/doctors` - List all doctors
- `GET /patient/doctors/:id/availability` - Get doctor's available slots

### Doctor
- `GET /doctor/profile` - Get doctor profile
- `POST /doctor/profile` - Update doctor profile
- `POST /doctor/availability` - Create availability slot
- `DELETE /doctor/account` - Delete doctor account

### Appointments
- `POST /appointments` - Book appointment
- `GET /appointments` - Get user's appointments
- `PATCH /appointments/:id` - Update appointment status

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_API_URL` = Your backend URL
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables in site settings
6. Deploy!

## License

MIT
