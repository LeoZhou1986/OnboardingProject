import React, { Component } from "react";
import { Button, Icon, Modal, Form } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react';
import Moment from 'moment';

export default class BasicModal extends Component {
    displayName = BasicModal.name
    constructor(props) {
        super(props);
        this.state = {
            modalType: 'Delete',    // Delete, Edit, Create, Message?
            loading: false,
            options: null,
            newData: null
        };
    }

    handleCloseModal = () => {
        this.props.handleCloseModal();
    }

    handleConfirmDelete = () => {
        this.props.deleteData(this.props.modalData)
    }

    handleConfirmEdit = () => {
        this.props.editData(this.state.newData);
    }

    handleConfirmCreate = () => {
        this.props.createData(this.state.newData);
    }

    handleInputValueChange = (e) => {
        var newData = {};
        newData[e.target.name] = e.target.value;
        this.setState({ newData: Object.assign({}, this.state.newData, newData) });
    }

    handleSelectValueChange = (e, data) => {
        var newData = {};
        newData[this.props.options[data.name + "Key"]] = data.value;
        newData[data.name] = data.text;
        newData = Object.assign(this.state.newData, newData)
        this.setState({ newData: newData });
    }

    handleDateChange = (event, { name, value }) => {
        var newData = Object.assign(this.state.newData, { [name]: value })
        this.setState({ newData: newData });
    }

    getFormField = (name, dataType, data, options) => {
        var formField;
        switch (dataType) {
            case "text":
                if (options !== null && options[name] !== undefined) {
                    formField =
                        <Form.Select
                        key={name}
                        name={name}
                        label={name.charAt(0).toUpperCase() + name.slice(1)}
                        options={options[name]}
                        placeholder={(data !== undefined && data[name] !== undefined) ? data[name] : ""}
                        onChange={this.handleSelectValueChange.bind(this)}
                        />
                } else {
                    formField =
                        <Form.Input
                        key={name}
                        name={name}
                        label={name.charAt(0).toUpperCase() + name.slice(1)}
                        type="text"
                        defaultValue={(data !== undefined && data[name] !== undefined) ? data[name] : ""}
                        onChange={this.handleInputValueChange.bind(this)}
                        />
                }
                break;
            case "date":
                
                formField =
                    <DateInput
                    key={name}
                    name={name}
                    value={(data !== undefined && data[name] !== undefined) ? Moment(data[name]).format('MM/DD/YYYY') : ""}
                    iconPosition="left"
                    dateFormat="MM/DD/YYYY"
                    onChange={this.handleDateChange}
                    />
                break;
            default:
                break
        }
        return formField;
    }

    render() {
        let modalHeader, modalContent, actionButton;
        let modalType = this.props.modalType;

        if (this.props.open) {
            if (this.state.newData === null) {
                this.state.newData = Object.assign({}, this.props.modalData)
            }
            switch (modalType) {
                case "Delete":
                    modalHeader = modalType + " " + this.props.dataName;
                    modalContent = <p>Are you sure?</p>
                    actionButton =
                        <Button
                            negative
                            icon labelPosition='right'
                            onClick={this.handleConfirmDelete}
                        >
                            delete
                            <Icon name='delete' />
                        </Button>
                    break;
                case "Edit":
                case "Create":
                    modalHeader = modalType + " " + this.props.dataName;
                    let formFields = [];
                    let columns = this.props.columns;
                    for (let i = 0; i < columns.length; i++) {
                        const name = columns[i][0];
                        const dataType = columns[i][1];
                        const formField = this.getFormField(name, dataType, this.state.newData, this.props.options);
                        if (formField !== undefined) formFields.push(formField);
                    }
                    modalContent =
                        <Form loading={this.props.loading}>
                            {formFields}
                        </Form>
                    actionButton =
                        <Button
                            positive
                            icon labelPosition='right'
                            onClick={modalType === "Edit" ? this.handleConfirmEdit : this.handleConfirmCreate}
                        >
                            {modalType === "Edit"?"edit":"create"}
                            <Icon name='check' />
                        </Button>
                    break;
                default:
                    break;
            }
        } else {
            this.state.newData = null;
        }

        return (
            <Modal size='tiny' open={this.props.open} onClose={this.handleCloseModal}>
                <Modal.Header> {modalHeader} </Modal.Header>
                <Modal.Content> {modalContent} </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={this.handleCloseModal}>
                        cancel
                    </Button>
                    {actionButton}
                </Modal.Actions>
            </Modal>
        );
    }
}