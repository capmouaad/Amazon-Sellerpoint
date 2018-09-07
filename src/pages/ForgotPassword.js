import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setHeaderClass } from '../actions/header';
import { setAuthToken } from '../actions/login';
import Formsy from 'formsy-react';
import FormLoader from '../components/Forms/FormLoader';
import FormInput from '../components/Forms/FormInput';
import api from '../services/Api';

class ForgotPassword extends Component {
    static propTypes = {
        setHeaderClass: PropTypes.func.isRequired,
        setAuthToken: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isFormSubmited: false,
            apiError: null,
            email: "",
            formIsValid: false,
            showThankYouPage: false
        }
    }

    componentDidMount() {
        this.props.setHeaderClass('header--logo-only');
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

    handleSubmit = (e) => {
        if (this.state.formIsValid) {
            this.forgotPasswordSubmit();
        }
    };

    forgotPasswordSubmit = async () => {
        try {
            const { email } = this.state;
            this.setState({
                isFormSubmited: true // reset submit status
            })
            const forgotPasswordData = {
                userEmail: email
            }
            const forgotPasswordRes = await api.post(`ForgotPassword`, forgotPasswordData)
            console.log('backend responce to POST ForgotPassword ', forgotPasswordRes)

            const { IsSuccess } = forgotPasswordRes.data;
            if (IsSuccess) {
                this.formRef.reset()
                this.setState({
                    showThankYouPage: true // show the thank you message
                })
            } else {
                this.setState({
                    apiError: forgotPasswordRes.data.ErrorMessage
                })
            }
        } catch (e) {
            console.log(e)
        } finally {
            this.setState({
                isFormSubmited: false // reset submit status
            })
        }
    }

    render() {
        const { email, apiError, isFormSubmited, showThankYouPage } = this.state;

        return (

            <div className="signup login">
                <div className="container">
                    <div className="login-container">
                        {!showThankYouPage ? (
                            <Formsy
                                className="signup__form login-form"
                                onValidSubmit={this.handleSubmit}
                                onValid={this.formValid}
                                onInvalid={this.formInvalid}
                                ref={(node) => { this.formRef = node }}
                            >
                                <h2>Reset Password</h2>
                                <p>We will send you an e-mail with instructions</p>
                                <p className="mb-15">on how to reset your password.</p>
                                <div className={"loader-container " + (isFormSubmited ? "is-loading" : "")}>
                                    <FormLoader />
                                    {apiError &&
                                        <span className="ui-input-validation">{apiError}</span>
                                    }
                                    <div className="email asterisk-removed">
                                        <FormInput
                                            name="email"
                                            label="Email"
                                            placeholder=""
                                            icon="email"
                                            value={email}
                                            validations="isEmail"
                                            validationErrors={{
                                                isEmail: "This is not a valid email",
                                                isDefaultRequiredValue: 'Please enter email'
                                            }}
                                            onChangeHandler={this.handleChange}
                                            ref={(node) => { this.emailInput = node }}
                                            required
                                        />
                                    </div>
                                    <div className="signup__form-cta">
                                        <button type="submit" className="btn btn-signup btn--block">Reset Password</button>
                                    </div>

                                    <Link to='/login' className="cancel-btn"> Cancel </Link>

                                </div>
                            </Formsy>) : (<Formsy className="signup__form login-form thankyou-form">
                                <h2>Reset Password</h2>
                                <p className="mb-15 line-h mar-t">Instructions to reset your password have been sent to the address provided.</p>
                                <p className="mb-15">Please check your inbox and spam folder.</p>
                                <p className="mb-15 link-color"><Link to='/login'>Click here</Link> to return to the login screen.</p>
                            </Formsy>)}
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
    setAuthToken: (data) => dispatch(setAuthToken(data))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword));
