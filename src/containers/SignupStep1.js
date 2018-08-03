import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import ReCAPTCHA from 'react-google-recaptcha';

import { setSignupStep, setSignupEmail, setSignupId, setSignupFields } from '../actions/signup';
import api from '../services/Api';
import FormInput from '../components/FormInput';
import PassMeter from '../components/PassMeter';
import FormLoader from '../components/FormLoader';

class SignupStep1 extends Component {
  static propTypes = {
    signupEmail: PropTypes.string,
    signupFields: PropTypes.object,
    signupId: PropTypes.number,

    setSignupStep: PropTypes.func,
    setSignupId: PropTypes.func,
    setSignupEmail: PropTypes.func,
    setSignupFields: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      first_name: props.signupFields.first_name,
      last_name:  props.signupFields.last_name,
      company_name:  props.signupFields.company_name,
      email: props.signupEmail,
      phone: props.signupFields.phone,
      password: props.signupFields.password,
      password_confirmation: '',
      captcha: null,
      passwords_match: null,
      formIsValid: false,
      isTransitioningNext: false,
      apiError: null,
      isFormSubmited: false
    };

    this.formRef = React.createRef();
  }


  formInvalid = () => {
    this.setState({ formIsValid: false });
  }

  formValid = () => {
    this.setState({ formIsValid: true });
  }

  recaptchaVerify = (response) => {
    this.setState({
      captcha: response
    })
  }

  // submit handler from the form
  handleSubmit = (e) => {
    if ( this.state.formIsValid &&
         this.state.captcha &&
         ( this.state.password === this.state.password_confirmation )
       ){
      this.nextStep();
    }
  }

  // submit handler for the form (prevalidations, etc)
  submitForm = () => {
    if ( this.state.password === this.state.password_confirmation ){
      this.setState({passwords_match: true})
    } else {
      this.setState({passwords_match: false})
    }

    if ( this.state.captcha === null ){
      this.setState({captcha: false})
    }

    this.setState({
      apiError: null
    });
  }

  handleChange = (e) => {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({...this.state, [fieldName]: fleldVal});
  }

  nextStep = () => {
    const { first_name, last_name, company_name, email, phone, password, captcha } = this.state;

    const leadObj = {
      email: email,
      password: password,
      firstName: first_name,
      lastName: last_name,
      workPhone: phone,
      companyName: company_name,
      captchaResponse: captcha
    }

    this.setState({
      isFormSubmited: true // reset submit status
    })

    // check dublicate first
    // "{
    //   ""IsDuplicateUser"": true,
    //   ""IsSuccess"": true,
    //   ""ErrorMessage"": ""User with same details already exists in our database.""
    // }"

    api
      .get(`CheckEmail?Email=${email}`)
      .then((res) => {
        console.log('backend responce to Get CheckEmail', res)
        if ( res.data.IsDuplicateUser ){
          this.formRef.current.updateInputsWithError({
            email: res.data.ErrorMessage
          });
        } else {
          this.createUser(leadObj)
        }

        this.setState({
          isFormSubmited: false // reset submit status
        })
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  createUser = (leadObj) => {
    // create new user
    api
      .post(`Signup`, leadObj)
      .then((res) => {
        console.log('back-end responce to post Signup', res)
        if ( res.data.IsSuccess ){
          // this.props.setSignupId(res.data.id); // TODO
          this.props.setSignupEmail(res.config.data.email);
          this.updateSignup();
        } else {
          this.setState({
            apiError: res.data.ErrorMessage
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    // TODO
    // if signup ID is present - then update by PATCH
    // else - create new
    // if ( this.props.signupId ){
    //   // patch user
    //   api
    //     .patch('Signup' + this.props.signupId, {

    // } else {
    //   // create new user
    //   api
    //     .post(`Signup`, {
    // }
  }

  updateSignup = () => {

    const { first_name, last_name, company_name, phone, password } = this.state;

    this.setState({
      passwords_match: null // null pass validation
    })

    this.props.setSignupStep(2);

    this.props.setSignupFields({
      ...this.props.signupFields,
      first_name: first_name,
      last_name: last_name,
      company_name: company_name,
      phone: phone,
      password: password
    })

    this.setState({ isTransitioningNext: false })

  }


  render(){
    const { first_name, last_name, company_name, email, phone, password, password_confirmation, isTransitioningNext, apiError, isFormSubmited } = this.state;

    return(
      <div className="signup__container">

        <Formsy
          className="signup__form"
          onSubmit={this.submitForm}
          onValidSubmit={this.handleSubmit}
          onValid={this.formValid}
          onInvalid={this.formInvalid}
          ref={this.formRef}
        >
          <div className={"loader-container " + (isFormSubmited ? "is-loading" : null) }>
            <FormLoader />
            { apiError &&
              <span className="ui-input-validation">{apiError}</span>
            }
            <FormInput
              name="first_name"
              label="First Name"
              placeholder="Jennifer"
              value={first_name}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter your first name',
                minLength: 'Name is too short'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <FormInput
              name="last_name"
              label="Last Name"
              placeholder="Smith"
              value={last_name}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter your last name',
                minLength: 'Last name is too short'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <FormInput
                name="company_name"
                label="Company Name"
                placeholder="Sales Warehouse LLC"
                value={company_name}
                onChangeHandler={this.handleChange}
                validationErrors={{
                  isDefaultRequiredValue: 'Please enter company name'
                }}
                required
              />
            <FormInput
              name="email"
              label="Email Address"
              placeholder="jennifer@saleswarehouse.com"
              value={email}
              validations="isEmail"
              validationErrors={{
                isEmail: "This is not a valid email",
                isDefaultRequiredValue: 'Please enter email'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <FormInput
              name="phone"
              type="tel"
              label="Phone Number"
              placeholder="XXX-XXX-XXXX"
              value={phone}
              mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              onChangeHandler={this.handleChange}
              validations={{
                matchRegexp: /\d{3}-\d{3}-\d{4}/
              }}
              validationErrors={{
                matchRegexp: "Phone number is not valid",
              }}
            />
            <FormInput
              name="password"
              type="password"
              label="Password"
              placeholder=""
              value={password}
              onChangeHandler={this.handleChange}
              validations="minLength:8"
              validationErrors={{
                // isDefaultRequiredValue: 'Please enter password'
              }}
              required
            />
            <PassMeter password={password} />

            <FormInput
              name="password_confirmation"
              type="password"
              label="Confirm Password"
              placeholder=""
              value={password_confirmation}
              onChangeHandler={this.handleChange}
              required
            />
            { this.state.passwords_match === false &&
              <span className="ui-input-validation">Passwords didn't match</span>
            }
            <div className="signup__captcha">
              <ReCAPTCHA
                sitekey="6Ld-90UUAAAAAP1OQz2XtlLe_zd8AYmMCql1vJXE"
                render="explicit"
                onChange={this.recaptchaVerify}
              />
            </div>
            { this.state.captcha === false &&
              <span className="ui-input-validation">Please enter captcha</span>
            }
            <div className="signup__rules">
            By signing up, you are agreeing to KiniMetrix’s <br/><a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
            </div>
            <div className="signup__form-cta">
              <button type="submit" className="btn btn-signup btn--block">Sign Up</button>
            </div>
          </div>
        </Formsy>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  signupFields: state.signup.fields,
  signupEmail: state.signup.signupEmail,
  signupId: state.signup.signupId
});

const mapDispatchToProps = (dispatch) => ({
  setSignupStep: (data) => dispatch(setSignupStep(data)),
  setSignupFields: (data) => dispatch(setSignupFields(data)),
  setSignupEmail: (data) => dispatch(setSignupEmail(data)),
  setSignupId: (data) => dispatch(setSignupId(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupStep1);
