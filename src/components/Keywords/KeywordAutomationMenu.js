import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Label, Input } from 'reactstrap'

class KeywordAutomationMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      key: null
    }
  }

  onSubmit = () => {
    const { history, match } = this.props
    const { key } = this.state
    switch (key) {
      case 'create':
        history.push(`${match.url}/CreateNewAutomation`)
        break
      case 'view':
        history.push(`${match.url}/ViewCurrentAutomations`)
        break
      case 'edit':
        alert(key)
        break
      default:
        break
    }
  }

  componentDidMount () {
    this.setState({
      key: 'create'
    })
  }

  onChange = (key) => {
    this.setState({
      key
    })
  }

  render() {
    const { key } = this.state
    return (
      <React.Fragment>
        <div className="dash-container">
          <div className='keywords-auto-menu'>
            <h3>{`Keywords Automation Menu`}</h3>
            <FormGroup check>
              <Label check>
                <Input type="radio" name='radio-keywords' onChange={() => this.onChange('create')} checked={key === 'create' ? true : false}/>
                <span className='radio-option'>{`Create New Automation`}</span>
              </Label>
              <Label check>
                <Input type="radio" name='radio-keywords' onChange={() => this.onChange('view')} />
                <span className='radio-option'>{`View Ongoing Automation`}</span>
              </Label>
              <Label check>
                <Input type="radio" name='radio-keywords' onChange={() => this.onChange('view')} />
                <span className='radio-option'>{`Edit Existing Automation`}</span>
              </Label>
            </FormGroup>
            <button className='btn-submit-automation' onClick={this.onSubmit}>{`Submit`}</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(KeywordAutomationMenu);
