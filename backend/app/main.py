"""Lookcha AI - FastAPI application entrypoint.

Stage 1: app factory, CORS, static uploads mount, and /health.
Additional routers (products, tryon, recommendations, merchant, leads,
orders) are mounted in later stages.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import (
    health,
    leads,
    merchant,
    orders,
    products,
    recommendations,
    tryon,
)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="AI try-on integration platform for fashion marketplaces.",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Ensure storage dirs exist, then serve uploaded files at /uploads
    settings.uploads_path.mkdir(parents=True, exist_ok=True)
    settings.data_path.mkdir(parents=True, exist_ok=True)
    app.mount(
        "/uploads",
        StaticFiles(directory=str(settings.uploads_path)),
        name="uploads",
    )

    # Routers
    app.include_router(health.router)
    app.include_router(products.router)
    app.include_router(tryon.router)
    app.include_router(recommendations.router)
    app.include_router(merchant.router)
    app.include_router(leads.router)
    app.include_router(orders.router)

    @app.get("/", tags=["system"])
    async def root() -> dict:
        return {"service": settings.app_name, "docs": "/docs", "health": "/health"}

    return app


app = create_app()
