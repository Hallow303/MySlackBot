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
};