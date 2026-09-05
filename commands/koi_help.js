module.exports = (app) =>{
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
                    "`/koi-bot` — Shows Koizinho's information."
            }}]
        });
    });
};