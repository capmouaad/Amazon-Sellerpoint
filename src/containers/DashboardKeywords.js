import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setHeaderClass } from '../actions/header';
import KeywordAutomation from '../components/Keywords/KeywordAutomation'
import KeywordAutomationMenu from '../components/Keywords/KeywordAutomationMenu'
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
    const { match } = this.props
    return (
      <React.Fragment>
        <ImportProgress />
        <ReloadStatusBar />
        <Switch>
          <Route exact path={`${match.url}`} component={KeywordAutomation} />
          <Route path={`${match.url}/KeywordsAutomationMenu`} component={KeywordAutomationMenu} />
        </Switch>
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
