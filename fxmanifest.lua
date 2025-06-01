fx_version 'cerulean'
game 'gta5'

author 'SandBox Development'
version 'v0.1.0'
description 'CleanUP script with custom ui'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/script.js',
    'html/style.css'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

lua54 'yes'