import React, { Component } from 'react';
import BasicDataList from './table/BasicDataList';

export class Sales extends Component {
    displayName = Sales.name

    render() {
        return (
            <BasicDataList
                columns={[["customer", "text"], ["product", "text"], ["store", "text"], ["dateSold", "date"]]}
                controller={"Sales"}
                dataName={"sale"}
                columnHasOptions={true}
            />
        );
    }
}
