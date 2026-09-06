const { doesNotMatch } = require("assert");
const { EdgeTTS } = require("node-edge-tts");
const path = require("path");
const { execArgv } = require("process");
const { queryObjects } = require("v8");

module.exports = (app) => {
    app.command("/koi-sound", async ({command, ack, respond}) =>{
        await ack();
        
        await respond({
            blocks: [
                {type: "header", text: {type: "plain_text", text: "Animal Sounds"}},
                {type: "section", text: {type: "mrkdwn", text: "Choose an animal from the list:"},
                accessory: {type: "static_select", action_id: "animal_select", placeholder: {type: "plain_text", text: "Select an animal"},
                        options: [
                            {text: { type: "plain_text", text: "😺 Cat" }, value: "cat"},
                            {text: { type: "plain_text", text: "🐶 Dog" },value: "dog"},
                            {text: { type: "plain_text", text: "🦊 Fox" }, value: "fox"},
                            {text: { type: "plain_text", text: "🐘 Elephant" },value: "elephant"},
                            {text: { type: "plain_text", text: "🐦 Bird" }, value: "bird"},
                            {text: { type: "plain_text", text: "🦆 Duck" }, value: "duck"}
                        ]
                    }
                }
            ]
        });
    });

    app.action("animal_select", async({ack, body, client}) =>{
        await ack();

        const animal = body.actions[0].selected_option.value;
        const loading = await client.chat.postMessage({channel: body.container.channel_id, text: `🔊 Loading ${animal} sound...`});
        let filePath;

        if(animal === "cat"){
            filePath = path.join(__dirname, "..", "sound", "cat.mp3");
        }else if (animal === "dog"){
            filePath = path.join(__dirname, "..", "sound", "dog.mp3");
        }else if (animal === "fox"){
            filePath = path.join(__dirname, "..", "sound", "fox.mp3");
        }else if (animal === "duck"){
            filePath = path.join(__dirname, "..", "sound", "duck.mp3");
        }else if (animal === "elephant"){
            filePath = path.join(__dirname, "..", "sound", "elephant.mp3");
        }else if (animal === "bird"){
            filePath = path.join(__dirname, "..", "sound", "bird.mp3");
        }else{
            await client.chat.update({channel: body.container.channel_id, ts: loading.ts, text: "Unknown animal."});
            return;
        }

        try{
            await client.filesUploadV2({channel_id: body.container.channel_id, file: filePath, filename: path.basename(filePath), title: `${animal} sound`});
            await client.chat.update({channel: body.container.channel_id, ts: loading.ts, text: `🔊 ${animal} sound successfully loaded!`});
        } catch (error) {
            console.error(error);
            await client.chat.update({channel: body.container.channel_id, ts: loading.ts, text: `❌ Couldn't load the ${animal} sound.`});
        }
    });

};
