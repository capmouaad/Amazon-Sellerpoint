import React, { Component } from 'react'
import { connect } from 'react-redux'
import api from '../../services/Api'
import Formsy from 'formsy-react'
import FormInput from './../Forms/FormInput'
import FormTextArea from './../Forms/FormTextArea'
import FormSelect from './../Forms/FormSelect'
import FormLoader from './../Forms/FormLoader'

const marketPlaceOptions = [{text:'US',value:'ATVPDKIKX0DER'},{text:'Canada',value:'A2EUQ1WTGCTBG2'},{text:'Mexico',value:'A1AM78C64UM0Y8'}]

class KeywordAutomation extends Component {
  constructor(props){
    super(props);

    this.state = {
      apiError: null,
      isFormSubmited: false,
      marketplaceId: marketPlaceOptions[0].value
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

  setValue = (id) => {
    this.setState({ marketplaceId: id });
  }

  submitForm = () => {
    this.setState({
      apiError: null
    });
  }

  handleSubmit = async (e) => {
    const { asin, automationName, inputKeywords, marketplaceId } = this.state
    try {
      this.setState({
        isFormSubmited: true // reset submit status
      })

      const arrayInputKeywords = inputKeywords.split('\n')

      const params = {
        name: automationName,
        marketPlaceId: marketplaceId,
        asin: asin,
        inputKeywords: arrayInputKeywords
      }

      const formRes = await api.post(`CreateKWAutomation`, params)
      console.log('backend responce to POST kwAutomation', formRes)

      const { IsSuccess, ErrorMessage } = formRes.data;

      if (IsSuccess) {

      } else {
        throw new Error(ErrorMessage)
      }

    } catch (e) {
      this.setState({
        apiError: e.message
      })
    } finally {
      this.setState({
        isFormSubmited: false
      })
    }
  }

  goBackMainMenu = () => {
    this.props.history.push('/dash/Keywords/KeywordsAutomationMenu')
  }

  render() {
    const { automationName, marketplaceId, inputAsin, inputKeywords, apiError, isFormSubmited } = this.state
    return (
      <React.Fragment>
        <div className="dash-container">
          <div className="container container--full">
            <button onClick={this.goBackMainMenu} className="btn-go-back-market">{`Back to Main Menu`}</button>
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
                <div className={"loader-container " + (isFormSubmited ? "is-loading" : "")}>
                  <FormLoader />
                  {
                    apiError &&
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
                    setValue={this.setValue}
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
                    label={`Input 1-3 Base Keywords/Phrases
                    (Seperated by line breaks.  Ideally there would only be 1 primary keyword):`}
                    value={inputKeywords}
                    validations="minLength:1"
                    validationErrors={{
                      isDefaultRequiredValue: 'Please enter keyword',
                      minLength: 'Keyword is invalid'
                    }}
                    onChangeHandler={this.handleChange}
                    required
                  />
                  <div>
                  Note: Enter the keyword(s) which most describes you that is specific enough to describe your product, but broad enough to have sufficient search volume (e.g. "milk frother", "stainless steel milk frother", "pot and pan set"). This should also be a keyword/phrase that would likely pull up a focused list of your top competitors.
                  </div>
                  <div className="signup__form-cta signup__form-cta--centered">
                    <button type="submit" className="btn btn-signup btn--block">Next</button>
                  </div>
                </div>
              </Formsy>
            </div>
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
