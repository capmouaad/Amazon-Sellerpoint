import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from '../services/Api'
import { setSignupFields } from '../actions/signup';
import Modal from 'react-responsive-modal';
import FormLoader from './Forms/FormLoader'

class ConnectMarketplaces extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sellerMarketplaces: [],
      advState: null,
      popupOpen: false,
      sellerId: null,
      loading: false
    }
  }

  componentDidMount() {
    this.getSellerMarketplaces();
  }

  onCloseModal = () => {
    this.setState({ popupOpen: false });
  };

  getSellerMarketplaces = () => {
    this.props.setSignupFields({ // update redux store
      ...this.props.signupFields,
      seller_id: this.props.sellerId,
      isInitialImport: this.props.isInitialImport
    })
    this.setState({ loading: true })
    api
      .get(`GetSellerMarketPlaces`)
      .then((res) => {
        console.log('backend responce to GET GetSellerMarketPlaces', res)
        if (res.data.IsSuccess) {
          this.setState({
            sellerMarketplaces: res.data.Marketplaces
          })
        } else {

          if (this.props.onApiError) {
            this.props.onApiError(res.data.ErrorMessage)
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  onOpenModel = (advState, sellerId) => {
    this.setState({
      advState: advState,
      popupOpen: true,
      sellerId: sellerId
    });
  }

  connectMarketplace = (advState, sellerId) => {
    this.props.setSignupFields({ // update redux store
      ...this.props.signupFields,
      seller_id: sellerId,
      isInitialImport: this.props.isInitialImport
    })

    this.LWAAuth(advState);
    this.props.onFormSubmited(false)

    this.setState({
      popupOpen: false
    });

  }

  LWAAuth = (advState) => {
    const ClientID = "amzn1.application-oa2-client.c66f0420a8fc4c13a7abb409399d9944"
    const RedirectUri = window.location.origin + "/SellerPoint/LWACallback"
    window.location.href = `https://www.amazon.com/ap/oa?client_id=${ClientID}&scope=cpc_advertising:campaign_management&response_type=code&redirect_uri=${RedirectUri}&state=${advState}`
  }

  render() {
    const tableHeads = [
      "Marketplace Name",
      "Seller ID",
      "MWS Status (SellerPoint)",
      "Advertising Data Status"
    ]

    const { sellerMarketplaces, popupOpen, advState, sellerId, loading } = this.state;

    return (
      <div>
        <Modal open={popupOpen} onClose={this.onCloseModal}>
          <div className="modal-dialog modal-md loader-inside step3-div">
            <div className="modal-content">
              <div className="modal-body">
                <div className="panel">
                  <div className="panel-body">
                    <div className="instruction-notes instruction-notes-last">
                      We will only be able to retrieve advertising data from the prior two months due to Amazon restrictions.
                                            </div>
                    <div id="divTableChildGroupBySKUIdsDataHolder" className="tab-content cust-cogs">
                      <div className="mar-b-15">
                        <div className="row">
                          <div className="col-lg-12 text-right content_col">
                            <button type="button" className="btn btn-white" id="btnAllUngroupSKus" onClick={this.connectMarketplace.bind(this, advState, sellerId)}>Okay</button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <div className={"loader-inside " + (loading ? "" : "loading-over")}>
          <FormLoader />
          <table className="signup__table">
            <thead>
              <tr>
                {tableHeads.map((name, index) => {
                  return (<td key={index}>{name}</td>)
                })}
              </tr>
            </thead>
            {sellerMarketplaces &&
              <tbody>
                {
                  sellerMarketplaces.map((mp, index) => {
                    const isConnected = mp.IsAdvertisingConnected
                    const isAvailable = mp.IsAdvertisingAvailable
                    return (
                      <tr key={index}>
                        <td><span className="for-desktop">{tableHeads[0]}</span>{mp.Name}</td>
                        <td><span className="for-desktop">{tableHeads[1]}</span>{mp.SellerId}</td>
                        <td><span className="for-desktop">{tableHeads[2]}</span>{mp.MWSStatus}</td>
                        <td>
                          {isConnected ?
                            <span className="signup__table-connection"><span className="ico-checkmark"></span> Connected</span> :
                            isAvailable ?
                              <span className="btn btn-connect" onClick={this.onOpenModel.bind(this, this.props.advState, mp.SellerId)}>Click to Connect</span> :
                              <span className="signup__table-connection"> Not Available</span>
                          }
                        </td>
                      </tr>
                    )
                  })
                }
                {
                  (sellerMarketplaces.length === 0) && <tr key="0"><td colSpan="4" className="not-found"> No marketplace found.</td></tr>
                }
              </tbody>
            }
          </table>
        </div>

      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  LWA: state.lwa,
  sellerId: state.signup.fields.seller_id
});

const mapDispatchToProps = (dispatch) => ({
  setSignupFields: (data) => dispatch(setSignupFields(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectMarketplaces);
