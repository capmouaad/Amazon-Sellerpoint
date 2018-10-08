import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../services/Api';
import "react-table/react-table.css";
import FormInput from '../components/Forms/FormInput';
import Formsy from 'formsy-react';
import FormLoader from '../components/Forms/FormLoader';
import Toaster, { showToastMessage } from '../services/toasterNotification'
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

const handleDropRejected = (...args) => console.log('reject', args)

class ProfileComponent extends Component {

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
            workPhone: ""
        }
        this.handleDrop = this.handleDrop.bind(this);
        this.getSellerPoint();
    }

    componentDidMount() {
        const element = document.getElementsByClassName("header__dash-nav")[0];
        element.style.display = 'none';
    }
    componentWillUnmount() {
        const element = document.getElementsByClassName("header__dash-nav")[0];
        element.style.display = 'flex';
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

    updateSellerProfile = () => {
        console.log(this.state);

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
                <div className="dash-container">
                    <div className="container container--full">
                        <div className={"panel panel-dark loader-inside loading-over"}>
                            <div className="panel-heading">
                                <h3 className="panel-title">Profile</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row asterisk-removed">
                                    <Formsy
                                        className="signup__form"
                                        onValidSubmit={this.updateSellerProfile}
                                    //  onValid={this.formValid}
                                    //  onInvalid={this.formInvalid}
                                    //  ref={this.formRef}
                                    >
                                        <div className="row">
                                            <div className="col-sm-5"><FormInput
                                                name="first_name"
                                                label="First Name"
                                                placeholder="Jennifer"
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
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
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
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
                                                    minLength: 'Name is too short'
                                                }}
                                                onChangeHandler={this.handleChange}
                                                required
                                            /></div>
                                            <div className="col-sm-5"><FormInput
                                                name="title"
                                                label="Title"
                                                placeholder="Jennifer"
                                                value={title}
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
                                                }}
                                                onChangeHandler={this.handleChange}
                                            /></div>
                                            <div className="col-sm-5"><FormInput
                                                name="workPhone"
                                                label="WorkPhone"
                                                placeholder="Work Phone"
                                                value={workPhone}
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
                                                }}
                                                onChangeHandler={this.handleChange}
                                                required
                                            /></div>
                                            {/* <div id="my-awesome-dropzone" class="dropzone" enctype='multipart/form-data'>
                                            </div> */}
                                            <Dropzone onDrop={this.handleDrop} accept="image/jpeg,image/jpg,image/tiff,image/gif" multiple={false} onDropRejected={handleDropRejected}>
                                                Drag a file here or click to upload.
        </Dropzone>
                                            {preview &&
                                                <img src={preview} alt="image preview" />
                                            }
                                            {profilePhoto &&
                                                <img src={"data:image;base64," + profilePhoto} className="img-thumbnail fix-size" alt="Thumbnail" />
                                            }
                                            <div className="col-sm-5"><div className="ui-group ui-group--labeled"><label>Primary Instance </label> <label>{instanceName} </label></div></div>
                                            <div className="col-sm-5"><div className="ui-group ui-group--labeled"><label>Role </label> <label>{role} </label></div></div>
                                            <div className="row">
                                                <button type="submit" style={{ width: '20%', marginRight: '9px' }} className="btn btn-signup btn--block">Update</button>
                                                <button type="button" style={{ width: '20%' }} className="btn btn-signup btn--block">Cancel</button>
                                            </div>

                                        </div>
                                    </Formsy>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>);
    }
}
const mapStateToProps = (state) => ({
    authToken: state.login.authToken
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent)
