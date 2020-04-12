#!/node
'use strict'

const fs = require("fs")
const child_process = require("child_process")
const readline = require('readline');

const DEFAULT_PASSWORD = 'password'
const DEFAULT_COMMAND_PATTERN = '^L \\d\\d/\\d\\d/\\d\\d\\d\\d - \\d\\d:\\d\\d:\\d\\d: ".*?<\\d+><(Console|\\[U:\\d+:\\d+\\])><.*?>" say ":cmd (?<command>.*?)"$'

let newArgs = process.argv.slice(2);
let socatExec = newArgs.join(" ");
fs.writeFileSync('/log.chatbot.txt',socatExec)

let pipes = child_process.spawn('socat',['-',`EXEC:'${socatExec}',pty,ctty`],{stdio:['pipe','pipe','pipe']})

pipes.stderr.pipe(process.stderr)
process.stdin.pipe(pipes.stdin)



const rl_in = new readline.Interface(process.stdin)
rl_in.on('line', (input) => {
    pipes.stdin.write(input+"\r\n")
});

const rl_out = new readline.Interface(pipes.stdout)
rl_out.on('line', (input) => {
    process.stdout.write(input+"\r\n")

    let readyMatcher = new RegExp('VAC secure mode is activated.')
    if (readyMatcher.exec(input)) {
        setTimeout(() => {
            process.stdout.write("Changing password\r\n")
            pipes.stdin.write(`sv_password "${process.env.PASSWORD || DEFAULT_PASSWORD}"\r\n`)
        },500)
    }

    let commandMatcher = new RegExp(process.env.COMMAND_PATTERN || DEFAULT_COMMAND_PATTERN)
    let cmdMatch = commandMatcher.exec(input)
    if (cmdMatch && cmdMatch.groups && cmdMatch.groups.command) {
        pipes.stdin.write(cmdMatch.groups.command+"\r\n")
    }
});