import React from 'react'
import { connect } from 'react-redux'

class ReloadTimeInGMT extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lastTime: null
    }
  }

  getReloadLastTime = async () => {
    if (this.props.QlikConnected && !this.state.lastTime) {
      const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
      
      qApp && qApp.variable.getContent('vReloadTimeInGMT', ( reply ) => {
        this.setState({
          lastTime: reply.qContent.qString
        })
      })
    }
  }

  componentDidMount () {
    this.getReloadLastTime()
  }

  componentDidUpdate () {
    this.getReloadLastTime()
  }

  render () {
    return (
      <div className='reload-time'>
        <span>{`Last Updated: ${this.state.lastTime || ''}`}</span>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  QlikConnected: state.qlik.connected
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ReloadTimeInGMT)