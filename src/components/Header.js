import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import onClickOutside from "react-onclickoutside";
import api from '../services/Api';
import { OPEN_MENU, CLOSE_MENU, RESET_STATE_SIGNUP, SET_STATUS_PROGRESS, SET_NAVBAR_DASHBOARD} from '../store/ActionTypes';
import { closeAppQlik } from '../actions/qlik'
import { logOut } from '../actions/login';
import { resetStateDashFilter } from '../actions/dashFilter'
import { resetStatusBar } from '../actions/statusBar'
import { clearReduxSignOut } from '../services/Api'

import UserConfirmationModal from './UserConfirmationModal'
import SvgIcon from '../components/Helpers/SvgIcon'
import HeaderUser from './HeaderUser';
import { isBrowser, isMobile } from 'react-device-detect'

const CONFIGURATION_TEXT = {
  COGS: 'COGS',
  GROUPING: 'GROUPING'
}

// move configuration nav link to separate component so we can mount / unmount it according to stateClass from redux instead of just hiding it by css
class ConfigurationClass extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      descFlag: '',
      isShowFlag: false
    }
  }
  GetCOGSAndSKUGroupingStatus = async () => {
    try {
      const { isShowFlag, descFlag } = this.state
      const { data } = await api.get('GetCOGSAndSKUGroupingStatus')
      // console.log('backend responce to GET COGSAndSKUGroupingStatus', data)

      let desc = descFlag
      let flag = isShowFlag

      if (data.IsSuccess) {
        if (!data.COGSUpdated && !data.ViewedSKUGroup) {
          desc = CONFIGURATION_TEXT.COGS
          flag = true
        } else if (!data.COGSUpdated && data.ViewedSKUGroup) {
          desc = CONFIGURATION_TEXT.COGS
          flag = true
        } else if (data.COGSUpdated && !data.ViewedSKUGroup) {
          desc = CONFIGURATION_TEXT.GROUPING
          flag = true
        } else {
          desc = ''
          flag = false
        }

        this.setState({
          isShowFlag: flag,
          descFlag: desc
        })
      } else {
        console.error('GetCOGSAndSKUGroupingStatus ERROR:', data.ErrorMessage)
      }
    } catch (e) {
      console.error(e)
    }
  }

  clearCheckStatusInterval = () => {
    this.timerGetCOGSAndSKUGroupingStatus && clearInterval(this.timerGetCOGSAndSKUGroupingStatus)
  }

  componentDidMount () {
    this.GetCOGSAndSKUGroupingStatus()
    this.timerGetCOGSAndSKUGroupingStatus = setInterval(() => {
      this.GetCOGSAndSKUGroupingStatus()
    }, 5000)
  }

  componentWillUnmount () {
    this.clearCheckStatusInterval()
  }

  checkPath = (configDesc) => {
    const publicUrl = process.env.PUBLIC_URL
    let configPath = ''
    if (configDesc === CONFIGURATION_TEXT.COGS) {
      configPath = '/dash/configuration'
    } else if (configDesc === CONFIGURATION_TEXT.GROUPING) {
      configPath = '/dash/configuration/skuasinGrouping'
    } else {
      configPath = '/dash/configuration'
    }

    return `${publicUrl}${configPath}`
  }

  render () {
    const { descFlag, isShowFlag } = this.state
    return (
      <li key={'configuration'}>
        <NavLink to={this.checkPath(descFlag)} className="" activeClassName="is-active">
          <div className="header__dash-icon">
            <SvgIcon name='dash-nav-settings' />
          </div>
          <span>{`Configuration`}</span>
        </NavLink>
        {
          isShowFlag &&
          (<span className={`flag-status ${descFlag === CONFIGURATION_TEXT.COGS ? 'flag-status-cogs' : 'flag-status-grouping'}`}>{descFlag}</span>)
        }
      </li>
    )
  }
}

const Configuration = withRouter(ConfigurationClass)

const makeDashNavLinks = [
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
    icon: "dash-nav-settings",
    component: Configuration
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
    // close modal then continue
    this.onCloseModal()
    try {
      // close qlik app
      const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
      if (qApp)
        await qApp.close()
      // clear qlik window object
      window.GlobalQdtComponents = null
      // reset qlik connection redux
      this.props.closeAppQlik()

      //window.location.reload()
      const logOffRes = await api.get(`LogOff`)
      console.log('backend responce to GET LogOff', logOffRes)
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
                {
                  isBrowser && this.props.stateClass === 'header--dash' && makeDashNavLinks.map((link, i) => {
                    return link.component
                    ? <link.component key={`dash-${i}`} />
                    : (
                      <li key={`dash-${i}`}>
                        <NavLink to={`${process.env.PUBLIC_URL + link.path}`} className="" activeClassName="is-active">
                          <div className="header__dash-icon">
                            <SvgIcon name={link.icon} />
                          </div>
                          <span>{link.name}</span>
                        </NavLink>
                      </li>
                    )
                  })
                }
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
                {
                  isMobile && this.props.stateClass === 'header--dash' && makeDashNavLinks.map((link, i) => {
                  return link.component
                    ? <link.component key={`mobile-dash-${i}`} />
                    : (
                      <li key={`mobile-dash-${i}`}>
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
                  })
                }
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
  logOut: () => dispatch(logOut())
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(onClickOutside(Header))
