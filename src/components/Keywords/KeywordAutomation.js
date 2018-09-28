import React, { Component } from 'react';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import FormInput from './../Forms/FormInput'
import FormTextArea from './../Forms/FormTextArea'
import FormSelect from './../Forms/FormSelect'
import FormLoader from './../Forms/FormLoader';

class KeywordAutomation extends Component {
  constructor(props){
    super(props);

    this.state = {
      apiError: null,
      isFormSubmited: false,
      marketPlaceOptions:[{text:'US',value:'ATVPDKIKX0DER'},{text:'Canada',value:'A2EUQ1WTGCTBG2'},{text:'Mexico',value:'A1AM78C64UM0Y8'}]
    }

    this.formRef = React.createRef();
  }

  formInvalid = () => {
    this.setState({ formIsValid: false });
  }

  formValid = () => {
    this.setState({ formIsValid: true });
  }

  handleChange = (e) => {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({ ...this.state, [fieldName]: fleldVal });
  }

  submitForm = () => {
    this.setState({
      apiError: null
    });
  }

  handleSubmit = (e) => {
    // if (
    //   this.state.formIsValid &&
    //   this.state.captcha &&
    //   (this.state.password === this.state.password_confirmation)
    // ) {
    //   this.nextStep();
    // }
  }

  render() {
 const { automationName,marketplaceId,inputAsin, inputKeywords,marketPlaceOptions, apiError, isFormSubmited } = this.state
    return (
      <React.Fragment>
        <div className="dash-container">
          <div className="container container--full">
            <h3>CREATE NEW AUTOMATION</h3>
            <div className="signup__subcontainer">
          <Formsy
            className="signup__seller-form"
             onSubmit={this.submitForm}
            onValidSubmit={this.handleSubmit}
            onValid={this.formValid}
            onInvalid={this.formInvalid}
            ref={(node) => { this.formRef = node }}
          >
            { apiError &&
              <span className="ui-input-validation">{apiError}</span>
            }
            <FormInput
              name="automationName"
              label="Automation Name"
              placeholder=""
              value={automationName}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter name',
                minLength: 'Name is invalid'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <FormSelect
              name="marketplace"
              label="Marketplace"
              value={marketplaceId}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please select marketplace',
                minLength: 'Marketplace is invalid'
              }}
              onChangeHandler={this.handleChange}
              options={marketPlaceOptions}
              required
            />
            <FormInput
              name="asin"
              label="ASIN"
              placeholder=""
              value={inputAsin}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter ASIN',
                minLength: 'ASIN is invalid'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <FormTextArea
              name="inputKeywords"
              label="Input 1-3 Base Keywords/Phrases
              (Seperated by line breaks.  Ideally there would only be 1 primary keyword):"
              value={inputKeywords}
              validations="minLength:1"
              validationErrors={{
                isDefaultRequiredValue: 'Please enter keyword',
                minLength: 'Keyword is invalid'
              }}
              onChangeHandler={this.handleChange}
              required
            />
            <div className="signup__form-cta signup__form-cta--centered">
              <button type="submit" className="btn btn-signup btn--block">Next</button>
            </div>
          </Formsy>  </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(KeywordAutomation);