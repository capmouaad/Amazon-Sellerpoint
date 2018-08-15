import React, { Component } from 'react'
import SvgIcon from '../components/Helpers/SvgIcon'
import { connect } from 'react-redux';

class HeaderUser extends Component {

    render() {

        const { isMenuOpened } = this.props
        return (
            <div
                className={"header__user" + (isMenuOpened ? " is-active" : "")}
                onClick={this.props.toggleUsermenu}
            >
                <div className="header__user-avatar">
                    {this.props.userInfo && <img src={this.props.userInfo.ProfilePhoto} alt="Profile Image" />}
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
                                <a href="">My Profile</a>
                            </li>
                            <li>
                                <a href="">Change Password</a>
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