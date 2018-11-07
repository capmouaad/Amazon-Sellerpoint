import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
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
    const { data } = await api.get(`KWAutomationResult?automationId=${item.AutomationId}`)
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
    const data = this.state.reports.map(item => {
      return {
        keyword: item.Keyword,
        indexed: item.IsIndexed ? 'Yes' : 'No',
        page: item.page,
        position: item.position,
        vexact: item.VolumeExact,
        vbroad: item.VolumeBroad,
        vphrase: item.VolumePhrase,
        rexact: item.RelevanceExact,
        rbroad: item.RelevanceBroad,
        rphrase: item.RelevancePhrase,
        xexact: item.VolumeExact * item.RelevanceExact,
        xbroad: item.VolumeBroad * item.RelevanceBroad,
        xphrase: item.VolumePhrase * item.RelevancePhrase,
        pexact: item.PowerExact,
        pbroad: item.PowerBroad,
        pphrase: item.PowerPhrase
      }
    })

    return (
      <div className="dash-container">
        <div className={'keywords-auto-menu ' + (this.state.loaded ? 'loader-container' : '')}>
          <FormLoader />
          <p>Keyword Report for: <strong>{this.state.item.ASIN}</strong></p>
          <ReactTable
            data={data}
            noDataText="Report unavailable."
            minRows="1"
            columns={[
              {
                Header: ' ',
                columns: [
                  {
                    Header: 'KEYWORD',
                    accessor: 'keyword',
                    width: 250
                  },
                  {
                    Header: 'Indexed?',
                    accessor: 'indexed',
                    width: 80
                  },
                  {
                    Header: 'Page',
                    accessor: 'page',
                    width: 70
                  },
                  {
                    Header: 'Position',
                    accessor: 'position',
                    width: 70
                  }
                ]
              },
              {
                Header: 'Search Volume',
                columns: [
                  {
                    Header: 'Broad',
                    accessor: 'vbroad'
                  },
                  {
                    Header: 'Phrase',
                    accessor: 'vphrase'
                  },
                  {
                    Header: 'Exact',
                    accessor: 'vexact'
                  }
                ]
              },
              {
                Header: 'Relevancy Score',
                columns: [
                  {
                    Header: 'Broad',
                    accessor: 'rbroad'
                  },
                  {
                    Header: 'Phrase',
                    accessor: 'rphrase'
                  },
                  {
                    Header: 'Exact',
                    accessor: 'rexact'
                  }
                ]
              },
              {
                Header: 'Volume x Relevacy',
                columns: [
                  {
                    Header: 'Broad',
                    accessor: 'xbroad'
                  },
                  {
                    Header: 'Phrase',
                    accessor: 'xphrase'
                  },
                  {
                    Header: 'Exact',
                    accessor: 'xexact'
                  }
                ]
              },
              {
                Header: 'Power',
                columns: [
                  {
                    Header: 'Broad',
                    accessor: 'pbroad'
                  },
                  {
                    Header: 'Phrase',
                    accessor: 'pphrase'
                  },
                  {
                    Header: 'Exact',
                    accessor: 'pexact'
                  }
                ]
              }
            ]}
            showPagination={true}
            className="-striped -highlight"
            nextText=">>"
            previousText="<<"
          />
        </div>
      </div>
    )
  }
}