import React, { Component } from 'react';
import { Redirect,Link } from 'react-router-dom';
import api from '../services/Api';
import "react-table/react-table.css";
import FormInput from '../components/Forms/FormInput';
import PassMeter from '../components/Forms/PassMeter';
import Formsy from 'formsy-react';
import FormLoader from '../components/Forms/FormLoader';
import PropTypes from 'prop-types';
import { setHeaderClass } from '../actions/header';
import Toaster, { showToastMessage } from '../services/toasterNotification'
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

const handleDropRejected = (...args) => console.log('reject', args)

class ChangePasswordComponent extends Component {
    static propTypes = {
        setHeaderClass: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            password: {
                CurrentPassword: '',
                NewPassword: '',
                ConfirmNewPassword: ''
            },
            formIsValid: false,
            isLoading: false,
            matchPassword:null
        }
        this.changePassword = this.changePassword.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.setHeaderClass('header--dash');
    }
   

    formInvalid = () => {
        this.setState({ formIsValid: false });
    }

    formValid = () => {
        this.setState({ formIsValid: true });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        const password = this.state.password;
        password[name] = value;
        this.setState({ ...this.state, password });
    }

    // submit handler from the form
    handleSubmit = (e) => {
let matchPassword=null;
        if (this.state.password.NewPassword===this.state.password.ConfirmNewPassword) {
            matchPassword=true
           this.setState({...this.state,matchPassword});
        }
        else {
            matchPassword=false;
            this.setState({...this.state,matchPassword});
        }

        if (this.state.formIsValid && matchPassword) {
            this.changePassword() // move on if it's fine
        }
    }

    changePassword = () => {
       
        this.setState({ isLoading: true });

        api
            .post(`ChangePassword`, this.state.password)
            .then((res) => {
                console.log('backend responce to GET UpdateSellerProfile', res)
                if (res.data.IsSuccess) {
                    showToastMessage(res.data.ErrorMessage, "Success");
                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
                this.setState({ isLoading: false });
            })
            .catch(function (error) {
                this.setState({ isLoading: false });
                console.log(error);
            });
    }

    render() {
        const { authToken } = this.props
        const { password, isLoading,matchPassword } = this.state

        if (!authToken) {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
            )
        }

        return (
            <React.Fragment>
                <Toaster />
                <div className="newpassword">
                    <div className={isLoading ? "container loader-inside loader-inside" : "container loader-inside loader-inside loading-over"}>
                        <FormLoader />
                        <div className="newpassword__container">
                            <Formsy
                                className="newpassword__form"
                                onValidSubmit={this.handleSubmit}
                                onValid={this.formValid}
                                onInvalid={this.formInvalid}
                            >
                                <div className="row"><h2>Change Password</h2><p></p></div>

                                <div className="row">
                                    <div className="col-sm-5"><FormInput
                                        name="CurrentPassword"
                                        label="Current Password"
                                        type="password"
                                        placeholder="Enter current password"
                                        validations="minLength:8"
                                        value={password.CurrentPassword}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>
                                    <div className="col-sm-5"><FormInput
                                        name="NewPassword"
                                        label="New Password"
                                        type="password"
                                        placeholder="Enter new password (8 char. min)"
                                        value={password.NewPassword}
                                        validations="minLength:8"
                                        validationErrors={{
                                            // isDefaultRequiredValue: 'Please enter password'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        required
                                    />
                                    <PassMeter password={password.NewPassword} />
                                    
                                    </div>
                                    <div className="col-sm-5"><FormInput
                                        name="ConfirmNewPassword"
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Confirm new password (8 char. min)"
                                        value={password.ConfirmNewPassword}
                                        validations="minLength:1"
                                        onChangeHandler={this.handleChange}
                                        required
                                    />
                                    {matchPassword === false &&
                                        <span className="ui-input-validation">Passwords did not match</span>
                                        }
                                    </div>
                                    <div className="newpassword__form-cta">
                                        <button type="submit" style={{ width: '30%', marginRight: '9px' }} className="btn btn-newpassword btn--block">Save</button>
                                        <Link to="/dash/dashboards" style={{ width: '30%' }} className="btn btn-newpassword btn--block">Cancel</Link>
                                    </div>

                                </div>
                            </Formsy>
                        </div>
                    </div></div>
            </React.Fragment>);
    }
}
const mapStateToProps = (state) => ({
    authToken: state.login.authToken,
    navDashboard: state.header.navDashboard
})

const mapDispatchToProps = (dispatch) => ({
    setHeaderClass: (data) => dispatch(setHeaderClass(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordComponent)
