const axios = require("axios");
const path = require("path");

module.exports = (app) => {
    app.command("/koi-duck", async({ command, ack, client, respond}) => {
    await ack();
    const loading = await client.chat.postMessage({channel: command.channel_id, text: "🦆 Looking for a duck..."});

    try{
        const resposta = await axios.get("https://random-d.uk/api/random");
        const duck = resposta.data;

        await client.chat.update({channel: command.channel_id, ts: loading.ts, text: "pato",
            blocks: [
                {type: "header", text: {type: "plain_text", text: "🦆Random Duck"}},
                {type: "image", image_url: duck.url, alt_text: "Random Duck"}
            ]
    });
    }catch (error){
        console.error(error);
        await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"I couldn't find a duck right now."});
    }

    });

    app.command("/koi-fox", async ({command, ack, client, respond }) => {
        await ack();
        const loading = await client.chat.postMessage({channel: command.channel_id, text: "🦊 Looking for a fox..."});

        try{
            const resposta = await axios.get("https://randomfox.ca/floof/");
            const fox = resposta.data;

            await client.chat.update({channel: command.channel_id, ts: loading.ts, text: "fox",
                blocks: [
                    {type: "header", text: {type: "plain_text", text: "🦊Random Fox"}},
                    {type: "image", image_url: fox.image, alt_text: "Random Fox"}
                ]
        });
        }catch(error){
            console.error(error);
            await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"I couldn't find a fox right now."});
        }
    });

    app.command("/koi-dog", async ({command, ack, client, respond}) => {
        await ack();
        const loading = await client.chat.postMessage({channel: command.channel_id, text: "🐶 Looking for a dog..."});

        try{
            const resposta = await axios.get("https://dog.ceo/api/breeds/image/random");
            const dog = resposta.data;

            await client.chat.update({channel: command.channel_id, ts: loading.ts, text: "dog",
                blocks: [
                    {type: "header", text: {type: "plain_text", text: "🐶Random Dog"}},
                    {type: "image", image_url: dog.message, alt_text: "Random Dog"}
                ]
        });

        }catch(error){
            console.error(error);
            await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"I couldn't find a dog right now."});
        }
    });

    app.command("/koi-cat", async ({command, ack, client, respond}) => {
        await ack();
        const loading = await client.chat.postMessage({channel: command.channel_id, text: "😺 Looking for a cat..."});

        try{
            const resposta = await axios.get("https://api.thecatapi.com/v1/images/search");
            const cat = resposta.data;

            await client.chat.update({channel: command.channel_id, ts: loading.ts, text: "cat",
                blocks: [
                    {type: "header", text: {type: "plain_text", text: "😺Random Cat"}},
                    {type: "image", image_url: cat[0].url, alt_text: "Random Cat"}
                ]
        });

        }catch(error){
            console.error(error);
            await client.chat.update({channel: command.channel_id, ts: loading.ts, text:"I couldn't find a cat right now."});
        }
    });
}