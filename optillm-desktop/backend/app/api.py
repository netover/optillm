from fastapi import APIRouter, Body
from typing import Dict, Any

from . import config_manager
from .ws import broadcast_config_update

router = APIRouter()

@router.get("/config", response_model=Dict[str, Any])
async def get_current_config():
    """
    Retrieves the current configuration from config.yaml.
    """
    return config_manager.load_config()

@router.post("/config", response_model=Dict[str, Any])
async def set_new_config(
    partial_update: Dict[str, Any] = Body(...)
):
    """
    Receives a partial configuration update, saves it,
    and broadcasts the change via WebSocket.
    """
    # Update the config file on disk
    updated_config = config_manager.update_config(partial_update)

    # Broadcast the entire updated configuration to all clients for state synchronization
    await broadcast_config_update(updated_config)

    # Return the full, updated configuration
    return updated_config
