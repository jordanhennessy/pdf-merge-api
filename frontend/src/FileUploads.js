import React, {useState} from "react";
import {arrayMoveImmutable} from "array-move";
import {SortableContainer, SortableElement} from "react-sortable-hoc";

export default function FileUploads() {

    let filesSelected = null;

    const setFilesSelected = (arg) => {
        filesSelected = arg;
    }

    const onFileChange = (e) => {
        setFilesSelected(e.target.files);
        console.log(filesSelected);
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

    const SortableItem = SortableElement(({ value, index }) => (
        <div className="list-card">
            <div className="file-name">{value}</div>
        </div>
    ))

    const SortableList = SortableContainer(({ files }) => {
        return (
            <div className="list">
                {console.log("list being called")}
                {console.log(filesSelected)}
                {Array.from(filesSelected).map((file, index) => (
                    <SortableItem value={file.filename} index={index} key={`item-${index}`}/>
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
                    {filesSelected ? <SortableList items={filesSelected} onSortEnd={onSortEnd}/> : ""}
                </div>
            </div>
        </div>
    )
}
