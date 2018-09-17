import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImportProgress from '../components/DashCommon/ImportProgress';
import DashboardNavTabs from '../components/DashCommon/DashboardNavTabs';
import { setHeaderClass } from '../actions/header';
import DashFinancialPerformance from '../components/DashDashboards/DashFinancialPerformance'
import DashBusinessResults from '../components/DashDashboards/DashBusinessResults'
import DashOperationalPerformance from '../components/DashDashboards/DashOperationalPerformance'
import DashAdvertisingPerformance from '../components/DashDashboards/DashAdvertisingPerformance'
import DashFilters from '../components/DashCommon/DashFilters'
import ReloadStatusBar from '../components/ReloadStatusBar'

class DashboardDashboards extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.setHeaderClass('header--dash');
  }

  renderRouteComponent = (route) => {
    switch (route.name) {
      case 'Financial Performance':
        return DashFinancialPerformance
      case 'Business Results':
        return DashBusinessResults
      case 'Operational Performance':
        return DashOperationalPerformance
      case 'Advertising Performance':
        return DashAdvertisingPerformance
      default:
        return null
    }
  }

  render() {
    const { navDashboard } = this.props // from the router
    const { dashboards } = navDashboard

    return (
      <React.Fragment>
        <ImportProgress />
        <ReloadStatusBar />
        <DashboardNavTabs routes={dashboards} />
        <DashFilters />
        <div className="dash">
          {dashboards.map(route => (
            <Route
              key={route.path}
              exact={route.isExact}
              path={route.path}
              component={this.renderRouteComponent(route)}
            />
          ))}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDashboards);