import React, { Component } from 'react';
import { connect } from 'react-redux';
// import api from '../services/Api';
import { setSignupFields, setSignupAuthStep } from '../actions/signup';

class MWSActionRegion extends Component {

  chooseOption = (id) => {
    this.props.setSignupFields({ // redux
      ...this.props.signupFields,
      marketplace_region: id
    })
  }

  nextAction = () => {
    // open MWS authorization page
    window.open("https://sellercentral.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1&developerName=KiniMetrix&devMWSAccountId=586216165313");

    this.props.setSignupAuthStep(
      this.props.signupAuthStep + 1
    )
  }

  render(){

    const { marketplace_region: marketplaceRegion = 1 } = this.props.signupFields

    return(
      <React.Fragment>
        <div className="signup__choose">Choose the marketplace you would like to connect:</div>
        <div className="signup__options">
          <SignupOption clickHandler={this.chooseOption} number={1} currentStep={marketplaceRegion} title="Americas (US, CA, MX, BR)" />
          <SignupOption clickHandler={this.chooseOption} number={2} currentStep={marketplaceRegion} title="Europe (not yet available)" disabled={true} />
          <SignupOption clickHandler={this.chooseOption} number={3} currentStep={marketplaceRegion} title="Asia (not yet available)" disabled={true} />
        </div>

        <div className="signup__note">
          <strong>From here, you will be redirected to Amazon to grant permission for KiniMetrix Sellerpoint.</strong>
          <br /><br />
          1. Make sure that you sign into your SellerCentral account
          <br /><br />
          2. The Amazon Marketplace Webservice will autopopulate KiniMetrix Sellerpoint’s information
          <br /><br />
          3. Grant permission to KiniMetrix Sellerpoint by confirming
          <br /><br />
          4. Once the connection is made, you will come back and input the ‘Seller ID’ and the ‘MWS Auth Token’
        </div>
        <div className="signup__form-cta signup__form-cta--centered">
          <span onClick={this.nextAction} className="btn btn-signup btn--block">Connect Marketplace</span>
        </div>
      </React.Fragment>
    )
  }
}

const SignupOption = (props) => {
  const { number, currentStep, title, clickHandler, disabled } = props
  return (
    <div
      className={"signup-option" + (currentStep === number ? " is-active" : "")}
      onClick={() => clickHandler(number)}
      data-disabled={disabled ? true : false}
    >{title}</div>
  )
}


const mapStateToProps = (state) => ({
  signupFields: state.signup.fields,
  signupAuthStep: state.signup.signupAuthStep
});

const mapDispatchToProps = (dispatch) => ({
  setSignupFields: (data) => dispatch(setSignupFields(data)),
  setSignupAuthStep: (data) => dispatch(setSignupAuthStep(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MWSActionRegion);
