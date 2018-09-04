import React, { Component } from 'react';
import { connect } from 'react-redux'
import QdtComponent from '../Qlik/QdtComponent';
import TooltipSimple from '../Helpers/ToolTipSimple';
import ToolTipTabbed from '../Helpers/ToolTipTabbed';
import { resetQlikFilter } from '../../actions/dashFilter'

const HIDE_OPTION = {
    Hide: 'Hide',
    Show: 'Show'
}

class DashSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTabOpened: true,
            qApp: null,
            vShowChildSellerSKU: null
        }
    }

    componentDidMount() {
        if (!this.state.qApp) {
            setTimeout(async () => {
                this.getChildShowHideState();
            }, 4200);
        } else {
            this.getChildShowHideState();
        }
    }

    getChildShowHideState = async () => {
        if (!this.state.qApp) {
            await this.getQApp()
        }
        this.state.qApp && this.state.qApp.variable.getContent('vShowChildSellerSKU', (reply) => {
            this.setState({ vShowChildSellerSKU: reply.qContent.qString })
        });
    }

    getQApp = async () => {
        const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
        this.setState({
            qApp,
        })
    }

    onResetQlik = async () => {
        if (!this.state.qApp) {
            await this.getQApp()
        }
        await this.state.qApp.clearAll()
        this.props.resetQlikFilter()
    }

    toggleChildSKU = async ({ option }) => {
        if (!this.state.qApp) {
            await this.getQApp()
        }
        this.setState({
            vShowChildSellerSKU: option
        })
        await this.state.qApp.variable.setStringValue('vShowChildSellerSKU', option)
    }

    toggleTab = () => {
        this.setState({
            isTabOpened: !this.state.isTabOpened
        })
    }

    render() {
        const { name, qdt, toolTipSimple, toolTipTabbed, toolTipHeader, toolTipContent, toolTipTabs, toolTipTabContents, clearFilters } = this.props;
        const { isTabOpened, vShowChildSellerSKU } = this.state
        return (
            <div className={"dash-section" + (isTabOpened ? "" : " is-closed")} >
                <div className="dash-section__heading">
                    <div className={"dash-section__toggler"} onClick={this.toggleTab}>
                        <div className="dash-section__toggler-icon"></div>
                    </div>
                    <h2 className="dash-section__title">{name}</h2>
                    {toolTipSimple && <TooltipSimple toolTipheader={toolTipHeader} toolTipContent={toolTipContent} />}
                    {toolTipTabbed && <ToolTipTabbed toolTipheader={toolTipHeader} toolTipTabs={toolTipTabs} toolTipTabContents={toolTipTabContents} />}
                </div>
                {
                    clearFilters &&
                    <div>
                        <div className='wrapper-btn-clear'>
                            <button className='btn-clear-filter' onClick={this.onResetQlik}>clear filters</button>
                        </div>
                        <div className='wrapper-radio-sku'>
                            <h5>Show/Hide Child SKUs (Grouping)*</h5>
                            <input type="radio" key="hide" name="radio_sku_child" className='style-radio-sku' onClick={(e) => { this.toggleChildSKU({ option: HIDE_OPTION.Hide }); }} checked={vShowChildSellerSKU === HIDE_OPTION.Hide} /><span>Hide</span>
                            <input type="radio" key="show" name="radio_sku_child" className='style-radio-sku' onClick={(e) => { this.toggleChildSKU({ option: HIDE_OPTION.Show }); }} checked={vShowChildSellerSKU === HIDE_OPTION.Show} /><span>Show</span>
                        </div>
                    </div>
                }
                <div className="dash-section__chart">
                    {qdt &&
                        <QdtComponent
                            type={qdt.type}
                            props={qdt.props}
                        />
                    }
                </div>
            </div >
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        resetQlikFilter: () => dispatch(resetQlikFilter())
    })
)(DashSection)
