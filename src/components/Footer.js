import React, { Component } from 'react';

export default class Footer extends Component {
  render(){
    return(
      <footer className="footer">
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

export function tAndC() {
    window.open(window.location.origin + "/Account/TermsAndConditions");
}

export function privacyPolicy() {
    window.open(window.location.origin + "/Account/PrivacyPolicy");
}