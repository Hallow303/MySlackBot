const axios = require("axios");

module.exports = (app) =>{
    app.command("/koi-apod", async({command, ack, client, respond}) =>{
        await ack();
        const apiKey = process.env.API_NASA;
        const loading = await client.chat.postMessage({channel: command.channel_id, text: "🚀 Loading APOD..."});

        try{
            const resposta = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
            const apod = resposta.data;
            const blocks = [
                {type: "header", text: {type: "plain_text", text: apod.title}},
                {type: "section", text: {type: "mrkdwn", text: apod.explanation}}
            ];
            
            if(apod.media_type === "image"){
                blocks.push({type: "image", image_url: apod.url, alt_text: apod.title});
            }else{
                blocks.push({type: "section", text: {type: "mrkdwn", text: `Video: ${apod.url}`}});
            }

            await client.chat.update({channel: command.channel_id, ts: loading.ts, text: `${apod.title}`, blocks: blocks});
        }catch(error){
            console.error(error);
            await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"Error accessing the NASA API."});
        }
    });
}