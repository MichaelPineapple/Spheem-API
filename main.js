const FS = require('fs')
const CRYPTO = require('crypto')
const DIR_DATA = "../../../data/spheem/"
const DIR_ACCOUNTS = DIR_DATA + "accounts/"
const FILE_TRANSACTIONS = DIR_DATA + "transactions"
const RC_OK = "OK"
const RC_FAIL = "FAIL"

function sha256(password)
{
    return CRYPTO.createHash('sha256').update(password).digest('hex')
}

function validatePassword(account, password)
{
    return (sha256(password) == account.passwordHash)
}

function validateUsername(username)
{
    return /^[a-zA-Z0-9]+$/.test(username)
}

// *** Hello ***
function hello(request)
{
    return [RC_OK, "Hello, Spheem!"]
}

// *** Create Account ***
function createAccount(request)
{
    // Get request parameters
    const username = request.username
    const password = request.password
    
    // Validate request parameters
    if (username == null || !validateUsername(username)) return [RC_FAIL, "Invalid username!"]
    if (password == null) return [RC_FAIL, "Invalid password!"]

    // Construct account filename
    const filename = DIR_ACCOUNTS + username
        
    // Validate account does not already exist
    if (FS.existsSync(filename)) return [RC_FAIL, "Account already exists!"]
    
    // Create data directory if does not already exist
    if (!FS.existsSync(DIR_ACCOUNTS)) FS.mkdirSync(DIR_ACCOUNTS, { recursive: true })
        
    try
    {
        // Construct new account data
        const passwordHash = sha256(password)
        const account = { passwordHash:passwordHash, balance:0 }
        
        // Write account data to file
        FS.writeFileSync(filename, JSON.stringify(account))
        
        // Return success
        return [RC_OK, ""]
    }
    catch (err) { return [RC_FAIL, err] }
}

// *** Login ***
function login(request)
{
    // Get request parameters
    const username = request.username
    const password = request.password
    
    // Validate request parameters
    if (username == null || !validateUsername(username)) return [RC_FAIL, "Invalid username!"]
    if (password == null) return [RC_FAIL, "Invalid password!"]

    // Construct account filename
    const filename = DIR_ACCOUNTS + username
    
    // Validate account exists
    if (!FS.existsSync(filename)) return [RC_FAIL, "Account does not exist!"]
        
    try
    {
        // Read account data
        const account = JSON.parse(FS.readFileSync(filename, 'utf8'))
        
        // Validate password
        if (!validatePassword(account, password)) return [RC_FAIL, "Incorrect password!"]

        // Return account balance
        return [RC_OK, account.balance]
    }
    catch (err) { return [RC_FAIL, err] }
}

// *** Pay ***
function pay(request)
{
    // Get request parameters
    const username = request.username
    const password = request.password
    const recipient = request.recipient
    const amountStr = request.amount
        
    // Validate request parameters
    if (username == null || !validateUsername(username)) return [RC_FAIL, "Invalid username!"]
    if (recipient == null || !validateUsername(recipient)) return [RC_FAIL, "Invalid recipient!"]
    if (password == null) return [RC_FAIL, "Invalid password!"]
    if (amountStr == null) return [RC_FAIL, "Invalid amount!"]
        
    // Parse amount value
    var amount = 0
    try { amount = parseInt(amountStr) }
    catch (err) { return [RC_FAIL, "Invalid amount!"] }
    
    // Validate amount greater than zero
    if (amount <= 0) return [RC_FAIL, "Invalid amount!"]
    
    // Validate sender and recipient are not the same
    if (username == recipient) return [RC_FAIL, "Sender and recipient cannot be the same!"]
    
    // Construct account filenames
    const filenameSender = DIR_ACCOUNTS + username
    const filenameRecipient = DIR_ACCOUNTS + recipient
    
    // Validate accounts exist
    if (!FS.existsSync(filenameSender)) return [RC_FAIL, "Sender account does not exist!"]
    if (!FS.existsSync(filenameRecipient)) return [RC_FAIL, "Recipient account does not exist!"]
     
    try
    {
        // Read accounts data
        const accountSender = JSON.parse(FS.readFileSync(filenameSender, 'utf8'))
        const accountRecipient = JSON.parse(FS.readFileSync(filenameRecipient, 'utf8'))
        
        // Validate sender password
        if (!validatePassword(accountSender, password)) return [RC_FAIL, "Incorrect password!"]

        // Validate sender balance
        if (amount > accountSender.balance) return [RC_FAIL, "Insufficient balance!"]
            
        // Execute transaction
        accountSender.balance -= amount
        accountRecipient.balance += amount
            
        // Write accounts data
        FS.writeFileSync(filenameSender, JSON.stringify(accountSender))
        FS.writeFileSync(filenameRecipient, JSON.stringify(accountRecipient))
            
        // Log transaction
        if (!FS.existsSync(FILE_TRANSACTIONS)) FS.writeFileSync(FILE_TRANSACTIONS, "")
        const trans = username + " -> " + recipient + " (" + amount + ")"
        FS.appendFileSync(FILE_TRANSACTIONS, trans + "\n")
        
        return [RC_OK, ""]
    }
    catch (err) { return [RC_FAIL, err] }
}

// *** Delete Account ***
function deleteAccount(request)
{
    // Get request parameters
    const username = request.username
    const password = request.password
    
    // Validate request parameters
    if (username == null || !validateUsername(username)) return [RC_FAIL, "Invalid username!"]
    if (password == null) return [RC_FAIL, "Invalid password!"]

    // Construct account filename
    const filename = DIR_ACCOUNTS + username
    
    // Validate account exists
    if (!FS.existsSync(filename)) return [RC_FAIL, "Account does not exist!"]
        
    try
    {
        // Read account data
        const account = JSON.parse(FS.readFileSync(filename, 'utf8'))
        
        // Validate password
        if (!validatePassword(account, password)) return [RC_FAIL, "Incorrect password!"]
        
        // Delete account data
        FS.unlinkSync(filename)
            
        // Return success
        return [RC_OK, ""]
    }
    catch (err) { return [RC_FAIL, err] }
}

// *** Update Account ***
function updateAccount(request)
{
    // Get request parameters
    const username = request.username
    const password = request.password
    const newPassword = request.new_password
    
    // Validate request parameters
    if (username == null || !validateUsername(username)) return [RC_FAIL, "Invalid username!"]
    if (password == null) return [RC_FAIL, "Invalid password!"]
    if (newPassword == null) return [RC_FAIL, "Invalid new password!"]

    // Construct account filename
    const filename = DIR_ACCOUNTS + username
    
    // Validate account exists
    if (!FS.existsSync(filename)) return [RC_FAIL, "Account does not exist!"]
        
    try
    {
        // Read account data
        const account = JSON.parse(FS.readFileSync(filename, 'utf8'))
        
        // Validate password
        if (!validatePassword(account, password)) return [RC_FAIL, "Incorrect password!"]
        
        // Update password
        account.passwordHash = sha256(newPassword)
            
        // Write account data
        FS.writeFileSync(filename, JSON.stringify(account))
            
        // Return success
        return [RC_OK, ""]
    }
    catch (err) { return [RC_FAIL, err] }
}

const VERB_HELLO = "HELLO"
const VERB_CREATE = "CREATE"
const VERB_LOGIN = "LOGIN"
const VERB_PAY = "PAY"
const VERB_DELETE = "DELETE"
const VERB_UPDATE = "UPDATE"

const handlerMap = {
    [VERB_HELLO]: hello,
    [VERB_CREATE]: createAccount,
    [VERB_LOGIN]: login,
    [VERB_PAY]: pay,
    [VERB_DELETE]: deleteAccount,
    [VERB_UPDATE]: updateAccount,
}

module.exports = {
    VERB_HELLO,
    VERB_CREATE,
    VERB_LOGIN,
    VERB_PAY,
    VERB_DELETE,
    VERB_UPDATE,

    // *** MAIN ***
    main: function (verb) {
        var requestRaw = process.argv[2] || "{}"
        if (parseInt(process.env.CONTENT_LENGTH || "0") > 0) requestRaw = FS.readFileSync(0, 'utf8')
        const response = handlerMap[verb](JSON.parse(requestRaw))
        process.stdout.write("Access-Control-Allow-Origin: *\r\n")
        process.stdout.write("Access-Control-Allow-Credentials: true\r\n")
        process.stdout.write("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization\r\n")
        process.stdout.write("Status: 200 OK\r\nContent-Type: application/json; charset=utf-8\r\n\r\n")
        process.stdout.write(JSON.stringify({result:response[0], payload:response[1]}))
    }
};
