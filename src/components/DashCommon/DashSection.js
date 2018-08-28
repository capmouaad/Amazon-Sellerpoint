import React, { Component } from 'react';
import QdtComponent from '../Qlik/QdtComponent';
import TooltipSimple from '../Helpers/ToolTipSimple';
import ToolTipTabbed from '../Helpers/ToolTipTabbed';

const HIDE_OPTION = {
    Hide: 'Hide',
    Show: 'Show'
}

export default class DashSection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isTabOpened: true,
            qApp: null,
            vShowChildSellerSKU: null
        }
    }

    componentDidMount () {
        this.getQApp()
    }

    componentDidUpdate (prevProps, prevState) {
        if(!this.state.qApp && window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) {
            this.getQApp()
        }
    }

    getQApp = async () => {
        const qApp = (window.GlobalQdtComponents && window.GlobalQdtComponents.qAppPromise) ? await window.GlobalQdtComponents.qAppPromise : null
        this.setState({
            qApp,
        })
        this.checkShowChild()
    }

    checkShowChild = () => {
        this.state.qApp && this.state.qApp.variable.getContent('vShowChildSellerSKU', (reply) => {
            this.setState({
                vShowChildSellerSKU: reply.qContent.qString
            })
        });
    }

    onResetQlik = async () => {
        this.state.qApp && this.state.qApp.clearAll()
    }

    onHideChildSellerSku = async (e) => {
        if (this.state.qApp) {
            this.setState({
                vShowChildSellerSKU: HIDE_OPTION.Hide
            })
            await this.state.qApp.variable.setStringValue('vShowChildSellerSKU', HIDE_OPTION.Hide)
            this.state.qApp.field('vShowChildSellerSKU').selectValues([HIDE_OPTION.Hide], true);
            this.state.qApp.field('vShowChildSellerSKU').lock();  
           // this.checkShowChild()
        }
    }

    onShowChildSellerSku = async () => {
        if (this.state.qApp) {       
            this.setState({
                vShowChildSellerSKU: HIDE_OPTION.Show
            })            
            await this.state.qApp.variable.setStringValue('vShowChildSellerSKU', HIDE_OPTION.Show)
             this.state.qApp.field('vShowChildSellerSKU').selectValues([HIDE_OPTION.Show], true);
             this.state.qApp.field('vShowChildSellerSKU').lock();            
           // this.checkShowChild()           
        }
    }

    toggleTab = () => {
        this.setState({
            isTabOpened: !this.state.isTabOpened
        })
    }

    render () {

        const { name, qdt, toolTipSimple, toolTipTabbed, toolTipHeader, toolTipContent, toolTipTabs, toolTipTabContents, clearFilters } = this.props;
        const { isTabOpened, vShowChildSellerSKU } = this.state
console.log("render : "+ vShowChildSellerSKU);
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
                            <input type="radio" key={"hide"+HIDE_OPTION.Hide } name="radio_sku_child" value={HIDE_OPTION.Hide} className='style-radio-sku' onClick={(e)=> { this.onHideChildSellerSku(); }} checked={vShowChildSellerSKU === HIDE_OPTION.Hide} /><span>Hide</span>
                            <input type="radio" key={"show"+HIDE_OPTION.Hide } name="radio_sku_child" value={HIDE_OPTION.Show} className='style-radio-sku' onClick={(e)=> { this.onShowChildSellerSku(); }} checked={vShowChildSellerSKU === HIDE_OPTION.Show} /><span>Show</span>
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
