import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImportProgress from '../components/DashCommon/ImportProgress';
import DashboardNavTabs from '../components/DashCommon/DashboardNavTabs';

import { setHeaderClass } from '../actions/header';

class DashboardDashboards extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };

  componentDidMount(){
    this.props.setHeaderClass('header--dash');
  }

  render(){
    const { listNav } = this.props // from the router

    if ( !this.props.authToken ){
      return (
        <Redirect to={`${process.env.PUBLIC_URL}/login`} />
      )
    }
    return (
      <React.Fragment>
        <ImportProgress />
        <DashboardNavTabs routes={listNav} />

        <div className="dash">
          {listNav.map(route => (
            <Route
              key={route.path}
              exact={route.isExact}
              path={process.env.PUBLIC_URL + route.path}
              component={route.component}
            />
          ))}
        </div>
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => (
  {
    authToken: state.login.authToken
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    setHeaderClass: (data) => dispatch(setHeaderClass(data))
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDashboards);
