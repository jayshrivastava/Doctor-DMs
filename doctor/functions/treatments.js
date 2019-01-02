// const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const helper = require("../helpers");

const URL_BASE = `${process.env.APIMEDIC_URL}`;
const URL_TOKEN = `token=${process.env.APIMEDIC_TOKEN}&`;
const URL_LANG = `language=en-gb&`;
const URL_FORMAT = `format=json`;
const URL_TYPE = { issues: `issues?`};

/**
* A basic Hello World function
* @param {string} _issue symptom to get treatment data for
* @returns {string}
*/
module.exports = (_issue, context, callback) => {
    let url = `${URL_BASE}${URL_TYPE.issues}${URL_TOKEN}${URL_LANG}${URL_FORMAT}`;
    helper.get_issue_id (_issue, url, id => {
        url = `${URL_BASE}issues/${id}/info?${URL_TOKEN}${URL_LANG}${URL_FORMAT}`;
        helper.get_treatment_info(id, url, info => {
            callback(null, info);
        })
    });
};
