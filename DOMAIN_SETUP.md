# 🌐 Custom Domain Setup Guide

## **Overview**
This guide will help you set up your custom domain for your portfolio website.

## **Current Setup**
- **Frontend**: Ready for Netlify deployment
- **Backend**: Deployed on Fly.io (`https://rahul-portfolio-backend.fly.dev`)
- **Custom Domain**: Your purchased domain

## **Option 1: Netlify + Custom Domain (Recommended)**

### **Step 1: Deploy to Netlify**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Drag and drop your `frontend/dist` folder
3. Or connect your GitHub repository for automatic deployments

### **Step 2: Add Custom Domain**
1. In Netlify Dashboard → Your site → Domain settings
2. Click "Add custom domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions

### **Step 3: Configure DNS**
Netlify will provide you with DNS records to add to your domain registrar:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

## **Option 2: Custom API Domain (Optional)**

### **Step 1: Set up API Subdomain**
If you want a custom API domain (e.g., `api.yourdomain.com`):

1. **Go to Fly.io Dashboard**
2. **Add custom domain** for your backend app
3. **Update frontend configuration**:

```bash
# Create .env file in frontend directory
VITE_API_BASE_URL=https://api.yourdomain.com
```

### **Step 2: Update DNS for API**
Add this DNS record to your domain registrar:
```
Type: CNAME
Name: api
Value: rahul-portfolio-backend.fly.dev
```

## **Option 3: Single Domain Setup**

### **Step 1: Configure Netlify Redirects**
Create `frontend/public/_redirects` file:
```
# Redirect API calls to Fly.io backend
/api/* https://rahul-portfolio-backend.fly.dev/api/:splat 200

# Handle client-side routing
/*    /index.html   200
```

### **Step 2: Update Frontend Config**
Set environment variable:
```bash
VITE_API_BASE_URL=https://yourdomain.com
```

## **Environment Variables**

Create `.env` file in `frontend/` directory:
```env
# For custom domain setup
VITE_CUSTOM_DOMAIN=yourdomain.com
VITE_API_BASE_URL=https://api.yourdomain.com

# Or for single domain setup
VITE_API_BASE_URL=https://yourdomain.com
```

## **DNS Configuration Examples**

### **For Netlify + Separate API Domain:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: CNAME
Name: api
Value: rahul-portfolio-backend.fly.dev
```

### **For Single Domain with Redirects:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

## **Testing Your Setup**

1. **Deploy frontend to Netlify**
2. **Add custom domain**
3. **Configure DNS records**
4. **Wait for DNS propagation** (up to 48 hours)
5. **Test your portfolio** at your custom domain
6. **Test admin panel** at `yourdomain.com/admin`

## **Troubleshooting**

### **Common Issues:**
- **DNS not propagated**: Wait up to 48 hours
- **SSL certificate issues**: Netlify handles this automatically
- **API not working**: Check CNAME records for API subdomain
- **Admin panel not loading**: Verify API base URL configuration

### **Useful Commands:**
```bash
# Check DNS propagation
nslookup yourdomain.com

# Test API connectivity
curl https://api.yourdomain.com/api/hero

# Build frontend for deployment
cd frontend && npm run build
```

## **Security Considerations**

- **HTTPS**: Netlify provides free SSL certificates
- **API Security**: Your Fly.io backend is already secured
- **Admin Access**: Use strong passwords for admin panel

## **Next Steps**

1. Choose your preferred setup option
2. Deploy frontend to Netlify
3. Configure your custom domain
4. Update DNS records
5. Test everything works
6. Update placeholder content through admin panel

Your portfolio will be live at your custom domain! 🚀 