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
            newData: {}
        };
    }

    handleCloseModal = () => {
        this.setState({ newData: {} });
        this.props.handleCloseModal();
    }

    handleConfirmDelete = () => {
        this.props.deleteData(this.props.modalData)
    }

    handleConfirmEdit = () => {
        var newData = Object.assign({}, this.props.modalData, this.state.newData);
        this.setState({ newData: {} });
        this.props.editData(newData);
    }

    handleConfirmCreate = () => {
        var newData = Object.assign({}, this.props.modalData, this.state.newData);
        this.setState({ newData: {} });
        this.props.createData(Object.assign({}, this.props.modalData, newData));
    }

    handleInputValueChange = (e) => {
        this.setState({ newData: Object.assign(this.state.newData, { [e.target.name]: e.target.value}) });
    }

    handleSelectValueChange = (e, data) => {
        this.setState({
            newData: Object.assign(
                this.state.newData,
                { [this.props.options[data.name + "Key"]]: data.value }
            )
        });
    }

    handleDateChange = (event, { name, value }) => {
        this.setState({ newData: Object.assign(this.state.newData, { [name]: value }) });
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
                        const currentData = Object.assign({}, this.props.modalData, this.state.newData)
                        const formField = this.getFormField(name, dataType, currentData, this.props.options);
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