import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import api from '../services/Api';
import FormInput from '../components/Forms/FormInput';
import CheckBox from '../components/Forms/CheckBox';
import FormLoader from '../components/Forms/FormLoader';
import { setSignupStep } from '../actions/signup';
import { RESET_STATE_SIGNUP } from '../store/ActionTypes';

import { setHeaderClass } from '../actions/header';
import { logIn, setAuthToken, setDataImportComplete } from '../actions/login';
import { setSignupId } from '../actions/signup';
import { APP_CONFIG } from '../constants'

class Login extends Component {
    static propTypes = {
        setHeaderClass: PropTypes.func.isRequired,
        logIn: PropTypes.func.isRequired,
        setAuthToken: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            rememberMe: false,
            formIsValid: false,
            apiError: null,
            authenticated: false,
            isFormSubmited: false
        }
    }

    formInvalid = () => {
        this.setState({ formIsValid: false });
    }

    formValid = () => {
        this.setState({ formIsValid: true });
    }

    handleChange = (e) => {
        let fieldName = e.target.name;
        let fleldVal = e.target.value;
        this.setState({ ...this.state, [fieldName]: fleldVal });
    }

    rememberToggler = () => {
        this.setState({
            rememberMe: !this.state.rememberMe
        })
    }

    handleSubmit = (e) => {
        if (this.state.formIsValid) {
            this.loginUser();
        }
    }

    submitForm = () => {
        // prevalidations if any ?
    }

    loginUser = async () => {
        try {
            const { email, password, rememberMe } = this.state;
            const { history, setSignupStep, setDataImportComplete } = this.props

            this.setState({
                isFormSubmited: true // reset submit status
            })

            const loginData = {
                userEmail: email,
                password: password,
                rememberMe: rememberMe
            }

            const loginRes = await api.post(`Login`, loginData)
            console.log('backend responce to POST LOGIN', loginRes)

            const { IsSuccess, AuthToken, UserInfo } = loginRes.data;
            if (IsSuccess && AuthToken) {
                this.props.logIn(UserInfo);
                this.props.setAuthToken(AuthToken);
                this.props.setSignupId(UserInfo.ClientID)

                if (UserInfo.KMASignUpCompleted === false && UserInfo.KMACurrentStep) {
                    switch (UserInfo.KMACurrentStep) {
                        case APP_CONFIG.SIGN_UP_STEP.ConnectAdvertising.key:
                            setSignupStep(APP_CONFIG.SIGN_UP_STEP.ConnectAdvertising.step)
                            history.push(`/signup/step-${APP_CONFIG.SIGN_UP_STEP.ConnectAdvertising.step}`)
                            break
                        case APP_CONFIG.SIGN_UP_STEP.ConnectSellerCentral.key:
                            setSignupStep(APP_CONFIG.SIGN_UP_STEP.ConnectSellerCentral.step)
                            history.push(`/signup/step-${APP_CONFIG.SIGN_UP_STEP.ConnectSellerCentral.step}`)
                            break
                        default:
                            break
                    }
                    return
                } else {
                    this.props.resetSignUp()
                }

                const importStatusRes = await api.get(`GetDataImportStatus`)
                const { DataImportComplete } = importStatusRes.data
                if (DataImportComplete) {
                    setDataImportComplete(true)
                }

                this.setState({
                    authenticated: true
                })
            } else {
                this.setState({
                    apiError: loginRes.data.ErrorMessage
                })
            }

            this.setState({
                isFormSubmited: false // reset submit status
            })
        } catch (e) {
            console.log(e)
        }
    }
    componentDidMount() {
        this.props.setHeaderClass('header--logo-only');
    }

    render() {

        const { email, password, rememberMe, apiError, isFormSubmited, authenticated } = this.state;

        if (authenticated) {
            return <Redirect to={`${process.env.PUBLIC_URL}/dash`} />
        }
        return (
            <div className="signup login">
                <div className="container">
                    <div className="login-container">
                   
                        <Formsy
                            className="signup__form login-form"
                            onSubmit={this.submitForm}
                            onValidSubmit={this.handleSubmit}
                            onValid={this.formValid}
                            onInvalid={this.formInvalid}
                            ref={this.formRef}
                        >
                         <h2>Sign In</h2>
                         <p>Sign In to start using our powerful</p>
                         <p>Business Intelligence tools</p>
                            <div className={"loader-container " + (isFormSubmited ? "is-loading" : "")}>
                                <FormLoader />
                                {apiError &&
                                    <span className="ui-input-validation">{apiError}</span>
                                }
                                                                
                                <FormInput
                                    name="email"
                                    label="Email"
                                    icon="mail.png"
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
                               
                               <div className="password">
                                <FormInput
                                    name="password"
                                    type="password" 
                                    label="Password"
                                    icon="lock.png"
                                    placeholder=""
                                    value={password}
                                    onChangeHandler={this.handleChange}
                                    validationErrors={{
                                        isDefaultRequiredValue: 'Please enter password'
                                    }}
                                    required
                                />
                                </div>
                               
                                <div className="login-remember ui-group">
                                    <CheckBox
                                        name="remember"
                                        text="Remember me?"
                                        clickHandler={this.rememberToggler}
                                        isActive={rememberMe}
                                    />
                                </div>
                                <Link to={`${process.env.PUBLIC_URL}/forgotpassword`} className="forgot"> Forgot Password? </Link>
                                                       <div className="signup__form-cta">
                                    <button type="submit" className="btn btn-signup btn--block">Login</button>
                                </div>
                                <Link to={`${process.env.PUBLIC_URL}/forgotpassword`} className="memeber"> Not a member? Sign up </Link>
                                                           </div>
                        </Formsy>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    DataImportComplete: state.login.DataImportComplete
});

const mapDispatchToProps = (dispatch) => ({
    setHeaderClass: (data) => dispatch(setHeaderClass(data)),
    logIn: (data) => dispatch(logIn(data)),
    setAuthToken: (data) => dispatch(setAuthToken(data)),
    setSignupId: (data) => dispatch(setSignupId(data)),
    setSignupStep: (data) => dispatch(setSignupStep(data)),
    setDataImportComplete: (completed) => dispatch(setDataImportComplete(completed)),
    resetSignUp: () => dispatch({ type: RESET_STATE_SIGNUP }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
