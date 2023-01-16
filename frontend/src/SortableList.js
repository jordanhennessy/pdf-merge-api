import React from "react";
import SortableItem from "./SortableItem";
import {SortableContainer} from "react-sortable-hoc";

const SortableList = (props) => {
    return (
        <ul>
            {props.items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value}/>
            ))}
        </ul>
    );
}

export default SortableContainer(SortableList);