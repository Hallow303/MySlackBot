const { EdgeTTS } = require("node-edge-tts");
const path = require("path");
const fs = require("fs");
const { title } = require("process");

module.exports = (app) =>{
    app.command("/koi-tts", async({command, ack, client, respond}) =>{
        await ack();
        const texto = command.text;
        const loading = await client.chat.postMessage({channel: command.channel_id, text: "🔊 Loading TTS..."});

        if(!texto.trim()){
            return await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"Hey, you need to write something, duh!\n*Example:*\n`/koi-tts Hello`"});
        }

        try{
            const fileName = `${Date.now()}.mp3`;
            const filePath = path.join(__dirname, "..", "temp", fileName);
            const tts = new EdgeTTS({voice: "en-US-GuyNeural"});
            
            await tts.ttsPromise(texto, filePath);
            await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"Text-to-Speech successfully loaded"});
            await app.client.files.uploadV2({channel_id: command.channel_id, file: filePath, filename: fileName, title: "Text to Speech"});
            await fs.promises.unlink(filePath);
        }catch(error){
            console.error(error);
            await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"Couldn't generate the audio"});
        }
    })
};