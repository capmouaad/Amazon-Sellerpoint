import React from 'react';
import gtmParts from 'react-google-tag-manager';
import PropTypes from 'prop-types';

class GoogleTagManager extends React.Component {
    componentDidMount() {
        const dataLayerName = this.props.dataLayerName || 'dataLayer';
        const scriptId = this.props.scriptId || 'react-google-tag-manager-gtm';

        if (!window[dataLayerName]) {
            const script = document.createElement("script")
            const gtmScriptNode = document.getElementById(scriptId);
            const scriptText = document.createTextNode(gtmScriptNode.textContent);
            script.appendChild(scriptText)
            document.head.appendChild(script)
        }
    }

    render() {
        const gtm = gtmParts({
            id: this.props.gtmId,
            dataLayerName: this.props.dataLayerName || 'dataLayer',
            additionalEvents: this.props.additionalEvents || {},
            previewVariables: this.props.previewVariables || false,
            scheme: 'https:',
        });

        return (
            <div>
                <div>{gtm.noScriptAsReact()}</div>
                <div id={this.props.scriptId || 'react-google-tag-manager-gtm'}>
                    {gtm.scriptAsReact()}
                </div>
            </div>
        );
    }
}

GoogleTagManager.propTypes = {
    gtmId: PropTypes.string.isRequired,
    dataLayerName: PropTypes.string,
    additionalEvents: PropTypes.object,
    previewVariables: PropTypes.string,
    scriptId: PropTypes.string
};

export default GoogleTagManager;