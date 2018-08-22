import React, { Component } from 'react';
import ConnectMarketplaces from '../ConnectMarketplaces';

export default class DashMarketplaceConfig extends Component {
  constructor(props){
    super(props)

    this.state = {
      isFormSubmited: false,
      apiError: null
    }
  }

  setApiError = (error) => {
    this.setState(error)
  }

  onFormSubmited = (state) => {
    this.setState({
      isFormSubmited: state
    })
  }

  addNewMarketplace = () => {
    // TODO
    // what should happens ? LWA auth
  }

  render(){

    return(
      <React.Fragment>
        <div className="dash-container">
          <div className="container container--full">

          <div className="panel panel-dark">
         
                                <div className="panel-heading">                                   
                                    <h3 className="panel-title">Marketplace Configuration</h3>
                                </div>
                              <div className="panel-body"></div>
                              <div className="dash-new-marketplace">
              <a className="btn btn-new-marketplace" onClick={this.addNewMarketplace}>Add New Marketplace</a>
            </div>

            <ConnectMarketplaces
              onApiError={this.setApiError}
              onFormSubmited={this.onFormSubmited}
            />

                              </div>

           
          </div>
        </div>
      </React.Fragment>
    )
  }
}
