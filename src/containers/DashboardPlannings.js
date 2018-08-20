import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImportProgress from '../components/DashCommon/ImportProgress';
// import SvgIcon from '../components/Helpers/SvgIcon';

import { setHeaderClass } from '../actions/header';

class DashboardPlannings extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };
  constructor(){
    super();
    this.addCustomScript();
  }

  componentDidMount(){
    this.props.setHeaderClass('header--dash');
  }

  addCustomScript(){
    const script = document.createElement("script");
    script.src = "https://kinimetrix.activehosted.com/f/embed.php?id=3s";
    script.async = true;
    document.body.appendChild(script);
}


  render(){
    if ( !this.props.authToken ){
      return (
        <Redirect to={`${process.env.PUBLIC_URL}/login`} />
      )
    }

    return (
      <React.Fragment>
        <ImportProgress />
        <div className="dash">
          <div className="container container--narrow">
            <div className="dash__heading">
            <div className="_form_3"></div>     
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPlannings);
