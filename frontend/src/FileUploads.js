import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import 

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles]);
    }
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    for (const key of Object.keys(files)) {
      formData.append("files", files[key])
    }

    await fetch("/merge", {
      method: "POST",
      body: formData
    }).then(result => result.blob())
        .then(blob => {
          let file = window.URL.createObjectURL(blob);
          window.location.assign(file);
        })
  };

  const handleReorder = (dragIndex, hoverIndex) => {
    const draggedFile = files[dragIndex];
    setFiles(
      update(files, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedFile]
        ]
      })
    );
  };

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        <h2>Drag and drop files here</h2>
        <ul>
          {files.map((file, index) => (
            <li key={file.path}>
              <div>
                <span>{file.path}</span>
              </div>
              <div>
                <Draggable
                  index={index}
                  onDragEnd={handleReorder}
                >
                </Draggable>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {files.length > 0 && (
        <button onClick={handleUpload}>Upload files</button>
      )}
    </div>
  );
};

export default FileUpload;
