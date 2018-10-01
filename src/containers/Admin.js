import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../services/Api';
import ReactTable from "react-table";
import "react-table/react-table.css";
import FormLoader from '../components/Forms/FormLoader';
import Toaster, { showToastMessage } from '../services/toasterNotification'
import Modal from 'react-responsive-modal';
import SvgIcon from "../components/Helpers/SvgIcon"
import { SET_NAVBAR_DASHBOARD } from '../store/ActionTypes'
import { connect } from 'react-redux';

class AdminComponent extends Component {

    pageSizeOptions = [10, 25, 50, 100];
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            data: [],
            sellerId: "",
            selectedSellerId: "",
            sellerIdPopup: false,
            confirmPopup: false,
            clientId: 0,
            Intances: []
        }

        this.getSellers = this.getSellers.bind(this);
        this.cancel = this.cancel.bind(this);
        this.sellerIdPopup = this.sellerIdPopup.bind(this);
        this.sellerIdSubmit = this.sellerIdSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteSeller = this.deleteSeller.bind(this);
        this.getInstances = this.getInstances.bind(this);
        this.changeInstance = this.changeInstance.bind(this);
    }
    handleChange(ele) {
        const { name, value } = ele.target;
        this.setState({ [name]: value });
    }
    componentWillMount() {
        //if (this.props.userInfo.Role.toUpperCase() !== "ADMIN") {
        this.getInstances();
        // }
        // else {
        this.getSellers();
        // }

    }

    sellerIdPopup(sellerId, clientId) {
        this.setState({ sellerIdPopup: true, selectedSellerId: sellerId, clientId });
    }
    sellerIdSubmit() {
        if (this.state.selectedSellerId === this.state.sellerId) {
            this.setState({ sellerIdPopup: false, confirmPopup: true });
        }
        else {
            this.setState({ sellerIdPopup: false })
            showToastMessage("your sellerid not matched", "Error");
        }
    }
    cancel() {
        this.setState({ sellerIdPopup: false, confirmPopup: false, selectedSellerId: "", sellerId: "" });
    }

    deleteSeller() {
        const that = this;
        that.setState({ isLoading: true, confirmPopup: false });
        api.delete(`DeleteSeller?clientId=` + this.state.clientId)
            .then((res) => {
                that.cancel();
                if (res.data.IsSuccess) {
                    showToastMessage("Seller deleted succesfully.", "Success");
                    that.getSellers();
                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
                that.setState({ isLoading: false });
            })
            .catch(function (error) {
                showToastMessage("!Unknown Issue", "Error");
                that.setState({ isLoading: false });
                console.log(error);
            });
    }

    getSellers() {
        const that = this;
        that.setState({ isLoading: true });
        api
            .get(`GetAllSellers`)
            .then((res) => {
                that.setState({ isLoading: false });
                if (res.data.IsSuccess) {
                    that.setState({ data: res.data.AdminSellers })
                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
            })
            .catch(function (error) {
                showToastMessage("!Unknown Issue", "Error");
                that.setState({ isLoading: false });
            });
    }
    getInstances() {
        const that = this;
        that.setState({ isLoading: true });
        api
            .get(`GetClients`)
            .then((res) => {
                that.setState({ isLoading: false });
                if (res.data.IsSuccess) {
                    that.setState({ Instances: res.data.Clients })
                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
            })
            .catch(function (error) {
                showToastMessage("!Unknown Issue", "Error");
                that.setState({ isLoading: false });
            });
    }
    changeInstance(clientId, type) {
        const that = this;
        that.setState({ isLoading: true });
        api
            .get(`ChangeInstance?clientId=` + clientId)
            .then((res) => {
                that.setState({ isLoading: false });
                if (res.data.IsSuccess) {
                    if (type != 3) {
                        setTimeout(() => { window.location = window.location.origin + "/home/index"; }, 2000);
                    }
                    showToastMessage("Instance successfully switched", "Success");

                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
            })
            .catch(function (error) {
                showToastMessage("!Unknown Issue", "Error");
                that.setState({ isLoading: false });
            });
    }

    render() {
        const model = {
            data: this.state.data,
            isLoading: this.state.isLoading,
            openSellerIdPopup: this.sellerIdPopup,
            confirmPopup: this.state.confirmPopup,
            cancel: this.cancel,
            pageSizeOptions: this.pageSizeOptions,
            sellerIdSubmit: this.sellerIdSubmit,
            deleteSeller: this.deleteSeller,
            sellerIdPopup: this.state.sellerIdPopup,
            handleChange: this.handleChange
        }
        const instanceModel = {
            Instances: this.state.Instances,
            isLoading: this.state.isLoading,
            changeInstance: this.changeInstance
        }

        const { authToken, userInfo } = this.props

        if (userInfo == null || !authToken) {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
            )

        }
        if (userInfo.Role.toUpperCase() !== "ADMIN") {
            return (<Instances {...instanceModel} />)
        }
        else {
            return [<Instances {...instanceModel} />, <Admin {...model} />]
        }

    }
}
const mapStateToProps = (state) => ({
    authToken: state.login.authToken,
    navDashboard: state.header.navDashboard,
    userInfo: state.login.userInfo
})

const mapDispatchToProps = (dispatch) => ({
    setNavbarDashboard: (data) => dispatch({ type: SET_NAVBAR_DASHBOARD, payload: data })
})


const Admin = (props) => {
    return (
        <React.Fragment>
            <Toaster />
            <div className="dash-container">
                <div className="container container--full">
                    <div className={props.isLoading ? "panel panel-dark loader-inside" : "panel panel-dark loader-inside loading-over"}>
                        <FormLoader />
                        <div className="panel-heading">
                            <h3 className="panel-title">Sellers</h3>
                        </div>
                        <div className="panel-body">

                            <div className="row">
                                <ReactTable
                                    key="1"
                                    data={props.data}
                                    noDataText="No Sellers found."
                                    minRows={1}
                                    columns={[
                                        {
                                            Header: "Name",
                                            id: "Name",
                                            headerClassName: "name",
                                            className: "name",
                                            accessor: d => d.SellerName,
                                        },
                                        {
                                            Header: "Client Name",
                                            id: "ClientName",
                                            headerClassName: "clientname",
                                            className: "clientname",
                                            accessor: d => d.ClientName,
                                        },
                                        {
                                            Header: "Client Id",
                                            id: "ClientId",
                                            headerClassName: "client",
                                            className: "client",
                                            accessor: d => d.ClientId,
                                            style: { whiteSpace: 'unset' }
                                        },
                                        {
                                            Header: "Action",
                                            id: "SellerId",
                                            accessor: d => (<button onClick={() => props.openSellerIdPopup(d.SellerId, d.ClientId)}><SvgIcon name="garbage"></SvgIcon></button>)
                                        }
                                    ]}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                    nextText=">>"
                                    previousText="<<"
                                    pageSizeOptions={this.pageSizeOptions}
                                />
                            </div></div>
                    </div> </div>
            </div>
            <Modal open={props.sellerIdPopup} onClose={props.cancel} showCloseIcon={false
            }>
                <div className={" modal-dialog modal-md loader-inside loading-over"}>
                    <div className="modal-content modal-content-seller">
                        <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel">Delete Seller</h4>
                        </div>
                        <div className="modal-body modal-body-update modal-body-sellerdelete">
                            <div className="upload-discription">
                                <input type="text" placeholder="seller Id" className="form-control" name="sellerId" id="sellerId" onChange={props.handleChange}></input>
                            </div>
                            <div className="upload-btn mt-20">
                                <a className="btn btn-new-marketplace" onClick={props.sellerIdSubmit}>Submit</a>
                                <a className="btn btn-new-marketplace btn-new-marketplace-blank" onClick={props.cancel}>Cancel</a>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={props.confirmPopup} onClose={props.cancel} showCloseIcon={false
            }>
                <div className={" modal-dialog modal-md loader-inside loading-over"}>
                    <div className="modal-content modal-content-seller">
                        <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel">Delete Seller</h4>
                        </div>
                        <div className="modal-body modal-body-update modal-body-sellerdelete">
                            <div className="upload-discription">
                                <p className="head">Are you sure you want to delete this seller data?</p>
                            </div>
                            <div className="upload-btn mt-20">
                                <a className="btn btn-new-marketplace" onClick={props.deleteSeller}>Yes</a>
                                <a className="btn btn-new-marketplace btn-new-marketplace-blank" onClick={props.cancel}>No</a>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </React.Fragment >
    )
}

const Instances = (props) => {

    // let result = [];
    // if (props.Instances !=null && props.Instances.length > 0) {
    //     result = props.Instances.map((val, key) => {
    //         return (<div className="row">
    //             <div class="col-md-5">{val.Name}</div>
    //             <div class="col-md-5"><label><input type="checkbox" value="" />select</label></div></div>)

    //     })
    // }

    return (<React.Fragment>
        <Toaster />
        <div className="dash-container">
            <div className="container container--full">
                <div className={props.isLoading ? "panel panel-dark loader-inside" : "panel panel-dark loader-inside loading-over"}>
                    <FormLoader />
                    <div className="panel-heading">
                        <h3 className="panel-title">Instances</h3>
                    </div>
                    <div className="panel-body">

                        <div className="row">

                            <ReactTable
                                key="1"
                                data={props.Instances}
                                noDataText="No Instances found."
                                showPagination={false}
                                minRows={1}
                                columns={[
                                    {
                                        Header: "Name",
                                        id: "Name",
                                        headerClassName: "name",
                                        className: "name",
                                        accessor: d => d.Name,
                                    },
                                    {
                                        Header: "Action",
                                        id: "ClientId",
                                        accessor: d => (<input type="radio" onClick={() => props.changeInstance(d.ClientID, d.ClientType)}></input>)
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </React.Fragment >)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent)
