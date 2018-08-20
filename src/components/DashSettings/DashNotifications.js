import React, { Component } from 'react';

export default class DashNotifications extends Component {
  
  constructor(){  
    super();
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
            <div className="_form_3"></div>            
           
          </div>
        </div>
      </React.Fragment>
    )
  }
}
