module.exports = (app) => {
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
};