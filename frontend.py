import os
import streamlit as st
import requests as r
from st_draggable_list import DraggableList

URL = "http://localhost:8000/merge"
working_dir = os.getcwd()


def send_request(pdfs):
    data = []
    for pdf in pdfs:
        path = working_dir + "/" + pdf
        if os.path.exists(path):
            data.append(("files", open(path, "rb")))
    response = r.post(URL, files=data)
    with open("result.pdf", "wb") as result:
        for chunk in response.iter_content(chunk_size=8192):
            result.write(chunk)
    result_path = working_dir + "/result.pdf"
    with open(result_path, "rb") as result:
        st.download_button("Download merged file", data=result, file_name="merged.pdf", mime="application/pdf",
                           on_click=cleanup)


def callback():
    names = []
    if len(drag_list) > 0:
        for element in drag_list:
            names.append(element["name"])
    send_request(names)


def cleanup():
    entries = os.listdir(working_dir)
    for entry in entries:
        print(entry)
        if entry.endswith(".pdf"):
            os.remove(os.path.join(working_dir, entry))
            print(f"removed: {entry}")


def create_draggable_list(names):
    data = []

    for name in names:
        data.append({"id": name, "order": len(data) + 1, "name": name})

    return DraggableList(data)


st.title("PDF Merger")
st.write("Files will be merged in the order shown below the merge button")
st.write("Drag and drop filenames to re-order")
st.markdown("---")

files = st.file_uploader("Select files for upload", type="pdf", accept_multiple_files=True)

if len(files) > 0:
    for file in files:
        if not os.path.exists(working_dir + "/" + file.name):
            with open(file.name, "wb") as f:
                f.write(file.getbuffer())
    st.button("Merge", on_click=callback)
    drag_list = create_draggable_list([file.name for file in files])
