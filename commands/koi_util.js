module.exports = (app) => {
    app.command("/koi-calc", async({command, ack, respond}) =>{
        await ack();
        const calc = command.text;
        let resultado = eval(calc);
        await respond({text:`Resultado: ${resultado}`});
    });
}