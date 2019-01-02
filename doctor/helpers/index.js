const request = require('request');
const _ = require('lodash');

const helper = {
    get_symptoms_ids: function(symptoms, url, callback) {
        request(url, (err, res, body) => {

            if (err) console.log(err);

            const result = JSON.parse(body);

            let ids = [];
            _.forEach(result, (element) => {
                for (var i = 0; i < symptoms.length; i++)
                    if (element.Name.toLowerCase() == symptoms[i].toLowerCase())
                        ids.push(element.ID);
                });
            callback(ids)
        });
    },

    generate_id_string: function (ids) {
        let id_string = '';
            ids.forEach((id, index) => {
              id_string += `\"${id}\"`;
              if (index != ids.length - 1)
                id_string += ', ';
            })
        return id_string;
    },

    get_issue_id: function (issue, url, callback) {
        request(url, (err, res, body) => {
            if (err) console.log(err);
            let id = null;
            const result = JSON.parse(body);
            result.forEach((element) => {
                if (element.Name.toLowerCase() == issue.toLowerCase()) {
                    id = element.ID;
                }
            });
            callback(id);
        });
    },

    get_treatment_info: function (id, url, callback) {
        request(url, (err, res, body) => {
            if (err) console.log(err);
            const result = JSON.parse(body);
            callback(result.TreatmentDescription);
        })
    },

    get_description: function (id, url, callback) {
        request(url, (err, res, body) => {
            if (err) console.log(err);
            const result = JSON.parse(body);
            let message = `${result.Description} \n\nPossible symptoms that accompany this illness are:\n`;

            result.PossibleSymptoms.split(',').forEach((symptom, index) => {
                message += `${index+1}. ${symptom}\n`;
            })

            callback(message);
        })
    }
}

module.exports = helper;
