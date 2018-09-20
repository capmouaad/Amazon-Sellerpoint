import React from 'react'
import api from '../services/Api'
import { connect } from 'react-redux'
import { APP_CONFIG } from '../constants'
import { setActiveStatusBar, setShowStatusBar, setDescStatusBar } from '../actions/statusBar'
import { store } from '../store/store'

export const GetActiveQSReload = async() => {
  const { isShowStatusBar, descStatusBar, isStatusBarActive } = store.getState().statusBar
  const { data } = await api.get(`GetActiveQSReloads`)

  const { ActiveReloadDueToCogsUpdate, ActiveReloadDueToSKUGroupChanges } = data

  if (!isShowStatusBar && (ActiveReloadDueToCogsUpdate || ActiveReloadDueToSKUGroupChanges)) {
    store.dispatch(setShowStatusBar(true))
  }

  let desc = descStatusBar
  let isActive = isStatusBarActive

  if (ActiveReloadDueToCogsUpdate && ActiveReloadDueToSKUGroupChanges) {
    desc = APP_CONFIG.RELOAD_STATUS_PROGRESS.BothLoading
    isActive = true
  } else if (ActiveReloadDueToCogsUpdate) {
    desc = APP_CONFIG.RELOAD_STATUS_PROGRESS.CogsLoading
    isActive = true
  } else if (ActiveReloadDueToSKUGroupChanges) {
    desc = APP_CONFIG.RELOAD_STATUS_PROGRESS.SkuGroupLoading
    isActive = true
  } else {
    switch (descStatusBar) {
      case APP_CONFIG.RELOAD_STATUS_PROGRESS.CogsLoading:
        desc = APP_CONFIG.RELOAD_STATUS_PROGRESS.CogsComplete
        break;
      case APP_CONFIG.RELOAD_STATUS_PROGRESS.SkuGroupLoading:
        desc = APP_CONFIG.RELOAD_STATUS_PROGRESS.SkuGroupComplete
        break
      case APP_CONFIG.RELOAD_STATUS_PROGRESS.BothLoading:
        desc = APP_CONFIG.RELOAD_STATUS_PROGRESS.BothComplete
        break
      case null:
      case '':
        store.dispatch(setShowStatusBar(false))
        break
      default:
        desc = descStatusBar
        break
    }
    isActive = false
  }
  store.dispatch(setDescStatusBar(desc))
  store.dispatch(setActiveStatusBar(isActive))
}

class ReloadStatusBar extends React.PureComponent {
  onCloseStatusBar = () => {
    this.props.setShowStatusBar(false)
  }

  componentDidMount () {
    this.getReloadStatus = setInterval(() => {
        GetActiveQSReload()
    }, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.getReloadStatus)
  }

  render () {
    const { isShowStatusBar, isStatusBarActive, descStatusBar } = this.props
    if (isShowStatusBar) {
      return (
        <div className={'wrapper-progress-bar'}>
          <div className={isStatusBarActive ? 'status-bar-update-loading' : 'status-bar-update-success'}>
            <span className={isStatusBarActive ? 'text-status-bar-loading': 'text-status-bar-success'}>{descStatusBar}</span>
            {
              !isStatusBarActive &&
              (
                <div>
                  <span className='ico-check-success'></span>
                  <i className='fa fa-times ico-close-bar' onClick={this.onCloseStatusBar}></i>
                </div>
              )
            }
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  descStatusBar: state.statusBar.descStatusBar,
  isShowStatusBar: state.statusBar.isShowStatusBar,
  isStatusBarActive: state.statusBar.isStatusBarActive
})

const mapDispatchToProps = (dispatch) => ({
  setShowStatusBar: (data) => dispatch(setShowStatusBar(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReloadStatusBar)
