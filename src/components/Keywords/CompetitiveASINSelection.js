import React from 'react'
import { Input } from 'reactstrap'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import api from '../../services/Api'
import FormLoader from './../Forms/FormLoader'

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
    const position = this.state.SelectedProductsIds.indexOf(idx)

    if (checked && position == -1) {
      const SelectedProductsIds = this.state.SelectedProductsIds
      SelectedProductsIds.push(idx)
      this.setState({
        SelectedProductsIds
      })
    }
    else if(!checked && position > -1) {
      const SelectedProductsIds = this.state.SelectedProductsIds
      SelectedProductsIds.splice(position, 1)
      this.setState({
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
        MatchingProducts: data.MatchingProducts || []
      })

      const MatchingProducts = data.MatchingProducts || []
      for (var i = 0;i < MatchingProducts.length;i ++) {
        const product = MatchingProducts[i]
        if (product.ASIN === location.state.asin) {
          this.setState({
            SelectedProductsIds: [i]
          })
          break;
        }
      }

      // Get Review data for each product
      for (var i = 0;i < MatchingProducts.length;i ++) {
        const product = MatchingProducts[i]
        const ReviewInfo = await fetch('https://sellerpoint-keyword-service.herokuapp.com/review', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ asins: [product.ASIN] })
        }).then(r => r.json())
        product.SalesCategory = ReviewInfo[0].category
        product.ListPrice = ReviewInfo[0].price
        product.Reviews = ReviewInfo[0].reviews + ' (' + ReviewInfo[0].score + ')'
        MatchingProducts[i] = product
      }

      this.setState({
        MatchingProducts: MatchingProducts,
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
        "SmallImageURL":"",
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
    const { location } = this.props
    const { MatchingProducts, SelectedProductsIds } = this.state
    const data = MatchingProducts.map((item, idx) => {
      const currentASIN = location.state.asin === item.ASIN
      const checked = SelectedProductsIds.indexOf(idx) > -1
      return {
        asin: <div className='wrapper-asin-checkbox'>
              {
                currentASIN
                ? <Input type='checkbox' checked={true} disabled={true} />
                : <Input type='checkbox' onChange={(e) => { this.onChangeCheckbox(e, idx) }} />
              }
              &nbsp;
              {
                item.isAddAsin
                ?  <Input type='text' onKeyPress={(e) => { this.checkAsinEnter(e, idx) }} onBlur={(e) => { this.onAsinBlur(e, idx) }}/>
                : <span className='text-asin'>{item.ASIN}</span>
              }
            </div>,
        image: item.SmallImageURL ? <img src={item.SmallImageURL} height="42" width="42"/> : '',
        brand: item.Brand,
        title: item.Title,
        category: item.SalesCategory,
        rank: item.SalesRank,
        reviews: item.Reviews,
        price: item.ListPrice || ''
      }
    })

    return (
      <div className="dash-container">
        <div className={"loader-container " + (isGetDataBE ? "is-loading" : "")}>
          <FormLoader />
          <div className='keywords-auto-menu'>
            <h3>{`Competitive ASIN Selection`}</h3>
            <ReactTable
              data={data}
              noDataText="No data found."
              minRows="1"
              columns={[
                {
                  Header: 'ASIN',
                  accessor: 'asin',
                },
                {
                  Header: 'Image',
                  accessor: 'image',
                  width: 100
                },
                {
                  Header: 'Brand',
                  accessor: 'brand'
                },
                {
                  Header: 'Listing Title',
                  accessor: 'title'
                },
                {
                  Header: 'Sales Category (Lowest Level)',
                  accessor: 'category'
                },
                {
                  Header: 'Sale Rank',
                  accessor: 'rank'
                },
                {
                  Header: 'Reviews',
                  accessor: 'reviews'
                },
                {
                  Header: 'Price',
                  id: 'price',
                  accessor: d=>Number(d.price)
                }
              ]}
              showPagination={false}
              sortable={false}
              defaultPageSize={100}
              className="-striped -highlight"
              nextText=">>"
              previousText="<<"
            />
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