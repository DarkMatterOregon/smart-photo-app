import gql from 'graphql-tag';

export const musiciansByEventIdQuery = gql`    
    query musicians($eventId: String!) {
        musicians: getMusiciansByEvent(eventId: $eventId) {
            name
            lastName
            firstName
            musicianId
            description
            primaryImage(aspectRatio: "1x1", maxWidth:50) {
                url
            }
        }
    }
`;

export const musicianQuery = gql`
    query musicianQuery($eventId: String!, $musicianId: String!) {
        musician: getMusician(eventId: $eventId, musicianId: $musicianId) {
            name
            lastName
            firstName
            musicianId
            description
            primaryImage(aspectRatio: "1x1", maxWidth:100) {
                url
            }
            sourceImageAlbums {
                name
                sourceImages {
                    url
                    bucket
                    key
                    elementId
                    elementType
                    album
                }
                processedImages {
                    aspectRatio
                    url
                }
            }
        }
    }
`;
