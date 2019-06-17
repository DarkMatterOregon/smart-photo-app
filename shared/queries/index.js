import gql from 'graphql-tag';

export const getCurrentEventsQuery = gql`
    query getCurrentEvents {
        currentEvents: getCurrentEvents {
            name
            eventId
        }
    }
`;

export const fetchAllQuery = gql`
    query getEventData(
        $eventId: String!,
        $eventImageWidthPixels: Int,
        $bandImageWidthPixels: Int,
        $bandNowPlayingImageWidthPixels: Int,
        $musicianImageWidthPixels: Int,
        $musicianBandImageWidthPixels: Int
    ) {
        event: getEvent(eventId: $eventId) {
            name
            eventType
            primaryImage(aspectRatio: "16x9", maxWidth: $eventImageWidthPixels) {
                url
            }
        }
        bands: getBandsByEvent(eventId: $eventId) {
            name
            bandId
            elementType
            elementId: bandId
            primaryImage(aspectRatio: "16x9", maxWidth: $bandImageWidthPixels) {
                url
            }
            nowPlayingImage: primaryImage(aspectRatio: "1x1", maxWidth: $bandNowPlayingImageWidthPixels) {
                url
            }
            musicians {
                musicianId
            }
        }
        artists: getMusiciansByEvent(eventId: $eventId) {
            name
            musicianId
            description
            elementId: musicianId
            elementType
            talents
            bandRoles
            primaryImage(aspectRatio: "1x1", maxWidth: $musicianImageWidthPixels) {
                url
            }
            bandProfileImage: primaryImage(aspectRatio: "1x1", maxWidth: $musicianBandImageWidthPixels) {
                url
            }
        }
        awards: getAwardsByEvent(eventId: $eventId) {
            awardId
            elementType
            awardCategories
            description
            name
        }
    }
`;

export const voteForElementAward = gql`
    mutation voteForElementAward($input: VoteInput!) {
        voteForElement(voteInput: $input) {
            voteId
            awardId
        }
    }
`;
