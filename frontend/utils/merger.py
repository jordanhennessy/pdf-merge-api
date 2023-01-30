from PyPDF2 import PdfReader, PdfMerger
from fastapi import UploadFile
from typing import List
from os import path, mkdir, remove
import uuid

file_dir = "/tmp/files"


async def merge(files: List[UploadFile]) -> str:
    merger = PdfMerger()
    result_filename = f"{uuid.uuid1()}.pdf"
    temp_files = []

    if not path.exists(file_dir):
        mkdir(file_dir)

    await save_temp_files(files)

    for file in files:
        merger.append(PdfReader(f"{file_dir}/{file.filename}"))
        temp_files.append(file.filename)

    await cleanup(temp_files)

    result_path = f"{file_dir}/{result_filename}"
    merger.write(result_path)
    return result_path


def merge_by_name(filenames: List[str]) -> str:
    merger = PdfMerger()
    result_filename = f"{uuid.uuid1()}.pdf"
    temp_files = []

    for filename in filenames:
        merger.append(PdfReader(f"{file_dir}/{filename}"))
        temp_files.append(filename)

    result_path = f"{file_dir}/{result_filename}"
    merger.write(result_path)
    return result_path


async def save_temp_files(files: List[UploadFile]):
    for file in files:
        with open(f"{file_dir}/{file.filename}", "wb+") as temp_file:
            temp_file.write(file.file.read())


async def cleanup(files: List[str]):
    for file in files:
        remove(f"{file_dir}/{file}")