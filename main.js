function hello(request)
{
    return "Hello, Spheem!"
}

const VERB_HELLO = "HELLO";

const handlerMap = {
    [VERB_HELLO]: hello
}

function handle(verb, request)
{
    return handlerMap[verb](request)
}

module.exports = {
    VERB_HELLO,

    main: function (verb) {
        var request = "REQUEST"
        if (parseInt(process.env.CONTENT_LENGTH || "0") > 0) request = JSON.parse(require('fs').readFileSync(0, 'utf8'));
        const response = handle(verb, request)
        process.stdout.write("Status: 200 OK\r\nContent-Type: application/json; charset=utf-8\r\n\r\n")
        process.stdout.write("{ \"responseCode\":\"OK\", \"payload\":\"" + response + "\" }")
    }
};
