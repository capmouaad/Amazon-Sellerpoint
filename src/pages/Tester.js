import React, { Component } from 'react';
import axios from 'axios';
import FormInput from '../components/Forms/FormInput';
import Formsy from 'formsy-react';
import Loader from '../components/Loader';

export default class Tester extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading:false,
      keywords: [],
      marketplaceId: 'ATVPDKIKX0DER',
      functionKey: '4uTea98LJ1TcujZtKtQheJZ0yUzTV5W2rQwMJ8jknfnhwxUdnOv2DA==',
      functionURL:'https://kinigroup-dev.azurewebsites.net/api'
    }
  }

  handleChange = (e) => {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({ ...this.state, [fieldName]: fleldVal });
  }

  GetAsin = async (e) => {
    const { marketplaceId, keyword,functionKey,functionURL } = this.state;
    this.setState({ loading: true });

    const resp = await axios.post(`${functionURL}/MatchingProducts/${marketplaceId}/${keyword}?code=${functionKey}`);
    this.setState({ loading: false });
    if (resp.status === 200) {
      alert('Data Added to DB');
    }
  }

  GetKeyWords = async (e) => {
    const { asin, functionKey,functionURL } = this.state;
    this.setState({ loading: true });
    const resp = await axios.post(`${functionURL}/SuggestedKeyWords/${asin}?code=${functionKey}`);
    this.setState({ keywords: resp.data });
    this.setState({ loading: false });
  }

  render() {
    const { asin, keyword, keywords, marketplaceId, loading } = this.state;
    return (
      <div className="signup login">
        <div className="container">

        {loading&&<Loader backGroundProcessing message={'Please wait the load is in progress.'} />}
          <div className="login-container">
            <Formsy
              className="signup__form login-form"
              ref={this.formRef}
            >
              <FormInput
                name="asin"
                placeholder="Enter ASIN"
                value={asin}
                onChangeHandler={this.handleChange}
              />
              <div className="signup__form-cta">
                <button onClick={this.GetKeyWords} className="btn btn-signup btn--block">Get Suggested Keywords</button>
              </div>
              <ul>
                {keywords.map((value, idx) => {
                  return (
                    <li key={idx}>{value.keywordText}</li>
                  )
                })
                }
              </ul>
              <FormInput
                name="keyword"
                placeholder="Enter Keyword"
                value={keyword}
                onChangeHandler={this.handleChange}
              />
              <FormInput
                name="marketplaceId"
                placeholder="Enter marketplaceId"
                value={marketplaceId}
                onChangeHandler={this.handleChange}
              />
              <div className="signup__form-cta">
                <button onClick={this.GetAsin} className="btn btn-signup btn--block">Get ASIN</button>
              </div>
            </Formsy>
          </div>
        </div>
      </div>
    );
  }
}
