import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseView from '../common/BaseView';
import NowPlayingBottomBar from './NowPlayingBottomBar';
import { AppConsumer } from '../../App';
import RealtimeManager from '../../lib/RealtimeManager';

export default class NowPlayingPageWrapper extends Component {
    static propTypes = {
        eventId: PropTypes.string
    };

    listeners = [];

    state = {
        realtimeEventData: {}
    };

    componentDidMount() {
        const realtimeManager = new RealtimeManager(this.props.eventId);
        this.listeners.push(realtimeManager.on(RealtimeManager.REALTIME_UPDATE, (realtimeEventData) => this.setState({ realtimeEventData })));
        this.setState({
            realtimeEventData: realtimeManager.getDataForType(RealtimeManager.REALTIME_UPDATE)
        })
    }

    componentWillUnmount() {
        const realtimeManager = new RealtimeManager(this.props.eventId);
        this.listeners.forEach((f) => realtimeManager.unsubscribe(f));
    }

    render() {
        const { realtimeEventData } = this.state;
        const { currentlyPlayingBandId = '' } = realtimeEventData;

        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventData: { bands = [] } } = appState;
                    return (
                        <BaseView>
                            {this.props.children}
                            <NowPlayingBottomBar bands={bands} currentBandId={currentlyPlayingBandId}/>
                        </BaseView>
                    );
                }}
            </AppConsumer>
        );
    }
}
