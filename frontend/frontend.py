import uuid
from os import path, mkdir, remove, listdir
import streamlit as st
from st_draggable_list import DraggableList
from utils import merger

file_dir = "/tmp/files"


def callback():
    filenames = listdir(file_dir)
    result_path = merger.merge_by_name(filenames)
    with open(result_path, "rb") as result:
        st.download_button("Download merged file", data=result, mime="application/pdf", on_click=cleanup,
                           file_name=f"{str(uuid.uuid1())}.pdf")


def cleanup():
    for name in listdir(file_dir):
        remove(f"{file_dir}/{name}")
    st.session_state["upload"] = False


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
    if "upload" not in st.session_state:
        st.session_state["upload"] = False
    if st.button("Upload"):
        st.session_state["upload"] = not st.session_state["upload"]
    if st.session_state["upload"]:
        if not path.exists(file_dir):
            mkdir(file_dir)
        for file in files:
            with open(f"{file_dir}/{file.name}", "wb") as f:
                f.write(file.getbuffer())
        st.button("Merge", on_click=callback)
        create_draggable_list([file.name for file in files])
