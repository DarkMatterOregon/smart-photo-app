import gql from 'graphql-tag';

export default gql`
    loginWithEmailPassword(email: $email, password: $password) {
        tokenType
        accessToken
        refreshToken
        expiresIn
    }
`;
