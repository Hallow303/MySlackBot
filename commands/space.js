const axios = require("axios"); 


module.exports = (app) => {
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
}