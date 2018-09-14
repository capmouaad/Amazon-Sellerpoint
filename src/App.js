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
      <BrowserRouter getUserConfirmation={this.getUserConfirmation} basename={'/SellerPoint'} >
        <div className="page">
          <Header routes={routes.filter(route => route.forNavBar)} />
          <div className="page__content">
            <RenderSwitch />
          </div>
          <Footer />
          <UserConfirmationModal
            modalIsOpen={modalIsOpen}
            modalMessage={modalMessage}
            onCloseModal={this.onCloseModal}
            onUserConfirm={this.onUserConfirm}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;