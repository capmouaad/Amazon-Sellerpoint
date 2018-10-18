import React from 'react'
import { Table } from 'reactstrap'
import FormLoader from './../Forms/FormLoader'
import axios from 'axios'

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

  onGetIndexReport = async (keyword) => {
    const params = {
      asin: this.state.item.ASIN,
      keyword
    }
    const { data } = await axios.post('https://sellerpoint-keyword-service.herokuapp.com/product', params)
                      .catch(e => { return {e, data: { indexed: 'No', page: '', rank: ''}}})

    return data;
  }
  
  onGetKeywordReport = async () => {
    const { item } = this.state;
    if (!item) {
      return;
    }
    const params = {
      pageId: `https://www.amazon.com/dp/${item.ASIN}`,
      keywordList: []
    }
    item.InputKeywords.map(keyword => {
      ['EXACT', 'BROAD', 'PHRASE'].map((type) => {
        params.keywordList.push({
          key: keyword,
          matchType: type
        })
      })
    })

    const { data } = await axios.post('https://sellerpoint-keyword-service.herokuapp.com/report', params)
                      .catch(e => { return {e, data: []}; })

    const reports = []
    await Promise.all(item.InputKeywords.map(async (keyword) => {
      let report = {
        keyword,
        index: {},
        broad: {},
        phrase: {},
        exact: {}
      }
      // Keyword index/page/rank
      const index = await this.onGetIndexReport(keyword);
      report.index = index;
      // Keyword report
      data.map(d => {
        if (d.keyword === keyword) {
          let type = d.matchType.toLowerCase();
          report[type] = {
            search: d.impression,
            relevancy: d.relevance,
            volume: d.impression * d.relevance,
            power: d.power
          }
        }
      })
      console.log(report)
      reports.push(report)
    }))

    this.setState({
      ...this.state,
      reports,
      loaded: true
    })
  }

  componentDidMount () {
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
                  <td>{report.keyword}</td>
                  <td>{report.index.indexed}</td>
                  <td>{report.index.page}</td>
                  <td>{report.index.rank}</td>
                  <td>{report.broad.search}</td>
                  <td>{report.phrase.search}</td>
                  <td>{report.exact.search}</td>
                  <td>{report.broad.relevancy}</td>
                  <td>{report.phrase.relevancy}</td>
                  <td>{report.exact.relevancy}</td>
                  <td>{report.broad.volume}</td>
                  <td>{report.phrase.volume}</td>
                  <td>{report.exact.volume}</td>
                  <td>{report.broad.power}</td>
                  <td>{report.phrase.power}</td>
                  <td>{report.exact.power}</td>
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