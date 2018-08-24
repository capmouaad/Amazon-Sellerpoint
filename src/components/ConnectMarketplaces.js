import React, { Component } from 'react';
import { connect } from 'react-redux';
import api from '../services/Api'
import { setSignupFields } from '../actions/signup';

class ConnectMarketplaces extends Component {

  constructor(props) {
    super(props)

    this.state = {
      sellerMarketplaces: [],
      advState: null
    }
  }

  componentDidMount() {
    this.getSellerMarketplaces();
  }

  getSellerMarketplaces = () => {
    api
      .get(`GetSellerMarketPlaces`)
      .then((res) => {
        console.log('backend responce to GET GetSellerMarketPlaces', res)

        if (res.data.IsSuccess) {

          this.setState({
            sellerMarketplaces:  res.data.Marketplaces
          })
        } else {

          if (this.props.onApiError) {
            this.props.onApiError(res.data.ErrorMessage)
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  connectMarketplace = (advState, sellerId) => {
    const { LWA } = this.props;
    this.props.setSignupFields({ // update redux store
      ...this.props.signupFields,
      seller_id: sellerId,
    })

    this.LWAAuth(advState);
    this.props.onFormSubmited(false)
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

    const { sellerMarketplaces } = this.state;

    return (
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
            {sellerMarketplaces.map((mp, index) => {
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
                      isAvailable?
                      <span className="btn btn-connect" onClick={this.connectMarketplace.bind(this, this.props.advState, mp.SellerId)}>Connect</span>:
                      <span className="signup__table-connection"> Not Available</span>
                    }
                  </td>
                </tr>
              )
            })
            }

            {(sellerMarketplaces.length === 0) ? <tr key="0"> <td colSpan="4" className="not-found"> No marketplace found.</td></tr> : ""}
          </tbody>
        }
      </table>
    )
  }
}


const mapStateToProps = (state) => ({
  LWA: state.lwa
});

const mapDispatchToProps = (dispatch) => ({
  setSignupFields: (data) => dispatch(setSignupFields(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectMarketplaces);
