import React, { Component } from "react";
import { Table, Button, Icon } from 'semantic-ui-react'
import Moment from 'moment';

export default class BasicTableRow extends Component {
    displayName = BasicTableRow.name

    render() {
        let columns = this.props.columns;
        let data = this.props.data;
        let cells = [];
        for (let i = 0; i < columns.length; i++) {
            const name = columns[i][0];
            const dataType = columns[i][1];
            var value;
            if (dataType === "date") {
                value = Moment(data[name]).format('DD MMM, YYYY');
            } else {
                value = data[name];
            }
            cells.push(
                <Table.Cell key={"item_" + i}>
                    { value }
                </Table.Cell >
            );
        }

        return (
            <Table.Row>
                {cells}
                <Table.Cell>
                    <Button
                        onClick={() => this.props.handleEditDataRequest(this.props.data)}
                        color={'yellow'}
                    >
                        <Icon name='edit outline' />
                        EDIT
                    </Button>
                    <Button
                        onClick={() => this.props.handleDeleteDataRequest(this.props.data) }
                        color={'red'}
                    >
                        <Icon name='trash' />
                        DELETE
                    </Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}