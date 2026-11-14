function hello(request)
{
    return request
}

const VERB_HELLO = "HELLO";

const handlerMap = {
    [VERB_HELLO]: hello
}

function handle(verb, request)
{
    return handlerMap[verb](request)
}

function send(str)
{
    process.stdout.write(str)
}

module.exports = {
    VERB_HELLO,

    main: function (verb) {
        var request = "REQUEST"
        const requestLength = parseInt(process.env.CONTENT_LENGTH || "0", 10);
        if (requestLength > 0) request = JSON.parse(require('fs').readFileSync(0, 'utf8'));
        const response = handle(verb, request)
        send("Status: 200 OK\r\n")
        send("Content-Type: application/json; charset=utf-8\r\n\r\n")
        send("{ \"responseCode\":\"OK\", \"payload\":\"" + response.replaceAll('"', ' ') + "\" }")
    }
};
