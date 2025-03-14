from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/fruits")
async def get_fruits():
    return {"apple": "2 calories"}