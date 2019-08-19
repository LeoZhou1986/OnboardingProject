import React, { Component } from 'react';
import BasicDataList from './table/BasicDataList';

export class Customers extends Component {
    displayName = Customers.name

    render() {
        return (
            <BasicDataList
                columns={[["name", "text"], ["address", "text"]]}
                controller={"Customers"}
                dataName={"customer"}
                columnHasOptions={false}
            />
        );
    }
}
