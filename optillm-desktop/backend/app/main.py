from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from .api import router as api_router
from .ws import sio_app

# Create the main FastAPI instance
app = FastAPI(title="OptiLLM Configurator")

# Include the REST API routes, which will be available under /api
app.include_router(api_router, prefix="/api")

# Mount the Socket.IO application. It will handle all requests to /socket.io/
app.mount('/socket.io', sio_app)

# The static files for the frontend will be built into `backend/app/static`.
# We need to define the path to this directory.
# This assumes the server is run from the `backend` directory.
static_files_path = os.path.join(os.path.dirname(__file__), "static")

# Mount the static files directory to serve the React frontend.
# This should be the last mount, as it catches all other paths.
# The `html=True` argument redirects any 404s to index.html,
# which is essential for client-side routing in SPAs.
app.mount("/", StaticFiles(directory=static_files_path, html=True), name="static")
