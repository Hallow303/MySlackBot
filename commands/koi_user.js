const path = require("path");
const fs = require("fs");
const axios = require("axios");
const {createCanvas, loadImage} = require("canvas");

module.exports = (app) => {
    app.command("/koi-user", async ({ ack, body, client, command }) => {
        await ack();
            await client.views.open({
                trigger_id: body.trigger_id,
                view: {type: "modal", callback_id: "koi_user_modal", private_metadata: body.channel_id,
                    title: {type: "plain_text", text: "Koi User Card"},
                    submit: {type: "plain_text", text: "View Data"},
                    close: {type: "plain_text", text: "Cancel"},
                    blocks: [{
                        type: "input", block_id: "user_select",
                        label: {type: "plain_text", text: "Select a user"},
                        element: {type: "users_select", action_id: "selected_user"}
                    }]
                }
            });
        });


    app.view("koi_user_modal", async ({ ack, body, view, client }) => {
        await ack();
        try {
            const userId =view.state.values.user_select.selected_user.selected_user;
            const response = await client.users.info({user: userId});
            const user = response.user;
            const profile = user.profile || {};
            let presence = "offline";

            try{
                const presenceResponse = await client.users.getPresence({user: userId});
                presence = presenceResponse.presence || "offline";
            }catch(error){
                console.log(error.data?.error || error.message);
            }

            const userData = {
                id: user.id,
                username: user.name,
                real_name: user.real_name || user.name || "Unknown",
                display_name: profile.display_name || "None",
                first_name: profile.first_name || "None",
                last_name: profile.last_name || "None",
                email: profile.email || "Hidden",
                skype: profile.skype || "None",
                status: {
                    text: profile.status_text || "",
                    emoji: profile.status_emoji || "",
                    expiration: profile.status_expiration || 0,
                    presence: presence
                },
                timezone: {
                    tz: user.tz || "Unknown",
                    label: user.tz_label || "Unknown"
                },
                avatar: {
                    original: profile.image_original || profile.image_512 || profile.image_192
                },
                flags: {
                    admin: user.is_admin,
                    owner: user.is_owner,
                    primary_owner: user.is_primary_owner,
                    bot: user.is_bot,
                    guest: user.is_restricted,
                    deleted: user.deleted
                },
                updated: user.updated
            };

            const output = await createUserCard(userData);
            const channelId = view.private_metadata;
            await client.filesUploadV2({channel_id: channelId, file: output, filename: `${user.name}-card.png`, title: `Koi User Card — ${user.real_name || user.name}`});
        }catch(error){
            console.error(error);
        }
    });
};

async function createUserCard(data) {
    const BASE_DIR = __dirname;
    const CARD_PATH = path.join(BASE_DIR,"img","card.png");
    const background = await loadImage(CARD_PATH);
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(background, 0, 0);
    const flags = data.flags;
    const id = data.id;
    const name = data.real_name;
    const displayName = data.display_name;
    const email = data.email;
    const status = data.status.presence;
    const timezone = data.timezone.label;
    const admin = String(flags.admin);
    const owner = String(flags.owner);
    const primaryOwner = String(flags.primary_owner);
    const bot = String(flags.bot);
    const guest = String(flags.guest);
    const deleted = String(flags.deleted);
    const avatarUrl = data.avatar.original;

    if (!avatarUrl) {
        throw new Error("The user does not have an avatar available.");
    }

    const avatarResponse = await axios.get(avatarUrl, {responseType: "arraybuffer"});
    const avatar = await loadImage(Buffer.from(avatarResponse.data));
    ctx.save();
    ctx.beginPath();
    ctx.arc(295, 315, 225, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 70, 90, 450, 450);
    ctx.restore();

    ctx.font = 'bold 55px "DejaVu Sans"';
    ctx.fillStyle = "white";

    const x = 160;
    const y = 695;
    const size = 70;
    const r = 40

    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = statusColor(status);
    ctx.fill();
    ctx.fillStyle = "white";

    ctx.fillText(id, 680, 160 + r);
    ctx.fillText(name, 820, 250 + r);
    ctx.fillText(displayName, 1090, 340 + r);
    ctx.fillText(email,800,425 + r);
    ctx.fillText(status,520,710 + r);
    ctx.fillText(timezone,260,950 + r);

    ctx.font = 'bold 40px "DejaVu Sans"';
    const s = 30;


    drawFlag(ctx, admin, 1277, 800 + s);
    drawFlag(ctx, owner, 1277, 860 + s);
    drawFlag(ctx, primaryOwner, 1460,915 + s);
    drawFlag(ctx, bot,1210, 975 + s);
    drawFlag(ctx, guest, 1260, 1030 + s);
    drawFlag(ctx, deleted, 1300, 1090 + s);

    const output = path.join(BASE_DIR, "output.png");
    fs.writeFileSync(output, canvas.toBuffer("image/png"));
    return output;
}

function statusColor(status){
    if (status === "active"){
        return "green";
    }
    return "red";
}

function colorTest(flag){
    if(flag === "true" || flag === true){
        return "green";
    }
    return "red";
}
function drawFlag(ctx, flag, x, y){
    ctx.fillStyle = colorTest(flag);
    ctx.fillText(String(flag), x, y);
}
