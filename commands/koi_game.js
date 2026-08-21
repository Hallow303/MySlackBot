module.exports = (app) =>{
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
        const aleatoria = resposta[num];

        await respond({text: `🐟 The koi said: ${aleatoria}`});
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
}