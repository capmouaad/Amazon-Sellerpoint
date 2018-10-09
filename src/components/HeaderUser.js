import React, { Component } from 'react'
import { Link} from 'react-router-dom';
import SvgIcon from '../components/Helpers/SvgIcon'
import { connect } from 'react-redux';
import UserConfirmationModal from './UserConfirmationModal'

class HeaderUser extends Component {
    state = {
        isMenuOpened: false,
        modalIsOpen: false,
        modalMessage: `
By leaving this page, you will close out the process of adding a new marketplace.\n
Are you sure you want to leave?
    `,
        navigateUrl: null
    }

    myProfile = () => {
        if (window.location.pathname.includes('addMarketPlace')) {
            this.setState({
                modalIsOpen: true,
                navigateUrl: `/User/Myprofile`
            })
        } else {
            window.location.href = window.location.origin + "/User/Myprofile"
        }
    }

    changePassword = () => {
        if (window.location.pathname.includes('addMarketPlace')) {
            this.setState({
                modalIsOpen: true,
                navigateUrl: `/User/ChangePassword`
            })
        } else {
            window.location.href = window.location.origin + "/User/ChangePassword"
        }
    }

    onUserConfirm = () => {
        this.onCloseModal()
        window.location.href = window.location.origin + this.state.navigateUrl
    }

    onCloseModal = () => {
        this.setState({
            modalIsOpen: false
        })
    }

    render () {
        const { isMenuOpened } = this.props
        const { modalIsOpen, modalMessage } = this.state

        return (
            <div className={"header__user" + (isMenuOpened ? " is-active" : "")} onClick={this.props.toggleUsermenu}>
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
                                <Link to="/profile">My Profile</Link>
                            </li>
                            <li>
                            <Link to="/changepassword">Change Password</Link>
                            </li>
                            <li>
                                <a onClick={this.props.logOutUser}>Log out</a>
                            </li>
                        </div>
                    </div>
                </div>
                <UserConfirmationModal
                    modalIsOpen={modalIsOpen}
                    modalMessage={modalMessage}
                    onCloseModal={this.onCloseModal}
                    onUserConfirm={this.onUserConfirm}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.login.userInfo
});
export default connect(mapStateToProps)(HeaderUser);
