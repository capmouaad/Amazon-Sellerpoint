import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../services/Api';
import "react-table/react-table.css";
import FormInput from '../components/Forms/FormInput';
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
            preview: null,
            filename: "",
            first_name: "",
            last_name: "",
            email: "",
            title: "",
            instanceName: "",
            profilePhoto: [],
            workPhone: "",
            formIsValid: false,
            apiError: null,
            isLoading: false
        }
        this.handleDrop = this.handleDrop.bind(this);
        this.updateSellerProfile = this.updateSellerProfile.bind(this);
    }
    
    componentDidMount() {
        this.props.setHeaderClass('header--dash');
    }
    componentWillUnmount() {
        const element = document.getElementsByClassName("header__dash-nav")[0];
        element.style.display = 'flex';
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

    handleDrop(files) {
        if (files.length > 0) {
            var data = new FormData();
            data.append("file", files[0]);
            this.setState({ filename: files[0].name, preview: files[0].preview });
            api
                .post(`ImageUpload`, data)
                .then((res) => {
                    console.log('backend responce to GET ImageUpload', res)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    // submit handler from the form
    handleSubmit = (e) => {

        if (this.state.first_name.match(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_')) {

            console.log("Special Character Found");
        }
        else {
            console.log("Special Character not Found");
        }

        if (this.state.formIsValid) {
            this.updateSellerProfile() // move on if it's fine

        }
    }

    updateSellerProfile = () => {
        var sellerProfileObj = {
            FirstName: this.state.first_name,
            LastName: this.state.last_name,
            Email: this.state.email,
            Title: this.state.title,
            WorkPhone: this.state.workPhone
        }
        this.setState({ isLoading: true });

        api
            .post(`UpdateSellerProfile`, sellerProfileObj)
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
        const { preview, first_name, last_name, email, title, instanceName, role, profilePhoto, workPhone, isLoading } = this.state

        if (!authToken) {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
            )
        }

        return (
            <React.Fragment>
                <Toaster />
                <div className="password">
                    <div className={isLoading ? "container loader-inside loader-inside" : "container loader-inside loader-inside loading-over"}>
                        <FormLoader />
                        <div className="password__container">
                            <Formsy
                                className="password__form"
                                onValidSubmit={this.handleSubmit}
                                onValid={this.formValid}
                                onInvalid={this.formInvalid}
                            >
                                <div className="row"><h2>Change Password</h2><p></p></div>

                                <div className="row">
                                    <div className="col-sm-5"><FormInput
                                        name="password"
                                        label="Current Password"
                                        placeholder="Enter current password"
                                        validations="minLength:1"
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your current password',
                                            minLength: 'First name is too short'
                                        }}
                                        value={first_name}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>
                                    <div className="col-sm-5"><FormInput
                                        name="last_name"
                                        label="New Password"
                                        placeholder="Enter new password (8 char. min)"
                                        validations="minLength:1"
                                        value={last_name}
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your last name',
                                            minLength: 'Last name is too short'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>
                                    <div className="col-sm-5"><FormInput
                                        name="email"
                                        label="Confirm Password"
                                        placeholder="Confirm new password (8 char. min)"
                                        value={email}
                                        validations="minLength:1"
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your email',
                                            minLength: 'Email is too short'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>
                                    <div className="row">
                                        <button type="submit" style={{ width: '20%', marginRight: '9px' }} className="btn btn-signup btn--block">Save</button>
                                        <button type="button" style={{ width: '20%' }} className="btn btn-signup btn--block">Cancel</button>
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
