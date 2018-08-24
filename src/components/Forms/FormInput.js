import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask'
import { withFormsy } from 'formsy-react';
import Image from '../../components/Helpers/Image';

class FormInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChangeHandler: PropTypes.func,
    mask: PropTypes.array,
    icon: PropTypes.string,
  };

  changeValue = (event) => {
    this.props.onChangeHandler(event)
    this.props.setValue(event.currentTarget.value);
  }

  getIcon=()=>{
    const { icon } = this.props

    if ( icon ){
      return (
        <div className="input-box">
        <Image image={icon}></Image>
        { this.getInput() }
        </div>
      )
    }
    else{
      return (       
         this.getInput() 
      )
    }
  }


  getInput = () => {
    const { name, placeholder, mask } = this.props
    const type = this.props.type ? this.props.type : "text"

    if ( mask ){
      return (
        <MaskedInput
          name={name}
          type={type}
          mask={mask}
          guide={false}
          placeholder={placeholder}
          onChange={this.changeValue}
          value={this.props.getValue() || ''}
        />
      )
    } else {
      return(
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={this.changeValue}
          value={this.props.getValue() || ''}
          // required={isRequired() ? true : false}
        />
      )
    }
  }

  render(){
    const { name, label, isRequired } = this.props

    // An error message is returned only if the component is invalid
    const errorMessage = this.props.isFormSubmitted() ? this.props.getErrorMessage() : null;
    const parentClass = this.props.isFormSubmitted() ? this.props.isValid() ? 'ui-group' : 'ui-group has-error' : 'ui-group'

    return (
      <React.Fragment>
        <div className={parentClass + (label ? " ui-group--labeled" : "")}>
          <label htmlFor={name}>
            {isRequired() ? '*' : ""}
            {label}
          </label>
         
          { this.getIcon() }
        
        </div>
        { errorMessage &&
          <span className="ui-input-validation">{errorMessage}</span>
        }
      </React.Fragment>
    )

  }
}

export default withFormsy(FormInput);
