import React, { Component } from 'react';
import {Panel, OverlayTrigger, Tooltip} from 'react-bootstrap';

export default class DashNotifications extends Component {
  
  constructor(){  
    super();
    this.state ={
      open:true
          }
    this.addCustomScript();
  }
  addCustomScript = ()=> {
    const script = document.createElement("script");
    script.src = "https://kinimetrix.activehosted.com/f/embed.php?id=3s";
    script.async = true;
    document.body.appendChild(script);
}
  render(){
    return(
      <React.Fragment>

         <div className="dash-container">
          <div className="container container--full">
                            <div className="panel panel-dark">
                                <div className="panel-heading">
                                    <div className="panel-btns">
                                    <OverlayTrigger placement="top" overlay={<Tooltip placement="right" className="in" id="tooltip-right"> {(this.state.open ? "Minimize":"Maximize")}</Tooltip>} onClick={() => this.setState({ open: !this.state.open })} id="tooltip1">
                                    <i className={"fa " + (this.state.open ? "fa-minus-square-o":"fa-plus-square-o")}></i>
    </OverlayTrigger>

                                    {/* <a href="javascript:void(0)" className="panel-minimize tooltips" data-toggle="tooltip" title={(this.state.open ? "Maximize":"Minimize")} onClick={() => this.setState({ open: !this.state.open })}><i className={"fa " + (this.state.open ? "fa-plus-square-o":"fa-minus-square-o")}></i></a> */}
                                    </div>
                                    <h3 className="panel-title">Notifications</h3>
                                </div>
                              
                                <Panel id="collapsible-panel-example-1" expanded={this.state.open}>
          <Panel.Collapse>
            <Panel.Body>
            <div className="_form_3 form-border"></div>   
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
                               
                                </div>
                                </div>
                                </div>       
      </React.Fragment>
    )
  }
}
