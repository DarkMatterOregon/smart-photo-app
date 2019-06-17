import React, { Component } from 'react';
import fanosityLogo from './fanosity-full-logo.svg';
import googlePlay from './google-play.png';
import appStore from './app-store.png';
// import comingSoon from './coming-soon.png';

import './home.scss';

const APP_STORE = 'https://itunes.apple.com/us/app/fanosity/id972417667?mt=8';
const GOOGLE_PLAY = 'https://play.google.com/store/apps/details?id=com.fanosity';

export default class Home extends Component {
    render() {
        return (
            <div id="home-lander">
                <div className="headline-section">
                    <img src={fanosityLogo} className="full-logo"/>
                    <h1>The App for the Show</h1>
                </div>
                <div className="app-download-links">
                    <div className="download-link">
                        <a href={GOOGLE_PLAY}>
                            <img src={googlePlay} className="swap-on-hover__front-image" />
                        </a>
                    </div>
                    <div className="download-link">
                        <a href={APP_STORE}>
                            <img src={appStore} className="swap-on-hover__front-image" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

/*
For Flipping On Hover:
<figure className="swap-on-hover">
    <img src={appStore} className="swap-on-hover__front-image" />
    <img src={comingSoon} className="swap-on-hover__back-image" />
</figure>
 */
