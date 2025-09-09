import yaml
import sys
from pathlib import Path

# This logic ensures that the path to the config file is correct,
# whether the app is running as a script or as a frozen .exe file.
if getattr(sys, 'frozen', False):
    # In a PyInstaller bundle, the base path is the directory of the executable
    CONFIG_FILE_PATH = Path(sys.executable).parent / "config" / "config.yaml"
else:
    # In development, calculate path relative to this file's location
    # backend/app/config_manager.py -> go up 3 levels to project root
    # Then go into config/config.yaml
    CONFIG_FILE_PATH = Path(__file__).resolve().parent.parent.parent / "config" / "config.yaml"

def load_config() -> dict:
    """Loads the configuration from the config file."""
    try:
        with open(CONFIG_FILE_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"Warning: Configuration file not found at {CONFIG_FILE_PATH}")
        return {}

def save_config(config_data: dict):
    """Saves the full configuration object to the config file."""
    try:
        CONFIG_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_FILE_PATH, "w", encoding="utf-8") as f:
            yaml.safe_dump(config_data, f, default_flow_style=False, sort_keys=False, indent=2)
    except Exception as e:
        print(f"Error saving configuration: {e}")

def _deep_update(source: dict, overrides: dict) -> dict:
    """Recursively update a dictionary."""
    for key, value in overrides.items():
        if isinstance(value, dict) and key in source and isinstance(source[key], dict):
            source[key] = _deep_update(source[key], value)
        else:
            source[key] = value
    return source

def update_config(partial_update: dict) -> dict:
    """
    Loads the current config, updates it with new values, and saves it back.
    Returns the fully updated configuration.
    """
    current_config = load_config()
    if not current_config: # Handle case where file doesn't exist yet
        current_config = {}
    updated_config = _deep_update(current_config, partial_update)
    save_config(updated_config)
    return updated_config
