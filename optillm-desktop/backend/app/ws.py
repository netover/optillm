import socketio

# Create an asynchronous Socket.IO server.
# CORS is not needed as the frontend will be served from the same origin.
sio = socketio.AsyncServer(async_mode="asgi")

# This creates a Socket.IO application that can be mounted by a parent ASGI app
sio_app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ):
    """Handle new client connections."""
    print(f"Socket.IO client connected: {sid}")

@sio.event
async def disconnect(sid):
    """Handle client disconnections."""
    print(f"Socket.IO client disconnected: {sid}")

async def broadcast_config_update(update_data: dict):
    """
    Broadcasts a configuration update to all connected clients.
    This function will be called from the REST API endpoint.
    """
    await sio.emit('config_updated', data=update_data)
    print(f"Broadcasted config update: {update_data}")
