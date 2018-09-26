import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import SvgIcon from '../components/SvgIcon';

export default class CheckBox extends Component {
  static propTypes = {
    name: PropTypes.string,
    text: PropTypes.string,
    clickHandler: PropTypes.func,
    active: PropTypes.bool
  };


  render(){

    const { name, isActive, clickHandler, text, isAddedToMarket } = this.props

    return(
      <div className={isAddedToMarket ? 'ui-checkbox isAdded' : (isActive ? "ui-checkbox is-active" : "ui-checkbox")} onClick={isAddedToMarket ? () => {} : clickHandler}>
        <input type="checkbox" name={name} id={name} />
        <div className="ui-checkbox__label">
          <span>{text}</span>
        </div>
      </div>
    )
  }
}
