# API Documentation

messageRecieve
--------------
url:      https://doctordms.lib.id/messaging@dev/messageRecieve/  
code:     lib.doctordms.messaging['@dev'].messageRecieve()  
shell:    lib doctordms.messaging[@dev].messageRecieve  
context:  (enabled)  
bg:       info  

  @param {string} sender The phone number that sent the text to be handled  
  @param {string} receiver The StdLib phone number that received the SMS  
  @param {string} message The contents of the SMS  
  @param {string} createdDatetime Datetime when the SMS was sent  
  @returns {string}  

messageSend
-----------
url:      https://doctordms.lib.id/messaging@dev/messageSend/  
code:     lib.doctordms.messaging['@dev'].messageSend()  
shell:    lib doctordms.messaging[@dev].messageSend  
context:  (enabled)  
bg:       info  

  Message Send  
  @param {string} number Phone number  
  @param {string} message The contents of the SMS  
  @returns {string}  

This file should contain documentation introducing your API to **end-users**.
It will display on your service's [Standard Library](https://stdlib.com/)
documentation page if you choose to publish it.

Usage examples and additional information around calling your API belong here.