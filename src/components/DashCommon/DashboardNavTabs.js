import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import onClickOutside from "react-onclickoutside";

class Help extends Component {

  constructor() {
    super();
    this.state = {
      tab1: true,
      tab2: false,
      isHelpOpen: false,
      loaded: false
    }
    this.OpenHelpBox = this.OpenHelpBox.bind(this);
  }

  componentWillMount() {
    if (document.getElementById("help_script") == null) {
      this.addCustomScript();
    }
  }

  handleClickOutside = () => {
    if (this.state.isHelpOpen) this.setState({ isHelpOpen: false })
  };

  addCustomScript = () => {
    const script = document.createElement("script");
    script.src = "https://kinimetrix.activehosted.com/f/embed.php?id=6";
    script.id = "help_script"
    script.async = true;
    document.body.appendChild(script);
    this.setState({ loaded: true });
  }

  OpenHelpBox = (e) => {
    if (this.state.isHelpOpen) {
      this.setState({ isHelpOpen: false });
    } else {
      this.setState({ isHelpOpen: true });
    }

    var formDiv = document.getElementsByClassName('_form-content');
    var thanksDiv = document.getElementsByClassName('_form-thank-you');

    if (thanksDiv.length > 0) {
      var input = formDiv[0].querySelectorAll('input');
      var textarea = formDiv[0].querySelectorAll('textarea');
      var button = formDiv[0].querySelectorAll("button")
      formDiv[0].style.display = "block";
      thanksDiv[0].style.display = "none";
      input[0].value = "";
      textarea[0].value = "";
      button[0].disabled = false;
    }
  }

  tabActive = (tab1) => {
    if (tab1) {
      this.setState({ tab1: true, tab2: false });
    }
    else { this.setState({ tab1: false, tab2: true }); }

    if (!tab1 && !this.state.loaded) {
      this.addCustomScript();
    }
  }

  render() {
    const { tab1, isHelpOpen, tab2 } = this.state;
    return (
      <div className="help" ref="helpBox">
        <a className="help_a cursor-pointer" onClick={this.OpenHelpBox}>Help</a>
        <div className={"help-box " + isHelpOpen}>
          <div className="tabs">
            <a className={(tab1) ? 'tab1 active cursor-pointer' : 'tab1 cursor-pointer'} onClick={() => this.tabActive(true)}>Tutorials</a>
            <a className={(!tab1) ? 'tab2 active cursor-pointer' : 'tab2 cursor-pointer'} onClick={() => this.tabActive(false)}>Help Tickets</a>
          </div>
          <div className="tabContent">
            <div className={"content-tab1 " + tab1}>
              <p>Looking for the tutorials you viewed when you first signed up?</p>
              <Link to="/dash/welcome">SellerPoint Tutorials</Link>
            </div>
            <div className={"content-tab2 " + tab2}>
              <div className="_form_6"></div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}

var HelpWrapper = (onClickOutside(Help))

export default class DashboardNavTabs extends Component {
  constructor() {
    super();
  }

  render() {
    const { routes, modifierClass } = this.props;
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
          <HelpWrapper></HelpWrapper>
        </div>
      </div>
    )
  }
}


