import sys
import json
import requests
from pathlib import Path
from PIL import ImageDraw
from easy_pil import Editor, Font


userJson = "AdaChan.json"
BASE_DIR = Path(__file__).resolve().parent
JSON_FILE = BASE_DIR / "user" / userJson


def statusColor(status):
    if status == 'active':
        return 'green'
    else:
        return 'red'

def save_avatar(data):
    avatar_url = data["avatar"]["original"]
    avatar_path = BASE_DIR / "user" / "avatar.png"

    response = requests.get(avatar_url)
    response.raise_for_status()

    with open(avatar_path, "wb") as f:
        f.write(response.content)

    return avatar_path

def colorTest(flag):
    if flag == 'true':
        return 'green'
    else:
        return 'red'
    
def creatorCard(data):
    

    flags = data['flags']
    avatar = Editor(save_avatar(data))      

    id = data['id']
    name = data['real_name']
    display_name = data['display_name']
    email = data['email']
    status = data['status']['presence']
    timezone = data['timezone']['label']
    admin = str(flags['admin']).lower()
    owner = str(flags['owner']).lower()
    primary_owner = str(flags['primary_owner']).lower()
    bot = str(flags['bot']).lower()
    guest = str(flags['guest']).lower()
    deleted = str(flags['deleted']).lower()

    bg = Editor(BASE_DIR / "img" / "card.png")
    draw = ImageDraw.Draw(bg.image)
    avatar.resize((450, 450))
    avatar.circle_image()
    poppins = str(BASE_DIR / "fonts" / "Poppins-Regular.ttf")
    font = Font(path=poppins, size=55)
    font2 = Font(path=poppins, size=40)

    x = 160
    y = 695
    size = 70

    draw.ellipse(
        (x, y, x + size, y + size),
        fill=statusColor(status)
    )

    bg.paste(avatar, (70, 90))
    bg.text((680, 160), id, color="white", font=font)
    bg.text((820, 250), name, color="white", font=font)
    bg.text((1090, 340), display_name, color="white", font=font)
    bg.text((800, 425), email, color="white", font=font)
    bg.text((520, 710), status, color="white", font=font)
    bg.text((260, 950), timezone, color="white", font=font)
    bg.text((1277, 800), admin, color=colorTest(admin), font=font2) # admin
    bg.text((1277, 860), owner, color=colorTest(owner), font=font2) # owner
    bg.text((1460, 915), primary_owner, color=colorTest(primary_owner), font=font2) # primary owner
    bg.text((1210, 975), bot, color=colorTest(bot), font=font2) # bot
    bg.text((1260, 1030), guest, color=colorTest(guest), font=font2) # guest
    bg.text((1300, 1090), deleted, color=colorTest(deleted), font=font2) # delete

    output = BASE_DIR / "output.png"
    bg.save(fp=output)
    return output


try:
    input_data = sys.stdin.read()

    data = json.loads(input_data)

    output = creatorCard(data)

    # Retorna informação para o JS
    print(json.dumps({
        "success": True,
        "file": str(output)
    }))

except Exception as error:

    print(json.dumps({
        "success": False,
        "error": str(error)
    }))