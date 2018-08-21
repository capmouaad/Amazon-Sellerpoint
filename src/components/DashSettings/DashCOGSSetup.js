import React, { Component } from 'react';
import api, { BACKEND_URL}from '../../services/Api';
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap';

// Import React Table
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import "react-table/react-table.css";
import Modal from 'react-responsive-modal';
import Dropzone from 'react-dropzone';
import FormLoader from '../Forms/FormLoader';

export default class DashCOGSSetup extends Component {

    lstEditedCOGS = [];
   
    state = {
        data: [],
        open: false,
        filename: ''              
    };

    constructor() {
        super();
        this.state = {
            data: [],
            open: false,
            loading:true,
            extended:true                 
        };
        this.getAllCOGS();
        this.renderLandedCost = this.renderLandedCost.bind(this);       
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    onDrop(files) {
        if (files.length > 0) {
            var data = new FormData();
            data.append("file", files[0]);            
            this.setState({ filename: files[0].name });
            api
                .post(`UploadCogsData`, data)
                .then((res) => {
                    console.log('backend responce to GET UploadCogsData', res)
                    if (res.data.IsSuccess) {
                        console.log(res.data);
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
    }

    onDownloadFile = () => {
        this.setState({
          loading:true
        })
        api
            .get(`DownloadCogsTemplate`)
            .then((res) => {
                console.log('backend responce to GET onDownloadFile', res)
                if (res.data.IsSuccess) {
                    this.setState({
                        loading:false
                      })
                    window.location.href = BACKEND_URL + "/Download?file=" + res.data.FileName;
                } else {
                    this.setState({
                        apiError: res.data.ErrorMessage,
                        loading:false
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getAllCOGS() {
        api
            .get(`GetAllCOGS`)
            .then((res) => {
                console.log('backend responce to GET GetAllCOGS', res)
                if (res.data.IsSuccess) {
                    this.setState({
                        data: res.data.LstCOGSTable,
                        loading:false
                    });                   
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
            <input type={"number"} min={0}
                contentEditable
                style={{ backgroundColor: "#fafafa", width: "100%", textAlign: "right" }}
                defaultValue={cellInfo.original.LandedCost.toFixed(2)}
                onChange={e => {
                    this.lstEditedCOGS.push({ COGSId: cellInfo.original.COGSId, LandedCost: e.target.value });
                }}
            />]}</div>
        );    }


    renderAvgHistoricalPrice(cellInfo) {
        if (cellInfo.original.AvgHistoricalPrice === 0) {
            return ('N/A');
        } else {
            return (['$', cellInfo.original.AvgHistoricalPrice.toFixed(2)]);
        }
    }

    saveCOGS = () => {
        if (this.lstEditedCOGS.length > 0) {
            api
                .post(`UpdateCOGS`, this.lstEditedCOGS)
                .then((res) => {
                    console.log('backend responce to GET UpdateCOGS', res)
                    if (res.data.IsSuccess) {
                        this.getAllCOGS();
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
    }

    render() {
        const { data, open, filename, loading } = this.state;              
               return (               
            <React.Fragment>    
                        
                <div className={"dash-container "+ (loading ? "" : "loading-over" )}>   
                <FormLoader />  

                    <div className="container container--full">
                        <div className="panel panel-dark">
                            <div className="panel-heading">
                            <div className="panel-btns">
                                    <OverlayTrigger placement="top" overlay={<Tooltip placement="right" className="in" id="tooltip-right"> {(this.state.extended ? "Minimize":"Maximize")}</Tooltip>} onClick={() => this.setState({ extended: !this.state.extended })} id="tooltip1">
                                    <i className={"fa " + (this.state.extended ? "fa-minus-square-o":"fa-plus-square-o")}></i>
    </OverlayTrigger>
                                    </div>
                                <h3 className="panel-title">Products List</h3>
                            </div>

                         <Panel expanded={this.state.extended}>
          <Panel.Collapse> <Panel.Body>
                                <div className="row">
                                    <div className="custom-pagelist-left">
                                       
                                        <div className="dash-new-marketplace btn-group">
              <a className="btn btn-new-marketplace" onClick={this.onOpenModal}>Bulk CSV Edit</a>
             
            </div>  </div></div>

                                <div className="row">
                                    <ReactTable
                                        data={data}
                                        noDataText="No products found."
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={[
                                            {
                                                Header: "Status",
                                                id: "Status",
                                                maxWidth: 80,
                                                accessor: d => d.Status,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["Status"] }),
                                                filterAll: true
                                            },
                                            {
                                                Header: "Seller SKU",
                                                id: "SellerSKU",
                                                maxWidth: 150,
                                                accessor: d => d.SellerSKU,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["SellerSKU"] }),
                                                filterAll: true
                                            },
                                            {
                                                Header: "Listing Name",
                                                id: "Name",
                                                maxWidth: 500,
                                                accessor: d => d.Name,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["Name"] }),
                                                filterAll: true,
                                                style: { 'white-space': 'unset' }
                                            },
                                            {
                                                Header: "Marketplace Name",
                                                id: "MarketplaceName",
                                                maxWidth: 140,
                                                accessor: d => d.MarketplaceName,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["MarketplaceName"] }),
                                                filterAll: true
                                            },
                                            {
                                                Header: "Brand",
                                                id: "Brand",
                                                maxWidth: 130,
                                                accessor: d => d.Brand,
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["Brand"] }),
                                                filterAll: true
                                            },
                                            {
                                                Header: "Avg. Hist. Price",
                                                id: "AvgHistoricalPrice",
                                                maxWidth: 120,
                                                accessor: d => ["$", () => { return d.AvgHistoricalPrice.toFixed(2) }],
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["AvgHistoricalPrice"] }),
                                                filterAll: true,
                                                Cell: this.renderAvgHistoricalPrice
                                            },
                                            {
                                                Header: "Landed Cost",
                                                id: "LandedCost",
                                                maxWidth: 120,
                                                accessor: "LandedCost",
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["LandedCost"] }),
                                                filterAll: true,
                                                Cell: this.renderLandedCost
                                            }
                                        ]}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"
                                    />
                                    <br />

                                    <div className="text-centre">
                                        <a id="btnSaveCogs" className="btn btn-primary btn-long" onClick={this.saveCOGS}>SAVE</a>
                                    </div>
                                </div></Panel.Body> </Panel.Collapse>
                                </Panel>
                        </div> </div>
                </div>

                <Modal open={open} onClose={this.onCloseModal}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Bulk CSV Edit</h4>
                            </div>
                            <div className="modal-body modal-body-update">
                                <div className="row">
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
                                        <button type="button" className="btn btn-primary btn-bordered" id="btnDownload" onClick={this.onDownloadFile}>Download CSV template</button>

                                    </div>
                                    <div className="upload-btn mt-20">
                                        <button type="button" className="btn btn-primary btn-rounded" id="btnUpload">Upload CSV template</button>
                                        <span id="filename">{filename}</span>
                                        <section>
                                            <div className="dropzone">
                                                <Dropzone onDrop={this.onDrop.bind(this)} accept=".xlsx">                                                   
                                                </Dropzone>
                                            </div>

                                        </section>
                                    </div>
                                    <div id="my-awesome-dropzone" className="dropzone dropzone-block" enctype='multipart/form-data'>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </Modal>
            </React.Fragment>
        )
    }
}
