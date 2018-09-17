import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImportProgress from '../components/DashCommon/ImportProgress';
import { setHeaderClass } from '../actions/header';
import ReloadStatusBar from '../components/ReloadStatusBar'

class DashboardPlannings extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };
  constructor() {
    super();
    this.addCustomScript();
    this.state = {
      open: true
    }
  }

  componentDidMount() {
    this.props.setHeaderClass('header--dash');
  }

  addCustomScript() {
    const script = document.createElement("script");
    script.src = "https://kinimetrix.activehosted.com/f/embed.php?id=3s";
    script.async = true;
    document.body.appendChild(script);
  }

  render() {
    return (
      <React.Fragment>
        <ImportProgress />
        <ReloadStatusBar />
        <br />
        <div className="dash-container">
          <div className="container container--full">
            <div className="_form_3 form-border"></div>
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