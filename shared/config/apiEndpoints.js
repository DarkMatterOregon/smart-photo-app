import axios from 'axios';

// export const API_BASE = 'http://localhost:3000';
// export const API_BASE = 'http://192.168.86.32:3000';
export const API_BASE = 'https://dev-next-api.fanosity.com';

export const FANOSITY_GRAPHQL_URL = `${API_BASE}/graphql`;
export const FANOSITY_AUTH_URL = `${API_BASE}/account`;

// Used for printing tickets
export const LOCAL_BOOTH_CONTROL_API = 'http://localhost:3001/api';

const API_JSON = 'https://www.fanosity.com/api.json';
let apiBase = 'https://dev-next-api.fanosity.com';

export default class ApiEndpoints {
    static async loadApiEndpoints() {
        try {
            const settings = await axios.get(API_JSON);
            apiBase = settings.data.apiBase;
        } catch(e) {
            console.log('Error loading settings', e);
        }

        return {
            authUrl: ApiEndpoints.getAuthUrl(),
            graphQlUrl: ApiEndpoints.getGraphQlUrl()
        };

    }

    static getGraphQlUrl() {
        return `${apiBase}/graphql`;
    }

    static getAuthUrl() {
        return `${API_BASE}/account`;
    }

    static getBoothControlsUrl() {
        return LOCAL_BOOTH_CONTROL_API;
    }
}
