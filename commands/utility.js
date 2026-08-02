const { EdgeTTS } = require("node-edge-tts");
const path = require("path");
const fs = require("fs");


module.exports = (app) => {
    app.message(async ({ message, say }) => {
        if (message.text === "Hi!") {
            await say("Hello! 👋");
        }
    });

    app.command("/koi-say", async({command, ack, respond}) => {
        await ack();
        const texto = command.text;
        if(!texto.trim()){
            return await respond("Hey, you need to write something, duh!\n*Example:*\n`/koi-say Hello`");
        }

        await respond(`Echo: ${texto}`);

    });

    app.command("/koi-tts", async({command, ack, client, respond}) =>{
        await ack();
        const texto = command.text;

        if(!texto.trim()){
            return await respond("Hey, you need to write something, duh!\n*Example:*\n`/koi-tts Hello`");
        }

        try{
            const fileName = `${Date.now()}.mp3`;
            const filePath = path.join(__dirname, "..", "temp", fileName); // O .. significa "voltar uma pasta".

            const tts = new EdgeTTS({voice: "en-US-GuyNeural"});

            await tts.ttsPromise(texto, filePath);

            await app.client.files.uploadV2({channel_id: command.channel_id, file: filePath, filename: fileName, title: "Text to Speech"});

            await fs.promises.unlink(filePath);
        }catch(error){
            console.error(error);
            await respond("Couldn't generate the audio");
        }
    });


    app.command("/koi-sound", async({command, ack, client, respond}) =>{
        await ack();

        await respond({blocks:[
            {type: "header", text: {type: "plain_text", text: "Animal Sounds"}},
            {type: "section", text: {type: "mrkdwn", text: "Choose an animal from the list:"},
            accessory: 
            {type: "static_select", action_id: "animal_select", placeholder: {type: "plain_text", text: "Select an animal"},
            options: [
                {text: {type: "plain_text", text: "😺 Cat"}, value: "cat"},
                {text: {type: "plain_text", text: "🐶 Dog"}, value: "dog"},
                {text: {type: "plain_text", text: "🦊 Fox"}, value: "fox"},
                {text: {type: "plain_text", text: "🐘 Elephant"}, value: "elephant"},
                {text: {type: "plain_text", text: "🐦 Bird"}, value: "bird"},
                {text: {type: "plain_text", text: "🦆 Duck"}, value: "duck"}
            ]
            }}
        ]});
    });

    app.action("animal_select", async({ack, body, client}) =>{
        await ack();
        const animal = body.actions[0].selected_option.value;
        let filePath;
        // novamente .. significa "volta uma pasta".

        if(animal === "cat"){
            filePath = path.join(__dirname, "..", "sound", "cat.mp3");
        } else if(animal === "dog"){
            filePath = path.join(__dirname, "..", "sound", "dog.mp3");
        } else if(animal === "fox"){
            filePath = path.join(__dirname, "..", "sound", "fox.mp3");
        } else if(animal === "duck"){
            filePath = path.join(__dirname, "..", "sound", "duck.mp3");
        } else if(animal === "elephant"){
            filePath = path.join(__dirname, "..", "sound", "elephant.mp3");
        } else if(animal === "bird"){
            filePath = path.join(__dirname, "..", "sound", "bird.mp3");
        } else {
            await client.chat.postMessage({channel: body.container.channel_id, text: "Unknown animal."});
            return;
        }

        try{
            await client.files.uploadV2({channel_id: body.container.channel_id, file: filePath, filename: path.basename(filePath), title: `${animal} sound`});
        }catch(error){
            console.error(error)
        }
    });
}