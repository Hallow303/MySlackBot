const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({token: process.env.SLACK_BOT_TOKEN, appToken: process.env.SLACK_APP_TOKEN, socketMode: true});
const fs = require("fs");
const path = require("path");
const commandsPath = path.join(__dirname, "commands");

for(const file of fs.readdirSync(commandsPath)){
    if(!file.endsWith(".js")){
        continue;
    }
    const command = require(path.join(commandsPath, file));
    command(app);
    console.log(`🐟 ${file} carregado`);
}

app.command("/koi-ping", async ({command, ack, respond}) =>{
    await ack();
    await respond("🏓 Pong!");
})

app.command("/koi-say", async({command, ack, respond}) =>{
    await ack();
    const texto = command.text;
    if(!texto.trim()){
        return await respond("Hey, you need to write something, duh!\n*Example:*\n`/koi-say Hello`");
    }
    await respond(`Echo: ${texto}`);
});

(async () => {
    await app.start();
    console.log("🐟 Koi bot running!");
})();