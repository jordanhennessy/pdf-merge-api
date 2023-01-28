import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from PyPDF2 import PdfMerger
from typing import List

app = FastAPI()


@app.get("/status")
def getStatus():
    return "OK"


@app.post("/merge")
def merge(files: List[UploadFile] = File(...)):
    for file in files:
        with open(f"{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    files_for_merging = [file.filename for file in files]
    mergePdfs(files_for_merging)
    [os.remove(file) for file in files_for_merging]
    return FileResponse("../merged.pdf", filename="merged.pdf")


def mergePdfs(pdfs):
    merger = PdfMerger()
    [merger.append(pdf) for pdf in pdfs]
    with open("../merged.pdf", "wb") as result:
        merger.write(result)

