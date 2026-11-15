# SpheemAPI

API for Spheem, a toy centralized digital (non crypto) currency system. <br>
Frontend website: https://meowcle.net/Spheem

## Endpoints
```
HELLO (Bare minimum endpoint for testing.)
https://meowcle.net/cgi-bin/Spheem-API/endpoints/hello.js
Parameters: N/A

CREATE_ACCOUNT (Create a new Spheem account.)
https://meowcle.net/cgi-bin/Spheem-API/endpoints/create.js
Parameters: username, password

DELETE_ACCOUNT (Delete a Spheem account.)
https://meowcle.net/cgi-bin/Spheem-API/endpoints/delete.js
Parameters: username, password

LOGIN (Login to Spheem account. Account balance provided in response payload.)
https://meowcle.net/cgi-bin/Spheem-API/endpoints/login.js
Parameters: username, password

PAY (Transfer funds from the sender account to the recipient account.)
https://meowcle.net/cgi-bin/Spheem-API/endpoints/pay.js
Parameters: username, password, recipient, amount
```

## Example API Call
Request Body
```
{ "username": "meowcle", "password": "abc" }
```
Response Body
```
{ "result": "OK", "payload": "1000" }
```

## Local Execution Example
Command
```
./login.js '{ "username":"meowcle", "password":"abc" }'
```
Output
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Status: 200 OK
Content-Type: application/json; charset=utf-8

{"result":"OK","payload":"1000"}   
```

## Related Repos
Spheem Frontend: https://github.com/MichaelPineapple/Spheem <br>
SpheemBot: https://github.com/MichaelPineapple/SpheemBot
