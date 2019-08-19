import React, { Component } from "react";
import { Dropdown } from 'semantic-ui-react'

export default class TableSizeSelecter extends Component {
    displayName = TableSizeSelecter.name
    render() {
        return (
            <Dropdown
                placeholder='Compact'
                compact
                selection
                options={this.props.tableSizeOptions}
                defaultValue={this.props.tableSizeOptions[0].value}
                onChange={this.props.handleChangeTableSize}
            />
        );
    }
}