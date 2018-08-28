import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import svg4everybody from 'svg4everybody';

import RenderSwitch from './Switch';
import Header from './components/Header';
import Footer from './components/Footer';
import GoogleTagManager from './components/Helpers/GoogleTagManager'
class App extends Component {

  componentDidMount() {
    require('viewport-units-buggyfill').init({
      force: false,
      refreshDebounceWait: 150
    });

    svg4everybody();
  }

  render() {
    return (
      <BrowserRouter basename={'/SellerPoint'}>
        <div className="page">
          <GoogleTagManager gtmId='GTM-TNJ6FS7' />
          <Header routes={routes.filter(route => route.forNavBar)} />
          <div className="page__content">
            <RenderSwitch />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
