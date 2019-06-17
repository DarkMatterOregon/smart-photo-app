import _ from 'lodash';

export const getConfigSetting = (setting) => {
    if (ENV_CONFIGURATION) {
        return _.get(ENV_CONFIGURATION, setting, '');
    }
    return '';
};

export const formatApiPayloadForReducer = (payload, single = false) => {
    let data = (_.has(payload, 'data')) ? payload.data : payload;

    if (_.has(payload, 'items')) {
        data = _.get(payload, 'items', []);

        if (single) {
            data = _.first(data);
        }
    }

    return {
        data,
        lastFetch: new Date().getTime(),
        paging: _.get(payload, 'paging', {}),
        summary: _.get(payload, 'summary', {}),
    };
};
