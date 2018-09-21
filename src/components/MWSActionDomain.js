import React, { Component } from 'react';
import { connect } from 'react-redux';
import CheckBox from './Forms/CheckBox';
import FormLoader from './Forms/FormLoader';
import api from '../services/Api';
import { setAddMarketStep, setSignupFields, setSignupStep, setSignupAuthStep } from '../actions/signup'

class MWSActionDomain extends Component {

  constructor(props){
    super(props);

    this.state = {
      marketplaceDomains: [], // state stores marketplaces ID only
      apiError: null,
      isFormSubmited: false,
      loading: false,
      choosedOptions: []
    }
  }

  componentDidMount () {
    this.setupMarketplaceDomains()
  }

  setupMarketplaceDomains = async () => {
    try {
      this.setState({loading: true})
      const res = await api.get(`GetSellerMarketPlaces`)
      if (res.data.IsSuccess) {
        this.setState({
          marketplaceDomains: res.data.Marketplaces.map(x => ({
            id: x.MarketPlaceId,
            isAddedtoMarket: true
          }))
        })
      } else {
        this.setState({
          apiError: res.data.ErrorMessage,
          marketplaceDomains: this.props.signupFields.marketplace_domains
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.setState({loading: false})
    }
  }

  chooseOption = (id) => {
    let options = this.state.choosedOptions
    let index

    if (options) {
      if (options.indexOf(id) === -1) {
        options.push(id)
      } else {
        index = options.indexOf(id)
        options.splice(index, 1)
      }
  
      this.setState({
        choosedOptions: options
      })
    }
  }

  nextAction = async () => {
    try {
      const { choosedOptions } = this.state
      const { signupFields } = this.props
      const seller_id = signupFields.seller_id
      const mws_auth = signupFields.mws_auth

      this.setState({
        isFormSubmited: true,
        apiError: null
      })

      const marketplaceData = signupFields.authenticated_marketplace.map((x) => {
        return {
          // sellerId: seller_id, // move to 1lvl up
          marketPlaceId: x.MarketplaceId,
          name: x.Name,
          domainName: x.DomainName,
          countryCode: x.DefaultCountryCode
        }
      })

      const filteredMarketplaces = marketplaceData.filter( x => choosedOptions.indexOf(x.marketPlaceId) !== -1 )


      const obj = {
        sellerId: seller_id,
        authToken: mws_auth,
        marketplaces: filteredMarketplaces
      }

      if(filteredMarketplaces.length > 0) {
        //butch save
        const res = await api.post(`SaveMarketPlaceIds`, obj)
        console.log('backend responce to POST SaveMarketPlaceIds', res)
        if ( res.data.IsSuccess ){
          if (this.props.isMarketSetup) {
            this.props.setAddMarketStep(2)
            this.props.setSignupAuthStep(1)
          } else {
            this.props.setSignupStep(3);
            this.props.setSignupAuthStep(1); // reset ?

            this.updateStepOnBackend()
              .then(res => {
                console.log(res)
              })
              .catch(err => {

              });
          }

        } else {
          this.setState({
            apiError: res.data.ErrorMessage
          })
        }

        this.setState({
          isFormSubmited: false // reset submit status
        })
      } else {
        this.setState({
          apiError: "Please select one marketplace.",
          isFormSubmited: false // reset submit status
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  async updateStepOnBackend(){
    const res = await api.post('UpdateCurrentStepAsync?step=ConnectAdvertising');
    return await res.data;
  }

  render(){
    const { choosedOptions, marketplaceDomains, isFormSubmited, apiError, loading } = this.state
    const { signupFields } = this.props
    console.log('>>> herhehrer', marketplaceDomains)

    const options = signupFields.authenticated_marketplace.map(x => {
      return {
        id: x.MarketplaceId,
        name: x.Name,
        text: x.DomainName
      }
    })

    return(
      
      <div className={"loader-container " + (loading || isFormSubmited ? "is-loading" : null) }>
      
        <FormLoader />
        { apiError &&
          <span className="ui-input-validation">{apiError}</span>
        }
        <p className="t-parapgraph"><strong>Add Marketplaces to your SellerPoint account: </strong></p>
        <div className="signup__checkboxes">
          { !!marketplaceDomains && options.map((cb, i) => {
            return(
              <CheckBox
                key={`domainCheckBox-${i}`}
                name={cb.name}
                text={cb.name}
                clickHandler={this.chooseOption.bind(this, cb.id)}
                isActive={choosedOptions.indexOf(cb.id) >= 0 }
                isAddedToMarket={marketplaceDomains.findIndex((item) => item.id === cb.id) >= 0 }
              />
            )
          }) }
        </div>
        <div className="signup__form-cta signup__form-cta--centered">
          <span onClick={this.nextAction} className="btn btn-signup btn--block">Next</span>
        </div>
      </div>
     
    )
  }
}

const mapStateToProps = (state) => ({
  signupFields: state.signup.fields,
  signupAuthStep: state.signup.signupAuthStep,
  sellerId:state.seller_id
});

const mapDispatchToProps = (dispatch) => ({
  setSignupFields: (data) => dispatch(setSignupFields(data)),
  setSignupAuthStep: (data) => dispatch(setSignupAuthStep(data)),
  setSignupStep: (data) => dispatch(setSignupStep(data)),
  setAddMarketStep: (data) => dispatch(setAddMarketStep(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MWSActionDomain);
