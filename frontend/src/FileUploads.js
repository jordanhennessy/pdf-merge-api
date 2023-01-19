import React, {useState} from "react";

export default function FileUploads() {

    const [filesSelected, setFilesSelected] = useState(null);

    const onFileChange = (e) => {
        setFilesSelected(e.target.files);
        console.log(filesSelected);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        for (const key of Object.keys(filesSelected)) {
            formData.append("files", filesSelected[key])
        }

        await fetch("/merge", {
            method: "POST",
            body: formData
        }).then(result => result.blob())
            .then(blob => {
                let file = window.URL.createObjectURL(blob);
                window.location.assign(file)
            })
    }

    const removeFile = (index) => {
        let updatedFiles = [...filesSelected].filter((val, i) => i !== index );
        setFilesSelected(updatedFiles);
    }



    return (
        <div className="container">
            <div className="row">
                <form onSubmit={onSubmit}>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                            <div className="container-fluid">
                                <a className="navbar-brand" href="/">PDF Merger</a>
                            </div>
                        </nav>
                    </div>
                    <div className="form-group">
                        <input className="btn btn-outline-primary" type="file" name="selectedFiles" onChange={onFileChange} multiple/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-outline-primary" type="submit">Upload</button>
                    </div>
                </form>
                <div className="py-4">
                    <table className="table border shadow">
                        <thead>
                        <tr>
                            <th scope="col">File name</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (filesSelected) ?
                            (Array.from(filesSelected).map((file, index) => (
                                <tr key={index}>
                                    <td>{file.name}</td>
                                    <td>
                                        <button className="btn btn-outline-danger mx-2" onClick={() => removeFile(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                            ): null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
