import React from 'react'
import api from '../services/Api'
import { connect } from 'react-redux'
import { APP_CONFIG } from '../constants'
import { setStatusBar } from '../actions/dashFilter'

class ReloadStatusBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      reloadBoth: true,
      reloadCogsUpdate: false,
      reloadSKUGroupChanges: false,

      isBothLoading: false,
      isCogsUpdateLoading: false,
      isSkuGroupChangesLoading: false,

      text: null,
      isActive: false
    }
  }

  onCloseStatusBar = () => {
    this.props.setStatusBar(false)
  }

  GetActiveQSReload = () => {
    const { isShowStatusBar, setStatusBar } = this.props
    api
        .get(`GetActiveQSReloads`)
        .then((res) =>{
          console.log('Backend response to GET GetActiveQSReloads', res)
          const { ActiveReloadDueToCogsUpdate, ActiveReloadDueToSKUGroupChanges } = res.data

          if (!isShowStatusBar && (ActiveReloadDueToCogsUpdate || ActiveReloadDueToSKUGroupChanges)) {
            setStatusBar(true)
          }

          let text = null
          let isActive

          if (ActiveReloadDueToCogsUpdate && ActiveReloadDueToSKUGroupChanges) {
            text = APP_CONFIG.RELOAD_STATUS_PROGRESS.BothLoading
            isActive = true
          } else if (ActiveReloadDueToCogsUpdate) {
            text = APP_CONFIG.RELOAD_STATUS_PROGRESS.CogsLoading
            isActive = true
          } else if (ActiveReloadDueToSKUGroupChanges) {
            text = APP_CONFIG.RELOAD_STATUS_PROGRESS.SkuGroupLoading
            isActive = true
          } else {
            switch (this.state.text) {
              case APP_CONFIG.RELOAD_STATUS_PROGRESS.CogsLoading:
                text = APP_CONFIG.RELOAD_STATUS_PROGRESS.CogsComplete
                break;
              case APP_CONFIG.RELOAD_STATUS_PROGRESS.SkuGroupLoading:
                text = APP_CONFIG.RELOAD_STATUS_PROGRESS.SkuGroupComplete
                break
              case APP_CONFIG.RELOAD_STATUS_PROGRESS.BothLoading:
                text = APP_CONFIG.RELOAD_STATUS_PROGRESS.BothComplete
                break
              case null:
                this.props.setStatusBar(false)
                break
              default:
                text = APP_CONFIG.RELOAD_STATUS_PROGRESS.default
                break
            }
            isActive = false
          }

          this.setState({
            text,
            isActive
          })
        })
  }

  componentDidMount () {
    this.getReloadStatus = setInterval(() => {
        this.GetActiveQSReload()
    }, 10000)
  }

  componentWillUnmount () {
    clearInterval(this.timerGetImportStatus)
  }

  render () {
    const { isShowStatusBar } = this.props
    const { isActive, text } = this.state
    if (isShowStatusBar) {
      return (
        <div className={'wrapper-progress-bar'}>
          {
            // this.renderComponentProgress()
          }
          <div className={isActive ? 'status-bar-update-loading' : 'status-bar-update-success'}>
            <span className={isActive ? 'text-status-bar-loading': 'text-status-bar-success'}>{text}</span>
            {
              !isActive &&
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
  isShowStatusBar: state.dashFilter.isShowStatusBar
})

const mapDispatchToProps = (dispatch) => ({
  setStatusBar: (data) => dispatch(setStatusBar(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReloadStatusBar)
