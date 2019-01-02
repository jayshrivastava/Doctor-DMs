const lib = require('lib');
const sms = lib.utils.sms['@1.0.9'];

/**
* Message Send
* @param {string} number Phone number
* @param {string} message The contents of the SMS
* @returns {string}
*/

module.exports = async (number = '', message = '', context) => {

    let result = await sms({
      to: number,
      body: message
    });

  return `A message was sent to ${number} with body ${message}`;

};
