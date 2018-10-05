import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../services/Api';
import ReactTable from "react-table";
import "react-table/react-table.css";
import FormInput from '../components/Forms/FormInput';
import Formsy from 'formsy-react';
import FormLoader from '../components/Forms/FormLoader';
import Toaster, { showToastMessage } from '../services/toasterNotification'
import Modal from 'react-responsive-modal';
import SvgIcon from "../components/Helpers/SvgIcon"
import { SET_NAVBAR_DASHBOARD } from '../store/ActionTypes'
import { setSignupId } from '../actions/signup';
import { connect } from 'react-redux';

class ProfileComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount(){
        const element = document.getElementsByClassName("header__dash-nav")[0];
        element.style.display='none';
    }
    componentWillUnmount(){
        const element = document.getElementsByClassName("header__dash-nav")[0];
        element.style.display='flex';
    }

    render() {
        const { authToken } = this.props

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
                                    //  onSubmit={this.submitForm}
                                    // onValidSubmit={this.handleSubmit}
                                    //  onValid={this.formValid}
                                    //  onInvalid={this.formInvalid}
                                    //  ref={this.formRef}
                                    >
                                        <div className="row">
                                            <div className="col-sm-5"><FormInput
                                                name="first_name"
                                                label="First Name"
                                                placeholder="Jennifer"
                                                // value={}
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
                                                }}
                                                //  onChangeHandler={this.handleChange}
                                                required
                                            /></div>
                                            <div className="col-sm-5"><FormInput
                                                name="last_name"
                                                label="Last Name"
                                                placeholder="Jennifer"
                                                // value={}
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
                                                }}
                                                //  onChangeHandler={this.handleChange}
                                                required
                                            /></div>
                                            <div className="col-sm-5"><FormInput
                                                name="email"
                                                label="E-Mail Address"
                                                placeholder="Jennifer@test.com"
                                                // value={}
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your email',
                                                    minLength: 'Name is too short'
                                                }}
                                                //  onChangeHandler={this.handleChange}
                                                required
                                            /></div>
                                            <div className="col-sm-5"><FormInput
                                                name="title"
                                                label="Title"
                                                placeholder="Jennifer"
                                                // value={}
                                                validations="minLength:1"
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Please enter your first name',
                                                    minLength: 'Name is too short'
                                                }}
                                                //  onChangeHandler={this.handleChange}
                                                required
                                            /></div>
                                            <div className="col-sm-5"><div className="ui-group ui-group--labeled"><label>Primary Instance </label> <label>Primary Instance </label></div></div>
                                            <div className="row">
                                                    <button type="submit" style={ {width:'20%',marginRight:'9px'}} className="btn btn-signup btn--block">Update</button>
                                                    <button type="button" style={ {width:'20%'}} className="btn btn-signup btn--block">Cancel</button>
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
