"""Application configuration.

Settings are loaded from environment variables (and an optional `.env` file)
via pydantic-settings. Keep this module free of business logic so it can be
imported anywhere without side effects.
"""

from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Project root = backend/  (this file lives at backend/app/config.py)
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Strongly-typed application settings."""

    # App
    app_name: str = "Lookcha AI API"
    environment: str = "development"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS: accept a comma-separated string or a list.
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Storage (relative to BASE_DIR unless an absolute path is given)
    data_dir: str = "app/data"
    uploads_dir: str = "app/storage/uploads"

    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "lookcha_ai"

    # AI try-on provider: "mock" | "nanobanana"
    ai_provider: str = "mock"
    ai_api_key: str | None = None
    ai_model: str | None = None

    # NanoBanana Pro virtual try-on
    nanobanana_api_key: str | None = None
    nanobanana_base_url: str = "https://api.nanobananaapi.ai"
    nanobanana_callback_url: str = "https://example.com/lookcha-callback"
    nanobanana_resolution: str = "2K"
    nanobanana_aspect_ratio: str = "3:4"

    # Public origin used to expose locally-saved upload URLs to external APIs
    # (e.g. ngrok / deployed backend). When empty, NanoBanana falls back to mock.
    public_base_url: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_cors(cls, value: object) -> object:
        """Allow CORS_ORIGINS to be provided as a comma-separated string."""
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def data_path(self) -> Path:
        path = Path(self.data_dir)
        return path if path.is_absolute() else BASE_DIR / path

    @property
    def uploads_path(self) -> Path:
        path = Path(self.uploads_dir)
        return path if path.is_absolute() else BASE_DIR / path


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor used as a FastAPI dependency."""
    return Settings()


settings = get_settings()
