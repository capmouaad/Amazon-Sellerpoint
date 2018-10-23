import React from 'react'
import { Input, Table } from 'reactstrap'
import api from '../../services/Api'


export default class ViewCurrentAutomations extends React.PureComponent {

  constructor (props) {
    super (props)
    this.state = {
      automations: [],
      selectedItem: false
    }
  }

  onGoBackMenu = () => {
    const { history } = this.props
    history.push('/dash/Keywords')
  }

  onSubmit = () => {
    const { automations, selectedItem } = this.state;
    const item = automations[selectedItem];
    this.props.history.push('/dash/keywords/KeywordReport', { item });
  }

  onSelectItem = (selectedItem) => {
    this.setState({
      ...this.state,
      selectedItem
    })
  }

  onGetAllKeywordsAutomations = async () => {
    try {
      const { data } = await api.get('KWAutomations')
      if (data.IsSuccess) {
        this.setState({
          automations: data.Automations
        })
      }
    } catch (error) {
      console.log('Error ', error)
    }
  }

  componentDidMount () {
    this.onGetAllKeywordsAutomations()
  }

  render () {
    return (
      <div className="dash-container">
        <div className='keywords-auto-menu'>
          <h3>{`View Current Automations`}</h3>
          <Table responsive>
            <thead>
              <tr>
                <th>{` `}</th>
                <th>{`ID`}</th>
                <th>{`Automation Name`}</th>
                <th>{`Marketplace`}</th>
                <th>{`Target ASIN`}</th>
                <th>{`Base Keywords`}</th>
                <th>{`Active (Y/N)`}</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.automations.map((item, index) => (
                <tr key={`key-${item.AutomationId}`}>
                  <td>
                    <Input type='radio' onClick={this.onSelectItem.bind(this, index)} name='keyword-automation'/>
                  </td>
                  <td>{item.AutomationId}</td>
                  <td>{item.Name}</td>
                  <td>{item.MarketPlaceId}</td>
                  <td>{item.ASIN}</td>
                  <td>{item.InputKeywords || '---'}</td>
                  <td>{item.IsEnabled ? 'Y' : 'N'}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>
          <div className='wrapper-btn'>
            <button className='btn-back-menu-keywords' onClick={this.onGoBackMenu}>{`Back to Main Menu`}</button>
            <button className='btn-submit-automation' onClick={this.onSubmit}>{`Submit`}</button>
          </div>
        </div>
      </div>
    )
  }
}
