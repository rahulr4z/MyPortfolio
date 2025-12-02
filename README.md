# Rahul's Portfolio

A modern, dynamic portfolio website built with React frontend and FastAPI backend, featuring a beautiful design with interactive animations and a comprehensive admin panel for content management.

## 🚀 Features

- **Dynamic Content Management**: Admin panel for easy content updates
- **JWT Authentication**: Secure admin access with token-based authentication
- **Responsive Design**: Beautiful UI that works on all devices
- **Interactive Animations**: Smooth animations throughout the interface
- **Real-time Updates**: Live content updates without page refresh
- **Image Upload**: Support for project images and media
- **Contact Form**: Functional contact form with backend integration
- **SEO Optimized**: Meta tags and structured data

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **Axios**: HTTP client for API communication

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (easily migratable to PostgreSQL/MySQL)
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **Uvicorn**: ASGI server for production deployment

## 🏗️ Project Structure

```
Rahul's Portfolio/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── sections/        # Main page sections
│   │   ├── services/       # API service functions
│   │   └── assets/         # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # FastAPI backend application
│   ├── api/               # API route handlers
│   ├── models/            # Database models and schemas
│   ├── uploads/           # File upload directory
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Rahul's Portfolio"
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   DATABASE_URL=sqlite:///portfolio.db
   ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
   DEBUG=true
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:5174/admin
   - API Documentation: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | `your-64-char-secret-key` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `your-secure-password` |
| `DATABASE_URL` | Database connection string | `sqlite:///portfolio.db` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173,https://yourdomain.com` |
| `DEBUG` | Debug mode | `true` or `false` |

### Database Configuration
The application uses SQLite by default. To use PostgreSQL or MySQL:
1. Update the `DATABASE_URL` environment variable
2. Install the appropriate database driver
3. Update the requirements.txt file

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for API endpoints

### Backend Deployment (Fly.io/Railway)
1. Set up the Python environment
2. Install dependencies: `pip install -r requirements.txt`
3. Configure environment variables
4. Deploy the backend code
5. Update frontend API endpoints to point to production backend

## 🔒 Security

- JWT-based authentication for admin access
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure file upload handling
- Environment variable configuration for sensitive data

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with modern web technologies for optimal performance and user experience** 