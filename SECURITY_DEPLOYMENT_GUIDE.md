# 🔒 Security & Deployment Guide

## **Security Configuration**

### **1. Environment Variables Setup**

#### **Development (.env file)**
```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

#### **Production (.env file)**
```bash
# Copy the production template
cp .env.production .env

# Edit with your actual production values
nano .env
```

### **2. Critical Security Steps**

#### **✅ Generate a New Secret Key**
```bash
# Generate a new secret key for production
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
```

#### **✅ Update CORS Origins**
In your `.env` file, replace the CORS origins with your actual domain:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### **✅ Disable Debug Mode**
```bash
DEBUG=false
LOG_LEVEL=WARNING
```

### **3. Production Security Checklist**

- [ ] **Secret Key**: Changed from default to unique value
- [ ] **CORS**: Restricted to specific domains only
- [ ] **Debug Mode**: Disabled in production
- [ ] **HTTPS**: Enabled on production server
- [ ] **Database**: Using secure database (PostgreSQL/MySQL)
- [ ] **File Uploads**: Restricted file types and sizes
- [ ] **Environment Variables**: All sensitive data in .env
- [ ] **Dependencies**: Updated to latest secure versions

### **4. Environment Variables Reference**

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | `your-64-char-secret-key` |
| `DATABASE_URL` | Database connection | `postgresql://user:pass@host/db` |
| `ALLOWED_ORIGINS` | CORS allowed domains | `https://domain.com,https://www.domain.com` |
| `DEBUG` | Debug mode | `false` (production) |
| `LOG_LEVEL` | Logging level | `WARNING` (production) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiry | `30` |
| `MAX_FILE_SIZE` | Upload size limit | `5242880` (5MB) |

### **5. Deployment Commands**

#### **Backend Deployment**
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export SECRET_KEY="your-production-secret-key"
export DEBUG=false
export ALLOWED_ORIGINS="https://yourdomain.com"

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### **Frontend Deployment**
```bash
# Build for production
npm run build

# Serve static files
npx serve -s dist -l 3000
```

### **6. Security Best Practices**

#### **Server Security**
- Use HTTPS only
- Set up proper firewall rules
- Keep system packages updated
- Use non-root user for running app
- Set up proper file permissions

#### **Application Security**
- Validate all inputs
- Sanitize file uploads
- Use parameterized queries
- Implement rate limiting
- Set secure headers

#### **Database Security**
- Use strong passwords
- Restrict database access
- Enable SSL connections
- Regular backups
- Monitor for suspicious activity

### **7. Monitoring & Logging**

#### **Enable Security Logging**
```python
# In your main.py
import logging

logging.basicConfig(
    level=logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

#### **Monitor for Security Events**
- Failed login attempts
- Unauthorized access attempts
- File upload violations
- Database connection issues

### **8. Emergency Response**

#### **If Compromised**
1. **Immediate Actions**
   - Change all passwords
   - Rotate secret keys
   - Review access logs
   - Check for unauthorized changes

2. **Investigation**
   - Analyze security logs
   - Check for data breaches
   - Review recent deployments
   - Audit user accounts

3. **Recovery**
   - Restore from clean backup
   - Update all dependencies
   - Implement additional security measures
   - Notify affected users if necessary

---

## **Quick Setup Commands**

```bash
# 1. Generate new secret key
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"

# 2. Create production .env
cp .env.production .env

# 3. Edit with your values
nano .env

# 4. Test configuration
python3 -c "from config import settings; print('Config OK')"

# 5. Start production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**⚠️ Remember**: Never commit `.env` files to version control! 