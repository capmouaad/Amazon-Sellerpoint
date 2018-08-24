import React, { Component } from 'react';
import QdtComponent from '../Qlik/QdtComponent';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import Select from 'react-select';

const filters = [
    {
        name: "DataGroupedBy",
        qdt: {
            type: 'QdtViz',
            props: {
                id: 'uFJU', height: '40px', width: '200px'
            },
        }
    },
    // {
    //     name: "SellerId",
    //     qdt: {
    //         type: 'QdtViz',
    //         props: {
    //             id: 'WzFqaf', height: '40px', width: '200px'
    //         },
    //     }
    // },
    // {
    //     name: "MarketPlace",
    //     qdt: {
    //         type: 'QdtViz',
    //         props: {
    //             id: 'UfRGFA', height: '40px', width: '200px'
    //         },
    //     }
    // },
    // {
    //     name: "SellerSKU",
    //     qdt: {
    //         type: 'QdtViz',
    //         props: {
    //             id: 'jYJJpT', height: '40px', width: '200px'
    //         },
    //     }
    // }
]

export default class DashFilters extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pickerStartDate: '',
            pickerEndDate: '',
            isTabOpened: true,
            sellerIDOption: [],
            marketOption: [],
            sellerSKUOptions: [],
            sellerIDSelectedOption: null,
            marketSelectedOption: null,
            sellerSKUSelectedOptions: null,
            currentSelections:[]
        }
        this.bindData = this.bindData.bind(this);
    }
    toggleTab = () => {
        this.setState({
            isTabOpened: !this.state.isTabOpened
        })
    }

    handleEvent = async (event, picker) => {
        if (event.type === 'apply') {
            const startDate = moment(picker.startDate).format('MM/DD/YYYY')
            const endDate = moment(picker.endDate).format('MM/DD/YYYY')

            this.handleDateSelection(startDate, endDate);
        }
    }

    handleDateSelection = async (startDate, endDate) => {
        this.setState({
            pickerStartDate: startDate,
            pickerEndDate: endDate
        })

        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.field('Date').selectMatch('>=' + startDate + '<=' + endDate, true).then(function () {
                qApp.field('Date').lock();
            });
        }
    }
    bindCurrentSelections = async () => {
        let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}
        
        app.getList('CurrentSelections', (reply) => {
            this.setState({ currentSelections: reply.qSelectionObject.qSelections })
        })

        // app.getList("CurrentSelections", function(reply){console.log(reply.qSelectionObject.qSelections); 
        //     reply.qSelectionObject.qSelections.map((item) => {item.qSelectedFieldSelectionInfo.map((sel)=>{console.log(sel.qName)})}
        // )});
    }

    // Render SellerId options

    renderSellerID = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            qApp.createList({
                "qFrequencyMode": "V",
                "qDef": {
                    "qFieldDefs": [
                        "SellerID"
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 20,
                        "qWidth": 1
                    }
                ]
            }, this.bindData);
        }
    }

    // Render Market options

    renderMarketDropDown = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            qApp.createList({
                "qFrequencyMode": "V",
                "qDef": {
                    "qFieldDefs": [
                        "MarketPlaceName"
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 20,
                        "qWidth": 1
                    }
                ]
            }, this.bindData);
        }
    }

    binddropdown = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            qApp.createList({
                "qFrequencyMode": "V",
                "qDef": {
                    "qFieldDefs": [
                        "SellerSKU"
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 20,
                        "qWidth": 1
                    }
                ]
            }, this.bindData);
        }
    }

    bindData = (reply, app) => {
        let data = [];
        if (reply.qListObject.qDataPages.length > 0) {
            data = reply.qListObject.qDataPages[0].qMatrix.map((item) => {
                return {
                    value: item[0].qText,
                    label: item[0].qText
                }
            })
        }

        if (reply.qListObject.qDimensionInfo.qFallbackTitle === 'MarketPlaceName') {
            this.setState({
                marketOption: data
            })
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === 'SellerSKU') {
            this.setState({ sellerSKUOptions: data });
        } else {
            this.setState({
                sellerIDOption: data
            })
        }
    }

    handleChange = async ({ optionSelected, key }) => {
        if ( key === 'SellerSKU') {
            this.setState({
                sellerSKUSelectedOptions: optionSelected
            })
        } else if (key === 'MarketPlaceName') {
            this.setState({
                marketSelectedOption: optionSelected
            })
        } else {
            this.setState({
                sellerIDSelectedOption: optionSelected
            })
        }

        let data = [];
        if (optionSelected.length > 0) {
            data = optionSelected.map((item) => ({
                qText: item.value
            }))
        }


        //window.qlik.app.field('SellerSKU').select(data, true, true);
        let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}
        app.field(key).selectValues(data, false);
    }

    componentDidMount() {
        this.initialSelection();
    }

    initialSelection = async () => {
        const startDate = moment().subtract(59, 'days').format('MM/DD/YYYY');
        const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
        this.handleDateSelection(startDate, endDate);
        setTimeout(() => {
            this.renderSellerID()
            this.renderMarketDropDown()
            this.binddropdown();
            this.bindCurrentSelections();
        }, 4000);

    }

    onResetQlik = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.clearAll()
        }
    }

    render() {
        const { pickerStartDate, pickerEndDate, selectedOption, options, isTabOpened, currentSelections } = this.state
        const ranges = {
            'Last 7 days': [moment().subtract(6, 'days'), moment().subtract(1, 'days')],
            'Last 30 days': [moment().subtract(29, 'days'), moment().subtract(1, 'days')],
            'Last 60 days': [moment().subtract(59, 'days'), moment().subtract(1, 'days')],
            'Last 90 days': [moment().subtract(89, 'days'), moment().subtract(1, 'days')],
            'Month to date': [moment().startOf('month'), moment().subtract(1, 'days')],
            'Year to date': [moment().startOf('year'), moment().subtract(1, 'days')],
            'Rolling 12 months': [moment().subtract(11, 'months'), moment().subtract(1, 'days')],
            'Last year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        }
        console.log('?????????', currentSelections)
        return (
            <div className="dash-filters">
                <div className="container container--full">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="dash-filters__title">FILTERS</div>
                        <button className='btn-clear-filter' onClick={this.onResetQlik}>
                            clear filters
                        </button>
                    </div>
                    <div className="dash-filters__wrapper">
                        {filters.map((filter, i) => {
                            return (
                                <QdtComponent
                                    key={i}
                                    type={filter.qdt.type}
                                    props={filter.qdt.props}
                                />
                            )
                        })}
                        <div>
                            <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                                hideSelectedOptions
                                onChange={(optionSelected) => {this.handleChange({ optionSelected, key: 'SellerID'})}}
                                options={this.state.sellerIDOption}
                                isClearable={false}
                                value={this.state.sellerIDSelectedOption}
                            />
                        </div>
                         <div>
                            <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                                hideSelectedOptions
                                onChange={(optionSelected) => {this.handleChange({ optionSelected, key: 'MarketPlaceName'})}}
                                options={this.state.marketOption}
                                isClearable={false}
                                value={this.state.marketSelectedOption}
                            />
                        </div>
                        <div>
                            <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                                hideSelectedOptions
                                onChange={(optionSelected) => {this.handleChange({ optionSelected, key: 'SellerSKU'})}}
                                options={this.state.sellerSKUOptions}
                                isClearable={false}
                                value={this.state.sellerSKUSelectedOptions}
                            />
                        </div>
                        <div>
                            <DateRangePicker alwaysShowCalendars onEvent={this.handleEvent} ranges={ranges} startDate={pickerStartDate} endDate={pickerEndDate} containerClass="react-bootstrap-daterangepicker-container">
                                <div className="input-group">
                                    <span className="input-group-btn date-range-picker-calender-btn">
                                        <button className="default date-range-toggle">
                                            <i className="fa fa-calendar" />
                                        </button>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control date-picker"
                                        value={(pickerStartDate && pickerEndDate) ? `${pickerStartDate} - ${pickerEndDate}` : ''}
                                    />
                                </div>
                            </DateRangePicker>
                        </div>
                    </div>
                    <div className={"dash-section" + (isTabOpened ? "" : " is-closed")}>
                        <div className="dash-section__heading">
                            <div className={"dash-section__toggler"} onClick={this.toggleTab} style={{ marginTop: 10 }}>
                                <div className="dash-section__toggler-icon"></div>
                            </div>
                            <h2 className="dash-filters__selected-title">Selected Filters</h2>
                        </div>
                        <div className="dash-filters__selection">
                           {
                               currentSelections.map((sel) => {
                                   if (sel.qField === 'Date') {
                                       return (
                                        <span className='selected-el'>{`${pickerStartDate} - ${pickerEndDate}`}
                                              <i className="fa fa-times" style={{ marginLeft: 10 }}></i>
                                        </span>
                                       )
                                   } else {
                                    return (
                                        <span className='selected-el'>
                                            {sel.qSelected}
                                            <i className="fa fa-times" style={{ marginLeft: 10 }}></i>
                                        </span>
                                    )
                                   }
                               })
                           }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
