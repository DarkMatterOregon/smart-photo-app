import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    ActivityIndicator,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Actions } from 'react-native-router-flux';
import { Query } from 'react-apollo';
import { Button } from './common';
import Loading from './Loading';
import { guardian } from '../../shared/AuthGuard';
import { AppConsumer } from '../App';
import { getCurrentEventsQuery } from '../../shared/queries';

import { dark, light, highlight, success } from '../colors';

const TEST_EUGENE_MAB = 'event_2019_eugene-make-a-band_26426992282555_06a96c48c88c4396';
const TEST_BEND_MAB = 'event_2015_bend-make-a-band_264269456487494654_7d5c5f0a28feb98b';

// QR Scan mode
const MODE_SCAN = 'MODE_SCAN';
const MODE_MANUAL = 'MODE_MANUAL';

export default class LoginWithQrCode extends Component {
    state = {
        scanMode: MODE_SCAN,
        enteredCode: '',
        loading: false,
        eventId: ''
    };

    scannedQrCode = changeEventId => e => {
        this.setState({ loading: true });
        const eventIdParts = e.data.split('_');
        let eventId;

        if (eventIdParts.length === 5) {
            eventId = `${eventIdParts[0]}_${eventIdParts[1]}_${eventIdParts[2]}`;
        }

        guardian
            .loginBallotQrCode(e.data)
            .then(() => {
                changeEventId(eventId, () => {
                    Actions.main();
                });
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
                Alert.alert('Unable to validate ballot', err.message);
            });
    };

    loginWithCode = (changeEventId) => () => {
        this.setState({ loading: true });
        const { enteredCode, eventId } = this.state;
        guardian
            .loginBallotEventIdAndCode(eventId, enteredCode)
            .then(() => {
                changeEventId(eventId, () => {
                    Actions.main();
                });
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
                Alert.alert('Unable to validate code', err.message);
            });
    };

    renderScanner(changeEventId) {
        return (
            <QRCodeScanner
                showMarker
                onRead={this.scannedQrCode(changeEventId)}
                topViewStyle={styles.topView}
                topContent={<Text style={styles.topViewText}>Scan your Fanosity Ballot</Text>}
                bottomViewStyle={styles.bottomView}
                bottomContent={<Button onPress={() => this.setState({ scanMode: MODE_MANUAL })}>Manual Entry</Button>}
            />
        );
    }

    renderManualInput(changeEventId) {
        return (
            <View style={styles.manualEntryContainer}>
                <View>
                    <Query
                        query={getCurrentEventsQuery}
                        onCompleted={({ currentEvents }) => {
                            if (currentEvents.length) {
                                this.state.eventId = currentEvents[0].eventId
                            }
                        }}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <ActivityIndicator size="small" color={highlight } style={{ paddingBottom: 10 }} />;
                            }

                            if (error) {
                                return;
                            }

                            return data.currentEvents.map(({ eventId, name }) => {

                                let buttonBackground = dark;
                                if (this.state.eventId === eventId) {
                                    buttonBackground = success;
                                }

                                return (
                                    <Button
                                        key={eventId}
                                        buttonStyleOverwrite={[styles.eventName, { backgroundColor: buttonBackground }]}
                                        onPress={() => {
                                            this.setState({ eventId })
                                        }}
                                    >
                                        {name}
                                    </Button>
                                );
                            }
                        );
                        }}
                    </Query>
                </View>
                <TextInput
                    style={styles.manualEntryTextInput}
                    onChangeText={enteredCode => this.setState({ enteredCode })}
                    value={this.state.enteredCode}
                />
                <Button
                    buttonType={Button.INVERSE}
                    onPress={this.loginWithCode(changeEventId)}
                    buttonStyleOverwrite={styles.manualButtonSpacing}
                >
                    Sign in with code
                </Button>
                <Button
                    onPress={() => this.setState({ scanMode: MODE_SCAN })}
                    buttonStyleOverwrite={styles.manualButtonSpacing}
                >
                    Back to Scanner
                </Button>
            </View>
        );
    }

    render() {
        const { scanMode = MODE_SCAN, loading } = this.state;

        if (loading) {
            return <Loading loadingText="Validation Ballot ..." />;
        }

        return (
            <View style={styles.scanView}>
                <AppConsumer>
                    {({ changeEventId }) => {
                        if (scanMode === MODE_MANUAL) {
                            return this.renderManualInput(changeEventId);
                        }

                        return this.renderScanner(changeEventId);
                    }}
                </AppConsumer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scanView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    topView: {
        flex: 1,
        backgroundColor: dark,
        zIndex: 1000,
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        flexWrap: 'wrap'
    },
    topViewText: {
        fontSize: 24,
        padding: 32,
        color: light,
        textAlign: 'center',
        flexWrap: 'wrap',
        zIndex: 1005
    },
    bottomView: {
        flex: 1,
        backgroundColor: dark,
        paddingLeft: 20,
        paddingRight: 20
    },
    textBold: {
        fontWeight: '500'
    },

    buttonText: {
        fontSize: 21,
        color: highlight
    },
    buttonTouchable: {
        padding: 16,
        backgroundColor: dark,
        borderColor: highlight,
        borderWidth: 1,
        borderRadius: 10
    },
    manualEntryTextInput: {
        height: 60,
        backgroundColor: light,
        borderWidth: 1,
        borderColor: highlight,
        borderStyle: 'solid',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 40
    },
    manualEntryContainer: {
        margin: 20
    },
    manualButtonSpacing: {
        marginBottom: 10
    },
    eventName: {
        marginBottom: 10
    }
});
