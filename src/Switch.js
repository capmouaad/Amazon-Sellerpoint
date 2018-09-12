import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { routes } from './routes';
import { connect } from 'react-redux';
import ScrollTo from './services/ScrollTo';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';

class RenderSwitch extends React.Component {

  componentDidMount(){
    hotjar.initialize(921921, 6);
    ReactGA.initialize('UA-114018340-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      ScrollTo(0, 300);
    }
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render () {
    return(
      <Switch>
        {routes.map(route => (
          <Route
            key={route.path}
            exact={route.isExact}
            path={process.env.PUBLIC_URL + route.path}
            component={route.component}
          />
        ))}
      </Switch>
    )
  }
}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RenderSwitch)
);
