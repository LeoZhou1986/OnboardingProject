import React, { Component } from "react";
import { Table } from 'semantic-ui-react'

export default class BasicTableHeader extends Component {
    displayName = BasicTableHeader.name
    render() {
        let headerCells = [];
        let columns = this.props.columns;
        for (let i = 0; i < columns.length; i++) {
            const name = columns[i][0];
            headerCells.push(
                <Table.HeaderCell
                    key={name}
                    width={1}
                    sorted={this.props.sortColumn === name ? ((this.props.asc) ? "ascending" : "descending") : null}
                    onClick={() => this.props.handleSort(name)}
                >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </Table.HeaderCell >
            );
        }
        headerCells.push(
            <Table.HeaderCell key={"Action"} width={1}>
                Actions
            </Table.HeaderCell >
        );
        return (
            <Table.Header>
                <Table.Row>
                    {headerCells}
                </Table.Row>
            </Table.Header>
        );
    }
}