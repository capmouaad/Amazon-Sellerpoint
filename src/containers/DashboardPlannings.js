import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap';

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
    this.state ={
open:true
    }
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
        <br />      

         <div className="dash-container">
          <div className="container container--full">
                            <div className="panel panel-dark">
                                <div className="panel-heading">
                                    <div className="panel-btns">
                                    <OverlayTrigger placement="top" overlay={<Tooltip placement="right" className="in" id="tooltip-right"> {(this.state.open ? "Minimize":"Maximize")}</Tooltip>} onClick={() => this.setState({ open: !this.state.open })} id="tooltip1">
                                    <i className={"fa " + (this.state.open ? "fa-minus-square-o":"fa-plus-square-o")}></i>
    </OverlayTrigger>
                                    </div>
                                    <h3 className="panel-title">Planning</h3>
                                </div>
                              
                                <Panel id="collapsible-panel-example-1" expanded={this.state.open}>
          <Panel.Collapse>
            <Panel.Body>
            <div className="_form_3 form-border"></div>   
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
                               
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
