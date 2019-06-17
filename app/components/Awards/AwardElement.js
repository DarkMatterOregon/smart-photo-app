import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Mutation } from 'react-apollo';
import { Text, View, FlatList, Alert } from 'react-native';
import { Button } from '../common';
import hexToRgba from 'hex-to-rgba';
import checked from '../../image/icons/check-square-o.png';
import { dark, light, secondary, extraLight } from '../../colors';
import { voteForElementAward } from '../../../shared/queries';
import { AppConsumer } from '../../App';

const vowels = ['a', 'e', 'i', 'o', 'u'];

export default class AwardPopup extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        element: PropTypes.object,
    };

    static defaultProps = {
        visible: false
    };

    onAwardConfirm = (awardParams, vote) => () => {
        const { nameOfAward, awardToName, awardId, elementId, eventId } = awardParams;

        Alert.alert(nameOfAward, `Award ${awardToName} the ${nameOfAward}?`, [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Cast Vote',
                onPress: () => vote({ variables: { input: { awardId, elementId, eventId } } })
            }
        ]);

        // TODO: Some kind of user feedback would be nice, maybe just a toast that says "Awarded the band ..."
    };

    renderAwardButton = (award, elementId, eventId, awardToName) => {
        const { awardId, name: nameOfAward } = award;
        //<Image source={checked}/>
        return (
            <View key={awardId} style={styles.awardButtonSpacer}>
                <Mutation mutation={voteForElementAward} errorPolicy="all">
                    {(vote, { data, loading, error }) => {
                        if (loading) {
                            return (
                                <View style={styles.voteFeedBack}>
                                    <Text style={styles.voteFeedBackText}>Casting Vote ...</Text>
                                </View>
                            );
                        }

                        if (error) {
                            const errorMessage = _.get(
                                error,
                                'graphQLErrors[0].message',
                                'Unable to cast vote. Please try again later.'
                            );
                            return (
                                <View style={styles.voteFeedBack}>
                                    <Text style={styles.voteFeedBackText}>
                                        {errorMessage || 'Unable to cast vote, please try again later'}
                                    </Text>
                                </View>
                            );
                        }

                        if (data) {
                            return (
                                <View style={styles.voteFeedBack}>
                                    <Text style={styles.voteFeedBackText}>Done!</Text>
                                </View>
                            );
                        }

                        const awardParams = {
                            nameOfAward,
                            awardToName,
                            awardId,
                            elementId,
                            eventId
                        };

                        return (
                            <Button buttonType={Button.INVERSE} onPress={this.onAwardConfirm(awardParams, vote)}>
                                {nameOfAward}
                            </Button>
                        );
                    }}
                </Mutation>
            </View>
        );
    };

    renderHeader(kindOfAward, nameOfElement) {
        const a = vowels.indexOf(kindOfAward.charAt(0).toLowerCase()) === -1 ? 'a' : 'an';

        return (
            <View style={styles.awardingHeader}>
                <Text style={styles.awardingHeaderText}>
                    Choose {a} {kindOfAward} award for
                </Text>
                <Text style={styles.awardingBandText}>{nameOfElement}</Text>
            </View>
        );
    }

    render() {
        const { element } = this.props;
        const { elementType = '', name: nameOfElement = '', elementId } = element;
        const kindOfAward = elementType === 'musician' ? 'artist' : elementType.toLowerCase();

        return (
            <AppConsumer>
                {({ appState }) => {
                    const { eventId, eventData: { awards = [] } } = appState;
                    const awardsForElementType = (awards || [])
                        .filter(({ awardCategories = [] }) => awardCategories.indexOf(kindOfAward) > -1);

                    return (
                        <View style={styles.container}>
                            <View style={styles.awardButtonContainer}>
                                <FlatList
                                    data={awardsForElementType}
                                    renderItem={({ item: award }) =>
                                        this.renderAwardButton(award, elementId, eventId, nameOfElement)
                                    }
                                    ListHeaderComponent={() => this.renderHeader(kindOfAward, nameOfElement)}
                                    stickyHeaderIndices={[0]}
                                    keyExtractor={({ awardId }) => awardId.toString()}
                                />
                            </View>
                        </View>
                    );
                }}
            </AppConsumer>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: dark,
        justifyContent: 'center'
    },
    awardingHeader: {
        backgroundColor: secondary,
        justifyContent: 'space-evenly'
    },
    awardingHeaderText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: light,
        fontSize: 20,
        paddingTop: 10
    },
    awardingBandText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: extraLight,
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    awardButtonContainer: {},
    awardButtonSpacer: {
        marginTop: 10,
        marginBottom: 10
    },
    voteFeedBack: {
        margin: 10,
        padding: 10
    },
    voteFeedBackText: {
        color: light,
        fontSize: 20
    }
};
