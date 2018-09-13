import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import api from '../services/Api';
import { connect } from 'react-redux';
import { SET_NAVBAR_DASHBOARD } from '../store/ActionTypes'

import DashboardWelcome from '../containers/DashboardWelcome';
import DashboardDashboards from '../containers/DashboardDashboards';
import DashboardPlannings from '../containers/DashboardPlannings';
import DashboardConfiguration from '../containers/DashboardConfiguration';
import QlikConnector from '../components/Qlik/QlikConnector'

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

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            apiError: null
        }
    }

    componentDidMount() {
        this.checkNavDashboard()
    }

    checkNavDashboard = () => {
        const { navDashboard } = this.props
        if (navDashboard.dashboards.length === 0 || navDashboard.settings.length === 0) {
            this.getTabs()
        }
    }

    getTabs = () => {
        const { match, setNavbarDashboard } = this.props
        api
            .get(`GetTabs`)
            .then((res) => {
                if (res.data.IsSuccess) {
                    const configurationTabs = res.data.ListOfTabs.find((item) => item.ModuleName === 'Configuration').Tabs || []
                    const dashboardTabs = res.data.ListOfTabs.find((item) => item.ModuleName === 'Dashboards').Tabs || []

                    const filterNavDash = dashboardTabs.map((tabString) => ({
                        ...DASHBOARD_TAB_MAP[tabString],
                        path: `${match.url}/dashboards/${DASHBOARD_TAB_MAP[tabString].path}`
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

    render() {
        const { match, authToken } = this.props
        if ( !authToken ) {
            return (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
            )
        }

        return (
            <React.Fragment>
                <QlikConnector />
                <Switch>
                    <Route path={`${match.url}/dashboards`} component={DashboardDashboards} />
                    <Route path={`${match.url}/plannings`} component={DashboardPlannings} />
                    <Route path={`${match.url}/configuration`} component={DashboardConfiguration} />
                    <Route
                        exact
                        path={`${match.url}/welcome`}
                        component={DashboardWelcome}
                    />
                    <Route render={({ history: { location: { pathname, search, hash } } }) => {
                        return pathname.slice(-1) === '/' ?
                            <Redirect to={`${pathname.slice(0, -1)}${search}${hash}`} /> :
                            pathname === '/dash' ?
                            <Redirect to={`${pathname}/dashboards`} /> :
                            null
                    }} />
                </Switch>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    authToken: state.login.authToken,
    navDashboard: state.header.navDashboard
})

const mapDispatchToProps = (dispatch) => ({
    setNavbarDashboard: (data) => dispatch({ type: SET_NAVBAR_DASHBOARD, payload: data })
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
