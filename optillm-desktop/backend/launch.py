import uvicorn

if __name__ == "__main__":
    # Run the Uvicorn server.
    # "app.main:app" points to the `app` object in the `app/main.py` file.
    # host="0.0.0.0" makes it accessible on the local network, not just localhost.
    # The port is 8000 as specified in the plan.
    # Reload is disabled as this is for the final packaged application.
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
