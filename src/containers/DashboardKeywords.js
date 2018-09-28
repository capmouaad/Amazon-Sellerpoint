import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setHeaderClass } from '../actions/header';
import KeywordAutomation from '../components/Keywords/KeywordAutomation'
import ImportProgress from '../components/DashCommon/ImportProgress';
import ReloadStatusBar from '../components/ReloadStatusBar'

class DashboardKeywords extends Component {
  static propTypes = {
    setHeaderClass: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.setHeaderClass('header--dash');
  }

  render() {
    return (
      <React.Fragment>
        <ImportProgress />
        <ReloadStatusBar />
        <KeywordAutomation/>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => (
  {
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    setHeaderClass: (data) => dispatch(setHeaderClass(data))
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardKeywords);