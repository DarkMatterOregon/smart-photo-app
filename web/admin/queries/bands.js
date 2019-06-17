import gql from 'graphql-tag';

export const bandsByEventIdQuery = gql`    
    query bands($eventId: String!) {
        bands: getBandsByEvent(eventId: $eventId) {
            name
            bandId
            primaryImage(aspectRatio: "1x1", maxWidth:50) {
                url
            }
        }
    }
`;

export const bandQuery = gql`    
    query bandQuery($eventId: String!, $bandId: String!) {
        band: getBand(eventId: $eventId, bandId: $bandId) {
            name
            primaryImage(aspectRatio: "1x1", maxWidth: 100) {
                url
            }
            bandId
            producers {
                name
                producerId
                description
            }
            musicians {
                name
                firstName
                lastName
                musicianId
                primaryImage(aspectRatio: "1x1", maxWidth: 100) {
                    url
                }
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
            },
            aspect1x1: primaryImage(aspectRatio: "1x1", maxWidth: 200) {
                url
            },
            aspect5x2: primaryImage(aspectRatio: "5x2", maxWidth: 200) {
                url
            },
            aspect16x9: primaryImage(aspectRatio: "16x9", maxWidth: 200) {
                url
            }
        }
    }
`;
