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
                           
                              
            <div className="_form_3 form-border"></div>   
               
                              
                                </div>
                                </div>       
      </React.Fragment>
    )
  }
}
