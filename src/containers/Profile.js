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

class ProfileComponent extends Component {
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
        }
        this.handleDrop = this.handleDrop.bind(this);
        this.getSellerPoint();
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


    getSellerPoint = () => {
        api
            .get(`GetSellerProfile`)
            .then((res) => {
                console.log('backend responce to GET GetSellerProfile', res);
                if (res.data.IsSuccess) {
                    this.setState({
                        first_name: res.data.FirstName,
                        last_name: res.data.LastName,
                        email: res.data.Email,
                        title: res.data.Title,
                        instanceName: res.data.ClientName,
                        role: res.data.RoleTitle,
                        profilePhoto: res.data.ProfilePhoto,
                        workPhone: res.data.WorkPhone
                    })
                }
                else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
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

        //         if (this.state.formIsValid) {
        // // check dublicate first
        // api
        // .get(`CheckEmail?Email=` + encodeURIComponent(this.state.email))
        // .then((res) => {
        //   console.log('backend responce to Get CheckEmail', res)
        //   if (res.data.IsSuccess) {
        //     if (res.data.IsDuplicateUser) {
        //       this.setState({
        //         apiError: res.data.ErrorMessage,
        //         isFormSubmited: false
        //       })
        //     } else {

        //       //this.updateSellerProfile(leadObj) // move on if it's fine
        //     }
        //   }
        //   else {
        //     this.setState({
        //       apiError: res.data.ErrorMessage,
        //       isFormSubmited: false
        //     })
        //   }
        // })
        // .catch(function (error) {
        //   console.log(error);
        // });
        //         }
    }

    updateSellerProfile = () => {
        var sellerProfileObj = {
            FirstName: this.state.first_name,
            LastName: this.state.last_name,
            Email: this.state.email,
            Title: this.state.title,
            WorkPhone: this.state.workPhone
        }

        api
            .post(`UpdateSellerProfile`, sellerProfileObj)
            .then((res) => {
                console.log('backend responce to GET UpdateSellerProfile', res)
                if (res.data.IsSuccess) {
                    showToastMessage(res.data.ErrorMessage, "Success");
                } else {
                    showToastMessage(res.data.ErrorMessage, "Error");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const { authToken } = this.props
        const { preview, first_name, last_name, email, title, instanceName, role, profilePhoto, workPhone } = this.state

        if (!authToken) {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
            )
        }

        return (
            <React.Fragment>
                <Toaster />
                <div className="signup">
                    <div className="container">
                        <div className="signup__container">
                            <Formsy
                                className="signup__form"
                                onValidSubmit={this.handleSubmit}
                                onValid={this.formValid}
                                onInvalid={this.formInvalid}
                            >
                                <div className="row">
                                    <div className="col-sm-5"><FormInput
                                        name="first_name"
                                        label="First Name"
                                        placeholder="Jennifer"
                                        validations="minLength:1"
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your first name',
                                            minLength: 'First name is too short'
                                        }}
                                        value={first_name}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>
                                    <div className="col-sm-5"><FormInput
                                        name="last_name"
                                        label="Last Name"
                                        placeholder="Jennifer"
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
                                        label="E-Mail Address"
                                        placeholder="Jennifer@test.com"
                                        value={email}
                                        validations="minLength:1"
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your email',
                                            minLength: 'Email is too short'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>
                                    <div className="col-sm-5"><FormInput
                                        name="title"
                                        label="Title"
                                        placeholder="User"
                                        value={title}
                                        onChangeHandler={this.handleChange}
                                    /></div>
                                    <div className="col-sm-5"><FormInput
                                        name="workPhone"
                                        label="WorkPhone"
                                        placeholder="Work Phone"
                                        value={workPhone}
                                        validations="minLength:1"
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your work phone',
                                            minLength: 'work phone is too short'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        required
                                    /></div>

                                    <div className="col-sm-5 profile-photo"><div className="ui-group ui-group--labeled"><label>Profile Image </label>
                                        <Dropzone onDrop={this.handleDrop} className="dropzone" accept="image/jpeg,image/jpg,image/tiff,image/gif" multiple={false} onDropRejected={handleDropRejected}>
                                            Drag a file here or click to upload.
        </Dropzone>
                                        {preview &&
                                            <img src={preview} alt="image preview" className="dz-image" />
                                        }
                                        {profilePhoto &&
                                            <img src={"data:image;base64," + profilePhoto} className="img-thumbnail fix-size" alt="Thumbnail" />
                                        }
                                    </div></div>

                                    <div className="col-sm-5"><div className="ui-group ui-group--labeled"><label>Primary Instance </label> <label>{instanceName} </label></div></div>

                                    <div className="row">
                                        <button type="submit" style={{ width: '20%', marginRight: '9px' }} className="btn btn-signup btn--block">Update</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent)
