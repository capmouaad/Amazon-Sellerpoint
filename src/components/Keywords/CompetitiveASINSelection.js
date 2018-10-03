import { Input, Table } from 'reactstrap'
// import api from '../../services/Api'
import React from 'react'

// Dummy data
const res = {
  "MatchingProducts": [
    {
        "ASIN": "B01BY9RTNQ",
        "Brand": "PowerLix",
        "Title": "PowerLix Milk Frother Handheld Battery Operated Electric Foam Maker For Coffee, Latte, Cappuccino, Hot Chocolate, Durable Drink Mixer With Stainless Steel Whisk, Stainless Steel Stand Include",
        "SalesCategory": "14042381",
        "SalesRank": 1,
        "ListPrice": ""
    },
    {
        "ASIN": "B06ZXXNMNS",
        "Brand": "VIVREAL",
        "Title": "Milk Frother - Milk Steamer Electric Frother for Soft Foam, Automatic Milk Frother Hot Cold Milk Frother and Warmer with Two Whisks, Frother for Coffee, Creamer Frother Milk Heater 4.25 oz/8.5 oz",
        "SalesCategory": "14042381",
        "SalesRank": 4,
        "ListPrice": "89.99"
    },
    {
        "ASIN": "B072W1MWDG",
        "Brand": "Chef's Star",
        "Title": "Chef's Star MF-2 Premier Automatic Milk Frother, Heater and Cappuccino Maker with New Foam Density Feature (New Version)",
        "SalesCategory": "14042381",
        "SalesRank": 8,
        "ListPrice": "109.99"
    },
    {
        "ASIN": "B076F3C4XP",
        "Brand": "Bonsenkitchen",
        "Title": "Bonsenkitchen Electric Handheld Milk Frother for Making Lattes, Cappuccinos and Hot Chocolates, Battery Included, Stainless Steel Shaft and Whip (MF8710)",
        "SalesCategory": "14042381",
        "SalesRank": 3,
        "ListPrice": "15.99"
    },
    {
        "ASIN": "B07D2Z6QDL",
        "Brand": "CHINYA",
        "Title": "Milk Frother, Automatic Milk Steamer with New Foam Density Feature, Electric Frother with Hot or Cold Milk Function for Coffee, Cappuccino and Breakfast (Silver)",
        "SalesCategory": "14042381",
        "SalesRank": 10,
        "ListPrice": ""
    },
    {
        "ASIN": "B07CJJLKN6",
        "Brand": "ISILER",
        "Title": "Milk Frother, iSiLER Electric Milk Frother, 130ml(4.5OZ) Automatic Hot Cold Milk Frother, 300ml(10.5OZ) Milk Heater with Non-Stick Coating Copper Thermostat for Coffee, Hot Chocolate, Creamer",
        "SalesCategory": "14042381",
        "SalesRank": 13,
        "ListPrice": ""
    },
    {
        "ASIN": "B06XHWQJKN",
        "Brand": "Nespresso",
        "Title": "Nespresso 3694-US-BK Aeroccino3 Milk Frother, One Size, Black",
        "SalesCategory": "14042381",
        "SalesRank": 11,
        "ListPrice": "99.00"
    },
    {
        "ASIN": "B01IYDNTAW",
        "Brand": "Elementi",
        "Title": "Milk Frother with Stand (Black) - Make Cappuccinos, Lattes and Bulletproof Coffee - Handheld with More Powerful High Torque Motor",
        "SalesCategory": "14042381",
        "SalesRank": 6,
        "ListPrice": "17.99"
    },
    {
        "ASIN": "B00SKFCSB6",
        "Brand": "1Easylife",
        "Title": "1Easylife H422 Stainless Steel Handheld Electric Milk Frother with Bonus Mix Spoon",
        "SalesCategory": "14042381",
        "SalesRank": 9,
        "ListPrice": "59.99"
    },
    {
        "ASIN": "B003LXY2HA",
        "Brand": "Capresso",
        "Title": "Capresso 202.04 frothPRO Automatic Milk Frother and Hot Chocolate Maker",
        "SalesCategory": "14042381",
        "SalesRank": 15,
        "ListPrice": "75.00"
    }
],
"IsSuccess": true,
"ErrorMessage": null
}

export default class CompetitiveASINSelection extends React.PureComponent {
  constructor (props) {
    super (props)
    this.state = {
      MatchingProducts: []
    }
  }

  onGoBackMenu = () => {
    const { history } = this.props
    history.push('/dash/Keywords')
  }

  onGetCompetitorASIN = async () => {
    // Dummy Data
    this.setState({
      MatchingProducts: res.MatchingProducts
    })
    // try {
    //   const { location } = this.props
    //   const params = {
    //     keywords: location.state ? location.state.inputKeywords: null,
    //     marketplaceId: location.state ? location.state.marketplaceId : null
    //   }
    //   const { data } = await api.post('KWCompetitorASIN', params)

    //   this.setState({
    //     MatchingProducts: data.MatchingProducts
    //   })
    // } catch (error) {
    //   console.log('Error ', error)
    // }
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
    this.onGetASINDetails(e.target.value, idx)
  }

  checkAsinEnter = (e, idx) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.onGetASINDetails(e.target.value, idx)
    }
  }

  onGetASINDetails = async (asin, idx) => {
    // Dummy Data
    const res = {
      "MatchingProduct": {
          "ASIN": "B01BY9RTNQ",
          "Brand": "PowerLix",
          "Title": "PowerLix Milk Frother Handheld Battery Operated Electric Foam Maker For Coffee, Latte, Cappuccino, Hot Chocolate, Durable Drink Mixer With Stainless Steel Whisk, Stainless Steel Stand Include",
          "SalesCategory": "14042381",
          "SalesRank": 1,
          "ListPrice": "15.99"
      },
      "IsSuccess": true,
      "ErrorMessage": null
    }

    const { MatchingProducts } = this.state
        if (idx) {
          const newArr = [...MatchingProducts]
          newArr[idx] = res.MatchingProduct
          this.setState({
            MatchingProducts: newArr
          })
        }
    // const { location } = this.props
    // try {
    //   const params = {
    //     ASIN: asin,
    //     MarketplaceId: location.state ? location.state.marketplaceId : null
    //   }
    //   const { data } = await api.post('KWASINDetails', params)
    //   if (data.IsSuccess) {
    //     const { MatchingProducts } = this.state
    //     if (idx) {
    //       const newArr = [...MatchingProducts]
    //       newArr[idx] = data.MatchingProduct
    //       this.setState({
    //         MatchingProducts: newArr
    //       })
    //     }
    //   }
    // } catch (error) {
    //   console.log('Error ', error)
    // }
  }

  onGoBackToMenu = () => {
    const { history } = this.props
    history.push('/dash/Keywords')
  }

  componentDidMount () {
    this.onGetCompetitorASIN()
  }

  render () {
    return (
      <div className="dash-container">
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
                        <Input type='checkbox'/>
                        {
                          item.isAddAsin
                          ?  <Input autoFocus type='text' onKeyPress={(e) => { this.checkAsinEnter(e, idx) }} onBlur={(e) => { this.onAsinBlur(e, idx) }}/>
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
            <div className='wrapper-asin-btn'>
              <button className='btn-submit-automation' onClick={this.onAddManualAsin}>{`Add Manual ASIN`}</button>
              <button className='btn-submit-automation' onClick={this.onGoBackToMenu}>{`Back to main menu`}</button>
              <button className='btn-submit-automation' onClick={this.onSubmit}>{`Submit`}</button>
            </div>
      </div>
    </div>
    )
  }
}