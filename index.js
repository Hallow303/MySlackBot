require("dotenv").config();

const axios = require("axios");
const { EdgeTTS } = require("node-edge-tts");
const path = require("path");
const fs = require("fs");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/koi-ping", async ({ command, ack, respond }) => {
    await ack();
    await respond("🏓 Pong!");
});

app.command("/koi-apod", async ({command, ack, respond }) => {
    await ack();
    const apiKey = process.env.API_NASA;

    try{
        const resposta = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        const apod = resposta.data;

        const blocks = [
            {type: "header", text: {type: "plain_text", text: apod.title}},
            {type: "section", text: {type: "mrkdwn", text: apod.explanation}}
        ];

        if(apod.media_type === "image"){
            blocks.push({type: "image", image_url: apod.url, alt_text: apod.title});
        } else {
            blocks.push({type: "section", text: {type: "mrkdwn", text: `Video: ${apod.url}`}});
        }

        await respond({blocks});
    }catch (error){
        console.error(error);
        await respond("Error accessing the NASA API.");
    }
});

app.command("/koi-duck", async({ command, ack, respond}) => {
    await ack();

    try{
        const resposta = await axios.get("https://random-d.uk/api/random");
        const duck = resposta.data;

        await respond({blocks: [
            {type: "header", text: {type: "plain_text", text: "🦆Random Duck"}},
            {type: "image", image_url: duck.url, alt_text: "Random Duck"}
        ]
    });
    }catch (error){
        console.error(error);
        await respond("I couldn't find a duck right now.")
    }
});

app.command("/koi-fox", async ({command, ack, respond }) => {
    await ack();

    try{
        const resposta = await axios.get("https://randomfox.ca/floof/");
        const fox = resposta.data;

        await respond({blocks: [
            {type: "header", text: {type: "plain_text", text: "🦊Random Fox"}},
            {type: "image", image_url: fox.image, alt_text: "Random Fox"}
            ]
        });

    }catch(error){
        console.error(error);
        await respond("I couldn't find a fox right now.");
    }
});

app.command("/koi-dog", async ({command, ack, respond }) => {
    await ack();

    try{
        const resposta = await axios.get("https://dog.ceo/api/breeds/image/random");
        const dog = resposta.data;

        await respond({blocks: [
            {type: "header", text: {type: "plain_text", text: "🐶Random Dog"}},
            {type: "image", image_url: dog.message, alt_text: "Random Dog"}
            ]
        });

    }catch(error){
        console.error(error);
        await respond("I couldn't find a dog right now.");
    }
});

app.command("/koi-cat", async ({command, ack, respond }) => {
    await ack();

    try{
        const resposta = await axios.get("https://api.thecatapi.com/v1/images/search");
        const cat = resposta.data;

        await respond({blocks: [
            {type: "header", text: {type: "plain_text", text: "😺Random Cat"}},
            {type: "image", image_url: cat[0].url, alt_text: "Random Cat"}
            ]
        });

    }catch(error){
        console.error(error);
        await respond("I couldn't find a cat right now.");
    }
});

app.command("/koi-sound", async({command, ack, respond}) =>{
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

    if(animal === "cat"){
        filePath = path.join(__dirname, "sound", "cat.mp3");
    } else if(animal === "dog"){
        filePath = path.join(__dirname, "sound", "dog.mp3");
    } else if(animal === "fox"){
        filePath = path.join(__dirname, "sound", "fox.mp3");
    } else if(animal === "duck"){
        filePath = path.join(__dirname, "sound", "duck.mp3");
    } else if(animal === "elephant"){
        filePath = path.join(__dirname, "sound", "elephant.mp3");
    } else if(animal === "bird"){
         filePath = path.join(__dirname, "sound", "bird.mp3");
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

app.command("/koi-say", async({command, ack, respond}) => {
    await ack();
    const texto = command.text;
    if(!texto.trim()){
        return await respond("Hey, you need to write something, duh!\n*Example:*\n`/koi-say Hello`");
    }

    await respond(`Echo: ${texto}`);

});

app.command("/koi-tts", async({command, ack, respond}) =>{
    await ack();
    const texto = command.text;

    if(!texto.trim()){
        return await respond("Hey, you need to write something, duh!\n*Example:*\n`/koi-tts Hello`");
    }

    try{
        const fileName = `${Date.now()}.mp3`;
        const filePath = path.join(__dirname, "temp", fileName);

        const tts = new EdgeTTS({voice: "en-US-GuyNeural"});

        await tts.ttsPromise(texto, filePath);

        await app.client.files.uploadV2({channel_id: command.channel_id, file: filePath, filename: fileName, title: "Text to Speech"});

        await fs.promises.unlink(filePath);
    }catch(error){
        console.error(error);
        await respond("Couldn't generate the audio");
    }
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();