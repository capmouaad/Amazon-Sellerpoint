import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import Select from 'react-select';
import { connect } from 'react-redux'
import { setDataGroupByOptions, setSellerIdOptions, setMarketPlaceNameOptions, setSellerSKUOptions, setDataGroupBySelectedOptions, setSellerIdSelectedOptions, setMarketPlaceNameSelectedOptions, setSellerSKUSelectedOptions, setCurrentSelections, setPickerStartDate, setPickerEndDate, resetQlikFilter } from '../../actions/dashFilter'

const initialState = {
    isTabOpened: true
}

const FIELD_NAME = {
    DataGroupBy: 'DataFieldLabel',
    SellerID: 'SellerID',
    MarketPlaceName: 'MarketPlaceName',
    SellerSKU: 'SellerSKU'
}

class DashFilters extends Component {
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
        const { setPickerStartDate, setPickerEndDate } = this.props

        setPickerStartDate(startDate)
        setPickerEndDate(endDate)

        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.field('Date').selectMatch('>=' + startDate + '<=' + endDate, true).then(function () {
                qApp.field('Date').lock();
            });
        }
    }

    bindCurrentSelections = async () => {
        const { setCurrentSelections } = this.props
        if (window.GlobalQdtComponents) {
            let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}

            await app.getList('CurrentSelections', (reply) => {
                console.log('Current selections');
                console.log(reply.qSelectionObject.qSelections);
                setCurrentSelections(reply.qSelectionObject.qSelections)
            })
        }
    }

    // Render Data Group By

    renderDataGroupBy = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            await qApp.createList({
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

            await qApp.createList({
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

            await qApp.createList({
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

            await qApp.createList({
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
        const { setDataGroupByOptions, setSellerIdOptions, setMarketPlaceNameOptions, setSellerSKUOptions } = this.props
        let data = []
        if (reply.qListObject.qDataPages.length > 0) {
            data = reply.qListObject.qDataPages[0].qMatrix.map((item) => {
                return {
                    value: item[0].qElemNumber,
                    label: item[0].qText
                }
            })
        }

        if (reply.qListObject.qDimensionInfo.qFallbackTitle === FIELD_NAME.MarketPlaceName) {
            setMarketPlaceNameOptions(data)
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === FIELD_NAME.SellerSKU) {
            setSellerSKUOptions(data)
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === FIELD_NAME.SellerID) {
            setSellerIdOptions(data)
        } else {
            setDataGroupByOptions(data)
        }
    }

    handleChange = async ({ optionSelected, key }) => {
        try {
            const { setDataGroupBySelectedOptions, setMarketPlaceNameSelectedOptions, setSellerIdSelectedOptions, setSellerSKUSelectedOptions } = this.props

            let data = [];
            if (optionSelected && Array.isArray(optionSelected) && optionSelected.length > 0) {
                data = optionSelected.map((item) => (item.value))
            } else if (optionSelected) {
                data.push(optionSelected.value);
            }

            let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}
            app && await app.field(key).select(data, false,true);

            if (key === FIELD_NAME.SellerSKU) {
                setSellerSKUSelectedOptions(optionSelected)
            } else if (key === FIELD_NAME.MarketPlaceName) {
                setMarketPlaceNameSelectedOptions(optionSelected)
            } else if (key === FIELD_NAME.SellerID) {
                setSellerIdSelectedOptions(optionSelected)
            } else {
                setDataGroupBySelectedOptions(optionSelected)
            }
        } catch (e) {
            console.error(e)
        }
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

            const { MarketPlaceNameSelectedOptions, SellerIDSelectedOptions, SellerSKUSelectedOptions, setMarketPlaceNameSelectedOptions, setSellerIdSelectedOptions, setSellerSKUSelectedOptions } = this.props
            switch (item.qField) {
                case FIELD_NAME.MarketPlaceName:
                    setMarketPlaceNameSelectedOptions(
                        MarketPlaceNameSelectedOptions.filter((item) => item.value !== qName)
                    )
                    break
                case FIELD_NAME.SellerID:
                    setSellerIdSelectedOptions(
                        SellerIDSelectedOptions.filter((item) => item.value !== qName)
                    )
                    break
                case FIELD_NAME.SellerSKU:
                    setSellerSKUSelectedOptions(
                        SellerSKUSelectedOptions.filter((item) => item.value !== qName)
                    )
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
        const { DataGroupBySelectedOptions, pickerStartDate, pickerEndDate } = this.props
        if (!pickerStartDate && !pickerEndDate) {
            const startDate = moment().subtract(59, 'days').format('MM/DD/YYYY');
            const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
            this.handleDateSelection(startDate, endDate);
        }
        setTimeout(async () => {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            this.renderDataGroupBy()
            this.renderSellerID()
            this.renderMarketDropDown()
            this.binddropdown();
            this.bindCurrentSelections();
            if (qApp) {
                await qApp.field(FIELD_NAME.DataGroupBy).selectValues(['Week'], true, true)
                await qApp.field(FIELD_NAME.DataGroupBy).lock()
                if (!DataGroupBySelectedOptions) {
                    this.handleChange({
                        optionSelected: {
                            value: 'Week',
                            label: 'Week'
                        },
                        key: FIELD_NAME.DataGroupBy
                    })
                }
            }
        }, 3000);

    }

    onResetQlik = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null

            await qApp.clearAll()
            this.props.resetQlikFilter()
        }
    }

    render() {
        const { isTabOpened } = this.state
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

        const {
            DataGroupByOptions,
            SellerIDOptions,
            MarketPlaceNameOptions,
            SellerSKUOptions,
            DataGroupBySelectedOptions,
            SellerIDSelectedOptions,
            MarketPlaceNameSelectedOptions,
            SellerSKUSelectedOptions,
            currentSelections,
            pickerStartDate,
            pickerEndDate
        } = this.props

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
                        <Select className="qlik-select" isMulti={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => { this.handleChange({ optionSelected, key: FIELD_NAME.DataGroupBy }) }}
                            options={DataGroupByOptions}
                            isClearable={false}
                            value={DataGroupBySelectedOptions}
                        />
                        <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => { this.handleChange({ optionSelected, key: FIELD_NAME.SellerID }) }}
                            options={SellerIDOptions}
                            isClearable={false}
                            controlShouldRenderValue={false}
                            value={SellerIDSelectedOptions}
                        />
                        <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => { this.handleChange({ optionSelected, key: FIELD_NAME.MarketPlaceName }) }}
                            options={MarketPlaceNameOptions}
                            isClearable={false}
                            controlShouldRenderValue={false}
                            value={MarketPlaceNameSelectedOptions}
                        />
                        <Select className="qlik-select" isMulti closeMenuOnSelect={false}
                            hideSelectedOptions
                            onChange={(optionSelected) => { this.handleChange({ optionSelected, key: FIELD_NAME.SellerSKU }) }}
                            options={SellerSKUOptions}
                            isClearable={false}
                            controlShouldRenderValue={false}
                            value={SellerSKUSelectedOptions}
                        />
                        <DateRangePicker alwaysShowCalendars onEvent={this.handleEvent} ranges={ranges} startDate={pickerStartDate} endDate={pickerEndDate} containerClass="react-bootstrap-daterangepicker-container">
                            <div className="input-group">
                                <span className="input-group-btn date-range-picker-calender-btn">
                                    <button className="default date-range-toggle">
                                        <i className="fa fa-calendar" />
                                    </button>
                                </span>
                                <input
                                    readOnly
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

const mapStateToProps = (state) => ({
    DataGroupByOptions: state.dashFilter.DataGroupByOptions,
    SellerIDOptions: state.dashFilter.SellerIDOptions,
    MarketPlaceNameOptions: state.dashFilter.MarketPlaceNameOptions,
    SellerSKUOptions: state.dashFilter.SellerSKUOptions,
    DataGroupBySelectedOptions: state.dashFilter.DataGroupBySelectedOptions,
    SellerIDSelectedOptions: state.dashFilter.SellerIDSelectedOptions,
    MarketPlaceNameSelectedOptions: state.dashFilter.MarketPlaceNameSelectedOptions,
    SellerSKUSelectedOptions: state.dashFilter.SellerSKUSelectedOptions,
    currentSelections: state.dashFilter.currentSelections,
    pickerStartDate: state.dashFilter.pickerStartDate,
    pickerEndDate: state.dashFilter.pickerEndDate
})

const mapDispatchToProps = (dispatch) => ({
    setDataGroupByOptions: (data) => dispatch(setDataGroupByOptions(data)),
    setSellerIdOptions: (data) => dispatch(setSellerIdOptions(data)),
    setMarketPlaceNameOptions: (data) => dispatch(setMarketPlaceNameOptions(data)),
    setSellerSKUOptions: (data) => dispatch(setSellerSKUOptions(data)),
    setDataGroupBySelectedOptions: (data) => dispatch(setDataGroupBySelectedOptions(data)),
    setSellerIdSelectedOptions: (data) => dispatch(setSellerIdSelectedOptions(data)),
    setMarketPlaceNameSelectedOptions: (data) => dispatch(setMarketPlaceNameSelectedOptions(data)),
    setSellerSKUSelectedOptions: (data) => dispatch(setSellerSKUSelectedOptions(data)),
    setCurrentSelections: (data) => dispatch(setCurrentSelections(data)),
    setPickerStartDate: (data) => dispatch(setPickerStartDate(data)),
    setPickerEndDate: (data) => dispatch(setPickerEndDate(data)),
    resetQlikFilter: () => dispatch(resetQlikFilter())
})

export default connect(mapStateToProps, mapDispatchToProps)(DashFilters)
