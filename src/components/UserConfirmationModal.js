import React, { PureComponent } from 'react';
import Modal from 'react-responsive-modal'

export default class UserConfirmationModal extends PureComponent {
  render () {
    const { modalMessage = '', modalIsOpen = false, title = 'Warning!', onCloseModal, onUserConfirm } = this.props
    return (
      <Modal center showCloseIcon={false} open={modalIsOpen} onClose={onCloseModal}>
        <div className="modal-dialog modal-md loader-inside loading-over">
          <div className="modal-content modal-user-config">
            <div className="modal-header modal-header-user-config">
                <h4 className="modal-title" id="myModalLabel">{title}</h4>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>

              <div className="button-row">
                <button className="button-wrapper yes-button" onClick={onUserConfirm}>
                  Yes
                </button>
                <button className="button-wrapper no-button" onClick={onCloseModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
