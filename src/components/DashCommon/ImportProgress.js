import React, { Component } from 'react';
import api from '../../services/Api';
import { connect } from 'react-redux';
import { SET_STATUS_PROGRESS } from '../../store/ActionTypes'
import { setShowImportProgressBar } from '../../actions/statusBar'

const IBar = (props) => {
    const { name, progress, optedOut } = props
    const isCompleated = progress === 100

    return (
        <div className="i-bar">
            <div className="i-bar__name">{name}</div>
            <div className="i-bar__status">
                <div
                    className={"i-bar__progress" + (optedOut ? " is-optedOut" : isCompleated ? " is-compleated" : "")}
                    style={{ "width": optedOut ? `100%` : `${progress}%` }}
                >
                    {
                        (progress > 1 || optedOut) &&
                        <span>{optedOut ? "Opted Out" : isCompleated ? "Complete" : Math.ceil(progress) + " %"}</span>
                    }
                </div>
            </div>
        </div>
    )
}

class ImportProgress extends Component {

    constructor(props) {
        super(props);

        this.state = {
            DataImportComplete: false
        }
    }

    componentDidMount() {
        if (this.props.isShowImportProgressBar) {
            this.getImportStatus()

            this.timerGetImportStatus = setInterval(() => {
                this.getImportStatus()
            }, 10000)
        }
    }

    componentWillUnmount() {
        this.clearCheckImportInterval()
    }

    clearCheckImportInterval = () => {
        this.timerGetImportStatus && clearInterval(this.timerGetImportStatus)
    }

    getImportStatus = async () => {
        const { setStatusProgress, setShowImportProgressBar } = this.props

        const { data } = await api.get('GetDataImportStatus')
        console.log('backend responce to GET GetDataImportStatus', data)
        
        if (data.IsSuccess) {
            if (data.DataImportComplete || (data.FinanceDataImportProgress === 100 && data.ReportDataImportProgress === 100 && data.AdvertisingOptedOut)) {
                this.clearCheckImportInterval()
                setShowImportProgressBar(false)
            }

            setStatusProgress({
                finaceDataProgress: data.FinanceDataImportProgress,
                reportDataProgress: data.ReportDataImportProgress,
                adDataProgress: data.AdDataImportProgress,
                adOptedOut: data.AdvertisingOptedOut
            })
        } else {
            setStatusProgress({
                finaceDataProgress: 0,
                reportDataProgress: 0,
                adDataProgress: 0
            })
        }
    }

    checkStatusProgressBar = () => {
        const { statusProgress } = this.props
        const { finaceDataProgress, reportDataProgress, adDataProgress } = statusProgress
        if ((finaceDataProgress === 0 || null) && (reportDataProgress === 0 || null) && (adDataProgress === 0 || null)) {
            this.getImportStatus()
        }
    }

    render() {

        const { statusProgress, isShowImportProgressBar } = this.props

        return (
            <div>
                {
                    isShowImportProgressBar
                    ? (
                        <div className="i-progress">
                            <div className="container container--full">
                                <div className="i-progress__wrapper">
                                    <div className="i-progress__title">DATA IMPORT STATUS</div>
                                    <div className="i-progress__bars">
                                        <IBar name="Financials" progress={statusProgress ? statusProgress.finaceDataProgress : 0} />
                                        <IBar name="Products" progress={statusProgress ? statusProgress.reportDataProgress : 0} />
                                        <IBar name="Advertising" progress={statusProgress ? statusProgress.adDataProgress : 0} optedOut={statusProgress.adOptedOut} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : null
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    statusProgress: state.header.statusProgress,
    isShowImportProgressBar: state.statusBar.isShowImportProgressBar
});

const mapDispatchToProps = (dispatch) => ({
    setStatusProgress: (data) => dispatch({ type: SET_STATUS_PROGRESS, payload: data }),
    setShowImportProgressBar: (data) => dispatch(setShowImportProgressBar(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportProgress);
