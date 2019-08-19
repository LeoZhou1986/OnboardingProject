import React, { Component } from 'react';
import BasicDataList from './table/BasicDataList';

export class Products extends Component {
    displayName = Products.name

    render() {
        return (
            <BasicDataList
                columns={[["name", "text"], ["price", "text"]]}
                controller={"Products"}
                dataName={"product"}
                columnHasOptions={false}
            />
        );
    }
}
