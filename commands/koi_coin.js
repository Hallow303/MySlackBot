module.exports = (app) =>{
    app.command("/koi-coin", async({command, ack, respond}) =>{
        await ack();
        const num = Math.floor(Math.random() * 2);

        if(num === 0){
            return respond({text:`🪙 The coin landed on heads!`});
        }else{
            return respond({text:`🪙 The coin landed on tails!`});
        }
    });

};