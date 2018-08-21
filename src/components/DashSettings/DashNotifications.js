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
                            <div className="panel panel-dark">
                                <div className="panel-heading">
                                    <div className="panel-btns">
                                        <a href="" className="panel-minimize tooltips" data-toggle="tooltip" title="Minimize"><i className="fa fa-minus-square-o"></i></a>
                                    </div>
                                    <h3 className="panel-title">Notifications</h3>
                                </div>

                                <div className="panel-body">
                                <div className="_form_3 form-border"></div>   
                                </div>
                                </div>
                                </div>
                                </div>       
      </React.Fragment>
    )
  }
}
