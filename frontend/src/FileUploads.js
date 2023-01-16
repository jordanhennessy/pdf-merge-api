import React, {Component} from "react";
import SortableList from "./SortableList";
import {arrayMoveImmutable} from "array-move";

export default class FileUploads extends Component {

    constructor(props) {
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            selectedFiles: null
        }
    }

    onFileChange(e) {
        this.setState({selectedFiles: e.target.files})
    }

    onSortEnd({oldIndex, newIndex}) {
        this.setState(({selectedFiles}) => ({
            selectedFiles: arrayMoveImmutable(selectedFiles, oldIndex, newIndex),
        }))
    }

    async onSubmit(e) {
        e.preventDefault();

        let formData = new FormData();
        for (const key of Object.keys(this.state.selectedFiles)) {
            formData.append("files", this.state.selectedFiles[key])
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

    render() {
        return (
            <div className="container">
                <div className="row">
                    <form onSubmit={this.onSubmit}>
                        <h3>PDF Merger</h3>
                        <div className="form-group">
                            <input type="file" name="selectedFiles" onChange={this.onFileChange} multiple/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">Upload</button>
                        </div>
                    </form>
                    <div className="container">
                        {(this.state.selectedFiles) ? <SortableList items={this.state.selectedFiles} onSortEnd={this.onSortEnd}/> : ""}
                    </div>
                </div>
            </div>
        )
    }
}