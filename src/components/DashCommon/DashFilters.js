import React, { Component } from 'react';
import QdtComponent from '../Qlik/QdtComponent';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import Select from 'react-select';

const filters = [
    // {
    //     name: "DataGroupedBy",
    //     qdt: {
    //         type: 'QdtViz',
    //         props: {
    //             id: 'uFJU', height: '40px', width: '200px'
    //         },
    //     }
    // },
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

const initialState = {
    isTabOpened: true,
    DataGroupByOption: [],
    sellerIDOption: [],
    marketOption: [],
    sellerSKUOptions: [],
    DataGroupBySelectedOption: null,
    sellerIDSelectedOption: null,
    marketSelectedOption: null,
    sellerSKUSelectedOptions: null,
    currentSelections:[]
}

const FIELD_NAME = {
    DataGroupBy: 'DataFieldLabel',
    SellerID: 'SellerID',
    MarketPlaceName: 'MarketPlaceName',
    SellerSKU: 'SellerSKU'
}

export default class DashFilters extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...initialState,
            pickerStartDate: '',
            pickerEndDate: ''
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
        if (window.GlobalQdtComponents) {
            let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}
            
            await app.getList('CurrentSelections', (reply) => {
                this.setState({ currentSelections: reply.qSelectionObject.qSelections })
            })
        }
    }

    // Render Data Group By

    renderDataGroupBy = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            qApp.createList({
                "qFrequencyMode": "V",
                "qDef": {
                    "qFieldDefs": [
                        FIELD_NAME.DataGroupBy
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

    // Render SellerId options

    renderSellerID = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            qApp.createList({
                "qFrequencyMode": "V",
                "qDef": {
                    "qFieldDefs": [
                        FIELD_NAME.SellerID
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
                        FIELD_NAME.MarketPlaceName
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
                        FIELD_NAME.SellerSKU
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
        console.log('replyyyyyy', reply)
        let data = [];
        if (reply.qListObject.qDataPages.length > 0) {
            data = reply.qListObject.qDataPages[0].qMatrix.map((item) => {
                return {
                    value: item[0].qText,
                    label: item[0].qText
                }
            })
        }

        if (reply.qListObject.qDimensionInfo.qFallbackTitle === FIELD_NAME.MarketPlaceName) {
            this.setState({
                marketOption: data
            })
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === FIELD_NAME.SellerSKU) {
            this.setState({ sellerSKUOptions: data });
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === FIELD_NAME.SellerID) {
            this.setState({
                sellerIDOption: data
            })
        } else {
            this.setState({
                DataGroupByOption: data
            })
        }
    }

    handleChange = async ({ optionSelected, key }) => {
        if ( key === FIELD_NAME.SellerSKU) {
            this.setState({
                sellerSKUSelectedOptions: optionSelected
            })
        } else if (key === FIELD_NAME.MarketPlaceName) {
            this.setState({
                marketSelectedOption: optionSelected
            })
        } else if (key === FIELD_NAME.SellerID) {
            this.setState({
                sellerIDSelectedOption: optionSelected
            })
        } else {
            this.setState({
                DataGroupBySelectedOption: optionSelected
            })
        }

        let data = [];
        if (optionSelected.length > 0) {
            data = optionSelected.map((item) => ({
                qText: item.value
            }))
        }

        let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}
        app && app.field(key).selectValues(data, false);
    }

    deleteFilter = async ({ item, qName }) => {
        try {
            const app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}

            let data = item.qSelectedFieldSelectionInfo
            data = data
                    .filter((val) => val.qName !== qName)
                    .map((val) => ({
                        qText: val.qName
                    }))

            await app.field(item.qField).selectValues(data, false);

            const { marketSelectedOption, sellerIDSelectedOption, sellerSKUSelectedOptions } = this.state
            switch (item.qField) {
                case FIELD_NAME.MarketPlaceName:
                    this.setState({
                        marketSelectedOption: marketSelectedOption.filter((item) => item.value !== qName)
                    })
                    break
                case FIELD_NAME.SellerID:
                    this.setState({
                        sellerIDSelectedOption: sellerIDSelectedOption.filter((item) => item.value !== qName)
                    })
                    break
                case FIELD_NAME.SellerSKU:
                    this.setState({
                        sellerSKUSelectedOptions: sellerSKUSelectedOptions.filter((item) => item.value !== qName)
                    })
                    break
                default:
                    break
            }
        } catch (e) {
            console.error(e)
        }
    }

    componentDidMount() {
        this.initialSelection();
    }

    initialSelection = async () => {
        const startDate = moment().subtract(59, 'days').format('MM/DD/YYYY');
        const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
        this.handleDateSelection(startDate, endDate);
        setTimeout( async () => {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            this.renderDataGroupBy()
            this.renderSellerID()
            this.renderMarketDropDown()
            this.binddropdown();
            this.bindCurrentSelections();
            if (qApp) {
                await qApp.field(FIELD_NAME.DataGroupBy).selectValues(['Week'], true, true)
                await qApp.field(FIELD_NAME.DataGroupBy).lock()
                this.handleChange({
                    optionSelected: {
                        value: 'Week',
                        label: 'Week'
                    },
                    key: FIELD_NAME.DataGroupBy
                })
            }
        }, 3000);

    }

    onResetQlik = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.clearAll()

            this.setState({
                ...initialState
            })
        }
    }

    render() {
        const { pickerStartDate, pickerEndDate, isTabOpened, currentSelections } = this.state
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
                        <Select className="qlik-select" isMulti={false} closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => {this.handleChange({ optionSelected, key: FIELD_NAME.DataGroupBy})}}
                            options={this.state.DataGroupByOption}
                            isClearable={false}
                            value={this.state.DataGroupBySelectedOption}
                        />
                        <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => {this.handleChange({ optionSelected, key: FIELD_NAME.SellerID})}}
                            options={this.state.sellerIDOption}
                            isClearable={false}
                            controlShouldRenderValue={false}
                            value={this.state.sellerIDSelectedOption}
                        />
                        <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => {this.handleChange({ optionSelected, key: FIELD_NAME.MarketPlaceName})}}
                            options={this.state.marketOption}
                            isClearable={false}
                            controlShouldRenderValue={false}
                            value={this.state.marketSelectedOption}
                        />
                        <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => {this.handleChange({ optionSelected, key: FIELD_NAME.SellerSKU})}}
                            options={this.state.sellerSKUOptions}
                            isClearable={false}
                            controlShouldRenderValue={false}
                            value={this.state.sellerSKUSelectedOptions}
                        />
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
                                   if (sel.qField === 'Date' || sel.qField === 'DataFieldLabel') {
                                       return null
                                   } else {
                                    return sel.qSelectedFieldSelectionInfo.map((value, idx) => (
                                        <span key={`${value.qName}-${idx}`} className='selected-el p-2'>
                                            {value.qName}
                                            <i
                                                className="fa fa-times"
                                                style={{ marginLeft: 10, cursor: 'pointer', padding: 3 }}
                                                onClick={() => { this.deleteFilter({ item: sel, qName: value.qName }) }}
                                            ></i>
                                        </span>
                                    ))
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
