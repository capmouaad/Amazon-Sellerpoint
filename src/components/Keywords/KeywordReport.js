import React from 'react'
import { Table } from 'reactstrap'
import FormLoader from './../Forms/FormLoader'
import api from '../../services/Api'

export default class KeywordReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      item: props.location.state ? props.location.state.item : false,
      reports: [],
      loaded: false,
      apiError: null
    }
  }

  onGetKeywordReport = async () => {
    const { item } = this.state;
    const { data } = await api.get('KWAutomationResult?automationId=1')
      .catch(e => { return { e, data: [] }; })

    if (data && data.KWAutomationResults) {
      const reports = data.KWAutomationResults;

      this.setState({
        ...this.state,
        reports,
        loaded: true
      })
    }
  }

  componentDidMount() {
    this.onGetKeywordReport();
  }

  render() {
    return (
      <div className="dash-container">
        <div className={'keywords-auto-menu ' + (this.state.loaded ? 'loader-container' : '')}>
          <FormLoader />
          <p>Keyword Report for: <strong>{this.state.item.ASIN}</strong></p>
          <Table responsive>
            <thead>
              <tr>
                <th>{` `}</th>
                <th>{` `}</th>
                <th>{` `}</th>
                <th>{` `}</th>
                <th colSpan="3">{`Search Volume`}</th>
                <th colSpan="3">{`Relevancy Score`}</th>
                <th colSpan="3">{`Volume x Relevancy`}</th>
                <th colSpan="3">{`Power`}</th>
              </tr>
              <tr>
                <th>{`KEYWORD`}</th>
                <th>{`Indexed?`}</th>
                <th>{`Page`}</th>
                <th>{`Position`}</th>
                <th>{`Broad`}</th>
                <th>{`Phrase`}</th>
                <th>{`Exact`}</th>
                <th>{`Broad`}</th>
                <th>{`Phrase`}</th>
                <th>{`Exact`}</th>
                <th>{`Broad`}</th>
                <th>{`Phrase`}</th>
                <th>{`Exact`}</th>
                <th>{`Broad`}</th>
                <th>{`Phrase`}</th>
                <th>{`Exact`}</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.reports.map((report, idx) => (
                  <tr key={`keyword-${idx}`}>
                    <td>{report.Keyword}</td>
                    <td>{report.IsIndexed ? 'Yes' : 'No'}</td>
                    <td>{report.Page}</td>
                    <td>{report.Position ? report.Position : ''}</td>
                    <td>{report.VolumeExact}</td>
                    <td>{report.VolumeBroad}</td>
                    <td>{report.VolumePhrase}</td>
                    <td>{report.RelevanceExact}</td>
                    <td>{report.RelevanceBroad}</td>
                    <td>{report.RelevancePhrase}</td>
                    <td>{report.VolumeExact * report.RelevanceExact}</td>
                    <td>{report.VolumeBroad * report.RelevanceBroad}</td>
                    <td>{report.VolumePhrase * report.RelevancePhrase}</td>
                    <td>{report.PowerExact}</td>
                    <td>{report.PowerBroad}</td>
                    <td>{report.PowerPhrase}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}