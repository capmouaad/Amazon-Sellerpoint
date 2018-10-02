import React, { Component } from 'react';
import { connect } from 'react-redux';

class KeywordAutomationMenu extends Component {

  render() {
    return (
      <React.Fragment>
        <div className="dash-container">
          Menu
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(KeywordAutomationMenu);
