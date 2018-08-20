import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setHeaderClass } from '../actions/header';
import DashboardNavTabs from '../components/DashCommon/DashboardNavTabs';

class DashboardSettings extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };

  componentDidMount(){
    this.props.setHeaderClass('header--dash');
  }

  render(){
    const { listNav } = this.props

    if ( !this.props.authToken ){
      return (
        <Redirect to={`${process.env.PUBLIC_URL}/login`} />
      )
    }
    return (
      <React.Fragment>
        <DashboardNavTabs
          routes={listNav}
          modifierClass="dash-nav--without-progress"
        />
         {listNav.map(route => (
            <Route
              key={route.path}
              exact={route.isExact}
              path={process.env.PUBLIC_URL + route.path}
              component={route.component}
            />
          ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSettings);
