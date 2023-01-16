import React, {useState} from "react";
import {arrayMoveImmutable} from "array-move";
import {SortableContainer, SortableElement} from "react-sortable-hoc";

function FileUploads() {

    const [filesSelected, setFilesSelected] = useState(null);

    const onFileChange = (e) => {
        setFilesSelected(e.target.files);
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        setFilesSelected(arrayMoveImmutable(filesSelected, oldIndex, newIndex));
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

    const SortableItem = SortableElement(({ value, index}) => (
        <div className="list-card">
            <div className="file-name">{value}</div>
        </div>
    ))

    const SortableList = SortableContainer(({ items }) => {
        return (
            <div className="list">
                {items.map((value, index) => (
                    <SortableItem value={value} index={index} key={`item-${index}`}/>
                ))}
            </div>
        )
    })


    return (
        <div className="container">
            <div className="row">
                <form onSubmit={onSubmit}>
                    <h3>PDF Merger</h3>
                    <div className="form-group">
                        <input type="file" name="selectedFiles" onChange={onFileChange} multiple/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" type="submit">Upload</button>
                    </div>
                </form>
                <div className="container">
                    {(filesSelected) ? <SortableList items={filesSelected} onSortEnd={onSortEnd} axis="xy"/> : ""}
                </div>
            </div>
        </div>
    )
}

export default FileUploads;