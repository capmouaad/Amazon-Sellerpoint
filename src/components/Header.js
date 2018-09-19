import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import onClickOutside from "react-onclickoutside";
import api from '../services/Api';
import { OPEN_MENU, CLOSE_MENU, RESET_STATE_SIGNUP, SET_STATUS_PROGRESS, SET_NAVBAR_DASHBOARD} from '../store/ActionTypes';
import { closeAppQlik } from '../actions/qlik'
import { logOut } from '../actions/login';
import { resetStateDashFilter } from '../actions/dashFilter'
import { resetStatusBar, setShowImportProgressBar } from '../actions/statusBar'
import { clearReduxSignOut } from '../services/Api'

import UserConfirmationModal from './UserConfirmationModal'
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
      isMenuOpened: false,
      modalIsOpen: false,
      modalMessage: `
By leaving this page, you will close out the process of adding a new marketplace.\n
Are you sure you want to leave?
  `
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

  logOutUser = () => {
    if (window.location.pathname.includes('addMarketPlace')) {
      this.setState({
        modalIsOpen: true
      })
    } else {
      this.proceedLogOut()
    }
  }

  proceedLogOut = async () => {
    try {
      // close modal then continue
      this.onCloseModal()

      // close qlik app
      const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
      if (qApp)
        await qApp.close()
      // clear qlik window object
      window.GlobalQdtComponents = null
      // reset qlik connection redux
      this.props.closeAppQlik()

      const logOffRes = await api.get(`LogOff`)
      console.log('backend responce to GET LogOff', logOffRes)

      //window.location.reload()
    } catch (e) {
      console.error(e)
    }

    clearReduxSignOut()
  }

  toggleUsermenu = () => {
    this.setState({
      isMenuOpened: !this.state.isMenuOpened
    })
  }

  onCloseModal = () => {
    this.setState({
      modalIsOpen: false
    })
  }

  render() {
    const { modalIsOpen, modalMessage } = this.state
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
              <NavLink onClick={this.closeHamburger} to='/dash/dashboards' className="header__logo">
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
        <UserConfirmationModal
          modalIsOpen={modalIsOpen}
          modalMessage={modalMessage}
          onCloseModal={this.onCloseModal}
          onUserConfirm={this.proceedLogOut}
        />
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
  closeAppQlik: () => dispatch(closeAppQlik()),
  resetSignUp: () => dispatch({ type: RESET_STATE_SIGNUP }),
  setStatusProgress: (data) => dispatch({ type: SET_STATUS_PROGRESS, payload: data }),
  setNavbarDashboard: (data) => dispatch({ type: SET_NAVBAR_DASHBOARD, payload: data }),
  resetStateDashFilter: () => dispatch(resetStateDashFilter()),
  resetStatusBar: () => dispatch(resetStatusBar()),
  setShowImportProgressBar: (data) => dispatch(setShowImportProgressBar(data)),
  logOut: () => dispatch(logOut())
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(onClickOutside(Header))
