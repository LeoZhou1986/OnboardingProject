import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import BasicTable from './BasicTable';
import BasicModal from './BasicModal'

const queryParams = ['tableSize', 'sortColumn', 'asc', 'currentPage'];

const tableSizeOptions = [
    { key: '0', value: '10', text: '10' },
    { key: '1', value: '25', text: '25' },
    { key: '2', value: '50', text: '50' },
    { key: '3', value: '100', text: '100' }
];

export default class BasicDataList extends Component {
    displayName = BasicDataList.name
    constructor(props) {
        super(props);
        this.state = {
            tableSize: tableSizeOptions[0].value,
            sortColumn: 'id',
            asc: false,
            currentPage: 1,
            totalPages: 1,
            rowData: [],

            open: false,
            modalType: 'Delete',
            modalData: null,
            loading: false,
            options: null
        };
    }

    componentDidMount() {
        this.loadData({});
    }

    showModal = (modalType, modalData) => {
        switch (modalType) {
            case "Create":
                this.setState({
                    modalType: modalType,
                    open: true,
                    loading: this.props.columnHasOptions,
                    modalData: null,
                    options: null
                })
                if (this.props.columnHasOptions) this.loadFieldOptions();
                //console.log(`columnHasOptions: ${this.props.columnHasOptions}`);
                break;
            case "Delete":
                this.setState({ modalType: modalType, open: true, modalData: modalData })
                break;
            case "Edit":
                this.setState({
                    modalType: modalType,
                    open: true,
                    loading: this.props.columnHasOptions,
                    modalData: modalData,
                    options: null
                })
                if (this.props.columnHasOptions) this.loadFieldOptions();
                break;
            default:
                break;
        }
    }

    handleEditDataRequest = data => this.showModal("Edit", data)

    handleDeleteDataRequest = data => this.showModal("Delete", data)

    handleCloseModal = () => this.setState({ open: false })

    handleSort = clickedColumn => {
        const { sortColumn, asc } = this.state;
        let newOrder = sortColumn !== clickedColumn ? true : !asc;
        this.loadData({
            sortColumn: clickedColumn,
            asc: newOrder,
            page: 1
        });
    };

    handleChangeTableSize = (event, data) => {
        this.loadData({ tableSize: data.value, currentPage: 1 });
    };

    handleChangePage = (event, data) => {
        const { activePage } = data;
        if (activePage !== this.state.currentPage) {
            this.loadData({ currentPage: activePage });
        }
    };

    createData = newData => {
        this.setState({ open: false })
        var request = {}
        var postData;
        if (this.state.options !== null && this.state.options.dataFormat !== undefined) {
            let dataFormat = this.state.options.dataFormat;
            postData = {};
            for (let i = 0; i < dataFormat.length; i++) {
                const key = dataFormat[i];
                postData[key] = newData[key];
            }
        } else {
            postData = newData;
        }
        request.tableFormat = this.getTableFormat();
        request[this.props.dataName] = postData;
        fetch(`api/${this.props.controller}/Create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(response => this.handleResponse(response))
    };

    editData = newData => {
        this.setState({ open: false })
        var request = {};
        //console.log(`editData: ${JSON.stringify(newData)}`);
        //console.log(`options: ${JSON.stringify(this.state.options)}`);
        var postData;
        if (this.state.options !== null && this.state.options.dataFormat !== undefined) {
            let dataFormat = this.state.options.dataFormat;
            postData = {};
            //console.log(`dataFormat: ${JSON.stringify(dataFormat)}`);
            for (let i = 0; i < dataFormat.length; i++) {
                const key = dataFormat[i];
                postData[key] = newData[key];
            }
        } else {
            postData = newData;
        }
        
        request.tableFormat = this.getTableFormat();
        request[this.props.dataName] = postData;
        //console.log(`request: ${JSON.stringify(request)}`);
        fetch(`api/${this.props.controller}/Edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(response => this.handleResponse(response))
    };

    deleteData = data => {
        this.setState({ open: false })
        fetch(`api/${this.props.controller}/Delete/${data.id}?${this.getQuery(this.state)}`)
            .then(response => this.handleResponse(response))
    };

    loadData = params => {
        const newState = Object.assign({}, this.state, params);
        fetch(`api/${this.props.controller}/Index?${this.getQuery(newState)}`)
            .then(response => this.handleResponse(response))
    };

    loadFieldOptions = () => {
        fetch(`api/${this.props.controller}/GetFieldOptions`)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.success) {
                            this.setState({
                                loading: false,
                                options: data.data
                            })
                        } else {
                            // Show error message.
                            // console.log(`Failed to load data: ${data.msg}`);
                            this.setState({ loading: false })
                        }
                    });
                } else {
                    // Show error message.
                    this.setState({ loading: false })
                }
            })
    }

    getTableFormat = () => {
        var format = {};
        for (let i = 0; i < queryParams.length; i++) {
            const param = queryParams[i]
            format[param] = this.state[param];
        }
        return format;
    }

    getQuery = state => {
        let query = "";
        var param;
        for (let i = 0; i < queryParams.length; i++) {
            param = queryParams[i]
            query = query + (query === "" ? "" : "&") + encodeURIComponent(param) + '=' + state[param];
        }
        return query
    };

    handleResponse = (response) => {
        if (response.ok) {
            response.json().then(data => {
                if (data.success) {
                    let returnData = data.data;
                    this.setState({
                        rowData: returnData.rowData,
                        totalPages: returnData.totalPages,
                        currentPage: returnData.currentPage,
                        sortColumn: returnData.sortColumn,
                        asc: returnData.asc
                    });
                } else {
                    // Show error message.
                    // console.log(`Failed to load data: ${data.msg}`);
                }
            });
        } else {
            // Show error message.
        }
    }

    render() {
        return (
            <div>
                <Button primary onClick={() => this.showModal('Create')} >
                    New { this.props.dataName.charAt(0).toUpperCase() + this.props.dataName.slice(1)}
                </Button>

                <BasicTable
                    columns={this.props.columns}

                    rowData={this.state.rowData}
                    totalPages={this.state.totalPages}
                    currentPage={this.state.currentPage}
                    sortColumn={this.state.sortColumn}
                    asc={this.state.asc}

                    tableSize={this.state.tableSize}
                    tableSizeOptions={tableSizeOptions}
                    
                    handleChangeTableSize={this.handleChangeTableSize}
                    handleChangePage={this.handleChangePage}
                    handleSort={this.handleSort}
                    handleDeleteDataRequest={this.handleDeleteDataRequest}
                    handleEditDataRequest={this.handleEditDataRequest}
                />

                <BasicModal
                    columns={this.props.columns}
                    dataName={this.props.dataName}

                    open={this.state.open}
                    modalType={this.state.modalType}
                    modalData={this.state.modalData}
                    loading={this.state.loading}
                    options={this.state.options}

                    handleCloseModal={this.handleCloseModal}
                    createData={this.createData}
                    editData={this.editData}
                    deleteData={this.deleteData}
                />
            </div>
        );
    }
}