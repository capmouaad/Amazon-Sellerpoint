import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
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
            isLoading: false
        }
        this.handleDrop = this.handleDrop.bind(this);
        this.getSellerPoint = this.getSellerPoint.bind(this);
        this.updateSellerProfile = this.updateSellerProfile.bind(this);
    }
    componentWillMount() {
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
        this.setState({ isLoading: true });
        api
            .get(`GetSellerProfile`)
            .then((res) => {
                if (res.data.IsSuccess) {
                    this.setState({
                        first_name: res.data.FirstName,
                        last_name: res.data.LastName,
                        email: res.data.Email,
                        title: res.data.Title,
                        instanceName: res.data.CompanyName,
                        role: res.data.RoleTitle,
                        profilePhoto: res.data.ProfilePhoto,
                        workPhone: res.data.WorkPhone,
                        isLoading: false
                    })
                }
                else {
                    showToastMessage(res.data.ErrorMessage, "Error");

                }
                this.setState({ isLoading: false });
            })
            .catch(function (error) {
                this.setState({ isLoading: false });
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
                <div className="profile">
                    <div className="container">
                        <div className= {isLoading ? "profile__container loader-inside" : "profile__container loader-inside loading-over"}>
                        <FormLoader />
                           
                            <Formsy
                                className="profile__form"
                                onValidSubmit={this.handleSubmit}
                                onValid={this.formValid}
                                onInvalid={this.formInvalid}
                            >
                                <div className="row"><h2>My Profile</h2><p></p></div>

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
                                        label="Email Address"
                                        placeholder="Jennifer@test.com"
                                        value={email}
                                        validations="minLength:1"
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Please enter your email',
                                            minLength: 'Email is too short'
                                        }}
                                        onChangeHandler={this.handleChange}
                                        readOnly={true}
                                    /></div>
                                    <div className="col-sm-5">
                                        <FormInput
                                            name="workPhone"
                                            type="tel"
                                            label="Phone Number"
                                            placeholder="XXX-XXX-XXXX"
                                            value={workPhone}
                                            mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                            onChangeHandler={this.handleChange}
                                            validations={{
                                                matchRegexp: /\d{3}-\d{3}-\d{4}/
                                            }}
                                            validationErrors={{
                                                matchRegexp: "Phone number is not valid",
                                            }}
                                        />
                                    </div>

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

                                    <div className="profile__form-cta">
                                        <button type="submit" style={{ width: '30%', marginRight: '9px' }} className="btn btn-profile btn--block">Update</button>
                                        <Link to="/dash/dashboards" style={{ width: '30%' }} className="btn btn-profile btn--block">Cancel</Link>
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
