import React, { Component } from "react";
import { Table, Pagination } from 'semantic-ui-react'
import BasicTableHeader from './BasicTableHeader'
import BasicTableRow from './BasicTableRow'
import TableSizeSelecter from './TableSizeSelecter'

export default class BasicTable extends Component {
    displayName = BasicTable.name
    render() {
        if (!this.props.columns) return (<React.Fragment />);
        let rows = [];
        let rowData = this.props.rowData;
        for (let i = 0; i < rowData.length; i++) {
            rows.push(
                <BasicTableRow
                    key={"row" + i}
                    columns={this.props.columns}
                    data={rowData[i]}
                    handleDeleteDataRequest={this.props.handleDeleteDataRequest}
                    handleEditDataRequest={this.props.handleEditDataRequest}
                />
            );
        }
        
        return (
            <React.Fragment>
                <Table celled selectable sortable>
                    <BasicTableHeader
                        columns={this.props.columns}
                        sortColumn={this.props.sortColumn}
                        asc={this.props.asc}
                        handleSort={this.props.handleSort}
                    />

                    <Table.Body>{rows}</Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan={this.props.columns.length + 1}>
                                <TableSizeSelecter
                                    tableSizeOptions={this.props.tableSizeOptions}
                                    currentPage={this.props.currentPage}
                                    handleChangeTableSize={this.props.handleChangeTableSize}
                                />
                                <Pagination
                                    floated='right'
                                    totalPages={this.props.totalPages}
                                    activePage={this.props.currentPage}
                                    onPageChange={this.props.handleChangePage}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </React.Fragment>
        );
    }
}
