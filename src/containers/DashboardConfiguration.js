import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setHeaderClass } from '../actions/header';
import DashboardNavTabs from '../components/DashCommon/DashboardNavTabs';
import DashMarketplaceConfig from '../components/DashSettings/DashMarketplaceConfig'
import DashCOGSSetup from '../components/DashSettings/DashCOGSSetup'
import DashSKUASINGrouping from '../components/DashSettings/DashSKUASINGrouping'
import DashNotifications from '../components/DashSettings/DashNotifications'

import ImportProgress from '../components/DashCommon/ImportProgress';

class DashboardConfiguration extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };

  componentDidMount(){
    this.props.setHeaderClass('header--dash');
  }

  renderRouteComponent = (route) => {
    switch (route.name) {
      case 'COGS Setup':
        return DashCOGSSetup
      case 'SKU/ASIN Grouping':
        return DashSKUASINGrouping
      case 'Marketplace Configuration':
        return DashMarketplaceConfig
      case 'Notifications':
        return DashNotifications
      default:
        return null
    }
  }

  render(){
    const { navDashboard } = this.props // from the router
    const { settings } = navDashboard
    return (
      <React.Fragment>
        <ImportProgress />
        <DashboardNavTabs
          routes={settings}
          modifierClass=""
        />
         {settings.map(route => (
            <Route
              key={route.path}
              exact={route.isExact}
              path={process.env.PUBLIC_URL + route.path}
              component={this.renderRouteComponent(route)}
            />
          ))}
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => (
  {
    authToken: state.login.authToken,
    navDashboard: state.header.navDashboard
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    setHeaderClass: (data) => dispatch(setHeaderClass(data))
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardConfiguration);
