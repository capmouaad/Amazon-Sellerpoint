import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { routes } from './routes';
import svg4everybody from 'svg4everybody';

import UserConfirmationModal from './components/UserConfirmationModal'
import RenderSwitch from './Switch';
import Header from './components/Header';
import Footer from './components/Footer';
import { KMLogin } from './routes'

class App extends Component {
  state = {
    modalIsOpen: false,
    modalMessage: '',
    confirmCallback: null
  }

  componentDidMount() {
    require('viewport-units-buggyfill').init({
      force: false,
      refreshDebounceWait: 150
    });

    svg4everybody();
    this.mountHotJar(window, document);
  }

  mountHotJar = (h, o, a, r) => {
    // Hotjar Tracking Code for www.kinimetrix.com
    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
    h._hjSettings = { hjid: 921921, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = 'https://static.hotjar.com/c/hotjar-' + h._hjSettings.hjid + '.js?sv=' + h._hjSettings.hjsv;
    a.appendChild(r);
  }

  onOpenModal = () => {
    this.setState({
      modalIsOpen: true
    })
  }

  onCloseModal = () => {
    this.setState({
      modalIsOpen: false,
      confirmCallback: null
    })
  }

  getUserConfirmation = (message, callback) => {
    this.setState({
      modalMessage: message,
      confirmCallback: callback
    })
    this.onOpenModal()
  }

  onUserConfirm = () => {
    const { confirmCallback } = this.state
    confirmCallback && confirmCallback(true)
    this.onCloseModal()
  }

  render() {
    const { modalIsOpen, modalMessage } = this.state
    return (
      <BrowserRouter>
        <Switch>
          <Route
            // key={route.path}
            exact
            path={`/Account/Login`}
            component={KMLogin}
          />
          <BrowserRouter getUserConfirmation={this.getUserConfirmation} basename={'/SellerPoint'} >
            <div className="page">
              <Header routes={routes.filter(route => route.forNavBar)} />
              <div className="page__content">
                <RenderSwitch />
              </div>
              <Footer />

              {/* router confirmation modal */}
              <UserConfirmationModal
                modalIsOpen={modalIsOpen}
                modalMessage={modalMessage}
                onCloseModal={this.onCloseModal}
                onUserConfirm={this.onUserConfirm}
              />
            </div>
          </BrowserRouter>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
