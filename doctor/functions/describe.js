const helper = require("../helpers");

const URL_BASE = `${process.env.APIMEDIC_URL}`;
const URL_LANG = `language=en-gb&`;
const URL_FORMAT = `format=json`;
const URL_TYPE = { issues: `issues?`};

/**
* A basic Hello World function
* @param {string} _issue symptom to get treatment data for
* @returns {string}
*/
module.exports = (_issue, context, callback) => {

    helper.fetch_api_medic_token().then((URL_TOKEN) => {

        URL_TOKEN = `token=${URL_TOKEN}&`;

        let url = `${URL_BASE}${URL_TYPE.issues}${URL_TOKEN}${URL_LANG}${URL_FORMAT}`;
        
        helper.get_issue_id (_issue, url, id => {
            url = `${URL_BASE}issues/${id}/info?${URL_TOKEN}${URL_LANG}${URL_FORMAT}`;
            helper.get_description(id, url, info => {
                callback(null, info);
            })
        });
    });
};
