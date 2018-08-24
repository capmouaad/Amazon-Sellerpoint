import React, { Component } from 'react';
import api from '../../services/Api';
import { connect } from 'react-redux';
import { SET_STATUS_PROGRESS } from '../../store/ActionTypes'

const IBar = (props) => {
    const { name, progress } = props
    const isCompleated = progress === 100

    return (
        <div className="i-bar">
            <div className="i-bar__name">{name}</div>
            <div className="i-bar__status">
                <div
                    className={"i-bar__progress" + (isCompleated ? " is-compleated" : "")}
                    style={{ "width": `${progress}%` }}
                >
                    {
                        progress > 5 &&
                        <span>{isCompleated ? "Complete" : progress.toFixed(2) + " %"}</span>
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
        this.checkStatusProgressBar()

        this.timerGetImportStatus = setInterval(() => {
            if (!this.state.DataImportComplete) {
                this.getImportStatus();
            } else {
                clearInterval(this.timerGetImportStatus);
            }
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timerGetImportStatus);
    }

    getImportStatus = () => {
        const { setStatusProgress } = this.props
        api
            .get(`GetDataImportStatus`)
            .then((res) => {
                console.log('backend responce to GET GetDataImportStatus', res)

                if (res.data.IsSuccess) {
                    this.setState({
                        DataImportComplete: res.data.DataImportComplete
                    })
                    setStatusProgress({
                        finaceDataProgress: res.data.FinanceDataImportProgress,
                        reportDataProgress: res.data.ReportDataImportProgress,
                        adDataProgress: res.data.AdDataImportProgress
                    })
                } else {
                    setStatusProgress({
                        finaceDataProgress: 0,
                        reportDataProgress: 0,
                        adDataProgress: 0
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    checkStatusProgressBar = () => {
        const { statusProgress } = this.props
        const { finaceDataProgress, reportDataProgress, adDataProgress } = statusProgress
        if ((finaceDataProgress === 0 || null) && (reportDataProgress === 0 || null) && (adDataProgress === 0 || null)) {
            this.getImportStatus()
        }
    }

    render() {

        const { statusProgress } = this.props

        return (
            <div className="i-progress">
                <div className="container container--full">
                    <div className="i-progress__wrapper">
                        <div className="i-progress__title">DATA IMPORT STATUS</div>
                        <div className="i-progress__bars">
                            <IBar name="Financials" progress={statusProgress ? statusProgress.finaceDataProgress : 0} />
                            <IBar name="Products" progress={statusProgress ? statusProgress.reportDataProgress : 0} />
                            <IBar name="Advertising" progress={statusProgress ? statusProgress.adDataProgress : 0} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => (
    {
      statusProgress: state.header.statusProgress
    }
  );
  
const mapDispatchToProps = (dispatch) => ({
    setStatusProgress: (data) => dispatch({ type: SET_STATUS_PROGRESS, payload: data })
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ImportProgress);
