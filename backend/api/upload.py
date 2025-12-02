import os
import uuid
from pathlib import Path
from typing import List
from fastapi import UploadFile, HTTPException, status
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io

# Configuration
UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGE_DIMENSIONS = (1920, 1080)  # Max width x height

# Create upload directory if it doesn't exist
UPLOAD_DIR.mkdir(exist_ok=True)

def validate_image_file(filename: str, content: bytes) -> bool:
    """Validate uploaded image file by extension and size"""
    # Check file extension
    file_extension = Path(filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    return True

def process_image(image_data: bytes, filename: str) -> str:
    """Process and save image with optimization"""
    try:
        # Open image with PIL
        image = Image.open(io.BytesIO(image_data))
        # Convert to RGB if necessary
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        # Resize if too large
        if image.size[0] > MAX_IMAGE_DIMENSIONS[0] or image.size[1] > MAX_IMAGE_DIMENSIONS[1]:
            # Use LANCZOS resampling, fallback if needed
            resample = getattr(Image, 'Resampling', Image).__dict__.get('LANCZOS', Image.LANCZOS)
            image.thumbnail(MAX_IMAGE_DIMENSIONS, resample)
        # Generate unique filename
        file_extension = Path(filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        # Save optimized image
        image.save(file_path, quality=85, optimize=True)
        return f"/uploads/{unique_filename}"
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )

async def upload_image(file: UploadFile) -> str:
    """Upload and process a single image"""
    # Read file content
    content = await file.read()
    # Validate file (extension and size)
    validate_image_file(file.filename, content)
    # Process and save image
    file_url = process_image(content, file.filename)
    return file_url

async def upload_multiple_images(files: List[UploadFile]) -> List[str]:
    """Upload and process multiple images"""
    uploaded_urls = []
    for file in files:
        try:
            url = await upload_image(file)
            uploaded_urls.append(url)
        except HTTPException:
            # Skip failed uploads but continue with others
            continue
    return uploaded_urls

def delete_image(image_url: str) -> bool:
    """Delete an uploaded image"""
    try:
        # Extract filename from URL
        filename = Path(image_url).name
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False
    except Exception:
        return False

def get_image_info(image_url: str) -> dict:
    """Get information about an uploaded image"""
    try:
        filename = Path(image_url).name
        file_path = UPLOAD_DIR / filename
        if not file_path.exists():
            return None
        # Get file stats
        stat = file_path.stat()
        # Get image dimensions
        with Image.open(file_path) as img:
            width, height = img.size
        return {
            "filename": filename,
            "url": image_url,
            "size": stat.st_size,
            "width": width,
            "height": height,
            "created": stat.st_ctime
        }
    except Exception:
        return None 