import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { withRouter } from 'react-router-dom'

import { setSignupStep, setSignupEmail, setSignupId, setSignupFields } from '../actions/signup';
import { logIn, setAuthToken } from '../actions/login';
import api from '../services/Api';
import FormInput from '../components/Forms/FormInput';
import PassMeter from '../components/Forms/PassMeter';
import FormLoader from '../components/Forms/FormLoader';
import { tAndC, privacyPolicy } from '../components/Footer';
import Toaster, { showToastMessage } from '../services/toasterNotification'

class SignupStep1 extends Component {
  static propTypes = {
    signupEmail: PropTypes.string,
    signupFields: PropTypes.object,
    signupId: PropTypes.number,

    setSignupStep: PropTypes.func,
    setSignupId: PropTypes.func,
    setSignupEmail: PropTypes.func,
    setSignupFields: PropTypes.func,
    setAuthToken: PropTypes.func,
    logIn: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      first_name: props.signupFields.first_name,
      last_name: props.signupFields.last_name,
      company_name: props.signupFields.company_name,
      email: props.signupEmail,
      phone: props.signupFields.phone,
      password: props.signupFields.password,
      password_confirmation: '',
      captcha: null,
      passwords_match: null,
      formIsValid: false,
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
    if (
      this.state.formIsValid &&
      this.state.captcha &&
      (this.state.password === this.state.password_confirmation)
    ) {
      this.nextStep();
    }
  }

  // submit handler for the form (prevalidations, etc)
  submitForm = () => {
    if (this.state.password === this.state.password_confirmation) {
      this.setState({ passwords_match: true })
    } else {
      this.setState({ passwords_match: false })
    }

    if (this.state.captcha === null) {
      this.setState({ captcha: false })
    }

    this.setState({
      apiError: null
    });
  }

  handleChange = (e) => {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({ ...this.state, [fieldName]: fleldVal });
  }

  nextStep = () => {
    const { first_name, last_name, company_name, email, phone, password, captcha } = this.state;
    const { history } = this.props
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
    api
      .get(`CheckEmail?Email=` + encodeURIComponent(email))
      .then((res) => {
        console.log('backend responce to Get CheckEmail', res)
        if (res.data.IsSuccess) {
          if (res.data.IsDuplicateUser) {
            this.setState({
              apiError: res.data.ErrorMessage,
              isFormSubmited: false
            })
            showToastMessage(res.data.ErrorMessage, "Error");
          } else {
            this.createUser(leadObj) // move on if it's fine
          }
        }
        else {
          this.setState({
            apiError: res.data.ErrorMessage,
            isFormSubmited: false
          })
          showToastMessage(res.data.ErrorMessage, "Error");
        }
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
        if (res.data.IsSuccess) {
          this.props.setSignupEmail(res.config.data.email);
          this.props.logIn(res.data.UserInfo);
          this.props.setSignupId(res.data.UserInfo.ClientID);
          this.props.setAuthToken(res.data.AuthToken);
          this.updateSignup();
        } else {
          if (res.data.ErrorMessage && res.data.ErrorMessage.toLowerCase().includes('google recaptcha')) {
            this.recaptchaRef.reset && this.recaptchaRef.reset()
          }
          this.setState({
            apiError: res.data.ErrorMessage
          })
          showToastMessage(res.data.ErrorMessage, "Error");
        }

        this.setState({ isFormSubmited: false })
      })
      .catch(function (error) {
        console.log(error);
      });
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

    this.updateStepOnBackend()
      .then(res => {
        console.log(res)
      })
      .catch(err => {

      });
  }

  async updateStepOnBackend() {
    const res = await api.post('UpdateCurrentStepAsync?step=ConnectSellerCentral');
    return await res.data;
  }

  getEmailUrl = () => {
    const { location } = this.props

    const params = new URLSearchParams(location.search)
    const emailUrl = params.get('email')

    if (emailUrl) {
      this.setState({
        email: emailUrl
      })
    }
  }

  componentDidMount() {
    this.getEmailUrl()
  }

  render() {
    const { first_name, last_name, company_name, email, phone, password, password_confirmation, apiError, isFormSubmited } = this.state;

    return (
      <div className="signup__container">
        <Toaster />
        <Formsy
          className="signup__form"
          onSubmit={this.submitForm}
          onValidSubmit={this.handleSubmit}
          onValid={this.formValid}
          onInvalid={this.formInvalid}
          ref={this.formRef}
        >
          <div className={"loader-container " + (isFormSubmited ? "is-loading" : null)}>
            <FormLoader />
            {apiError &&
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
            {this.state.passwords_match === false &&
              <span className="ui-input-validation">Passwords did not match</span>
            }
            <div className="signup__captcha">
              <ReCAPTCHA
                ref={(node) => { this.recaptchaRef = node }}
                sitekey="6Ld-90UUAAAAAP1OQz2XtlLe_zd8AYmMCql1vJXE"
                render="explicit"
                onChange={this.recaptchaVerify}
              />
            </div>
            {this.state.captcha === false &&
              <span className="ui-input-validation">Please enter captcha</span>
            }
            <div className="signup__rules">
              By signing up, you are agreeing to KiniMetrix’s <br /><a onClick={tAndC} rel="noopener noreferrer">Terms of Use</a> and <a onClick={privacyPolicy} rel="noopener noreferrer">Privacy Policy</a>.
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
  signupEmail: state.signup.signupEmail
});

const mapDispatchToProps = (dispatch) => ({
  setSignupStep: (data) => dispatch(setSignupStep(data)),
  setSignupFields: (data) => dispatch(setSignupFields(data)),
  setSignupEmail: (data) => dispatch(setSignupEmail(data)),
  setSignupId: (data) => dispatch(setSignupId(data)),
  setAuthToken: (data) => dispatch(setAuthToken(data)),
  logIn: (data) => dispatch(logIn(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignupStep1));
