import React, { Component } from 'react';
import api from '../../services/Api';
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import "react-table/react-table.css";
import Modal from 'react-responsive-modal';
import Toaster, {showToastMessage} from '../../services/toasterNotification'
import FormLoader from '../Forms/FormLoader';
import 'react-toastify/dist/ReactToastify.css';

export default class DashSKUASINGrouping extends Component {
skuIds =[];
parentSKUId=0;
parentGroupId=0;

commonColumns=[                                        
     {
        Header: "Status",
        id: "Status",
        headerClassName:"status",
       className:"status",       
        accessor: d => d.Status,
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["Status"] }),
        filterAll: true
    },
    {
        Header: "Seller SKU",
        id: "SellerSKU",
        headerClassName:"sellersku",
        className:"sellersku",
        accessor: d => d.SellerSKU,
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["SellerSKU"] }),
        filterAll: true
    },
    {
        Header: "Listing Name",
        id: "Name",
        headerClassName:"name",
        className:"name",
        accessor: d => d.Name,
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["Name"] }),
        filterAll: true,
        style: { 'white-space': 'unset' }
    },
    {
        Header: "Marketplace Name",
        id: "MarketplaceName",
        headerClassName:"marketplacename",
        className:"marketplacename",
        accessor: d => d.MarketplaceName,
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["MarketplaceName"] }),
        filterAll: true
    },
    {
        Header: "Brand",
        id: "Brand",
        headerClassName:"brand",
        className:"brand",
        accessor: d => d.Brand,
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["Brand"] }),
        filterAll: true
    },
    {
        Header: "Avg. Hist. Price",
        id: "AvgHistoricalPrice",
        headerClassName:"avgprice",
        className:"avgprice",
        accessor: d => d.AvgHistoricalPrice,
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["AvgHistoricalPrice"] }),
        filterAll: true,
        Cell: this.renderAvgHistoricalPrice
    },
    {
        Header: "Landed Cost",
        id: "LandedCost",
        headerClassName:"landedcost",
        className:"landedcost",
        accessor: d => ['$',d.LandedCost.toFixed(2)],
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["LandedCost"] }),
        filterAll: true                                               
    }
];

existingGroupColumns={};
ungroupTableColumns={};
childSKUTableColumns=[];

constructor() {
  super();
  
  this.state = {
      data: [],
      grouped_data:[],
      childPopupOpen:false,
      childSKUs:[],
      groupSelectedPopupOpen : false,
      groupedSKUPopupOpen :false,
      selSKUs_data :[],
      open:true,
      loading:true
  }; 
  
this.existingGroupColumns ={                                            
    id: "MerchantListingId",
    maxWidth: 25,
    Cell: this.renderRadioBtnMerchantListingId,
    Filter: ({filter, onChange}) => (
      <div></div>                                             
    )                                     
};

this.ungroupTableColumns={                                            
    id: "MerchantListingId",
    maxWidth: 40,
    Cell: this.renderMerchantListingId,
    Filter: ({filter, onChange}) => (
      <div></div>                                             
    )                                     
};

let childSKUActionColumn={
    Header: "Action",
    id: "Action",
    headerClassName:"action",
    className:"action",
    Filter: ({filter, onChange}) => (
      <div></div>                                             
    ),                                             
    Cell:(cellInfo)=>{
return <button type='button' class='btn btn-primary btn-bordered btn-small btnUnGroupSku'  title='Ungroup SKU' onClick={() => { this.ungroupSKU(cellInfo.original.MerchantListingId); }}><i class='fa fa fa-object-ungroup'></i></button>
    }
};

this.commonColumns.forEach(x=>{
    this.childSKUTableColumns.push(x);
})
this.childSKUTableColumns.push(childSKUActionColumn);

this.ungroupTableColumns=[this.ungroupTableColumns].concat(this.commonColumns);
  this.existingGroupColumns = [this.existingGroupColumns].concat(this.commonColumns);

  this.getUngroupedSKUs();  
  this.getGroupedSKUs();
}

onCloseModal = () => {
  this.setState({ childPopupOpen: false,
  groupSelectedPopupOpen:false,
  groupedSKUPopupOpen:false
 });

 this.parentGroupId=0;
};

onOpenGroupSelectedModal = () => {
  if (this.skuIds.length>1){
    //this.setState({   groupSelectedPopupOpen:true });
    this.getDetailUnGroupBySKUIds(this.skuIds);
  } else{
      showToastMessage("Please select minimum 2 SKUs.", "Error");
  }
};

onOpenGroupedSKUModal = () => {
    if (this.skuIds.length>0){
      this.setState({   groupedSKUPopupOpen:true });    
    } 
    else{
        showToastMessage("Please select atleast 1 SKU.", "Error");
    }
  };

createNewSKUGroup =()=>{
    if (this.skuIds.length>1 && this.parentGroupId>0){    
        this.setState({           
            loading:true
        });        
        api
  .post(`CreateGroupSKUs`, {newGroupSKUId:this.parentGroupId, skuIds: this.skuIds})
  .then((res) => {      
      if (res.data.IsSuccess) {       
        showToastMessage(res.data.ErrorMessage, "Success");
          this.skuIds=[];
          this.parentGroupId=0;
          this.onCloseModal();
          this.getUngroupedSKUs();
          this.getGroupedSKUs();
      } else {
        this.setState({
            apiError: res.data.ErrorMessage,
            loading:false
        })
        showToastMessage(res.data.ErrorMessage, "Error");        
      }
      this.setState({           
        loading:false
    })    
  })
  .catch(function (error) {
    showToastMessage("!Unknown Issue", "Error");   
  });
    }else{
        showToastMessage("Please select a SKU before submitting.", "Error");      
    }
}

updateExistingSKUGroup =()=>{
    if (this.skuIds.length>0 && this.parentGroupId>0){ 
        this.setState({           
            loading:true
        });     
        api
  .post(`UpdateGroupSKUsChild`, {groupSKUId:this.parentGroupId, skuIds: this.skuIds})
  .then((res) => {    
      if (res.data.IsSuccess) {   
        showToastMessage(res.data.ErrorMessage, "Success");   
          this.skuIds=[];
          this.parentGroupId=0;
      } else {
          this.setState({
              apiError: res.data.ErrorMessage,
              loading:false
          })
          showToastMessage(res.data.ErrorMessage, "Error");
      }      
  })
  .catch(function (error) {
      console.log(error);
  });
    }else{
        showToastMessage("Please select a SKU before submitting.", "Error");      
    }
}

getDetailUnGroupBySKUIds =(skuIds)=>{
    this.setState({
        loading:true
    });

  api
  .get(`GetDetailUnGroupBySKUIds?skuIds=${skuIds.join(',')}`)
  .then((res) => {
      console.log('backend responce to GET GetDetailUnGroupBySKUIds', res)
      if (res.data.IsSuccess) {       
          this.setState({
              selSKUs_data: res.data.LstCOGSTable,
              groupSelectedPopupOpen:true,
              loading:false
          });        
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

ungroupSKU(SKUId){
    this.setState({
        loading:true
    });

  api
  .get(`UngroupSKU?SKUId=${SKUId}`)
  .then((res) => {     
      if (res.data.IsSuccess) {   
        showToastMessage(res.data.ErrorMessage, "Success");  
        this.getChildSKUByParentSKUId(this.parentSKUId);
        this.getUngroupedSKUs(); 
      } else {
          this.setState({
              apiError: res.data.ErrorMessage
          })
          showToastMessage(res.data.ErrorMessage, "Error");   
      }
      this.setState({
        loading:false
    });
  })
  .catch(function (error) {
      console.log(error);
  });
}

ungroupAllSKUs(){    

    if (this.state.childSKUs.length>0){
        this.setState({
            loading:true
        });
  api
  .get(`UngroupAllChildSKU?parentSkuId=${this.parentSKUId}`)
  .then((res) => {      
      if (res.data.IsSuccess) {      
        showToastMessage(res.data.ErrorMessage, "Success");   
        this.onCloseModal();
        this.getUngroupedSKUs();
        this.getGroupedSKUs();
      } else {
          this.setState({
              apiError: res.data.ErrorMessage
          })
          showToastMessage(res.data.ErrorMessage, "Error");   
      }

      this.setState({
        loading:false
    });
  })
  .catch(function (error) {
      console.log(error);
  });
}
else{
    this.onCloseModal();
    this.getGroupedSKUs();
}
}

getUngroupedSKUs() {
  api
      .get(`GetUngroupedSKUs`)
      .then((res) => {
          console.log('backend responce to GET GetUngroupedSKUs', res)
          if (res.data.IsSuccess) {
              this.setState({
                  data: res.data.LstCOGSTable,
                  loading:false
              });

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

getGroupedSKUs() {
  api
      .get(`GetGroupedSKUs`)
      .then((res) => {
          console.log('backend responce to GET GetGroupedSKUs', res)
          if (res.data.IsSuccess) {
              this.setState({
                  grouped_data: res.data.LstCOGSTable
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

checkboxChangedEvent=(e)=>{
if(e.target.checked){
  if(this.skuIds.indexOf(e.target.value)===-1){
    this.skuIds.push(e.target.value)
  }
}
else{
  if(this.skuIds.indexOf(e.target.value)>-1){
    this.skuIds.pop(e.target.value)
  }
}
}

renderMerchantListingId=(cellInfo)=>{
  return (<input type="checkbox" defaultValue={cellInfo.original.MerchantListingId} 
  onChange={this.checkboxChangedEvent}/>
)}

renderRadioBtnMerchantListingId=(cellInfo)=>{   
    return (<input type="radio" defaultValue={cellInfo.original.MerchantListingId} name="SKUGroups" 
    onChange={(e)=>{
       this.parentGroupId=e.target.value;
       console.log(this.parentGroupId);
    }}/>
  )}

renderAvgHistoricalPrice(cellInfo) {
  if (cellInfo.original.AvgHistoricalPrice === 0) {
      return ('N/A');
  } else {
      return (['$', cellInfo.original.AvgHistoricalPrice.toFixed(2)]);
  }
}

getChildSKUByParentSKUId=(parentId)=>{

    this.setState({      
        loading:true
    })

  this.parentSKUId=parentId;
  api
  .get(`GetChildSKUByParentSKUId?SKUId=${parentId}`)
  .then((res) => {
      console.log('backend responce to GET GetChildSKUByParentSKUId', res)
      if (res.data.IsSuccess) {       
          this.setState({
              childSKUs: res.data.LstCOGSTable,
              childPopupOpen:true,
              loading:false
          });         
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

  render(){
    const { data,grouped_data, childPopupOpen, childSKUs, groupSelectedPopupOpen, selSKUs_data, groupedSKUPopupOpen, loading } = this.state;   
  
           return(
      <React.Fragment>        
<Toaster />           
        <div className={"dash-container "+ (loading ? "" : "loading-over" )}>
        <FormLoader />  
          <div className="container container--full">
                            <div className="panel panel-dark">
                                <div className="panel-heading">                                   
                                    <h3 className="panel-title">SKU/ASIN Grouping</h3>
                                </div>
                              <div className="panel-body">
                                    <div className="row">                                       
                                            <div className="instruction-notes">
                                                <h3>
                                                    Group your SKU/ASINs into a single product to stay organized!
                                                </h3>
                                                <p>
                                                    Sometimes minor tweaks to your listings, or color and style variations, end up creating multiple listings of the same product that are difficult to keep organized.  This section allows you to group those listings together and view them as a single product!
                                                </p>
                                                <h4>
                                                    Instructions/Notes:
                                                </h4>
                                                <ul>
                                                    <li>
                                                        Choose all of the SKU/ASINs that you’d like to group together and click "Group Selected SKUs".
                                                    </li>
                                                    <li>
                                                        Out of those selected, choose a single SKU/ASIN that you would like to assign as the <b>primary SKU</b>. <br /> All other products in the group will inherit product and Landed Cost information of the primary SKU.
                                                    </li>
                                                </ul>                                            
                                        </div>
                                    </div>
                                    <h3 className="h3">Ungrouped SKUs</h3>

                                    <div id="divTableUngroupDataHolder" className="tab-content  cust-cogs cust-confiq">
                                        <div className="row clearfix">
                                            <div className="col-sm-6">                                                
                                                <div className="dash-new-Marketplace btn-group">
              <a className="btn btn-primary btn-new-Marketplace" onClick={this.onOpenGroupSelectedModal}>Group Selected SKUs</a>
              <a className="btn btn-new-Marketplace existing-group" onClick={this.onOpenGroupedSKUModal}>Add to existing group</a>
            </div>                                                                   </div>                                             
                                           
                                        </div>
                                      
                                    <ReactTable
                                        data={data}
                                        noDataText="No ungrouped skus found."
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={this.ungroupTableColumns}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"
                                    />
                                    </div>

                                    <h3 className="h3">Grouped SKUs</h3>

                                    <div className="instruction-notes">
                                        <p className="font-bold">Note: Click into a grouped listing to view the products contained in the group.</p>
                                    </div>

                                    <div id="divTableGroupDataHolder" className="tab-content  cust-cogs">
                                    <ReactTable id="TableGroupDataHolder"
                                        data={grouped_data}
                                        noDataText="No grouped skus found."
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={this.commonColumns}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"
                                        getTrProps={(state,rowInfo) => {
                                          return {
                                            onClick: (e) => {                                            
                                            this.getChildSKUByParentSKUId(rowInfo.original.MerchantListingId);                                                                                    }                                           
                                          }
                                        }}
                                    />
                                    </div>
                                   </div>
                            </div>
                       
          </div>

           <Modal open={childPopupOpen} onClose={this.onCloseModal}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Child SKUs</h4>
                            </div>
                            <div className="modal-body">
                                <div className="panel panel-dark">    
                                <div className="panel-body">                                
                                <div className="instruction-notes instruction-notes-last">
                                <h4 className="instruct">
                                    Instructions/Notes:
                                </h4>
                                <ul>
                                    <li> Select the listings that you would like to remove from this group.</li>
                                    <li>
                                        When ungrouped, the ungrouped listing will inherit the Landed Price from the
                                        primary listing from which it is being ungrouped.
                                    </li>
                                </ul>
                            </div>

                            <div id="divTableChildGroupBySKUIdsDataHolder" className="tab-content  cust-cogs">
                                <div className="mar-b-15">
                                    <div className="row">                                       
                                        <div className="col-lg-12 text-right content_col">
                                            <button type="button" className="btn btn-primary btn-bordered pull-right" id="btnAllUngroupSKus" onClick={()=> {this.ungroupAllSKUs()}}>Ungroup all SKUs</button>
                                        </div>
                                    </div>
                                </div>

                               <ReactTable
                                        data={childSKUs}
                                        noDataText="No child skus found."
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={this.childSKUTableColumns}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"                                      
                                    />
                            </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal open={groupSelectedPopupOpen} onClose={this.onCloseModal}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Group Selected SKUs</h4>
                            </div>
                            <div className="modal-body modal-body-update">
                                <div className="panel panel-dark">  
                                <div className="panel-body">                                    
                                <div className="instruction-notes instruction-notes-last">
                                <h4 className="instruct">
                                    Instructions/Notes:
                                </h4>
                                <ul>
                                <li>
                                        Select the listing that you would like to designate as the <b>'primary' listing</b>. The selected listing will be the one
                                        that shows up in all of the dashboards and filters.
                                    </li>
                                    <li>All of the sales for the corresponding grouped listings will roll up into this primary listing.</li>

                                </ul>
                                <p className="font-bold">Note: All grouped listings will inherit the Landed Cost of the primary listing.</p>
                           
                            </div>

                            <div id="divTableChildGroupBySKUIdsDataHolder" className="tab-content  cust-cogs">
                                                              <ReactTable
                                        data={selSKUs_data}
                                        noDataText="No child skus found."
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={this.existingGroupColumns}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"                                      
                                    />

                                    
                                    <div className="text-centre mt-20">
                                        <a id="btnSubmit" className="btn btn-primary btn-long" onClick={this.createNewSKUGroup}>Submit</a>
                                    </div>
                            </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                 <Modal open={groupedSKUPopupOpen} onClose={this.onCloseModal}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">EXISTING GROUP</h4>
                            </div>
                            <div className="modal-body modal-body-update">
                                <div className="panel panel-dark">  
                                <div className="panel-body">    
                              <div className="instruction-notes">
                                <h4 className="instruct">
                                    Instructions/Notes:
                                </h4>
                                <ul>
                                    <li>
                                        Select the existing listing group that you would like to add these listings to.
                                    </li>
                                    <li>All of the sales for the corresponding grouped listings will roll up into this primary listing.</li>
                                </ul>
                                <p className="font-bold">Note: All grouped listings will inherit the Landed Cost of the primary listing.</p>
                            </div>
                            <div id="divTableExistingGroupBySKUIdsDataHolder" className="tab-content  cust-cogs">
                            <ReactTable id="TableGroupDataHolder"
                                        data={grouped_data}
                                        noDataText="No grouped skus found."
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value}
                                        columns={this.existingGroupColumns}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        nextText=">>"
                                        previousText="<<"                                       
                                    />

                                     <div className="text-centre mt-20">
                                        <a id="btnSubmit" className="btn btn-primary btn-long" onClick={this.updateExistingSKUGroup}>Submit</a>
                                    </div>
                            </div>

                                </div>
                            </div>
                            </div> 
                        </div>
                    </div>
                </Modal>
        </div>     

      </React.Fragment>
    )
  }
}
