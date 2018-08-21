import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import api from '../services/Api';

import { setHeaderClass } from '../actions/header';

import SignupNav from '../components/SignupNav';
import SignupStep1 from '../containers/SignupStep1';
import SignupStep2 from '../containers/SignupStep2';
import SignupStep3 from '../containers/SignupStep3';

class Signup extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired,
    signupStep: PropTypes.number
  };

  componentDidMount(){
    this.checkEmail()
    this.updateURL();
    this.props.setHeaderClass('header--logo-only');
  }

  checkEmail = async () => {
    try {
      const { history, location } = this.props

      const params = new URLSearchParams(location.search)
      const email = params.get('email')

      if (email) {
        const checkEmailRes = await api.get(`CheckEmail?Email=${email}`)
        if ( checkEmailRes.data.IsDuplicateUser ){
          history.push(`/login`)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  updateURL = () => {
    const { signupStep, location, history } = this.props

    const params = new URLSearchParams(location.search)
    const email = params.get('email')
    const emailStr = email ? `?email=${email}` : null

    let newPath = process.env.PUBLIC_URL + "/signup/step-" + (signupStep);
    if ( location.pathname === newPath ){
      return
    }
    history.push({
      pathname: newPath,
      search: emailStr
    })
  }


  render(){
    const { match } = this.props

    return(
      <div className="signup">
        <div className="container">
          <SignupNav />

          <Route path={`${match.url}/:step`} component={SignupSwitch} />
          <Route
            exact
            path={match.url}
            component={SignupStep1}
          />

        </div>
      </div>
    )
  }
}


class SignupSwitch extends React.Component {

  renderStep = () => {
    const { match } = this.props;

    const stepParam = match.params.step;

    switch (stepParam) {
      case 'step-1':
        return (
          <SignupStep1 />
        )
      case 'step-2':
        return (
          <SignupStep2 />
        )
      case 'step-3':
        return (
          <SignupStep3 />
        )
      default:
        return <SignupStep1 />
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.renderStep()}
      </React.Fragment>
    );
  }
}



const mapStateToProps = (state) => (
  {
    signupStep: state.signup.signupStep
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    setHeaderClass: (data) => dispatch(setHeaderClass(data))
  }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));
