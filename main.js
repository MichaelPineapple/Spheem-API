function hello(request)
{
    return "Hello, Spheem!"
}

function login(request)
{
    return "username:" + request.username + ", password:" + request.password
}

const VERB_HELLO = "HELLO";
const VERB_LOGIN = "LOGIN";

const handlerMap = {
    [VERB_HELLO]: hello,
    [VERB_LOGIN]: login
}

function handle(verb, request)
{
    return handlerMap[verb](request)
}

module.exports = {
    VERB_HELLO,
    VERB_LOGIN,

    main: function (verb) {
        var request = "REQUEST"
        if (parseInt(process.env.CONTENT_LENGTH || "0") > 0) request = JSON.parse(require('fs').readFileSync(0, 'utf8'));
        const response = handle(verb, request)
        process.stdout.write("Status: 200 OK\r\nContent-Type: application/json; charset=utf-8\r\n\r\n")
        process.stdout.write("{ \"responseCode\":\"OK\", \"payload\":\"" + response + "\" }")
    }
};
