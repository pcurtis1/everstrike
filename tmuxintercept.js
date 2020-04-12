#!/node
'use strict'

const fs = require("fs")
const child_process = require("child_process")
// console.error(process.argv);

// Take whole arguments and log them to a file

let file = fs.openSync('/tmuxintercept.log.txt','a')
try {
    fs.writeSync(file,JSON.stringify(process.argv)+"\r\n")

    let newArgs = process.argv.slice(2);
    
    if (newArgs.length >= 2 && newArgs[0] == 'new-session') {
        let i_command = newArgs.findIndex(arg => arg === "-s")
        // let gameCommand = process.argv[i_command]
        if (i_command != -1 && newArgs[i_command+2]) {
            newArgs[i_command+2] = "/chatbotproxy.js " + newArgs[i_command+2]
        }
    }
    
    // call tmux.orig with arguments
    fs.writeSync(file,`Calling /usr/bin/tmux.orig with args ${JSON.stringify(newArgs)}\r\n`)
    let tmux = child_process.spawn('/usr/bin/tmux.orig',newArgs,{stdio:'inherit'})
    //process.stdout.write(resultBuffer)
    
} finally {
    fs.closeSync(file)
}