# Spheem-API

API for Spheem, a toy centralized digital (non crypto) currency system.

## Endpoints
Each endpoint script can also be exeucted locally via the command line. Execution examples have been provided for each.

### Hello
Bare minimum endpoint for testing.<br>
https://meowcle.net/cgi-bin/Spheem-API/endpoints/hello.js

Parameters
```
(None)
```

Local Execution
```
./hello.js '{ }'
```
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Status: 200 OK
Content-Type: application/json; charset=utf-8

{"result":"OK","payload":"Hello, Spheem!"}   
```

## Related Repos
Spheem Frontend: https://github.com/MichaelPineapple/Spheem
SpheemBot: https://github.com/MichaelPineapple/SpheemBot
