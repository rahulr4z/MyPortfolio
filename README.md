# Rahul's Portfolio Website

A modern, dynamic portfolio website built with React frontend and FastAPI backend, featuring a beautiful soft sky blue design with fun animations and interactive elements.

## 🚀 Features

- **Dynamic Content Management**: Admin panel for easy content updates
- **JWT Authentication**: Secure admin access with token-based authentication
- **Responsive Design**: Beautiful UI that works on all devices
- **Interactive Animations**: Smooth Framer Motion animations throughout
- **Lottie Animations**: Engaging animated elements
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
- **Lottie React**: Lottie animation integration
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (can be easily migrated to PostgreSQL/MySQL)
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **Python-multipart**: File upload handling
- **Uvicorn**: ASGI server for production deployment

### Authentication & Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive data validation

### Development Tools
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Git**: Version control
- **Virtual Environment**: Python dependency isolation

## 🏗️ Architecture

### Project Structure
```
Rahul's Portfolio/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── sections/        # Main page sections
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── assets/         # Static assets
│   │   └── lottie/         # Lottie animation files
│   ├── public/             # Public static files
│   └── package.json        # Frontend dependencies
├── backend/                # FastAPI backend application
│   ├── api/               # API route handlers
│   ├── models/            # Database models and schemas
│   ├── scripts/           # Database seeding scripts
│   ├── utils/             # Utility functions
│   ├── uploads/           # File upload directory
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
└── README.md              # Project documentation
```

### Database Schema
- **About**: Personal information and skills
- **Experience**: Work history and roles
- **Projects**: Portfolio projects with images and links
- **Stats**: Achievement statistics
- **Testimonials**: Client feedback and reviews
- **Contact**: Contact form submissions

### API Endpoints
- `GET /api/about` - Get about information
- `GET /api/experiences` - Get work experience
- `GET /api/projects` - Get portfolio projects
- `GET /api/stats` - Get achievement statistics
- `GET /api/testimonials` - Get client testimonials
- `POST /api/contact` - Submit contact form
- `POST /api/login` - Admin authentication
- `POST /api/upload` - File upload endpoint

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

4. **Initialize the Database**
   ```bash
   cd ../backend
   python -c "from models.database import engine, Base; Base.metadata.create_all(bind=engine)"
   python scripts/seed_data.py
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

### Admin Access
- **Username**: admin
- **Password**: admin123

## 🎨 Design System

### Color Palette
- **Primary**: Soft Sky Blue (`sky-400`, `sky-500`, `sky-600`)
- **Secondary**: Blue (`blue-400`, `blue-500`, `blue-600`)
- **Accent**: Indigo (`indigo-400`, `indigo-500`)
- **Background**: Gradient from sky-50 to indigo-50
- **Text**: Sky-900 for headings, sky-700 for body text

### Typography
- **Headings**: Bold, large text with gradient effects
- **Body**: Clean, readable font with proper line spacing
- **Emphasis**: Color variations and font weights

### Animations
- **Framer Motion**: Smooth page transitions and hover effects
- **Lottie**: Engaging animated illustrations
- **CSS Transitions**: Subtle hover and focus states
- **Loading States**: Animated spinners and skeleton screens

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Database Configuration
The application uses SQLite by default. To use PostgreSQL or MySQL:
1. Update the database URL in `backend/models/database.py`
2. Install the appropriate database driver
3. Update the requirements.txt file

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for API endpoints

### Backend Deployment (Railway/Heroku)
1. Set up the Python environment
2. Install dependencies: `pip install -r requirements.txt`
3. Configure environment variables
4. Deploy the backend code
5. Update frontend API endpoints to point to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Tailwind CSS** for the utility-first styling approach
- **Lottie** for beautiful animations
- **FastAPI** for the modern Python web framework
- **React** for the component-based architecture

## 📞 Support

For support and questions:
- Email: hello@example.com
- GitHub Issues: Create an issue in the repository

---

**Built with ❤️ using modern web technologies** 