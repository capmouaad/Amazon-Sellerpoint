import React, { Component } from 'react';

export default class DashNotifications extends Component {

  constructor() {
    super();
    this.state = {
      open: true
    }
  }

  componentWillMount() {
    if (document.getElementById("notification_script") == null) {
      this.addCustomScriptNotification();
    }
    else {
      document.getElementById("notification_script").remove();
      this.addCustomScriptNotification();
    }
  }

  addCustomScriptNotification = () => {
    const script = document.createElement("script");
    script.src = "https://kinimetrix.activehosted.com/f/embed.php?id=3s";
    script.id = "notification_script";
    script.async = true;
    document.body.appendChild(script);
  }
  render() {
    return (
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
