import React, { Component } from 'react';
import SvgIcon from '../Helpers/SvgIcon'

export default class FilterInput extends Component {
  render() {
    const { onChange, filter } = this.props;
    return (
      <div className="search-box">
        <input type="text"
          onChange={event => onChange(event.target.value)}
          value={filter ? filter.value : ""}></input>
        {
          filter&&filter.value.length > 0 ? <div className="close-round cursor-pointer" onClick={()=>onChange("")}><SvgIcon name="close"></SvgIcon></div> : <SvgIcon name="magnifying-glass-bold"></SvgIcon>
        }
      </div>
    )
  }
}
