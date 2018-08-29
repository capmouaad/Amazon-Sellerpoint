import React from 'react';
import { connect } from 'react-redux'
import api from '../../services/Api';
import QdtComponents from 'qdt-components';
import { setQlikParams, setQlikConnection, setQlikInstance } from '../../actions/qlik'

class QlikConnector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isImageRequested: false,
      isConnected: props.QlikConnected,
      QlikData: props.QlikParams,
      apiError: null
    }
  }

  componentDidMount() {
    this.requestQlikData()
  }

  // first request API
  requestQlikData = () => {

    // if ( window.GlobalQdtComponents || this.props.QlikConnected ) {
    //   this.connectQlik() // skip API responce and image reguest
    //   return
    // }

    this.props.setQlikConnection(false)

    api
      .get(`GetSellerPointTicketDetails`)
      .then((res) => {
        console.log('backend responce to Get GetSellerPointTicketDetails', res)

        if (res.data.IsSuccess) {

          this.props.setQlikParams({
            QlikAppId: res.data.QlikAppId,
            QTicket: res.data.QTicket,
            QlikProtocol: res.data.QlikProtocol,
            QSecure: res.data.QSecure,
            QServer: res.data.QServer,
            QPort: res.data.QPort,
            VirtualProxy: res.data.VirtualProxy,
            QUrl: res.data.QUrl,
            IsWebTicketEnabled: res.data.IsWebTicketEnabled
          })

          this.setState({
            QlikData: {
              QlikAppId: res.data.QlikAppId,
              QTicket: res.data.QTicket,
              QlikProtocol: res.data.QlikProtocol,
              QSecure: res.data.QSecure,
              QServer: res.data.QServer,
              QPort: res.data.QPort,
              VirtualProxy: res.data.VirtualProxy,
              QUrl: res.data.QUrl,
              IsWebTicketEnabled: res.data.IsWebTicketEnabled
            }
          }, () => {
            this.requestQlikImage(); // next step
          })

        } else {
          this.setState({
            apiError: res.data.ErrorMessage
          });
          this.props.setQlikConnection(false)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // then get iamge to establish session
  requestQlikImage = () => {
    const { QlikData } = this.state
    const imgForSessionUrl = `${QlikData.QUrl}/resources/img/core/dark_noise_16x16.png?qlikTicket=${QlikData.QTicket}`

    var newImg = new Image();
    newImg.onload = this.ContinueLoading();
    newImg.src = imgForSessionUrl;
  }

  ContinueLoading = () => {
    const { QlikData } = this.state

    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = `${QlikData.QUrl}/resources/autogenerated/qlik-styles.css`;
    document.getElementsByTagName("head")[0].appendChild(link);

    var script = document.createElement("script");
    script.src = `${QlikData.QUrl}/resources/assets/external/requirejs/require.js`;
    script.onload = setTimeout(function () {
      this.connectQlik();
    }.bind(this), 1000)
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // step 3 connect and prepare master component
  connectQlik = () => {
    const { QlikData } = this.state
    const options = {
      config: {
        host: QlikData.QServer,
        secure: QlikData.QSecure,
        port: QlikData.QPort,
        prefix: QlikData.VirtualProxy,
        appId: QlikData.QlikAppId
      },
      connections: {
        vizApi: true,
        // engineApi: true
      }
    }

    // TODO fails with multiple requests
    if (!window.GlobalQdtComponents || !this.props.QlikConnected) {
      const qdtComponents = new QdtComponents(options.config, options.connections);
      window.GlobalQdtComponents = qdtComponents
    }

    this.props.setQlikConnection(true)
  }

  // blank render function
  render() {
    return null
  }
}

const mapStateToProps = (state) => ({
  QlikConnected: state.qlik.connected,
  QlikParams: state.qlik.params,
  QlikInstance: state.qlik.instance
});

const mapDispatchToProps = (dispatch) => ({
  setQlikConnection: (data) => dispatch(setQlikConnection(data)),
  setQlikParams: (data) => dispatch(setQlikParams(data)),
  setQlikInstance: (data) => dispatch(setQlikInstance(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QlikConnector);