from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "NEXUS API"
    
    # CORS (Frontend URLs)
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ]

    # Email Settings (For 2FA)
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your_email@gmail.com"
    SMTP_PASSWORD: str = ""

    # AI Config
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    class Config:
        env_file = ".env"

settings = Settings()