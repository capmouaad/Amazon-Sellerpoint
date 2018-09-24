import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import FormInput from '../components/Forms/FormInput';
import CheckBox from '../components/Forms/CheckBox';
import FormLoader from '../components/Forms/FormLoader';
import { withRouter, Redirect } from 'react-router-dom';
import Image from '../components/Helpers/Image';
import { APP_CONFIG } from '../constants'
import api from '../services/Api';
import { RESET_STATE_SIGNUP, SET_STATUS_PROGRESS, SET_NAVBAR_DASHBOARD } from '../store/ActionTypes';
import { setSignupStep } from '../actions/signup';
import { setHeaderClass } from '../actions/header';
import { logIn, setAuthToken, setDataImportComplete } from '../actions/login';
import { setSignupId } from '../actions/signup';
import { CanvasBG, CanvasBG1 } from '../components/CanvasBG.js';
import { Helmet } from "react-helmet";

const options = {
    width: window.innerWidth,
    height: window.innerHeight,
    Loc: {
        x: window.innerWidth / 6,
        y: window.innerHeight / 6
    }
}

class KMLogin extends Component {
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
            isFormSubmited: false,
            clientType: 0
        }
    }

    componentDidMount() {
        this.props.setHeaderClass('no-header')
        CanvasBG(options)
        CanvasBG1(options)
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
                this.props.setStatusProgress({
                    finaceDataProgress: 0,
                    reportDataProgress: 0,
                    adDataProgress: 0
                })
                this.props.setNavbarDashboard({
                    dashboards: [],
                    settings: []
                })

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

                if (UserInfo.ClientType !== 3) {
                    this.setState({
                        authenticated: true,
                        clientType: UserInfo.ClientType
                    })
                } else {
                    const importStatusRes = await api.get(`GetDataImportStatus`)
                    const { DataImportComplete, FinanceDataImportProgress, ReportDataImportProgress, AdvertisingOptedOut } = importStatusRes.data
                    if (DataImportComplete || (FinanceDataImportProgress === 100 && ReportDataImportProgress === 100 && AdvertisingOptedOut)) {
                        setDataImportComplete(true)
                        history.push('/dash/dashboards')
                    } else {
                        history.push('/dash/welcome')
                    }
                }
            } else {
                this.setState({
                    apiError: loginRes.data.ErrorMessage
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        const { email, password, rememberMe, apiError, isFormSubmited, authenticated, clientType } = this.state;

        if (authenticated) {
            if (clientType !== 3) {
                setTimeout(() => { window.location = window.location.origin + "/home/index"; }, 2000);
            }
            else {
                return <Redirect to={`${process.env.PUBLIC_URL}/dash`} />
            }
        }
        return (
            <div className="kmlogin-bg">

                <Helmet>
                    <title>KiniMetrix</title>
                </Helmet>

                <div id="canvas-wrapper">
                    <canvas id="demo-canvas"></canvas>
                </div>
                <div id="canvas-wrapper1">
                    <canvas id="demo-canvas1"></canvas>
                </div>
                <section className="login clearfix">
                    <div className="header-logo">
                        <Image image="login-logo.png" />
                    </div>
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
                            <p>Sign In to start using our powerful Business</p>
                            <p className="mb-15">Intelligence tools for your organization.</p>
                            <div className={"loader-container " + (isFormSubmited ? "is-loading" : "")}>
                                <FormLoader />
                                {apiError &&
                                    <span className="ui-input-validation">{apiError}</span>
                                }
                                <div className="email asterisk-removed">
                                    <FormInput
                                        name="email"
                                        label="Email"
                                        placeholder="Email"
                                        icon="envelope"
                                        iconClass="bak-grey"
                                        value={email}
                                        validations="isEmail"
                                        validationErrors={{
                                            isEmail: "This is not a valid email",
                                            isDefaultRequiredValue: 'Please enter email'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        required
                                    />
                                </div>
                                <div className="password asterisk-removed">
                                    <FormInput
                                        name="password"
                                        type="password"
                                        icon="padlock"
                                        iconClass="bak-grey"
                                        label="Password"
                                        placeholder="Password"
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
                                        text="Remember me"
                                        clickHandler={this.rememberToggler}
                                        isActive={rememberMe}
                                    />
                                </div>
                                <a href={window.location.origin + "/Account/ForgotPassword"} className="forgot"> Forgot Password? </a>
                                <div className="signup__form-cta">
                                    <button type="submit" className="btn btn-signup btn--block">Sign In</button>
                                </div>
                            </div>
                        </Formsy>
                    </div>

                    <div className="col-md-12 info-text">
                        <div className="content text-center">
                            <h4 className="text-uppercase text-white">Are you looking for The Kini Group corporate site? <a href="https://thekinigroup.com/" target="_blank" rel="noopener noreferrer" className="text-yellow">Click Here</a></h4>
                        </div>
                    </div>
                </section>

                <div className="login-footer">
                    <div className="navbar navbar-default navbar-fixed-bottom">
                        <div className="col-xs-12 col-sm-12 col-lg-6 footer-left">
                            &copy; <span> <Image image="Logo2.png" /></span>. All rights reserved.
            </div>
                        <div className="col-xs-12 col-sm-12 col-lg-6 buttn-group">
                            <button onClick={() => { window.open(window.location.origin + "/Account/TermsAndConditions", "_blank"); }} className="btn btn-bordered-dark"><i className="fa fa-file-text"></i>Terms & Conditions</button>
                            <button onClick={() => { window.open(window.location.origin + "/Account/PrivacyPolicy", "_blank"); }} className="btn btn-bordered-dark"><i className="fa fa-key"></i>Privacy Policy</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    DataImportComplete: state.login.DataImportComplete
});

const mapDispatchToProps = (dispatch) => (
    {
        setHeaderClass: (data) => dispatch(setHeaderClass(data)),
        logIn: (data) => dispatch(logIn(data)),
        setAuthToken: (data) => dispatch(setAuthToken(data)),
        setSignupId: (data) => dispatch(setSignupId(data)),
        setSignupStep: (data) => dispatch(setSignupStep(data)),
        setDataImportComplete: (completed) => dispatch(setDataImportComplete(completed)),
        resetSignUp: () => dispatch({ type: RESET_STATE_SIGNUP }),
        setStatusProgress: (data) => dispatch({ type: SET_STATUS_PROGRESS, payload: data }),
        setNavbarDashboard: (data) => dispatch({ type: SET_NAVBAR_DASHBOARD, payload: data })
    });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(KMLogin));
