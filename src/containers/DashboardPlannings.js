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
        <div className="dash-container">
          <div className="container container--full">
                            <div className="panel panel-dark">
                                <div className="panel-heading">
                                    <div className="panel-btns">
                                        <a href="" className="panel-minimize tooltips" data-toggle="tooltip" title="Minimize"><i className="fa fa-minus-square-o"></i></a>
                                    </div>
                                    <h3 className="panel-title">Planning</h3>
                                </div>

                                <div className="panel-body">
                                <div className="_form_3 form-border"></div>   
                                </div>
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
