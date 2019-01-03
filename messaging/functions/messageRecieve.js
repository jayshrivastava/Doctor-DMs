const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const _ = require('lodash');

const apiMedicData = require('../data/symptomsAndIllnesses')

function generate_symptom_string(symptoms) {
    let s_string = '';
        symptoms.forEach((sym, index) => {
           s_string += `&_symptoms[]="${sym}"`;
        })
    return s_string;
}

/**
 * @param {string} sender The phone number that sent the text to be handled
 * @param {string} receiver The StdLib phone number that received the SMS
 * @param {string} message The contents of the SMS
 * @param {string} createdDatetime Datetime when the SMS was sent
 * @returns {string}
 */
module.exports = async(sender = '', receiver = '', message = 'diagnose male 18 skin rash, fever', createdDatetime = '', context) => {

    //CHECK QUERY
    var mssg = message.toLowerCase();
    var type_full = mssg.match(/(treatment for|treat|diagnose|describe|illnesses|symptoms)(,*)/i);
    var type;
    
    if (type_full) {

        type = type_full[1];
        mssg = mssg.replace(type_full[0], '').trim();
    } else {
        type = 'Invalid Format';
    }

    switch (type) {

        // -------------
        // DIAGNOSE CASE
        // -------------
        case 'diagnose': {
            console.log('Generating Diagnoses...');

            //PARSE
            var age_full = mssg.match(/(\d+)(,*)/);
            var age = age_full[1];
            mssg = mssg.replace(age_full[0], '').trim();
            // console.log("age: " + age);

            var sex_full = mssg.match(/(male|female|m|f|boy|girl)(,*)/i);
            var sex = sex_full[1];
            mssg = mssg.replace(sex_full[0], '').trim();
            if (sex == 'm' || sex == 'boy') sex = 'male';
            if (sex == 'f' || sex == 'girl') sex = 'female';
            // console.log("sex: " + sex);

            //PARSE
            var symptoms = mssg.split(',').map(symptom => symptom.trim());
            // console.log(symptoms);

            //GET ISSUES FROM DOCTOR API

            let res = await lib.doctordms.doctor['@dev']({
                _sex: sex, // (required)
                _age: age, // (required)
                _symptoms: symptoms // (required)
            });

            // console.log('Diagnoses Received from Doctor: ');
            // console.log(res[0]);

            let message_response = '';

            if (res.length) {

                message_response = `I am ${res[0].Issue.Accuracy}% sure you have ${res[0].Issue.Name}.\n`;

                if (res.length > 1) {

                    message_response += `However, other possible issues worth looking in to are:\n\n`;

                    _.forEach(res, (illness, i) => {
                        if (i > 0) {
                            message_response += `${i}. ${illness.Issue.Name} (${Math.round(Number(illness.Issue.Accuracy)*10)/10}%)\n`;
                        }
                    });
                }
            } else {

                message_response = "We could not find an accurate diagnoses for those symptoms." + 
                "Try using 2-3 symptoms per text and group symptoms by what you think may be related. Eg. 'diagnose female 20 skin rash, fever'.\n\n" + 
                "Rememeber that you can always text us 'symptoms' for a complete list of symptoms"
            }

            console.log('Generated Response: ')
            console.log(message_response);

            let symptoms_string = generate_symptom_string(symptoms);
            const url_age = `?_age=${age}`;
            const url_sex = `&_sex=${sex}`;
            const url_symptoms = `&_symptoms=${encodeURIComponent(JSON.stringify(symptoms_string))}`;
            // const webpage_url = `https://doctordms.lib.id/vue@dev/${url_age}${url_sex}${url_symptoms}`;
            const webpage_url = '';

            //TEXT USER USING MESSAGEBIRD API
            let result = await lib.doctordms.messaging['@dev'].messageSend({
                number: sender,
                message: `${message_response}` //  \nTake a closer look here: ${webpage_url}`
            });

            // console.log(result);
        
            break;

        }
        // ----------
        // TREAT CASE
        // ----------
        case 'treatment for':
        case 'treat': {
            console.log('Generating Treatment Response...');

            //PARSE
            var issue = mssg;

           // GET TREATMENT FROM DOCTOR API
            let message_response = await lib.doctordms.doctor['@dev'].treatments({
                _issue: issue, // (required)
            });

            message_response = message_response === 'None' ? 'That illness does not exist in our database. ' + 
                "Any illness returned by our 'diagnose' operation is valid.\n\n" + 
                "Remember that you can always text 'illnesses' for a compelete list of illnesses" : message_response;

            // SEND DIAGNOSES USING MESSAGEBIRD APIs
            let result = await lib.doctordms.messaging['@dev'].messageSend({
                number: sender,
                message: message_response
            });

            // console.log(result);
            break;
        }
        // -------------
        // DESCRIBE CASE
        // -------------
        case 'describe': {
            console.log('Generating Describe Response...');

            //PARSE
            var issue = mssg;
            // console.log(issue);

            // GET TREATMENT FROM DOCTOR API
            let message_response = await lib.doctordms.doctor['@dev'].describe({
                _issue: issue, // (required)
            });

            message_response = message_response === 'None' ? 'That illness does not exist in our database. ' + 
                "Any illness returned by our 'diagnose' operation is valid.\n\n" + 
                "Remember that you can always text 'illnesses' for a compelete list of illnesses" : message_response;

            // console.log(message_response);

            //SEND DIAGNOSES USING MESSAGEBIRD APIs
            let result = await lib.doctordms.messaging['@dev'].messageSend({
                number: sender,
                message: message_response
            });

            break;
        }
        case "illnesses": {

            var data = await apiMedicData();
            
            var message = '';

            _.forEach(data.illnesses, (illness) => {
                message += illness.Name + ', ';
            });
            message = message.slice(0, -2);
            
            let result = await lib.doctordms.messaging['@dev'].messageSend({
                number: sender,
                message: message
            }); 

            break;
        }
        case "symptoms": {

            var data = await apiMedicData();
            
            var message = '';

            _.forEach(data.symptoms, (symptom) => {
                message += symptom.Name + ', ';
            });
            message = message.slice(0, -2);
            
            let result = await lib.doctordms.messaging['@dev'].messageSend({
                number: sender,
                message: message
            }); 

            break;
        }
        default: {

            var message = "Welcome to Doctor DMs. Let's get started\n\n" + 
                "We support 3 functions: \n\n" + 
                " - diagnose {AGE} {SEX} {SYMPTOM1}, {SYMPTOM2}...\n" + 
                " - treat {ILLNESS}\n" + 
                " - describe {ILLNESS}\n\n" + 
                "For example, try texting 'diagnose male 18 cough, sneezing' or 'treat reflux disease'\n\n" + 
                "For a list of illnesses, text us 'illnesses'\n" + 
                "For a list of symptoms, text us 'symptoms'\n" + 
                "Note: We are currently using sandbox data, so the data available may be limited\n\n" + 
                "Thanks for using Doctor DMs!"

            let result = await lib.doctordms.messaging['@dev'].messageSend({
                number: sender,
                message: message
            });
        }
    }

    return '200';
};
