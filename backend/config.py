import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Database Configuration
    database_url: str = "sqlite:////data/portfolio.db"
    
    # Security Configuration
    secret_key: str = Field(default="", description="Secret key for JWT tokens")
    access_token_expire_minutes: int = 30
    
    # Admin Configuration
    admin_username: str = Field(default="admin", description="Admin username")
    admin_password: str = Field(default="", description="Admin password")
    
    # Environment Configuration
    environment: str = "development"
    
    # CORS Configuration - Use string to avoid JSON parsing issues
    allowed_origins_str: str = Field(
        default="http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:3000,https://rahulr4j.netlify.app,https://itsrahulraj.com,https://*.netlify.app,https://*.vercel.app",
        alias="ALLOWED_ORIGINS"
    )
    
    # File Upload Configuration
    upload_dir: str = "uploads"
    max_file_size: int = 5242880  # 5MB in bytes
    
    # Development Configuration
    debug: bool = True
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def allowed_origins(self) -> List[str]:
        """Convert CORS string to list."""
        return [origin.strip() for origin in self.allowed_origins_str.split(",") if origin.strip()]

# Global settings instance
settings = Settings()

# Override with environment variables if they exist
env_secret_key = os.getenv("SECRET_KEY")
if env_secret_key:
    settings.secret_key = env_secret_key

env_database_url = os.getenv("DATABASE_URL")
if env_database_url:
    settings.database_url = env_database_url

env_debug = os.getenv("DEBUG")
if env_debug:
    settings.debug = env_debug.lower() == "true"

env_log_level = os.getenv("LOG_LEVEL")
if env_log_level:
    settings.log_level = env_log_level

env_cors_origins = os.getenv("ALLOWED_ORIGINS")
if env_cors_origins:
    settings.allowed_origins_str = env_cors_origins 