const fs = require('fs');
const DIR_ACCOUNTS = "accounts"

// *** Hello ***
function hello(request)
{
    return "Hello, Spheem!"
}

// *** Create Account ***
function createAccount(request)
{
    const username = request.username || "USERNAME"
    const password = request.password || "PASSWORD"
    const filename = DIR_ACCOUNTS + "/" + username
    if (!fs.existsSync(DIR_ACCOUNTS)) fs.mkdirSync(DIR_ACCOUNTS)
    if (fs.existsSync(filename)) return "Account already exists!"
    try { fs.writeFileSync(filename, password) }
    catch (err) { return "Failed! " + err }
    return "Success!"
}

// *** Login ***
function login(request)
{
    const username = request.username || "USERNAME"
    const password = request.password || "PASSWORD"
    const filename = DIR_ACCOUNTS + "/" + username
    if (!fs.existsSync(filename)) return "Account does not exist!"
    const actualPassword = fs.readFileSync(filename, 'utf8')
    if (password != actualPassword) return "Incorrect password!"
    return "Success!"
}

// *** Pay ***
function pay(request)
{
    return "username:" + request.username + ", password:" + request.password
}

const VERB_HELLO = "HELLO"
const VERB_CREATEACCOUNT = "CREATEACCOUNT"
const VERB_LOGIN = "LOGIN"
const VERB_PAY = "PAY"

const handlerMap = {
    [VERB_HELLO]: hello,
    [VERB_CREATEACCOUNT]: createAccount,
    [VERB_LOGIN]: login,
    [VERB_PAY]: pay
}

module.exports = {
    VERB_HELLO,
    VERB_CREATEACCOUNT,
    VERB_LOGIN,
    VERB_PAY,

    main: function (verb) {
        var request = "REQUEST"
        if (parseInt(process.env.CONTENT_LENGTH || "0") > 0) request = JSON.parse(fs.readFileSync(0, 'utf8'))
        const response = handlerMap[verb](request)
        process.stdout.write("Status: 200 OK\r\nContent-Type: application/json; charset=utf-8\r\n\r\n")
        process.stdout.write("{ \"responseCode\":\"OK\", \"payload\":\"" + response + "\" }")
    }
};
