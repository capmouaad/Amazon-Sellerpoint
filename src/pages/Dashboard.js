import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import api from '../services/Api';
import { connect } from 'react-redux';
import { SET_NAVBAR_DASHBOARD } from '../store/ActionTypes'

import DashboardWelcome from '../containers/DashboardWelcome';
import DashboardDashboards from '../containers/DashboardDashboards';
import DashboardPlannings from '../containers/DashboardPlannings';
import DashboardConfiguration from '../containers/DashboardConfiguration';

const Configuration_TAB_MAP = {
    'COGS Setup': {
        isExact: true,
        path: '',
        name: 'COGS Setup'
    },
    'SKU/ASIN Grouping': {
        path: 'skuasinGrouping',
        name: 'SKU/ASIN Grouping'
    },
    'Marketplace Configuration': {
        path: 'marketplaceconfiguration',
        name: 'Marketplace Configuration'
    },
    'Notifications': {
        path: 'notifications',
        name: 'Notifications'
    }
}

const DASHBOARD_TAB_MAP = {
    'Financial Performance': {
        isExact: true,
        path: '',
        name: 'Financial Performance'
    },
    'Business Results': {
        path: 'businessResults',
        name: 'Business Results'
    },
    'Operational Performance': {
        path: 'operationalPerformance',
        name: 'Operational Performance'
    },
    'Advertising Performance': {
        path: 'advertisingPerformance',
        name: 'Advertising Performance'
    }
}

class DashboardSwitch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            apiError: null
        }
    }

    getTabs = () => {
        const { match, setNavbarDashboard } = this.props
        api
            .get(`GetTabs`, )
            .then((res) => {
                if (res.data.IsSuccess) {
                    const configurationTabs = res.data.ListOfTabs.find((item) => item.ModuleName === 'Configuration').Tabs || []
                    const dashboardTabs = res.data.ListOfTabs.find((item) => item.ModuleName === 'Dashboards').Tabs || []

                    const filterNavDash = dashboardTabs.map((tabString) => ({
                        ...DASHBOARD_TAB_MAP[tabString],
                        path: `${match.url}/${DASHBOARD_TAB_MAP[tabString].path}`
                    }))

                    const filterNavSettings = configurationTabs.map((tabString) => ({
                        ...Configuration_TAB_MAP[tabString],
                        path: `/dash/configuration/${Configuration_TAB_MAP[tabString].path}`
                    }))

                    const mergeNav = {
                        dashboards: filterNavDash,
                        settings: filterNavSettings
                    }

                    setNavbarDashboard(mergeNav)
                } else {
                    this.setState({
                        apiError: res.data.ErrorMessage
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    renderAction = () => {
        const { match } = this.props;
        const actionParam = match.params.action;

        switch (actionParam) {
            case 'dashboards':
                return (
                    <DashboardDashboards match={match} />
                )
            case 'plannings':
                return (
                    <DashboardPlannings match={match} />
                )
            case 'configuration':
                return (
                    <DashboardConfiguration match={match}/>
                )
            default:
                return <DashboardWelcome />
        }
    }

    checkNavDashboard = () => {
        const { navDashboard } = this.props
        if (navDashboard.dashboards.length === 0 || navDashboard.settings.length === 0) {
            this.getTabs()
        }
    }

    componentDidMount() {
        this.checkNavDashboard()
    }

    render() {
        return (
            <React.Fragment>
                {this.renderAction()}
            </React.Fragment>
        );
    }
}

    const mapStateToProps = (state) => ({
        navDashboard: state.header.navDashboard
    })
  
    const mapDispatchToProps = (dispatch) => ({
        setNavbarDashboard: (data) => dispatch({ type: SET_NAVBAR_DASHBOARD, payload: data }) 
    });
  
const DashboardSwitchModel = connect(mapStateToProps, mapDispatchToProps)(DashboardSwitch);

class Dashboard extends Component {
    render() {
        const { match } = this.props
        return (
            <React.Fragment>
                <Route path={`${match.url}/:action`} component={DashboardSwitchModel} />
                <Route
                    exact
                    path={match.url}
                    component={DashboardWelcome}
                />
                <Route render={({ history: { location: { pathname, search, hash } } }) => (
                    pathname.slice(-1) === '/' ?
                        <Redirect to={`${pathname.slice(0, -1)}${search}${hash}`} /> :
                        null
                )} />
            </React.Fragment>
        )
    }
}

export default Dashboard
