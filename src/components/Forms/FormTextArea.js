import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';

class FormTextArea extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChangeHandler: PropTypes.func,
  };

  changeValue = (event) => {
    this.props.onChangeHandler(event)
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    const { name, label, isRequired } = this.props

    // An error message is returned only if the component is invalid
    const errorMessage = this.props.isFormSubmitted() ? this.props.getErrorMessage() : null;
    const parentClass = this.props.isFormSubmitted() ? this.props.isValid() ? 'ui-group' : 'ui-group has-error' : 'ui-group'

    return (
      <React.Fragment>
        <div className={parentClass + (label ? " ui-group--labeled" : "")}>
          <label htmlFor={name}>
            {isRequired() ? (<span className="asterisk">*</span>) : ""}
            {label}
          </label>
          <div className="input-box">
            <textarea rows="5" cols="47" name={name}
              onChange={this.changeValue}
              value={this.props.getValue() || ''}
              required={isRequired() ? true : false}>
            </textarea>
          </div>
        </div>
        {errorMessage &&
          <span className="ui-input-validation">{errorMessage}</span>
        }
      </React.Fragment>
    )
  }
}

export default withFormsy(FormTextArea);