import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import Select from 'tuna.react-select';
import { connect } from 'react-redux'
import chroma from 'chroma-js';
import { APP_CONFIG } from '../../constants'

import { setDataGroupByOptions, setSellerIdOptions, setMarketPlaceNameOptions, setSellerSKUOptions, setDataGroupBySelectedOptions, setSellerIdSelectedOptions, setMarketPlaceNameSelectedOptions, setSellerSKUSelectedOptions, setCurrentSelections, setPickerStartDate, setPickerEndDate, resetQlikFilter } from '../../actions/dashFilter'

const initialState = {
    isTabOpened: true
}

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isAlternative, isDisabled, isFocused, isPossible, isSelected }) => {
        const color = chroma('#2683FE');
        let checkBackgroundColor
        let checkColor
        if (isDisabled) {
            checkBackgroundColor = '#A8A8A8'
            checkColor = 'white'
        } else if (isPossible) {
            checkBackgroundColor = 'white'
            checkColor = 'black'
        } else if (isAlternative) {
            checkBackgroundColor = '#DDDDDD'
            checkColor = 'black'
        } else if (isSelected) {
            checkBackgroundColor = '#2683FE'
            checkColor = 'white'
        } else {
            // default color and bgcolor
        }

        if (isFocused) {
            if (!isSelected) {
                checkBackgroundColor = color.alpha(0.1).css()
                checkColor = data.color
            } else {
                checkBackgroundColor = 'white'
                checkColor = 'black'
            }
        }

        return {
            ...styles,
            backgroundColor: checkBackgroundColor,
            color: checkColor,
            cursor: isDisabled ? 'not-allowed' : 'default'
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma('#DEEBFF');
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: '#DEEBFF'
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: '#DEEBFF',
            color: 'white',
        },
    }),
    placeholder: (styles, { data }) => ({
        ...styles,
        color: '#595959'
    })
};

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
        if (event.type === 'apply' && this.props.QlikConnected) {
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

                // Flatten data from qlik so redux connect can compare object changes
                let data = []
                reply.qSelectionObject.qSelections.forEach((sel) => {
                    if (sel.qField !== 'DataFieldLabel' && sel.qField !== 'Date') {
                        sel.qSelectedFieldSelectionInfo.forEach((item) => {
                            data.push({
                                qField: sel.qField,
                                qName: item.qName
                            })
                        })
                    }
                })

                setCurrentSelections(data)
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
                        APP_CONFIG.QS_FIELD_NAME.DataGroupBy
                    ],
                    "qSortCriterias": [
                        {
                            "qSortByLoadOrder": 1
                        }
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 2000,
                        "qWidth": 1
                    }
                ],
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
                        APP_CONFIG.QS_FIELD_NAME.SellerID
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 2000,
                        "qWidth": 1
                    }
                ],
                "qShowAlternatives": true
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
                        APP_CONFIG.QS_FIELD_NAME.MarketPlaceName
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 2000,
                        "qWidth": 1
                    }
                ],
                "qShowAlternatives": true
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
                        APP_CONFIG.QS_FIELD_NAME.SellerSKU
                    ],
                    "qSortCriterias": [
                        {
                            "qSortByState": 1
                        }
                    ]
                },
                "qInitialDataFetch": [
                    {
                        "qHeight": 2000,
                        "qWidth": 1
                    }
                ],
                "qShowAlternatives": true
            }, this.bindData);
        }
    }

    bindData = (reply, app) => {
        const { setDataGroupByOptions, setSellerIdOptions, setMarketPlaceNameOptions, setSellerSKUOptions, DataGroupBySelectedOptions, setDataGroupBySelectedOptions } = this.props

        let data = []
        if (reply.qListObject.qDataPages.length > 0) {
            data = reply.qListObject.qDataPages[0].qMatrix
                .map((item) => {
                    return {
                        value: item[0].qElemNumber,
                        label: item[0].qText,
                        isPossible: item[0].qState === 'O',
                        isAlternative: item[0].qState === 'A',
                        isDisabled: (item[0].qState === 'X' || item[0].qState === 'XS' || item[0].qState === 'XL') && reply.qListObject.qDimensionInfo.qFallbackTitle !== APP_CONFIG.QS_FIELD_NAME.DataGroupBy ? true : false
                    }
                })
        }

        if (reply.qListObject.qDimensionInfo.qFallbackTitle === APP_CONFIG.QS_FIELD_NAME.MarketPlaceName) {
            setMarketPlaceNameOptions(data)
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === APP_CONFIG.QS_FIELD_NAME.SellerSKU) {
            setSellerSKUOptions(data)
        } else if (reply.qListObject.qDimensionInfo.qFallbackTitle === APP_CONFIG.QS_FIELD_NAME.SellerID) {
            setSellerIdOptions(data)
        } else {
            setDataGroupByOptions(data)
            !DataGroupBySelectedOptions && setDataGroupBySelectedOptions(data[1])
        }
    }

    handleChange = async ({ optionSelected, key, doNotApplySelection }) => {
        try {
            const { setDataGroupBySelectedOptions, setMarketPlaceNameSelectedOptions, setSellerIdSelectedOptions, setSellerSKUSelectedOptions } = this.props
            // let difference = this.state.selected.filter(x => !value.includes(x)); // calculates diff
            // console.log('Removed: ', difference);                         // prints array of removed

            //this.setState({ selected: value });
            let data = [];
            if (optionSelected && Array.isArray(optionSelected) && optionSelected.length > 0) {
                data = optionSelected.map((item) => (item.value))
            } else if (optionSelected) {
                data.push(optionSelected.value);
            }

            if (!doNotApplySelection) {
                let app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}
                app && await app.field(key).select(data, false, true);
            }

            if (key === APP_CONFIG.QS_FIELD_NAME.SellerSKU) {
                setSellerSKUSelectedOptions(optionSelected)
            } else if (key === APP_CONFIG.QS_FIELD_NAME.MarketPlaceName) {
                setMarketPlaceNameSelectedOptions(optionSelected)
            } else if (key === APP_CONFIG.QS_FIELD_NAME.SellerID) {
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
            // const { SellerSKUSelectedOptions} = this.props
            const app = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : {}

            if (isNaN(Number(qName)))
                await app.field(item.qField).selectValues([{ qText: qName }], true, true);
            else
                await app.field(item.qField).selectValues([Number(qName)], true, true);

            const { MarketPlaceNameSelectedOptions, SellerIDSelectedOptions, SellerSKUSelectedOptions, setMarketPlaceNameSelectedOptions, setSellerIdSelectedOptions, setSellerSKUSelectedOptions } = this.props
            switch (item.qField) {
                case APP_CONFIG.QS_FIELD_NAME.MarketPlaceName:
                    setMarketPlaceNameSelectedOptions(
                        MarketPlaceNameSelectedOptions.filter((val) => val.label !== qName)
                    )
                    break
                case APP_CONFIG.QS_FIELD_NAME.SellerID:
                    setSellerIdSelectedOptions(
                        SellerIDSelectedOptions.filter((val) => val.label !== qName)
                    )
                    break
                case APP_CONFIG.QS_FIELD_NAME.SellerSKU:
                    setSellerSKUSelectedOptions(
                        SellerSKUSelectedOptions.filter((val) => val.label !== qName)
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

    componentDidUpdate (prevProps) {
        if (this.props.QlikConnected && !prevProps.QlikConnected) {
            this.renderDataGroupBy()
            this.renderSellerID()
            this.renderMarketDropDown()
            this.binddropdown();
            this.bindCurrentSelections();
        }
    }

    initialSelection = async () => {
        const { pickerStartDate, pickerEndDate } = this.props
        if (!pickerStartDate && !pickerEndDate) {
            const startDate = moment().subtract(59, 'days').format('MM/DD/YYYY');
            const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
            this.handleDateSelection(startDate, endDate);
        }
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
            pickerEndDate,
            QlikConnected
        } = this.props

        return (
            <div className="dash-filters">
                <div className="container container--full">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="dash-filters__title mar-b">FILTERS</div>
                        <button className='btn-clear-filter mar-b' onClick={this.onResetQlik}>
                            clear filters
                        </button>
                    </div>
                    <div className="dash-filters__wrapper">
                        <div className="data-grouped data-filter">
                            <label>View data by </label>
                            <Select
                                className="qlik-select mar-r"
                                isMulti={false}
                                autoFocusFirstOption={false}
                                isDisabled={!QlikConnected}
                                onChange={(optionSelected) => { this.handleChange({ optionSelected, key: APP_CONFIG.QS_FIELD_NAME.DataGroupBy }) }}
                                options={DataGroupByOptions}
                                isClearable={false}
                                placeholder="Data Grouped By"
                                value={DataGroupBySelectedOptions}
                                styles={colourStyles}
                            /></div>
                        <div className="date-range-picker data-filter">
                            <label>Date range </label>
                            <DateRangePicker
                                alwaysShowCalendars
                                onEvent={this.handleEvent}
                                ranges={ranges}
                                startDate={pickerStartDate}
                                endDate={pickerEndDate} containerClass="react-bootstrap-daterangepicker-container"
                            >
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

                        <div className="seller-id data-filter">
                            <label>Seller ID </label>
                            <Select
                                className="qlik-select mar-r"
                                isMult
                                autoFocusFirstOption={false}
                                closeMenuOnSelect={false}
                                isDisabled={!QlikConnected}
                                hideSelectedOptions={false}
                                onChange={(optionSelected) => { this.handleChange({ optionSelected, key: APP_CONFIG.QS_FIELD_NAME.SellerID }) }}
                                options={SellerIDOptions}
                                isClearable={false}
                                controlShouldRenderValue={false}
                                value={SellerIDSelectedOptions}
                                styles={colourStyles}
                                placeholder="SellerID"
                            />
                        </div>

                        <div className="marketplace data-filter">
                            <label>Marketplace </label>
                            <Select
                                className="qlik-select mar-r"
                                isMulti
                                autoFocusFirstOption={false}    
                                closeMenuOnSelect={false}
                                isDisabled={!QlikConnected}
                                hideSelectedOptions={false}
                                onChange={(optionSelected) => { this.handleChange({ optionSelected, key: APP_CONFIG.QS_FIELD_NAME.MarketPlaceName }) }}
                                options={MarketPlaceNameOptions}
                                isClearable={false}
                                controlShouldRenderValue={false}
                                value={MarketPlaceNameSelectedOptions}
                                styles={colourStyles}
                                placeholder="Marketplace"
                            />
                        </div>
                        <div className="seller-sku data-filter">
                            <label>Seller SKU </label>
                            <Select
                                className="qlik-select mar-r-0"
                                isMulti
                                autoFocusFirstOption={false}
                                closeMenuOnSelect={false}
                                isDisabled={!QlikConnected}
                                hideSelectedOptions={false}
                                onChange={(optionSelected) => { this.handleChange({ optionSelected, key: APP_CONFIG.QS_FIELD_NAME.SellerSKU }) }}
                                options={SellerSKUOptions}
                                isClearable={false}
                                controlShouldRenderValue={false}
                                value={SellerSKUSelectedOptions}
                                styles={colourStyles}
                                placeholder="Seller SKU"
                            />
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
                                currentSelections.map((value, idx) => {
                                    return (
                                        <span key={`${value.qName}-${idx}`} className='selected-el p-2'>
                                            {value.qName}
                                            <i
                                                className="fa fa-times"
                                                style={{ marginLeft: 10, cursor: 'pointer', padding: 3 }}
                                                onClick={() => { this.deleteFilter({ item: value, qName: value.qName }) }}
                                            ></i>
                                        </span>
                                    )
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
    pickerEndDate: state.dashFilter.pickerEndDate,
    QlikConnected: state.qlik.connected
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
