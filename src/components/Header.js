import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import onClickOutside from "react-onclickoutside";
import api from '../services/Api';
import { OPEN_MENU, CLOSE_MENU, CLOSE_APP_QLIK, RESET_STATE_SIGNUP } from '../store/ActionTypes';
import { setQlikConnection, setQlikInstance } from '../actions/qlik'
import { logOut } from '../actions/login';

import SvgIcon from '../components/Helpers/SvgIcon'
import HeaderUser from './HeaderUser';

const dashNavLinks = [
  {
    name: "Dashboards",
    path: "/dash/dashboards",
    icon: "dash-nav-dashboards"
  },
  {
    name: "Planning",
    path: "/dash/plannings",
    icon: "dash-nav-planning"
  },
  {
    name: "Configuration",
    path: "/dash/configuration",
    icon: "dash-nav-settings"
  }
]

class Header extends React.Component {
  static propTypes = {
    routes: PropTypes.array,
    menuOpened: PropTypes.bool,
    stateClass: PropTypes.string,
    openMenu: PropTypes.func,
    closeMenu: PropTypes.func,
    logOut: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isMenuOpened: false
    }
  }

  toggleHamburger = () => {
    this.props.menuOpened ? this.props.closeMenu() : this.props.openMenu()
  }

  closeHamburger = () => {
    if (this.props.menuOpened) {
      this.props.closeMenu()
    }
  }

  handleClickOutside = () => {
    this.closeHamburger();
    this.setState({
      isMenuOpened: false
    })
  };

  preloaderOnHover = (component) => {
    component.preload();
  };

  logOutUser = async () => {
    try {
      const logOffRes = await api.get(`LogOff`)
      console.log('backend responce to GET LogOff', logOffRes)

      // reset qlik connection redux
      this.props.setQlikConnection(false)
      this.props.setQlikInstance(null)
      // close qlik app
      const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
      if (qApp)
        await qApp.close()
      // clear qlik window object
      window.GlobalQdtComponents = null
      // destroy session
      this.props.resetSignUp()
      this.props.logOut()
      //window.location.reload()
    } catch (e) {
      console.error(e)
    }
  }

  toggleUsermenu = () => {
    this.setState({
      isMenuOpened: !this.state.isMenuOpened
    })
  }

  render() {

    // const { isMenuOpened } = this.state;
    const { menuOpened } = this.props;

    return (
      <div className={this.props.stateClass}>
        <header className='header'>
          <div className="container container--full">
            <div className="header__wrapper">
              <div className="header__hamburger">
                <div
                  className={"hamburger hamburger--squeeze " + (menuOpened ? "is-active" : "")}
                  onClick={this.toggleHamburger}>
                  <div className="hamburger-box">
                    <div className="hamburger-inner">
                    </div>
                  </div>
                </div>
              </div>
              <NavLink onClick={this.closeHamburger} to='/' className="header__logo">
                <SvgIcon name="logo" />
              </NavLink>
              <div className="header__welcome-link">
                <Link to={`${process.env.PUBLIC_URL}/dash/dashboards`} className="btn btn-welcome">
                  <span className="for-desktop">Go straight to dashboards</span>
                  <span className="for-tablet">Dashboards</span>
                </Link>
              </div>
              <ul className="header__dash-nav">
                {dashNavLinks.map((link, i) => {
                  return (
                    <li key={i}>
                      <NavLink to={`${process.env.PUBLIC_URL + link.path}`} className="" activeClassName="is-active">
                        <div className="header__dash-icon">
                          <SvgIcon name={link.icon} />
                        </div>
                        <span>{link.name}</span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
              <HeaderUser
                toggleUsermenu={this.toggleUsermenu}
                logOutUser={this.logOutUser}
                isMenuOpened={this.state.isMenuOpened}
              />
            </div>
          </div>
        </header>

        { /* Mobile navi */}
        <div className={"mobile-nav " + (menuOpened ? "is-active" : "")}>
          <div className="container">
            <div className="mobile-nav__wrapper">
              <div className="mobile-nav__menu">
                {dashNavLinks.map((link, i) => {
                  return (
                    <li key={i}>
                      <NavLink
                        to={`${process.env.PUBLIC_URL + link.path}`}
                        className=""
                        activeClassName="is-active"
                        onClick={this.toggleHamburger}
                      >
                        <div className="mobile-nav__icon">
                          <SvgIcon name={link.icon} />
                        </div>
                        <span>{link.name}</span>
                      </NavLink>
                    </li>
                  )
                })}
              </div>
              <div className="mobile-nav__user">
                <HeaderUser
                  toggleUsermenu={this.toggleUsermenu}
                  logOutUser={this.logOutUser}
                  isMenuOpened={this.state.isMenuOpened}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};


const mapStateToProps = (state) => ({
  menuOpened: state.header.menuOpened,
  stateClass: state.header.stateClass
});

const mapDispatchToProps = (dispatch) => ({
  openMenu: () => dispatch({ type: OPEN_MENU }),
  closeMenu: () => dispatch({ type: CLOSE_MENU }),
  closeQlik: () => dispatch({ type: CLOSE_APP_QLIK }),
  setQlikConnection: (data) => dispatch(setQlikConnection(data)),
  setQlikInstance: (data) => dispatch(setQlikInstance(data)),
  resetSignUp: () => dispatch({ type: RESET_STATE_SIGNUP }),
  logOut: () => dispatch(logOut())
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(onClickOutside(Header));
