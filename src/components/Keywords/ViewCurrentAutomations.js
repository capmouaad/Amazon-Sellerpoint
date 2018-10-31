import React from 'react'
import { Input } from 'reactstrap'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
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
    const data = this.state.automations.map((automation, index) => {
      return {
        checkbox: <Input type='radio' onClick={this.onSelectItem.bind(this, index)} name='keyword-automation'/>,
        id: automation.AutomationId,
        name: automation.Name,
        mid: automation.MarketPlaceId,
        asin: automation.ASIN,
        keywords: automation.InputKeywords ? automation.InputKeywords.join(' ') : '---',
        state: automation.IsEnabled ? 'Y' : 'N'
      }
    })

    return (
      <div className="dash-container">
        <div className='keywords-auto-menu'>
          <h3>{`View Current Automations`}</h3>
          <ReactTable
            data={data}
            noDataText="No automations found."
            columns={[
                {
                  Header: ' ',
                  accessor: 'checkbox',
                  width: 100,
                  style: {textAlign: 'center'}
                },
                {
                  Header: 'ID',
                  accessor: 'id'
                },
                {
                  Header: 'Automation Name',
                  accessor: 'name'
                },
                {
                  Header: 'Marketplace',
                  accessor: 'mid'
                },
                {
                  Header: 'Target ASIN',
                  accessor: 'asin'
                },
                {
                  Header: 'Base Keywords',
                  accessor: 'keywords'
                },
                {
                  Header: 'Active (Y/N)',
                  accessor: 'state'
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            nextText=">>"
            previousText="<<"
          />
          <div className='wrapper-btn'>
            <button className='btn-back-menu-keywords' onClick={this.onGoBackMenu}>{`Back to Main Menu`}</button>
            <button className='btn-submit-automation' onClick={this.onSubmit}>{`Submit`}</button>
          </div>
        </div>
      </div>
    )
  }
}
