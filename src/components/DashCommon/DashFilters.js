import React, { Component } from 'react';
import QdtComponent from '../Qlik/QdtComponent';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';

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
    //{
    //     name: "DatePicker",
    //     qdt: {
    //         type: 'QdtViz',
    //         props: {
    //             id: 'JQfpVS', height: '40px',width:'400px'
    //         },
    //     }
    // },
    {
        name: "SellerId",
        qdt: {
            type: 'QdtViz',
            props: {
                id: 'WzFqaf', height: '40px', width: '200px'
            },
        }
    },
    {
        name: "MarketPlace",
        qdt: {
            type: 'QdtViz',
            props: {
                id: 'UfRGFA', height: '40px', width: '200px'
            },
        }
    },
    {
        name: "SellerSKU",
        qdt: {
            type: 'QdtViz',
            props: {
                id: 'jYJJpT', height: '40px', width: '200px'
            },
        }
    }
]

export default class DashFilters extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pickerStartDate: '',
            pickerEndDate: ''
        }
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
            const qApp = (window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.field('Date').selectMatch('>=' + startDate + '<=' + endDate, true).then(function () {
                qApp.field('Date').lock();
            });
        }
    }

    componentDidMount() {
        this.initialSelection();
    }

    initialSelection = async () => {
        const startDate = moment().subtract(59, 'days').format('MM/DD/YYYY');
        const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
        this.handleDateSelection(startDate, endDate);
    }

    onResetQlik = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.clearAll()
        }
    }

    render() {
        const { pickerStartDate, pickerEndDate } = this.state

        // TODO - not rendering - wrong type or/and props ?
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
                        <div>
                            <DateRangePicker onEvent={this.handleEvent} ranges={ranges} containerClass="react-bootstrap-daterangepicker-container">
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
                </div>
            </div>
        )
    }
}
