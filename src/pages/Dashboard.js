import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import api from '../services/Api';

import DashboardWelcome from '../containers/DashboardWelcome';
import DashboardDashboards from '../containers/DashboardDashboards';
import DashboardPlannings from '../containers/DashboardPlannings';
import DashboardConfiguration from '../containers/DashboardConfiguration';

import DashFinancialPerformance from '../components/DashDashboards/DashFinancialPerformance'
import DashBusinessResults from '../components/DashDashboards/DashBusinessResults'
import DashOperationalPerformance from '../components/DashDashboards/DashOperationalPerformance'
import DashAdvertisingPerformance from '../components/DashDashboards/DashAdvertisingPerformance'

import DashMarketplaceConfig from '../components/DashSettings/DashMarketplaceConfig'
import DashCOGSSetup from '../components/DashSettings/DashCOGSSetup'
import DashSKUASINGrouping from '../components/DashSettings/DashSKUASINGrouping'
import DashNotifications from '../components/DashSettings/DashNotifications'

const Configuration_TAB_MAP = {
    'COGS Setup': {
        isExact: true,
        path: '',
        name: 'COGS Setup',
        component: DashCOGSSetup
    },
    'SKU/ASIN Grouping': {
        path: 'skuasinGrouping',
        name: 'SKU/ASIN Grouping',
        component: DashSKUASINGrouping
    },
    'Marketplace Configuration': {
        path: 'marketplaceconfiguration',
        name: 'Marketplace Configuration',
        component: DashMarketplaceConfig
    },
    'Notifications': {
        path: 'notifications',
        name: 'Notifications',
        component: DashNotifications
    }
}

const DASHBOARD_TAB_MAP = {
    'Financial Performance': {
        isExact: true,
        path: '',
        name: 'Financial Performance',
        component: DashFinancialPerformance
    },
    'Business Results': {
        path: 'businessResults',
        name: 'Business Results',
        component: DashBusinessResults
    },
    'Operational Performance': {
        path: 'operationalPerformance',
        name: 'Operational Performance',
        component: DashOperationalPerformance
    },
    'Advertising Performance': {
        path: 'advertisingPerformance',
        name: 'Advertising Performance',
        component: DashAdvertisingPerformance
    }
}

class DashboardSwitch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            apiError: null,
            ListOfTabs: [],
            configurationRoutes: [],
            dashboardRoutes: []
        }
    }

    getTabs = () => {
        const { match } = this.props
        api
            .get(`GetTabs`, )
            .then((res) => {
                if (res.data.IsSuccess) {
                    const ListOfTabs = res.data.ListOfTabs
                    const configurationTabs = ListOfTabs.find((item) => item.ModuleName === 'Configuration').Tabs || []
                    const dashboardTabs = ListOfTabs.find((item) => item.ModuleName === 'Dashboards').Tabs || []
                    this.setState({
                        ListOfTabs: res.data.ListOfTabs,
                        configurationRoutes: configurationTabs.map((tabString) => ({
                            ...Configuration_TAB_MAP[tabString],
                            path: `${match.url}/${Configuration_TAB_MAP[tabString].path}`
                        })),
                        dashboardRoutes: dashboardTabs.map((tabString) => ({
                            ...DASHBOARD_TAB_MAP[tabString],
                            path: `${match.url}/${DASHBOARD_TAB_MAP[tabString].path}`
                        }))
                    })
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
                    <DashboardDashboards match={match} listNav={this.state.dashboardRoutes} />
                )
            case 'plannings':
                return (
                    <DashboardPlannings match={match} />
                )
            case 'configuration':
                return (
                    <DashboardConfiguration match={match} listNav={this.state.configurationRoutes} />
                )
            default:
                return <DashboardWelcome />
        }
    }

    componentDidMount() {
        this.getTabs();
    }

    render() {
        return (
            <React.Fragment>
                {this.renderAction()}
            </React.Fragment>
        );
    }
}

class Dashboard extends Component {
    render() {
        const { match } = this.props
        return (
            <React.Fragment>
                <Route path={`${match.url}/:action`} component={DashboardSwitch} />
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
