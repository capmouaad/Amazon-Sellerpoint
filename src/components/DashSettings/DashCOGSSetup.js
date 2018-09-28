import React, { Component } from 'react';
import api, { BACKEND_URL } from '../../services/Api';
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import "react-table/react-table.css";
import Modal from 'react-responsive-modal';
import Dropzone from 'react-dropzone';
import FormLoader from '../Forms/FormLoader';
import Toaster, { showToastMessage } from '../../services/toasterNotification'
import FilterInput from '../Helpers/FilterInput'
import { GetActiveQSReload } from '../ReloadStatusBar'

export default class DashCOGSSetup extends Component {

    lstEditedCOGS = [];
    pageSizeOptions = [10, 25, 50, 100];

    constructor() {
        super();
        this.state = {
            data: [],
            open: false,
            loading: true,
            expanded: true,
            filename: '',
            popupLoading: false
        };
        this.getAllCOGS();
        this.renderLandedCost = this.renderLandedCost.bind(this);
    }

    onOpenModal = () => {
        this.setState({
            open: true
        });
    };

    onCloseModal = () => {
        this.setState({ open: false, filename: '' });
    };

    onDrop(files) {
        if (files.length > 0) {
            var data = new FormData();
            data.append("file", files[0]);
            this.setState({ filename: files[0].name, popupLoading: true });
            api
                .post(`UploadCogsData`, data)
                .then((res) => {
                    console.log('backend responce to GET UploadCogsData', res)
                    this.setState({ popupLoading: false });
                    if (res.data.IsSuccess) {
                        showToastMessage(res.data.ErrorMessage, "Success");
                        //close the popup window after updation
                        this.onCloseModal();
                        this.getAllCOGS();
                    } else {
                        this.setState({
                            apiError: res.data.ErrorMessage
                        })
                        showToastMessage(res.data.ErrorMessage, "Error");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    showToastMessage("!Unknown Issue", "Error");
                    this.setState({ popupLoading: false });
                });
        }
    }

    onDownloadFile = () => {
        this.setState({ popupLoading: true });
        api
            .get(`DownloadCogsTemplate`)
            .then((res) => {
                console.log('backend responce to GET onDownloadFile', res)
                this.setState({ popupLoading: false });
                if (res.data.IsSuccess) {
                    window.location.href = BACKEND_URL + "/Download?file=" + res.data.FileName;
                } else {
                    this.setState({
                        apiError: res.data.ErrorMessage
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                this.setState({ popupLoading: false });
            });
    }

    getAllCOGS() {
        api
            .get(`GetAllCOGS`)
            .then((res) => {
                this.setState({ loading: false });
                if (res.data.IsSuccess) {
                    this.setState({
                        data: []
                    }, () => this.setState({ data: res.data.LstCOGSTable }));
                } else {
                    this.setState({
                        apiError: res.data.ErrorMessage
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    renderLandedCost(cellInfo) {

        return (<div className="inpt-landed-cost">{["$",
            <input type={"number"} min={0.00}
                step="1.00"
                contentEditable
                key={cellInfo.original.COGSId}
                style={{ backgroundColor: "#fafafa", width: "100%", textAlign: "right" }}
                name={cellInfo.original.LandedCost}
                defaultValue={cellInfo.original.LandedCost.toFixed(2)}
                onChange={e => {

                    e.target.name = e.target.value;
                    this.lstEditedCOGS = this.lstEditedCOGS.filter((value, i) => value.COGSId !== cellInfo.original.COGSId)
                    this.lstEditedCOGS.push({ COGSId: cellInfo.original.COGSId, LandedCost: (e.target.value != null && e.target.value != "" && e.target.value >= 0 ? e.target.value : e.target.defaultValue) });
                }}
                onClick={e => {
                    e.target.value = e.target.name;
                }}
                onBlur={
                    e => {
                        e.target.value = Number(e.target.value).toFixed(2)
                    }
                }
            />]}</div>
        );
    }


    renderAvgHistoricalPrice(cellInfo) {
        if (cellInfo.original.AvgHistoricalPrice === 0) {
            return ('N/A');
        } else {
            return (['$', cellInfo.original.AvgHistoricalPrice.toFixed(2)]);
        }
    }

    saveCOGS = () => {
        this.setState({ loading: true });
        if (this.lstEditedCOGS.length > 0) {
            api
                .post(`UpdateCOGS`, this.lstEditedCOGS)
                .then((res) => {
                    console.log('backend responce to GET UpdateCOGS', res)
                    this.setState({ loading: false });
                    if (res.data.IsSuccess) {
                        showToastMessage(res.data.ErrorMessage, "Success");
                        this.getAllCOGS();

                        // call reload status bar api
                        GetActiveQSReload()
                    } else {
                        this.setState({
                            apiError: res.data.ErrorMessage
                        })
                        showToastMessage(res.data.ErrorMessage, "Error");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    this.setState({ loading: false });
                });
        }
        else {
            setTimeout(() => { this.setState({ loading: false }); }, 2000);
        }
    }

    render() {
        const { data, open, filename, loading, popupLoading } = this.state;
        return (
            <React.Fragment>
                <Toaster />
                <div className="dash-container">
                    <div className="container container--full">
                        <div className={"panel panel-dark loader-inside " + (loading ? "" : "loading-over")}>
                            <FormLoader />
                            <div className="panel-heading">
                                <h3 className="panel-title">Products List</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="custom-pagelist-left">
                                        <div className="dash-new-marketplace btn-group">
                                            <a className="btn btn-new-marketplace" onClick={this.onOpenModal}>Bulk CSV Edit</a>
                                        </div>  </div></div>

                                <div className="row">
                                    <ReactTable
                                        key="1"
                                        data={data}
                                        noDataText="No products found."
                                        filterable
                                        minRows={1}
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={[
                                            {
                                                Header: "Status",
                                                id: "Status",
                                                headerClassName: "status",
                                                className: "status",
                                                accessor: d => d.Status,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["Status"], threshold: matchSorter.rankings.STARTS_WITH }),
                                                Filter: ({ filter, onChange }) =>
                                                    <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true
                                            },
                                            {
                                                Header: "Seller SKU",
                                                id: "SellerSKU",
                                                headerClassName: "sellersku",
                                                className: "sellersku",
                                                accessor: d => d.SellerSKU,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["SellerSKU"], threshold: matchSorter.rankings.CONTAINS }),
                                                Filter: ({ filter, onChange }) => <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true
                                            },
                                            {
                                                Header: "Listing Name",
                                                id: "Name",
                                                headerClassName: "name",
                                                className: "name",
                                                accessor: d => d.Name,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["Name"], threshold: matchSorter.rankings.CONTAINS }),
                                                Filter: ({ filter, onChange }) => <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true,
                                                style: { whiteSpace: 'unset' }
                                            },
                                            {
                                                Header: "Marketplace Name",
                                                id: "MarketplaceName",
                                                headerClassName: "marketplacename",
                                                className: "marketplacename",
                                                accessor: d => d.MarketplaceName,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["MarketplaceName"], threshold: matchSorter.rankings.CONTAINS }),
                                                Filter: ({ filter, onChange }) => <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true
                                            },
                                            {
                                                Header: "Brand",
                                                id: "Brand",
                                                headerClassName: "brand",
                                                className: "brand",
                                                accessor: d => d.Brand,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["Brand"], threshold: matchSorter.rankings.CONTAINS }),
                                                Filter: ({ filter, onChange }) => <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true
                                            },
                                            {
                                                Header: "Avg. Hist. Price",
                                                id: "AvgHistoricalPrice",
                                                headerClassName: "avgprice",
                                                className: "avgprice",
                                                accessor: d => d.AvgHistoricalPrice,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["AvgHistoricalPrice"], threshold: matchSorter.rankings.CONTAINS }),
                                                Filter: ({ filter, onChange }) => <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true,
                                                Cell: this.renderAvgHistoricalPrice
                                            },
                                            {
                                                Header: "Landed Cost",
                                                id: "LandedCost",
                                                headerClassName: "landedcost",
                                                className: "landedcost",
                                                accessor: "LandedCost",
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["LandedCost"], threshold: matchSorter.rankings.CONTAINS }),
                                                Filter: ({ filter, onChange }) => <FilterInput onChange={onChange} filter={filter}></FilterInput>,
                                                filterAll: true,
                                                Cell: this.renderLandedCost
                                            }
                                        ]}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"
                                        pageSizeOptions={this.pageSizeOptions}
                                    />
                                    <br />

                                    <div className="text-centre">
                                        <a id="btnSaveCogs" className="btn btn-primary btn-long" onClick={this.saveCOGS}>SAVE</a>
                                    </div>
                                </div></div>
                        </div> </div>
                </div>

                <Modal open={open} onClose={this.onCloseModal}>
                    <div className={" modal-dialog modal-md loader-inside " + (popupLoading ? "" : "loading-over")}>
                        <FormLoader />
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Bulk CSV Edit</h4>
                            </div>
                            <div className="modal-body modal-body-update">
                                <div className="upload-discription">
                                    <p className="head">How to use this template</p>
                                    <p>
                                        This template contains all the products imported via the Amazon MWS API.
                                        To edit your costs, proceed as follows:
                        </p>

                                    <p>
                                        1. Click on button <b className="head">Download CSV template</b> and download the template file.
                        </p>
                                    <p>
                                        2. Enter your Landed Cost per unit in the format '12.34' in the respective columns
                                        (marked in blue color).
                        </p>
                                    <p>
                                        3. Save this file as .xlsx and upload it to SellerPoint.
                        </p>

                                    <p>
                                        Please note: The columns Status, Seller SKU, Listing Name, Marketplace Name, Brand,
                                        Avg. Historical Price, cannot be changed.
                        </p>
                                    <p className="red">
                                        Caution: Uploading this file will overwrite all previously entered costs.
                                        Empty cells will be interpreted as 0.00.
                        </p>
                                </div>

                                <div className="upload-btn">
                                    <a className="btn btn-new-marketplace" onClick={this.onDownloadFile}>Download CSV template</a>
                                </div>
                                <div className="upload-btn mt-20">

                                    <a className="btn btn-primary btn-new-marketplace" id="btnUpload">Upload CSV template


                                                <Dropzone onDrop={this.onDrop.bind(this)} accept=".xlsx">
                                        </Dropzone>
                                    </a>

                                    <span id="filename">{filename}</span>

                                </div>
                            </div>

                        </div>
                    </div>

                </Modal>
            </React.Fragment>
        )
    }
}
