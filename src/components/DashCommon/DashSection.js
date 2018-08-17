import React, { Component } from 'react';
import QdtComponent from '../Qlik/QdtComponent';
import TooltipSimple from '../Helpers/ToolTipSimple';
import ToolTipTabbed from '../Helpers/ToolTipTabbed';

export default class DashSection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isTabOpened: true
        }
    }
    componentDidMount() {
        // this.requestQlikData()
    }

    onResetQlik = async () => {
        if (window.GlobalQdtComponents) {
            const qApp = (window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
            qApp.clearAll()
        }
    }

    onHideChildSellerSku = async () => {
        const qApp = (window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
        qApp.variable.setStringValue('vShowChildSellerSKU', 'Hide')
    }

    onShowChildSellerSku = async () => {
        const qApp = (window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
        qApp.variable.setStringValue('vShowChildSellerSKU', 'Show')
    }

    toggleTab = () => {
        this.setState({
            isTabOpened: !this.state.isTabOpened
        })
    }

    render() {

        const { name, qdt, toolTipSimple, toolTipTabbed, toolTipHeader, toolTipContent, toolTipTabs, toolTipTabContents, clearFilters } = this.props;
        const { isTabOpened } = this.state

        return (
            <div className={"dash-section" + (isTabOpened ? "" : " is-closed")}>
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
                            <h5>Show child SKU</h5>
                            <input type="radio" name="radio_sku_child" value="1" className='style-radio-sku' onClick={this.onHideChildSellerSku} /><span>Hide</span>
                            <input type="radio" name="radio_sku_child" value="0" className='style-radio-sku' onClick={this.onShowChildSellerSku} /><span>Show</span>
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
            </div>
        )
    }
}
