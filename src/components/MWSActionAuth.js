import React, { Component } from 'react';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import FormInput from './Forms/FormInput';
import Image from './Helpers/Image';
import FormLoader from './Forms/FormLoader';
import api from '../services/Api';
import { setSignupFields, setSignupAuthStep } from '../actions/signup';

class MWSActionAuth extends Component {

  constructor(props){
    super(props);

    this.state = {
      seller_id: '',
      mws_auth: '',
      apiError: null,
      isFormSubmited: false
    }

    this.formRef = React.createRef();
  }

  componentWillUnmount () {
    this.formRef.reset()
  }

  handleChange = (e) => {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({...this.state, [fieldName]: fleldVal});
  }

  formInvalid = () => {
    this.setState({ formIsValid: false });
  }

  formValid = () => {
    this.setState({ formIsValid: true });
  }

  submitForm = () => {
    this.setState({
      apiError: null // null errors on submit
    });
    this.formRef.current.submit();
  }

  validSubmit = () => {
    if ( this.state.formIsValid ){ // repeat validations rules if non-default
      this.sendToBackend()
    }
  }

  sendToBackend = async () => {
    try {
      const { seller_id, mws_auth } = this.state;

      const leadObj = {
        sellerId: seller_id.trim(),
        mwsAuthToken: mws_auth.trim()
      }

      this.setState({
        isFormSubmited: true
      })

      // authenticate
      const res = await api.post(`AuthenticateMWSDetails`, leadObj)
      console.log('back-end responce to post AuthenticateMWSDetails', res)
      if ( res.data.IsSuccess ){
        this.props.setSignupFields({ // update redux store
          ...this.props.signupFields,
          seller_id: leadObj.sellerId,
          mws_auth: leadObj.mwsAuthToken,
          authenticated_marketplace: res.data.Marketplace
        })
    
        this.props.setSignupAuthStep(
          this.props.signupAuthStep + 1
        )
      } else {
        this.setState({
          apiError: res.data.ErrorMessage,
          isFormSubmited: false
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  render(){

    const { seller_id, mws_auth, apiError, isFormSubmited } = this.state

    return(
      <div className={"loader-container " + (isFormSubmited ? "is-loading" : null) }>
        <FormLoader />
        <div className="signup__choose signup__choose--not-bold">Copy & paste the ‘Seller ID’ and ‘MWS Auth Token’ from Amazon into the fields below.</div>
        <div className="signup__subcontainer">
          <Formsy
            className="signup__seller-form"
            // onSubmit={this.submitForm}
            onValidSubmit={this.validSubmit}
            onValid={this.formValid}
            onInvalid={this.formInvalid}
            ref={(node) => { this.formRef = node }}
          >
            { apiError &&
              <span className="ui-input-validation">{apiError}</span>
            }
            <FormInput
              name="seller_id"
              label="Seller ID"
              placeholder=""
              value={seller_id}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter Seller Id',
                minLength: 'ID is invalid'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <FormInput
              name="mws_auth"
              label="MWS Auth Token"
              placeholder=""
              value={mws_auth}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter MWS Auth Token',
                minLength: 'MWS Auth Token is invalid'
              }}
              onChangeHandler={this.handleChange}
              required
            />

            <p className="t-parapgraph">If you are having trouble, below is an example of where to find this information. </p>
            <Image image="amazonMWS.jpg" />

            <div className="signup__form-cta signup__form-cta--centered">
              <button type="submit" className="btn btn-signup btn--block">Next</button>
            </div>
          </Formsy>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  signupFields: state.signup.fields,
  signupAuthStep: state.signup.signupAuthStep
});

const mapDispatchToProps = (dispatch) => ({
  setSignupFields: (data) => dispatch(setSignupFields(data)),
  setSignupAuthStep: (data) => dispatch(setSignupAuthStep(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MWSActionAuth);
