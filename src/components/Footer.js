import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class Footer extends Component {
  static propTypes = {
    stateClass: PropTypes.string
  };

  render() {
    return (
      <footer className={"footer " + this.props.stateClass}>
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__links">
              <a onClick={tAndC} rel="noopener noreferrer">Terms of Use</a> | <a onClick={privacyPolicy} rel="noopener noreferrer">Privacy Policy</a>
            </div>
            <div className="footer__copy">
              © 2018 KiniMetrix SellerPoint.  All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

const mapStateToProps = (state) => ({
  stateClass: state.header.stateClass
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Footer);

export function tAndC() {
  window.open(window.location.origin + "/Account/TermsAndConditions", "_blank");
}

export function privacyPolicy() {
  window.open(window.location.origin + "/Account/PrivacyPolicy", "_blank");
}