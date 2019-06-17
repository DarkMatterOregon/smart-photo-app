import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { guardian } from 'Shared/AuthGuard';

class Scan extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        isValidating: false,
        validationError: '',
        hasQRScanner: false,
        qrCodeText: 'event_2015_bend-make-a-band_26426947462172_b2e94030d1df67fd',
        qrError: '',
        status: 'none'
    };

    linkToPage = (path) => {
        this.props.history.push(path);
    };

    scanComplete = (err, qrCodeText) => {
        QRScanner.hide();
        QRScanner.cancelScan();
        document.body.style.backgroundColor = '#222222';

        if (err){
            this.setState({ qrError: err });
        } else {
            this.processQRBallot(qrCodeText)
        }
    };

    processQRBallot(qrCodeText) {
        this.setState({ isValidating: true });
        guardian.loginBallotQrCode(qrCodeText)
            .then((result) => {
                console.log('result', result);
                this.linkToPage('/home');
            })
            .catch((err) => {
                this.setState({ isValidating: false, validationError: JSON.stringify(err) });
            });
    }

    componentDidMount() {
        if (window && window.QRScanner) {
            this.setState({ hasQRScanner: true });
            QRScanner.scan(this.scanComplete);
            QRScanner.show((status) => {
                this.setState({ status: JSON.stringify(status)});
            });
        }
    }

    onGetScanStatus = () => {
        QRScanner.getStatus((status) => {
            this.setState({ status: JSON.stringify(status)})
        });
    };

    renderValidationError(validationError) {
        return (
            <div>
                <div className="scan-cta-header">Unable to Validate Ballot</div>
                <button onClick={() => this.setState({ validationError: '' })}>
                    Re-Scan
                </button>
            </div>
        )
    }

    renderValidating() {
        return (
            <div>
                <div className="scan-cta-header">Validating Ballot ...</div>
            </div>
        );
    }

    renderScanScreen() {
        const { hasQRScanner } = this.state;
        if (hasQRScanner) {
            return <div className="scan-cta-header">Scan Your Ballot</div>;
        }

        return (
            <div className="manual-entry-form">
                <div className="scan-cta-header">Enter Code</div>
                <div>
                    <input
                        name="qrCodeText"
                        value={this.state.qrCodeText}
                        onChange={(e) => this.setState({ qrCodeText: e.target.value })}
                    />
                    <button onClick={() => this.processQRBallot(this.state.qrCodeText)}>
                        Process
                    </button>
                </div>
            </div>
        )
    }

    renderContents() {
        const { validationError, isValidating = false } = this.state;
        if (validationError) {
            return this.renderValidationError(validationError)
        }

        if (isValidating) {
            return this.renderValidating();
        }

        return this.renderScanScreen();

    }


    render() {
        return (
            <div className="scan-view">
                {this.renderContents()}
            </div>
        );
    }
}


export default withRouter(Scan);
