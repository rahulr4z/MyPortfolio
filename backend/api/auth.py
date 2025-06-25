from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from models.database import get_db, Contact
from config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# JWT Configuration
SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

# Admin user configuration from environment variables
def get_admin_user():
    """Get admin user configuration from environment variables."""
    return {
        "username": settings.admin_username,
        "hashed_password": pwd_context.hash(settings.admin_password) if settings.admin_password else None,
        "full_name": "Admin User",
        "email": "admin@example.com",
        "disabled": False
    }

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate user with username and password."""
    admin_user = get_admin_user()
    
    if username != admin_user["username"]:
        return None
    
    if not admin_user["hashed_password"]:
        return None
    
    if not verify_password(password, admin_user["hashed_password"]):
        return None
    
    return admin_user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Get current user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin_user = get_admin_user()
    if username != admin_user["username"]:
        raise credentials_exception
    
    return admin_user

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Get current active user."""
    if current_user.get("disabled"):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Utility function to generate new password hash
def generate_password_hash(password: str) -> str:
    """Generate a new password hash (useful for updating admin password)"""
    return pwd_context.hash(password)

# Example usage for updating admin password
def update_admin_password(new_password: str) -> str:
    """Update admin password and return new hash"""
    new_hash = generate_password_hash(new_password)
    # In production, you would save this to database
    # For now, you need to update the MOCK_USER["hashed_password"] manually
    return new_hash 