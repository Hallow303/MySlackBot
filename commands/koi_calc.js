module.exports = (app) =>{
    app.command("/koi-calc", async ({ command, ack, respond }) => {
        await ack();
        const calc = command.text.trim();

        if (!calc) {
            return await respond({response_type: "ephemeral", text: "❌ Please enter a mathematical expression.\nExample: `/koi-calc 10 + 5 * 2`"});
        }

        try {
            if (!/^[0-9+\-*/().%\s]+$/.test(calc)) {
                return await respond({response_type: "ephemeral", text: "❌ Invalid expression. Only numbers and basic mathematical operators are allowed."});
            }

            const resultado = Function(`"use strict"; return (${calc})`)();

            if (!Number.isFinite(resultado)) {
                return await respond({response_type: "ephemeral", text: "❌ The result is not a valid number."});
            }

            await respond({response_type: "ephemeral", text: `🧮 *Result:* ${resultado}`});

        } catch (error) {
            await respond({response_type: "ephemeral", text: "❌ I couldn't calculate that expression."});
        }
    });
};