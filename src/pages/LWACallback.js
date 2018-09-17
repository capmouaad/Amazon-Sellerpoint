import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import api from '../services/Api'
import PropTypes from 'prop-types';
import { setLwaAuth } from '../actions/lwa';
import { APP_CONFIG } from '../constants'
import Loader from '../components/Loader';
class LWACallback extends Component {
  static propTypes = {
    setLwaAuth: PropTypes.func,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldRedirect: false,
      destination: null
    }
  }

  componentDidMount() {
    this.getLWAToken()
  }

  getLWAToken = async () => {
    try {
      const { sellerId } = this.props;
      const redirectResponce = this.props.location.search
      const authCode = this.getQueryVariable(redirectResponce, 'code')
      const authScope = this.getQueryVariable(redirectResponce, 'scope')
      const state = this.getQueryVariable(redirectResponce, 'state')
      switch (state) {
        case APP_CONFIG.LWA_Source.SignUpStep3.state:
          this.setState({
            destination: APP_CONFIG.LWA_Source.SignUpStep3.destination
          });
          break
        case APP_CONFIG.LWA_Source.Configuration.state:
          this.setState({
            destination: APP_CONFIG.LWA_Source.Configuration.destination
          });
          break
        default:
          break
      }

      this.props.setLwaAuth({
        code: authCode,
        scope: authScope
      })

      const obj = {
        code: authCode,
        scope: authScope,
        sellerId: sellerId
      }

      const res = await api.post(`ConnectAdvertisingData`, obj)
      console.log('>>>>>>> backend response to POST ConnectAdvertisingData', res)
      this.setState({
        shouldRedirect: true
      })
    } catch (e) {
      console.error(e)
    }
  }

  getQueryVariable = (url, variable) => {
    var query = url.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false
  }

  render() {
    const { shouldRedirect, destination } = this.state;

    if (shouldRedirect) {
      return <Redirect to={`${process.env.PUBLIC_URL}${destination}`} />
    }

    return (
      <div className="container">
        <Loader backGroundProcessing message={'Please wait while we connect your advertising account.'} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sellerId: state.signup.fields.seller_id,
  LWA: state.lwa
});

const mapDispatchToProps = (dispatch) => ({
  setLwaAuth: (data) => dispatch(setLwaAuth(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LWACallback);
