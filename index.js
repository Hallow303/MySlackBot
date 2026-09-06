const { App } = require("@slack/bolt");
require("dotenv").config();
const { EdgeTTS } = require("node-edge-tts");
const path = require("path");
const fs = require("fs");
const { title } = require("process");; 
const commandsPath = path.join(__dirname, "commands");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.error(async (error) => {
    console.error("❌ SLACK ERROR:");
    console.error(error);
});

for(const file of fs.readdirSync(commandsPath)){
    if(!file.endsWith(".js")){
        continue;
    }
    const command = require(path.join(commandsPath, file));
    command(app);
    console.log(`🐟 ${file} loaded`);
}

app.command("/koi-ping", async ({ command, ack, respond }) => {
    await ack();
    await respond("🏓 Pong!");
});

app.command("/koi-help", async ({ command, ack, respond }) => {
    await ack();

    await respond({
        response_type: "ephemeral",
        blocks: [
            {type: "header", text: {type: "plain_text", text: "🐟 Koi Commands"}},
            {type: "section", text: {type: "mrkdwn",
            text:
                "*Commands*\n\n" +
                "`/koi-ping` — Replies with Pong!\n" +
                "`/koi-apod` — Shows NASA's Astronomy Picture of the Day.\n" +
                "`/koi-cat` — Displays a random cat image.\n" +
                "`/koi-dog` — Displays a random dog image.\n" +
                "`/koi-fox` — Displays a random fox image.\n" +
                "`/koi-duck` — Displays a random duck image.\n" +
                "`/koi-say` — Repeats the text you send.\n" +
                "`/koi-sound` — Lets you choose an animal and plays its sound.\n" +
                "`/koi-tts` — Converts your text into speech and sends it as an MP3 file.\n" +
                "`/koi-calc` — Solves a mathematical expression.\n" +
                "`/koi-rps` — Rock Paper Scissors game.\n" +
                "`/koi-8ball` — Ask a question and let luck decide your answer.\n" +
                "`/koi-coin` — Heads or tails.\n" +
                "`/koi-help` — Lists all available Koi commands.\n" +
                "`/koi-bot` — Shows Koizinho's information.\n" +
                "`/koi-bot` — View detailed information about a Slack user."
        }}]
    });
});

app.command("/koi-calc", async ({ command, ack, respond }) => {
    await ack();
    const calc = command.text.trim();

    if (!calc) {
        return await respond({response_type: "ephemeral", text: "❌ Please enter a mathematical expression.\nExample: `/koi-calc 10 + 5 * 2`"});
    }

    try {
        if (!/^[0-9+\-*/().%\s]+$/.test(calc)) {
            return await respond({response_type: "ephemeral", text: "❌ Invalid expression. Only numbers and basic mathematical operators are allowed."});
        }

        const resultado = Function(`"use strict"; return (${calc})`)();

        if (!Number.isFinite(resultado)) {
            return await respond({response_type: "ephemeral", text: "❌ The result is not a valid number."});
        }

        await respond({response_type: "ephemeral", text: `🧮 *Result:* ${resultado}`});

    } catch (error) {
        await respond({response_type: "ephemeral", text: "❌ I couldn't calculate that expression."});
    }
});

app.command("/koi-bot", async ({ command, ack, respond }) => {
    await ack();

    await respond({
        response_type: "ephemeral",
        blocks: [
            {type: "header", text: {type: "plain_text", text: "🐟 Koizinho"}},
            {type: "section", 
                fields: [
                    {type: "mrkdwn", text: "*Name:* Koizinho"},
                    {type: "mrkdwn", text: "*Creator:* @AdaChan"},
                    {type: "mrkdwn", text: "*ID:* `A0BGXPTKR4L`"},
                    {type: "mrkdwn", text: "*Created on:* July 12, 2026"}
                ]
            },
            {type: "divider"},
            {type: "context",elements: [{type: "mrkdwn", text: "🐟 Koizinho — Your friendly Slack bot!"}]}
        ]
    });
});

app.command("/koi-coin", async({command, ack, respond}) =>{
    await ack();
    const num = Math.floor(Math.random() * 2);

    if(num === 0){
        return respond({text:`🪙 The coin landed on heads!`});
    }else{
        return respond({text:`🪙 The coin landed on tails!`});
    }
});

app.command("/koi-say", async ({ command, ack, respond }) => {
    await ack();
    const texto = command.text.trim();
    if (!texto) {
        return await respond({response_type: "ephemeral", text: "❌ Please write something!\nExample: `/koi-say Hello`"});
    }
    await respond({text: `Echo: ${texto}`});
});

app.command("/koi-rps", async ({ command, ack, respond }) =>{
    await ack();
    const rps = ["rock", "paper", "scissors"];
    const choice = command.text.trim().toLowerCase();

    if (!rps.includes(choice)){
        await respond({text: "❌ Choose `rock`, `paper`, or `scissors`."});
        return;
    }

    const num = Math.floor(Math.random() * rps.length);
    const botchoice = rps[num];
    let resultado;

    if (choice === botchoice){
        resultado = "🥹 It was a draw.";
    }else if ((choice === "rock" && botchoice === "scissors") || (choice === "paper" && botchoice === "rock") || (choice === "scissors" && botchoice === "paper")){
        resultado = "🎉 You win!";
    }else{
        resultado = "🤖 Koizinho wins!";
    }
    await respond({text: `👤 You: *${choice}* \n🤖 Koizinho: *${botchoice}* \n${resultado}`});
});

app.command("/koi-8ball", async({command, ack, respond}) => {
    await ack();
    const respostas = [
        'Maybe.', 'I think so.', 'Yes.', 'No.', 'I don’t know.',
        'Probably.', 'I don’t think so.', 'Could be.', 'Definitely.', 'I doubt it.',
        'I have no idea.', 'Who knows?', 'Possibly.', 'Of course.', 'No way.',
        'It depends.', 'It’s possible.', 'Maybe so.', 'Maybe not.', 'Hmm...',
        'Why not?', 'I believe so.', 'I’m not sure.', 'Seems likely.',
        'It looks like it.', 'I don’t think so.', 'Interesting...', 'Good question.',
        'Maybe someday.', 'You never know.', 'Yeah, maybe.', 'Hard to say.',
        'Absolutely.', 'Definitely not.', 'More or less.', 'I’d say yes.',
        'I’d say no.', 'I have my doubts.', 'It’s complicated.', 'That’s a difficult question.'
    ];
    const num = Math.floor(Math.random() * respostas.length);
    const aleatoria = respostas[num];

    await respond({text: `🐟 The koi said: ${aleatoria}`});
});

(async () => {
    try {
        await app.start();
        console.log("🐟 Koi bot running!");
    } catch (error) {
        console.error("💀 ERRO AO INICIAR O BOT:");
        console.error(error);
    }
})();
