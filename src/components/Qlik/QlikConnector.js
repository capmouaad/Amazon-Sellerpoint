import React from 'react';
import { connect } from 'react-redux'
import api from '../../services/Api';
import QdtComponents from 'qdt-components';
import { setQlikParams, setQlikConnection, setQlikInstance } from '../../actions/qlik'
import { APP_CONFIG } from '../../constants'
import moment from 'moment';
import Modal from 'react-responsive-modal'

class QlikConnector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isConnected: props.QlikConnected,
      QlikData: props.QlikParams,
      apiError: null,
      isModal: false,
      qlikError: null
    }
    this.connectQlik = this.connectQlik.bind(this);
  }

  componentDidMount() {
    this.requestQlikData()
  }

  // first request API
  requestQlikData = () => {

    // if (window.GlobalQdtComponents || this.props.QlikConnected) {
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
            this.requestQlikCSS(); // next step
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

  // Step 1: Load Qlik CSS
  requestQlikCSS = () => {
    const { QlikData } = this.state
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.addEventListener("load", this.requestQlikRequire.bind(this), false);
    link.href = `${QlikData.QUrl}/resources/autogenerated/qlik-styles.css?qlikTicket=${QlikData.QTicket}`;
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  // Step 2: Load Qlik Require JS
  requestQlikRequire = () => {
    const { QlikData } = this.state
    console.log("CSS finished loading and now loading requirejs");
    var script = document.createElement("script");
    script.src = `${QlikData.QUrl}/resources/assets/external/requirejs/require.js`;
    script.addEventListener("load", this.connectQlik());
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // Step 3: Connect and prepate qdt Components.
  connectQlik = async () => {
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
        //engineApi: true
      }
    }
    console.log('connectQlik');

    //if (!window.GlobalQdtComponents || !this.props.QlikConnected) {
    // Add few secs delay till Require Js is loaded.
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    await wait(1000);

    // Create Qdt Component instance.
    const qdtComponents = new QdtComponents(options.config, options.connections);
    window.GlobalQdtComponents = qdtComponents

    // Apply default DataGroup By selection.
    const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null;

    qApp.on('error', (error) => {
      console.log('qlik.setOnError' + ((error !== undefined && error.message !== undefined) ? ': ' + error.message : ''))
      if ((error !== undefined && error.message !== undefined) && (error.message === 'Not connected' || error.message === 'Socket closed' || error.message === 'Connection lost. Make sure that Qlik Sense is running properly. If your session has timed out due to inactivity, refresh to continue working.' || error.message === 'No available Qlik Sense engine was found. Refresh your browser or contact your system administrator.')) {
         this.setState({
           isModal: true,
           qlikError: error.message
         })
      }
    })
    
    await qApp.field(APP_CONFIG.QS_FIELD_NAME.DataGroupBy).selectValues(['Week'], false, true);
    await qApp.field(APP_CONFIG.QS_FIELD_NAME.DataGroupBy).lock();

    // Apply default Date selection.
    const startDate = moment().subtract(59, 'days').format('MM/DD/YYYY');
    const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
    await qApp.field('Date').selectMatch('>=' + startDate + '<=' + endDate, true).then(async () => {
      await   qApp.field('Date').lock();
    });

    //}
    // Set QS connection complete flag.
    this.props.setQlikConnection(true);
  }

  onCloseModal = () => {
    this.setState({
      isModal: false
    })
  }

  render() {
    const { isModal, qlikError }  = this.state
    return (
      <Modal center showCloseIcon={false} open={isModal} onClose={this.onCloseModal}>
        <div className="modal-dialog modal-md loader-inside loading-over">
          <div className="modal-content modal-user-config">
            <div className="modal-header modal-header-user-config">
                <h4 className="modal-title" id="myModalLabel">{`Warning!`}</h4>
            </div>
            <div className="modal-body">
              <p>{qlikError}</p>

              <div className="button-row">
                <button className="button-wrapper yes-button" onClick={this.onCloseModal}>
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
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
