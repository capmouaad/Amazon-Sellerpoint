import React, { Component } from 'react';
import ConnectMarketplaces from '../ConnectMarketplaces';
import MWSActionRegion from '../MWSActionRegion';
import MWSActionAuth from '../MWSActionAuth'
import MWSActionDomain from '../MWSActionDomain'
import { Prompt } from 'react-router-dom'
import { setAddMarketStep, setSignupAuthStep } from '../../actions/signup'
import { connect } from 'react-redux';
import SignupStep3 from '../../containers/SignupStep3'
import { APP_CONFIG } from '../../constants'

const SignupNavEl = (props) => {

  const classControl = "signup-nav__el" + (props.step === props.number ? " is-current-market" : " is-feature") + (props.step > props.number ? " is-done-step-market" : "")

  return (
    <div className={classControl}>
      <div className="signup-nav__number"><span>{props.number}</span></div>
      <div className="signup-nav__name_config" dangerouslySetInnerHTML={{ __html: props.name }} />
    </div>
  )
}

class AddMarketSwitch extends Component {
  componentDidMount() {
    this.props.resetSignupAuthStep(1)
  }

  renderAddMarketStep = () => {
    const { signupAuthStep, addMarketStep } = this.props
    if (addMarketStep === 1) {
      switch (signupAuthStep) {
        case 1:
          return (
            <div className='market-msw-region'>
              <MWSActionRegion />
            </div>
          )
        case 2:
          return (
            <div className='wrapper-market-step'>
              <MWSActionAuth />
            </div>
          )
        case 3:
          return (
            <div className='wrapper-market-step'>
              <MWSActionDomain isMarketSetup />
            </div>
          )
        default:
          return null
      }
    } else {
      return <SignupStep3 isMarketSetup advState={APP_CONFIG.LWA_Source.Configuration.state} onGoBackMarket={this.goBackMarketPlace} />
    }
  }

  goBackMarketPlace = () => {
    this.props.onGoback()
    this.props.resetSignupAuthStep(1)
  }

  renderTitleStep = () => {
    const { signupAuthStep } = this.props
    switch (signupAuthStep) {
      case 1:
        return <h1 className="signup__heading">{`Connect with your SellerCentral account`}</h1>
      case 2:
        return <h1 className="signup__heading">{`Connect with your SellerCentral account`}</h1>
      case 3:
        return <h1 className="signup__heading">{`Set up your advertising data by connecting your Sponsored Products so we can help you manage the effectiveness of your campaigns`}</h1>
      default:
        return null
    }
  }

  render() {
    const { addMarketStep } = this.props
    return (
      <div>
        <Prompt
          when
          message={location =>
            `Are you sure you want to leave setup?`
          }
        />
        <div>
          <button onClick={this.goBackMarketPlace} className="btn btn-go-back-market">{`Back to Marketplace Configuration Home`}</button>
        </div>
        <div className="signup-nav">
          <div className="signup-nav__wrapper">
            <SignupNavEl number={1} name="Connect with<br/>SellerCentral" step={addMarketStep} />
            <SignupNavEl number={2} name="Connect<br/>Advertising Data" step={addMarketStep} />
          </div>
        </div>
        <div style={{ paddingTop: 20 }}>
          {
            this.renderTitleStep()
          }
        </div>
        {this.renderAddMarketStep()}
      </div>
    )
  }
}

class DashMarketplaceConfig extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFormSubmited: false,
      apiError: null,
      marketPlace: 0
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

  addNewMarketplace = () => {
    this.setState({
      marketPlace: 1
    })
  }

  onGoBack = () => {
    this.setState({
      marketPlace: 0
    })
  }

  renderMarketPlace = () => {
    switch (this.state.marketPlace) {
      case 0:
        return (
          <div>
            <div className="dash-new-marketplace">
              <a className="btn btn-new-marketplace" onClick={this.addNewMarketplace}>Add New Marketplace</a>
            </div>
            <ConnectMarketplaces
              advState={APP_CONFIG.LWA_Source.Configuration.state}
              onApiError={this.setApiError}
              onFormSubmited={this.onFormSubmited}
            />
          </div>
        )
      case 1:
        return (
          <AddMarketSwitch signupAuthStep={this.props.signupAuthStep} resetSignupAuthStep={this.props.setSignupAuthStep} onGoback={this.onGoBack} signupStep={this.props.signupStep} addMarketStep={this.props.addMarketStep} />
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div className="dash-container">
        <div className="container container--full">
          {
            this.renderMarketPlace()
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  signupAuthStep: state.signup.signupAuthStep,
  signupStep: state.signup.signupStep,
  addMarketStep: state.signup.addMarketStep
});

const mapDispatchToProps = (dispatch) => ({
  setSignupAuthStep: (data) => dispatch(setSignupAuthStep(data)),
  setAddMarketStep: (data) => dispatch(setAddMarketStep(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashMarketplaceConfig);
