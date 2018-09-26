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
            clientId:0
        }

        this.getSellers = this.getSellers.bind(this);
        this.cancel = this.cancel.bind(this);
        this.sellerIdPopup = this.sellerIdPopup.bind(this);
        this.sellerIdSubmit = this.sellerIdSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteSeller = this.deleteSeller.bind(this);
    }
    handleChange(ele) {
        const { name, value } = ele.target;
        this.setState({ [name]: value });
    }
    componentWillMount() {
        this.getSellers();
    }

    sellerIdPopup(sellerId,clientId) {
        this.setState({ sellerIdPopup: true, selectedSellerId: sellerId,clientId });
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
        api
            .get(`DeleteSeller?clientId=` + this.state.clientId)
            .then((res) => {
                that.setState({ isLoading: false });
                that.cancel();
                if (res.data.IsSuccess) {
                    showToastMessage("Seller deleted succesfully.", "Success");
                    that.getSellers();
                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
            })
            .catch(function (error) {
                showToastMessage("!Unknown Issue", "Error");
                that.setState({ isLoading: false });
            });
    }

    getSellers() {
        const that = this;
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

    render() {
        const { data, isLoading, sellerIdPopup, confirmPopup } = this.state;

        const { authToken, userInfo } = this.props
        if (userInfo == null || !authToken) {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
            )

        } else if (userInfo.Role !== "Admin") {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/dash/dashboards`} />
            )
        }

        return (
            <React.Fragment>
                <Toaster />
                <div className="dash-container">
                    <div className="container container--full">
                        <div className={isLoading ? "panel panel-dark loader-inside" : "panel panel-dark loader-inside loading-over"}>
                            <FormLoader />
                            <div className="panel-heading">
                                <h3 className="panel-title">Sellers</h3>
                            </div>
                            <div className="panel-body">

                                <div className="row">
                                    <ReactTable
                                        key="1"
                                        data={data}
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
                                                accessor: d => (<button onClick={() => this.sellerIdPopup(d.SellerId,d.ClientId)}><SvgIcon name="garbage"></SvgIcon></button>)
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
                <Modal open={sellerIdPopup} onClose={this.cancel} showCloseIcon={false
                }>
                    <div className={" modal-dialog modal-md loader-inside loading-over"}>
                        <div className="modal-content modal-content-seller">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Delete Seller</h4>
                            </div>
                            <div className="modal-body modal-body-update modal-body-sellerdelete">
                                <div className="upload-discription">
                                    <input type="text" placeholder="seller Id" className="form-control" name="sellerId" id="sellerId" onChange={this.handleChange}></input>
                                </div>
                                <div className="upload-btn mt-20">
                                    <a className="btn btn-new-marketplace" onClick={this.sellerIdSubmit}>Submit</a>
                                    <a className="btn btn-new-marketplace btn-new-marketplace-blank" onClick={this.cancel}>Cancel</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal open={confirmPopup} onClose={this.cancel}>
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
                                    <a className="btn btn-new-marketplace" onClick={this.deleteSeller}>Yes</a>
                                    <a className="btn btn-new-marketplace btn-new-marketplace-blank" onClick={this.cancel}>No</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment >
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent)

