import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default class DashboardNavTabs extends Component {

  constructor() {
    super();
    this.state = {
      tab1: true,
      tab2: false,
      isHelpOpen: false
    }
  }

  addCustomScript = () => {
    const script = document.createElement("script");
    script.src = "https://kinimetrix.activehosted.com/f/embed.php?id=6";
    script.async = true;
    document.body.appendChild(script);
  }

  OpenHelpBox = () => {
    if (this.state.isHelpOpen) {
      this.setState({ isHelpOpen: false });
    } else {
      this.setState({ isHelpOpen: true });
    }
  }

  tabActive = (tab1) => {
    if (tab1) {
      this.setState({ tab1: true, tab2: false });
    }
    else { this.setState({ tab1: false, tab2: true }); }
    if (!tab1) {
      this.addCustomScript();
    }
  }

  render() {

    const { routes, modifierClass } = this.props;
    const { tab1, isHelpOpen } = this.state;
    console.log(tab1);

    return (
      <div className={"dash-nav " + modifierClass}>
        <div className="container container--full">
          <div className="dash-nav__wrapper">
            {routes.map((route, i) => {
              return (
                <NavLink
                  key={i}
                  to={`${process.env.PUBLIC_URL}${route.path}`}
                  className=""
                  activeClassName="is-active"
                  exact={route.isExact}>
                  {route.name}
                </NavLink>
              )
            })}
          </div>
          <div className="help">
            <a className="help_a" onClick={() => this.OpenHelpBox()}>Help</a>
            {
              (isHelpOpen) ?
                <div className="help-box">
                  <div className="tabs">
                    <a className={(tab1) ? 'tab1 active' : 'tab1'} onClick={() => this.tabActive(true)}>Tutorials</a>
                    <a className={(!tab1) ? 'tab2 active' : 'tab2'} onClick={() => this.tabActive(false)}>Help Tickets</a>
                  </div>
                  <div className="tabContent">
                    {(tab1) ?
                      <div className="content-tab1">
                        <p>Looking for the tutorials you viewed when you first signed up?</p>
                        <Link to="/dash/welcome">SellerPoint Tutorials</Link>
                      </div> : <div className="content-tab2">
                        <div className="_form_6"></div>
                      </div>}
                  </div>
                </div>
                : ''
            }

          </div>
        </div>
      </div>
    )
  }
}
