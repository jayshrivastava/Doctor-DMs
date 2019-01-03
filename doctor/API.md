# API Documentation

(default function)
------------------
url:      https://doctordms.lib.id/doctor@dev/  
code:     lib.doctordms.doctor['@dev']()  
shell:    lib doctordms.doctor[@dev]  
context:  (enabled)  
bg:       info  

  MAIN Gets Complete Diagnoses Information  
  @param {string} _sex Sex of the patient  
  @param {string} _age Age of the patient  
  @param {array} _symptoms Symptoms of the patient  
  @returns {array}  

describe
--------
url:      https://doctordms.lib.id/doctor@dev/describe/  
code:     lib.doctordms.doctor['@dev'].describe()  
shell:    lib doctordms.doctor[@dev].describe  
context:  (enabled)  
bg:       info  

  A basic Hello World function  
  @param {string} _issue symptom to get treatment data for  
  @returns {string}  

treatments
----------
url:      https://doctordms.lib.id/doctor@dev/treatments/  
code:     lib.doctordms.doctor['@dev'].treatments()  
shell:    lib doctordms.doctor[@dev].treatments  
context:  (enabled)  
bg:       info  

This file should contain documentation introducing your API to **end-users**.
It will display on your service's [Standard Library](https://stdlib.com/)
documentation page if you choose to publish it.

Usage examples and additional information around calling your API belong here.