import gql from 'graphql-tag';

export const currentEventsQuery = gql`    
    query currentEvents {
        events: getCurrentEvents {
            name
            eventId
            description
            eventType
            eventStart
            eventEnd
        }
    }
`;

export const currentEventQuery = gql`    
    query eventQuery($eventId: String!) {
        event: getEvent(eventId: $eventId) {
            name
            description
            eventType
            eventStart
            eventEnd
            primaryImage(aspectRatio: "1x1", maxWidth:100) {
                url
            }
            eventId
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
