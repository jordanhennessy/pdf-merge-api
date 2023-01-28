from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from typing import List
from utils import merger

app = FastAPI()


@app.get("/status")
def getStatus():
    return "OK"


@app.post("/merge")
async def merge(files: List[UploadFile] = File(...)):
    result_path = await merger.merge(files)
    return FileResponse(result_path)


