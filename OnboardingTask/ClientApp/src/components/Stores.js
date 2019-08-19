import React, { Component } from 'react';
import BasicDataList from './table/BasicDataList';

export class Stores extends Component {
    displayName = Stores.name

    render() {
        return (
            <BasicDataList
                columns={[["name", "text"], ["address", "text"]]}
                controller={"Stores"}
                dataName={"store"}
                columnHasOptions={false}
            />
        );
    }
}
