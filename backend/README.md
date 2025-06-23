# Portfolio Backend

A FastAPI backend for the portfolio website with SQLite database integration, fully configurable content management, authentication, and image upload capabilities.

## Features

- ✅ **Dynamic Content Management** - All portfolio sections configurable via API
- ✅ **Authentication System** - JWT-based admin authentication
- ✅ **Admin Interface** - Web-based content management dashboard
- ✅ **Image Upload** - Secure image upload with optimization
- ✅ **Database Integration** - SQLite with SQLAlchemy ORM
- ✅ **CORS Support** - Cross-origin requests enabled
- ✅ **API Documentation** - Interactive FastAPI docs

## Setup

1. Activate the virtual environment:
```bash
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Seed the database with initial data:
```bash
python seed_data.py
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The server will run on `http://localhost:8000`

## Authentication

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

**⚠️ Important:** Change these credentials in production!

### Login Endpoint
- `POST /api/auth/login` - Authenticate and get JWT token

## API Endpoints

### Health Check
- `GET /` - Check if backend is running

### Authentication
- `POST /api/auth/login` - Login and get access token

### Image Upload (Protected)
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image` - Delete uploaded image
- `GET /api/upload/image/info` - Get image information

### Contact Form
- `POST /api/contact` - Submit a contact form
- `GET /api/contacts` - Get all contact submissions

### About Section
- `GET /api/about` - Get all active about content items
- `POST /api/about` - Create new about content item (Protected)
- `PUT /api/about/{id}` - Update about content item (Protected)
- `DELETE /api/about/{id}` - Delete about content item (Protected)

### Experience Section
- `GET /api/experiences` - Get all active experience entries
- `POST /api/experiences` - Create new experience entry (Protected)
- `PUT /api/experiences/{id}` - Update experience entry (Protected)
- `DELETE /api/experiences/{id}` - Delete experience entry (Protected)

### Stats Section
- `GET /api/stats` - Get all active statistics
- `POST /api/stats` - Create new statistic (Protected)
- `PUT /api/stats/{id}` - Update statistic (Protected)
- `DELETE /api/stats/{id}` - Delete statistic (Protected)

### Testimonials Section
- `GET /api/testimonials` - Get all active testimonials
- `POST /api/testimonials` - Create new testimonial (Protected)
- `PUT /api/testimonials/{id}` - Update testimonial (Protected)
- `DELETE /api/testimonials/{id}` - Delete testimonial (Protected)

### Projects Section
- `GET /api/projects` - Get all active projects
- `GET /api/projects/{category}` - Get projects by category
- `POST /api/projects` - Create new project (Protected)
- `PUT /api/projects/{id}` - Update project (Protected)
- `DELETE /api/projects/{id}` - Delete project (Protected)

### Admin (Protected)
- `GET /api/admin/contacts` - Get all contact submissions with metadata

## Database Models

### Contact
- `id` (Primary Key)
- `name` (String)
- `email` (String)
- `message` (Text)
- `created_at` (DateTime)

### About
- `id` (Primary Key)
- `title` (String)
- `subtitle` (String, Optional)
- `description` (Text)
- `image_url` (String, Optional)
- `is_active` (Boolean)
- `order_index` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Experience
- `id` (Primary Key)
- `company` (String)
- `position` (String)
- `duration` (String)
- `description` (Text)
- `technologies` (String, Optional)
- `is_active` (Boolean)
- `order_index` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Stat
- `id` (Primary Key)
- `label` (String)
- `value` (String)
- `suffix` (String, Optional)
- `icon` (String, Optional)
- `is_active` (Boolean)
- `order_index` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Testimonial
- `id` (Primary Key)
- `name` (String)
- `position` (String, Optional)
- `company` (String, Optional)
- `message` (Text)
- `avatar_url` (String, Optional)
- `rating` (Integer, 1-5)
- `is_active` (Boolean)
- `order_index` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Project
- `id` (Primary Key)
- `title` (String)
- `description` (Text)
- `short_description` (String, Optional)
- `image_url` (String, Optional)
- `live_url` (String, Optional)
- `github_url` (String, Optional)
- `technologies` (String, Optional)
- `category` (String, Default: "all")
- `is_featured` (Boolean)
- `is_active` (Boolean)
- `order_index` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## Content Management Features

### Ordering
All content items have an `order_index` field to control their display order.

### Active/Inactive Items
Use the `is_active` field to show/hide content without deleting it.

### Categories
Projects can be categorized (e.g., "software", "data", "all") for filtering.

### Featured Projects
Use `is_featured` to highlight important projects.

### Image Upload
- Supported formats: JPG, JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Automatic image optimization and resizing
- Unique filename generation
- Static file serving

## Frontend Integration

### Admin Interface
Visit `/admin` in your frontend to access the admin dashboard:
- Login with admin credentials
- View all content in organized tables
- Manage content across all sections
- Upload and manage images

### API Integration
The frontend components now fetch data dynamically from the backend:
- About section loads from `/api/about`
- Experience section loads from `/api/experiences`
- Stats section loads from `/api/stats`
- Testimonials section loads from `/api/testimonials`
- Projects section loads from `/api/projects`

## Interactive API Documentation

Visit `http://localhost:8000/docs` to see the interactive FastAPI documentation where you can:
- Test all endpoints
- View request/response schemas
- Try out the API directly
- Authenticate and test protected endpoints

## Security Features

### Authentication
- JWT token-based authentication
- Password hashing with bcrypt
- Token expiration (30 minutes)
- Protected admin endpoints

### Image Upload Security
- File type validation
- File size limits
- Secure filename generation
- Image processing and optimization

## CORS

CORS is configured to allow requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`

## Database

The application uses SQLite with SQLAlchemy ORM. The database file (`portfolio.db`) will be created automatically when you first run the application.

## File Structure

```
backend/
├── main.py              # FastAPI application
├── database.py          # Database models and configuration
├── models.py            # Pydantic models
├── auth.py              # Authentication system
├── upload.py            # Image upload functionality
├── seed_data.py         # Database seeding script
├── requirements.txt     # Python dependencies
├── README.md           # This file
├── uploads/            # Uploaded images directory
└── portfolio.db        # SQLite database (auto-generated)
```

## Production Considerations

1. **Change default admin credentials** in `auth.py`
2. **Use environment variables** for sensitive data
3. **Set up proper database** (PostgreSQL, MySQL)
4. **Configure proper CORS origins**
5. **Set up HTTPS**
6. **Use proper secret key** for JWT tokens
7. **Set up image CDN** for production
8. **Configure logging**
9. **Set up monitoring**

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure all dependencies are installed
2. **Database errors**: Run `python seed_data.py` to initialize data
3. **CORS errors**: Check that frontend URL is in allowed origins
4. **Upload errors**: Ensure `uploads/` directory exists and is writable
5. **Authentication errors**: Verify admin credentials

### Logs
Check the console output for detailed error messages and debugging information. 