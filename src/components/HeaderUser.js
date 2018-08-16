<<<<<<< HEAD
import React, { Component } from 'react'
import SvgIcon from '../components/Helpers/SvgIcon'

export default class HeaderUser extends Component{

  render(){

    const { isMenuOpened } = this.props

    return(
      <div
        className={"header__user" + ( isMenuOpened ?  " is-active" : "") }
        onClick={this.props.toggleUsermenu}
      >
        <div className="header__user-avatar">
          {/* SOME IMAGE TAG */}
        </div>
        <div className="header__user-name">
          BRITTANY DEMO
        </div>
        <div className={"header__user-dropdown"}>
          <div className="header__user-dropdown-arrow">
            <SvgIcon name="dropdown-arrow" />
          </div>
          <div className="header__dropdown">
            <div className="header__dropdown-menu">
              <li>
                <a href="">Some action</a>
              </li>
              <li>
                <a href="">Some action</a>
              </li>
              <li>
                <a onClick={this.props.logOutUser}>Log out</a>
              </li>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
=======
import React, { Component } from 'react'
import SvgIcon from '../components/Helpers/SvgIcon'
import { connect } from 'react-redux';

class HeaderUser extends Component {
    myProfile = () => {
        window.location.href = window.location.origin + "/User/Myprofile"
    }
    changePassword = () => {
        window.location.href = window.location.origin + "/User/ChangePassword"
    }
    render() {
        const { isMenuOpened } = this.props
        return (
            <div
                className={"header__user" + (isMenuOpened ? " is-active" : "")}
                onClick={this.props.toggleUsermenu}>
                <div className="header__user-avatar">
                    {this.props.userInfo && <img src={this.props.userInfo.ProfilePhoto} alt="My Profile" />}
                </div>
                <div className="header__user-name">
                    {this.props.userInfo && this.props.userInfo.UserName}
                </div>
                <div className={"header__user-dropdown"}>
                    <div className="header__user-dropdown-arrow">
                        <SvgIcon name="dropdown-arrow" />
                    </div>
                    <div className="header__dropdown">
                        <div className="header__dropdown-menu">
                            <li>
                                <a onClick={this.myProfile}>My Profile</a>
                            </li>
                            <li>
                                <a onClick={this.changePassword}>Change Password</a>
                            </li>
                            <li>
                                <a onClick={this.props.logOutUser}>Log out</a>
                            </li>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.login.userInfo
});

export default connect(mapStateToProps)(HeaderUser);
>>>>>>> 65a0d66960f344de2ee473534d95ced6dce2e05f
