import { Input, Table } from 'reactstrap'
import api from '../../services/Api'
import FormLoader from './../Forms/FormLoader'
import React from 'react'

export default class CompetitiveASINSelection extends React.PureComponent {
  constructor (props) {
    super (props)

    const { location } = this.props
    this.state = {
      automationId: location.state ? location.state.automationId: null,
      MatchingProducts: [],
      SelectedProductsIds: [],
      isGetDataBE: false,
      apiError: null
    }
  }

  onGoBackMenu = () => {
    const { history } = this.props
    history.push('/dash/Keywords')
  }

  onChangeCheckbox = (e, idx) => {
    const target = e.target
    const checked = target.checked

    console.log(this.state.SelectedProductsIds)
    const position = this.state.SelectedProductsIds.indexOf(idx)

    if (checked && position == -1) {
      const SelectedProductsIds = this.state.SelectedProductsIds
      SelectedProductsIds.push(idx)
      this.setState({
        ...this.state,
        SelectedProductsIds
      })
    }
    else if(!checked && position > -1) {
      const SelectedProductsIds = this.state.SelectedProductsIds
      SelectedProductsIds.splice(position, 1)
      this.setState({
        ...this.state,
        SelectedProductsIds
      })
    }
  }

  onSubmit = async () => {
    const queryData = {
      automationId: this.state.automationId,
      outputASINs: []
    }

    const selectedProducts = []
    this.state.SelectedProductsIds.map((idx) => {
      const product = this.state.MatchingProducts[idx]
      const item = {
        asin: product.ASIN,
        isMyAsin: product.IsMyASIN,
        isManualInput: product.isAddAsin ? product.isAddAsin : false,
        brand: product.Brand,
        title: product.Title,
        salesCategory: product.SalesCategory,
        salesRank: product.SalesRank
      }
      selectedProducts.push(item)
    })
    queryData.outputASINs = selectedProducts
    
    this.setState({
      isGetDataBE: true
    })
    await api.post('KWSaveOutput', queryData)
    this.setState({
      isGetDataBE: false
    })
    this.onGoBackToMenu()
  }

  onGetCompetitorASIN = async () => {
    try {
      this.setState({
        isGetDataBE: true
      })
      const { location } = this.props
      const params = {
        keywords: location.state ? location.state.inputKeywords: null,
        marketplaceId: location.state ? location.state.marketplaceId : null,
        InputASIN: location.state ? location.state.asin : null
      }

      const { data } = await api.post('KWCompetitorASIN', params)
      this.setState({
        MatchingProducts: data.MatchingProducts ? data.MatchingProducts : [],
        isGetDataBE: false
      })
    } catch (error) {
      console.log('Error ', error)
      this.setState({
        isGetDataBE: false
      })
    }
  }

  onAddManualAsin = () => {
    const { MatchingProducts } = this.state
    
    let products = [
      ...MatchingProducts,
      {
        "ASIN": "",
        "Brand": "",
        "Title": "",
        "SalesCategory": "",
        "SalesRank": "",
        "ListPrice": "",
        "isAddAsin": true
      }
    ]

    this.setState({
      MatchingProducts: products
    })
  }

  onAsinBlur = (e, idx) => {
    if (e.target.value === ''){
      this.setState({
        apiError: `Can't set empty ASIN input.`
      })
    } else {
      this.setState({
        apiError: null
      })

      this.onGetASINDetails(e.target.value, idx)
    }
  }

  checkAsinEnter = (e, idx) => {
    if (e.target.value === ''){
      this.setState({
        apiError: `Can't set empty ASIN input.`
      })
    } else {
      this.setState({
        apiError: null
      })

      if (e.key === 'Enter' || e.keyCode === 13) {
        this.onGetASINDetails(e.target.value, idx)
      }
    }
  }

  onGetASINDetails = async (asin, idx) => {
    const { location } = this.props
    try {
      this.setState({
        isGetDataBE: true
      })
      const params = {
        ASIN: asin,
        MarketplaceId: location.state ? location.state.marketplaceId : null
      }
      const { data } = await api.post('KWASINDetails', params)
      
      if (data.IsSuccess) {
        const { MatchingProducts } = this.state
        if (idx || idx === 0) {
          const newArr = [...MatchingProducts]
          newArr[idx] = data.MatchingProduct
          newArr[idx]['isAddAsin'] = true
          this.setState({
            MatchingProducts: newArr,
            isGetDataBE: false,
            apiError: null
          })
        }
      }
      else {
        this.setState({
          isGetDataBE: false,
          apiError: data.ErrorMessage
        })
      }
    } catch (error) {
      console.log('Error ', error)
    }
  }

  onGoBackToMenu = () => {
    const { history } = this.props
    history.push('/dash/Keywords')
  }

  componentDidMount () {
    this.onGetCompetitorASIN()
  }

  render () {
    const { isGetDataBE, apiError } = this.state
    console.log(this.state);
    return (
      <div className="dash-container">
        <div className={"loader-container " + (isGetDataBE ? "is-loading" : "")}>
          <FormLoader />
          <div className='keywords-auto-menu'>
            <h3>{`Competitive ASIN Selection`}</h3>
            <Table responsive>
              <thead>
                <tr>
                  <th>{`ASIN`}</th>
                  <th>{`Brand`}</th>
                  <th>{`Listing Title`}</th>
                  <th>{`Sales Category (Lowest Level)`}</th>
                  <th>{`Sale Rank`}</th>
                  <th>{`Price`}</th>
                </tr>
              </thead>
              <tbody>
              {
                this.state.MatchingProducts.map((item, idx) => (
                  <tr key={`key-asin-${idx}`}>
                    <td>
                      <div className='wrapper-asin-checkbox'>
                        <Input type='checkbox' onChange={(e) => { this.onChangeCheckbox(e, idx) }} />
                        {
                          item.isAddAsin
                          ?  <Input type='text' onKeyPress={(e) => { this.checkAsinEnter(e, idx) }} onBlur={(e) => { this.onAsinBlur(e, idx) }}/>
                          : <span className='text-asin'>{item.ASIN}</span>
                        }
                      </div>
                    </td>
                    <td>{item.Brand}</td>
                    <td>{item.Title}</td>
                    <td>{item.SalesCategory}</td>
                    <td>{item.SalesRank}</td>
                    <td>{item.ListPrice || '---'}</td>
                  </tr>
                ))
              }
              </tbody>
            </Table>
            {
              apiError &&
              <span className="ui-input-error">{apiError}</span>
            }
            <div className='wrapper-asin-btn'>
              <button className='btn-submit-automation' onClick={this.onAddManualAsin}>{`Add Manual ASIN`}</button>
              <button className='btn-submit-automation' onClick={this.onGoBackToMenu}>{`Back to main menu`}</button>
              <button className='btn-submit-automation' onClick={this.onSubmit}>{`Submit`}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}