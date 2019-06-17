import gql from 'graphql-tag';

export const voteSummaryReport = gql`
    query getVoteSummariesForEvent($eventId: String!)
    {
        summary: getVoteSummariesForEvent(eventId: $eventId) {
            awardId
            award {
                name
                awardCategories
                description
            }
            details {
                elementId
                elementType
                voteCount
                element {
                    ... on Band {
                        name
                        primaryImage(maxWidth: 200) {
                            url
                        }
                    }

                    ... on Musician {
                        name
                        primaryImage(maxWidth: 200) {
                            url
                        }
                    }
                }
            }
        }
    }
`;
