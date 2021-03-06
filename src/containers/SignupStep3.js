import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAddMarketStep, setSignupStep } from '../actions/signup';
import FormLoader from '../components/Forms/FormLoader';
import ConnectMarketplaces from '../components/ConnectMarketplaces';
import api from '../services/Api'
import { APP_CONFIG } from '../constants'

class SignupStep3 extends Component {

  static propTypes = {
    setSignupStep: PropTypes.func,
  };

  constructor(props) {
    super(props)

    this.state = {
      shouldRedirect: false,
      isFormSubmited: false,
      apiError: null,
      isAdvertisingOptedOut: false,
      error: false,
      isDisabled: false
    }
  }

  setApiError = (error) => {
    this.setState(error)
  }

  onFormSubmited = (state) => {
    this.setState({
      isFormSubmited: state
    })
  }

  compleateSignup = async () => {
    const { LWA } = this.props
    try {
      if (!this.state.isAdvertisingOptedOut && (!LWA.resp.code && !LWA.resp.scope)) {
        this.setState({
          error: true
        })
      } else {
        this.setState({
          error: false
        })

        await this.compleateSignupOnBackend()

        if (!this.props.onGoBackMarket) {
          this.setState({
            shouldRedirect: true
          })
          this.props.setSignupStep(1);
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  compleateSignupOnBackend = async () => {
    if (this.state.isAdvertisingOptedOut) {
      const resAd = await api.post('AdvertisingOptOut', { sellerId: this.props.sellerId });
      if (!resAd.data.IsSuccess) {
        throw new Error(resAd.data.ErrorMessage)
      }
    }

    if (!this.props.onGoBackMarket) {
      const ressignup = await api.post('SignUpComplete')
      if (!ressignup.data.IsSuccess) {
        throw new Error(ressignup.data.ErrorMessage)
      }
    } else {
      this.props.onGoBackMarket({ isSkipPrompt: true })
      this.props.setAddMarketStep(1)
    }
  }

  onCheckedInput = () => {
    this.setState({
      isAdvertisingOptedOut: !this.state.isAdvertisingOptedOut,
      error: ''
    })
  }

  getSellerMarketplaces = () => {
    api
      .get(`GetSellerMarketPlaces`)
      .then((res) => {
        console.log('backend responce to GET GetSellerMarketPlaces', res)
        const { Marketplaces } = res.data
        const MarketsConnected = Marketplaces.some((market) => market.IsAdvertisingConnected === true)

        if (MarketsConnected) {
          this.setState({ isDisabled: true })
        } else {
          this.setState({ isDisabled: false })
        }

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getSellerMarketplaces()
  }

  render() {
    const { shouldRedirect, isFormSubmited, apiError, error, isDisabled } = this.state;
    const { isMarketSetup } = this.props

    if (shouldRedirect) {
      return <Redirect to={`${process.env.PUBLIC_URL}/dash/welcome`} />
    }

    return (
      <div className="signup__container signup__container--wide">
        <div className={"loader-container " + (isFormSubmited ? "is-loading" : null)}>
          <FormLoader />
          {apiError &&
            <span className="ui-input-validation">{apiError}</span>
          }
          <div className={isMarketSetup ? 'signup__form config-padding' : 'signup__form'}>
            <div className="signup__heading">Set up your advertising data by connecting your Sponsored Products so we can help you manage the effectiveness of your campaigns</div>
            <ConnectMarketplaces
              advState={this.props.advState || APP_CONFIG.LWA_Source.SignUpStep3.state}
              onApiError={this.setApiError}
              onFormSubmited={this.onFormSubmited}
              isInitialImport={true}
            />
            <div className="signup__form-cta signup__form-cta--centered">
              <input type="checkbox" onChange={this.onCheckedInput} disabled={isDisabled} className={isDisabled ? 'check-box-disabled' : ''} /> I don't have advertising data to connect
              </div>

            <div className="signup__form-cta signup__form-cta--centered">
              <span onClick={this.compleateSignup} className="btn btn-signup btn--block">Complete</span>
            </div>
            {
              error && <div style={{ display: 'block', textAlign: 'center', paddingTop: '10px' }}>
                <span style={{ color: 'red', fontSize: 14 }}>{`Please click "Connect" to connect your advertising data or click the opt-out checkbox to continue`}</span>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  signupId: state.signup.signupId,
  LWA: state.lwa,
  sellerId: state.signup.fields.seller_id
})

const mapDispatchToProps = (dispatch) => ({
  setSignupStep: (data) => dispatch(setSignupStep(data)),
  setAddMarketStep: (data) => dispatch(setAddMarketStep(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupStep3)
