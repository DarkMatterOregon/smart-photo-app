import gql from 'graphql-tag';

export const realtimeQuery = gql`
    query realtimeData($eventId: String!) {
        getRealtimeDataByEvent(eventId: $eventId) {
            name
            value
        }
    }
`;

export const setCurrentlyPlayingBandMutation = gql`
    mutation setCurrentlyPlayingBandMutation($eventId: String!, $bandId: String!) {
        currentlyPlayingBand: setCurrentlyPlayingBand(eventId: $eventId, bandId: $bandId) {
            name
            value
        }
    }
`;
