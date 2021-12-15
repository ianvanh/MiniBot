const { GroupSettingChange, WAMessageProto, MessageType, prepareMessageFromContent, relayWAMessage } = require('@adiwajshing/baileys')
const { exec } = require('child_process');
const axios = require('axios')
const fs = require('fs')
let FormData = require('form-data')
let fetch = require('node-fetch')
const afkJs = require('./lib/afk')
const moment = require('moment-timezone');
const { mess, menu, ingfo, update } = require('./lib/text')
const { color, getBuffer, convertMp3 } = require('./lib/func')
moment.tz.setDefault('America/Bogota').locale('co');
const time = moment.tz('America/Bogota').format('HH:mm:ss')

const dbot = require('dbot-api')
const yts = require('yt-search')
const ggle = require('google-it')
var { yta, ytv, Ttdl, igDownloader } = require('./lib/newdown.js')


module.exports = handle = (client, Client) => {
try {
/*######## COMANDOS ########*/
    Client.cmd.on('alive', async (data) => {
        const mediaMsg = await client.prepareMessageMedia(await getBuffer(configs.imgUrl), 'imageMessage')
        const buttonMessage = {
            contentText: '✪〘 *FUNCIONANDO* 〙✪',
            footerText: 'MiniBot',
            "contextInfo": {
                //mentionedJid: [configs.ownerList[0]],
                participant: data.sender,
                stanzaId: data.message.key.id,
                quotedMessage: data.message.message,
            },
            buttons: [
                {
                    buttonId: `${data.prefix}menu`,
                    buttonText: {
                        displayText: "📒 MENU"
                    },
                    "type": "RESPONSE"
                },
                {
                     buttonId: `${data.prefix}update`,
                     buttonText: {
                         displayText: "🪀 LO NUEVO"
                    },
                    "type": "RESPONSE"
                },
            ],
            headerType: 4,
            ...mediaMsg
        }
        let zz = await client.prepareMessageFromContent(data.from, {buttonsMessage: buttonMessage}, {})
        client.relayWAMessage(zz, {waitForAck: true})
    })
    

    Client.cmd.on('sfw', async (data) => {
		if(isLimit(data.sender)) return data.reply(mess.limit)
		const res = await axios.get(`https://waifu.pics/api/sfw/waifu`)
		const mediaMsg = await client.prepareMessageMedia(await getBuffer(res.data.url), 'imageMessage')
        const buttonMessage = {
            contentText: 'Waifu',
			footerText: 'Presione para obtener otra imagen.',
            "contextInfo": {
                participant: data.sender,
                stanzaId: data.message.key.id,
                quotedMessage: data.message.message,
			},
            buttons: [
                {
                    buttonId: `${data.prefix}sfw`,
                    buttonText: {
                        displayText: `⏯️ Nueva imagen`
                    },
                    "type": "RESPONSE"
                },
            ],
            headerType: 4,
            ...mediaMsg
        }
        let zz = await client.prepareMessageFromContent(data.from, {buttonsMessage: buttonMessage}, {})
        client.relayWAMessage(zz, {waitForAck: true}) 
	})

    Client.cmd.on('nsfw', async (data) => {
        if(isLimit(data.sender)) return data.reply(mess.limit)
        const res = await axios.get(`https://waifu.pics/api/nsfw/waifu`)
        const mediaMsg = await client.prepareMessageMedia(await getBuffer(res.data.url), 'imageMessage')
        const buttonMessage = {
            contentText: 'Nsfw Waifu',
            footerText: 'Presione para obtener otra imagen.',
            "contextInfo": {
                participant: data.sender,
                stanzaId: data.message.key.id,
                quotedMessage: data.message.message,
            },
            buttons: [
                {
                    buttonId: `${data.prefix}nsfw`,
                    buttonText: {
                        displayText: `⏯️ Nueva imagen`
                    },
                    "type": "RESPONSE"
                },
            ],
            headerType: 4,
            ...mediaMsg
        }
        let zz = await client.prepareMessageFromContent(data.from, {buttonsMessage: buttonMessage}, {})
        client.relayWAMessage(zz, {waitForAck: true}) 
    })

    Client.cmd.on('join', async (data) => {
        if(!data.isOwner) return data.reply(mess.ownerOnly)
        if(data.body == "") return data.reply(`🤖 Necesito el link del grupo.`)
        Client.acceptInviteLink(data.body).then(() => data.reply('ok')).catch(() => data.reply('🤖 No puedo ingresar.'))
    })

    Client.cmd.on('owner', async (data) => {
        Client.sendContact(data.from, { number: configs.ownerList[0].split('@')[0], name: 'Ian' }, data.message)
    })
    
    Client.cmd.on('limit', async (data) => {
        const dataUser = JSON.parse(fs.readFileSync('./lib/json/dataUser.json'))
        if(dataUser[data.sender].premium) return data.reply(`Hola @${data.sender.split('@')[0]} 👋🏻\n¡Eres un usuario premium con acceso ilimitado!`)
        limits = configs.maxLimit - dataUser[data.sender].limit
        if(limits <= 0) return data.reply("```" + `Tu límite se ha agotado` + "```")
        data.reply(`Hola @${data.sender.split('@')[0]} 👋🏻\nTu límite permanece ${limits || 100}\nLos límites se restablecen todos los días a las 00.00\nSi desea obtener límites ilimitados, chatee con el propietario del bot, escriba ${configs.prefix}owner`)
    })
/*######## FIN COMANDOS ########*/
    
/*######## GRUPOS ########*/
    Client.cmd.on('group', (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.args[0] && data.args[0].toLowerCase() == 'abrir') {
            client.groupSettingChange(data.from, GroupSettingChange.messageSend, false)
            data.reply(`Todos pueden escribir en el grupo gracias a @${data.sender.split('@')[0]}`)
        } else if(data.args[0] && data.args[0].toLowerCase() == 'cerrar') {
            client.groupSettingChange(data.from, GroupSettingChange.messageSend, true)
            data.reply(`El administrador @${data.sender.split('@')[0]} ha cerrado el grupo.\nVallan y descancen un rato.`)
        } else {
            let po = client.prepareMessageFromContent(data.from, {
                "listMessage":{
                    "title": "*MiniBot*",
                    "description": "Abre o Cierra el grupo",
                    "buttonText": "COMANDOS",
                    "listType": "SINGLE_SELECT",
                    "sections": [
                        {
                            "rows": [
                                {
                                    "title": "Abrir Grupo.",
                                    "rowId": `${data.prefix}${data.command} abrir`
                                },
                                {
                                    "title": "Cerrar Grupo.",
                                    "rowId": `${data.prefix}${data.command} cerrar`
                                }
                            ]
                        }
                    ]
                }
            }, {})
            client.relayWAMessage(po, {waitForAck: true})
        }
    })

    Client.cmd.on('antilink', (data) => {
        if(!data.isGroup) return data.reply(mess.admin)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        const dataGc = JSON.parse(fs.readFileSync('./lib/json/dataGc.json'))
        if(data.args[0].toLowerCase() == 'on') {
            if(dataGc[data.from].antilink) return data.reply('Antilink activado!')
            dataGc[data.from].antilink = true
            fs.writeFileSync('./lib/json/dataGc.json', JSON.stringify(dataGc))
            data.reply(`El administrador @${data.sender.split('@')[0]} ha activado el Antilink.`)
        } else if(data.args[0].toLowerCase() == 'off') {
            if(!dataGc[data.from].antilink) return data.reply('Antilink desactivado!')
            dataGc[data.from].antilink = false
            fs.writeFileSync('./lib/json/dataGc.json', JSON.stringify(dataGc))
            data.reply(`El administrador @${data.sender.split('@')[0]} ha desactivado el Antilink.`)
        } else {
            let po = client.prepareMessageFromContent(data.from, {
                "listMessage":{
                  "title": "*MiniBot*",
                  "description": "Activa o desactiva el Antilink.",
                  "buttonText": "COMMANDS",
                  "listType": "SINGLE_SELECT",
                  "sections": [
                     {
                        "rows": [
                           {
                              "title": "Activar",
                              "rowId": `${data.prefix}${data.command} on`
                           },
                           {
                              "title": "Desactivar",
                              "rowId": `${data.prefix}${data.command} off`
                           }
                        ]
                     }]}}, {}) 
            client.relayWAMessage(po, {waitForAck: true})
        }
    })

    Client.cmd.on('welcome', (data) => {
        if(!data.isGroup) return data.reply(mess.admin)
        if(!data.isAdmin) return data.reply(mess.admin)
        const dataGc = JSON.parse(fs.readFileSync('./lib/json/dataGc.json'))
        if(data.args[0].toLowerCase() == 'on') {
            if(dataGc[data.from].welcome) return data.reply('🤖 Mensaje de Bienvenida activado')
            dataGc[data.from].welcome = true
            fs.writeFileSync('./lib/json/dataGc.json', JSON.stringify(dataGc))
            data.reply('Listo')
        } else if(data.args[0].toLowerCase() == 'off') {
            if(!dataGc[data.from].welcome) return data.reply('🤖 Mensaje de Bienvenida desactivado')
            dataGc[data.from].welcome = false
            fs.writeFileSync('./lib/json/dataGc.json', JSON.stringify(dataGc))
            data.reply('Listo')
        } else {
            let po = client.prepareMessageFromContent(data.from, {
                "listMessage":{
                    "title": "*MiniBot*",
                    "description": "Activa o desactiva el mensaje de Bienvenida.",
                    "buttonText": "COMMANDS",
                    "listType": "SINGLE_SELECT",
                    "sections": [{
                        "rows": [
                            {
                                "title": "Activar Bienvenida",
                                "rowId": `${data.prefix}${data.command} on`
                            },
                           {
                                "title": "Desactivar Bienvenida",
                                "rowId": `${data.prefix}${data.command} off`
                           }
                        ]
                    }]
                }
            }, {})
        client.relayWAMessage(po, {waitForAck: true})
        }
    })

    Client.cmd.on('setppgroup', async (data) => {
        if(!data.isGroup) return data.reply(mess.admin)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(!data.isQuotedImage && data.type != 'imageMessage') return data.reply(`🤖 Formato incorrecto!, envíe una imagen con un título ${data.prefix}setppgroup, o responder imagen con ${data.prefix}setppgroup`)
        const getbuff = data.isQuotedImage ? JSON.parse(JSON.stringify(data.message).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : data.message
        const dlfile = await client.downloadMediaMessage(getbuff)
        client.updateProfilePicture(client.user.jid, dlfile)
        data.reply(`🤖 ¡éxito!, la foto ha sido cambiada por @${data.sender.split('@')[0]}`)
    })

    Client.cmd.on('setgroupname', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.body == "") return data.reply(`Que nombre le vas a poner al grupo?\nEjemplo: ${data.prefix}${data.command} MiniBot`)
        client.groupUpdateSubject(data.from, `${data.body}`)
        data.reply(`🤖 Nombre del grupo cambiado por: @${data.sender.split('@')[0]}`)
    })

    Client.cmd.on('setgroupdesc', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.body == "") return data.reply(`Que descripción le vas a poner al grupo?\nEjemplo: ${data.prefix}${data.command} MiniBot`)
        client.groupUpdateDescription(data.from, `${data.body}`)
        data.reply(`Descripción del grupo cambiada por: @${data.sender.split('@')[0]}`)
    })

    Client.cmd.on('promote', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.mentionedJidList.length == 0) return data.reply(`Mensiona a quien vas a promover.\nEjemplo: ${data.prefix}${data.command} @57`)
        client.groupMakeAdmin(data.from, data.mentionedJidList).then(() => data.reply(`Promovido a @${data.mentionedJidList.join(' @').replace(/@s.whatsapp.net/g, '')} como admin.`)).catch(() => data.reply('Algo salio mal!'))
    })

    Client.cmd.on('demote', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.mentionedJidList.length == 0) return data.reply(`Mensiona a quien vas a promover.\nEjemplo: ${data.prefix}${data.command} @57`)
        client.groupDemoteAdmin(data.from, data.mentionedJidList).then(() => data.reply(`@${data.mentionedJidList.join(' @').replace(/@s.whatsapp.net/g, '')} ya no eres admin.`)).catch(() => data.reply('Algo salio mal!'))
    })

    Client.cmd.on('add', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.body == "") return data.reply(`Necesito el numero de quien vas agregar\nEjemplo: ${data.prefix}${data.command} 573xxxxxx`)
        args = data.args.map(mp => mp + "@s.whatsapp.net")
        client.groupAdd(data.from, args).then(() => data.reply(`@${data.sender.split('@')[0]} agrego a @${data.args.join(' @')}`)).catch(() => data.reply('No se puede invitar'))
    })

    Client.cmd.on('kick', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.mentionedJidList.length == 0) return data.reply(`Mensiona a quien deseas expulsar.\nEjemplo: ${data.prefix}${data.command} @57`)
        data.mentionedJidList.forEach(async jid =>{
            client.groupRemove(data.from, [jid]).then(x => data.reply(`@${jid.split('@')[0]} a sido expulsado por @${data.sender.split('@')[0]}`)).catch(x => data.reply(`No se pudo expulsar @${jid.split('@')[0]}`)); await sleep(2000)
        })
    })

    Client.cmd.on('tagall', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        group = await data.groupMetadata
        var jids = [];
        const ini = "╔══✪〘 *REPORTENSE* 〙✪══\n"
        mesaj = '';
        const end = "╚══✪〘 *MiniBot* 〙✪══"
        group['participants'].map(
            async (uye) => {
                mesaj += '╠❖ @' + uye.jid.split('@')[0] + '\n';
                jids.push(uye.id.replace('c.us', 's.whatsapp.net'));
                tga = `${ini}${mesaj}${end}`
            }
        );
        Client.sendText(data.from, tga)
    })
    
    Client.cmd.on('difusion', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.isAdmin) return data.reply(mess.admin)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(data.body == "") return data.reply(`Para usar este comando escribe\n*${data.prefix}difusion* texto a enviar`)
        const busqueda = data.body
        group = await data.groupMetadata
        var jids = [];
        mesaj = '';
        group['participants'].map(async (uye) => {
            Client.sendText(uye.id, busqueda, MessageType.text)
        })
    })

    Client.cmd.on('linkgroup', async (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(!data.isAdmin) return data.reply(mess.admin)
        groupName = data.groupMetadata.subject
        linkgc = await client.groupInviteCode(data.from)
        caption = `*Nombre del Grupo:* *${groupName}*\n\n*Link del grupo:* https://chat.whatsapp.com/${linkgc}`
        data.reply(caption)
    })


    Client.cmd.on('revoke', (data) => {
        if(!data.isGroup) return data.reply(mess.group)
        if(!data.botIsAdmin) return data.reply(mess.botAdmin)
        if(!data.isAdmin) return data.reply(mess.admin)
        client.revokeInvite(data.from)
        data.reply(`🤖 El enlaces ha sido restablecido con éxito por el administrador @${data.sender.split('@')[0]}`)
    })
/*######## FIN GRUPOS ########*/

/*###### DUEÑO ######*/    
    Client.cmd.on('resetlimit', async (data) => {
        if(!data.isOwner) return data.reply(mess.ownerOnly)
        const dataUser = JSON.parse(fs.readFileSync('./lib/json/dataUser.json'))
        for(users in dataUser) {
            dataUser[users].limit = 0
        }
        fs.writeFileSync('./lib/json/dataUser.json', JSON.stringify(dataUser))
        console.log(color('[ INFO ]', 'cyan'), 'LIMIT RESETED!')
        data.reply('🤖 Limites reiniciados.')
    })
    
    Client.cmd.on('premium', async (data) => {
        if(!data.isOwner) return data.reply(mess.ownerOnly)
        const dataUser = JSON.parse(fs.readFileSync('./lib/json/dataUser.json'))
        dataToPr = data.mentionedJidList.length ? data.mentionedJidList : [data.args[1] + "@s.whatsapp.net"] || null

        if(data.args[0].toLowerCase() == 'add') {
            if(data.args.length < 2) return data.reply('what?')
            dataToPr.forEach(nums => {
                if(!dataUser[nums]) dataUser[nums] = {
                    limit: 0
                }
                dataUser[nums].premium = true
            })
            fs.writeFileSync('./lib/json/dataUser.json', JSON.stringify(dataUser))
            data.reply(`Usuario premium agregado exitosamente @${dataToPr.join(' @').replace(/@s.whatsapp.net/g, '')}`)
        } else if(data.args[0].toLowerCase() == 'del') {
            if(data.args.length < 2) return data.reply('what?')
            dataToPr.forEach(nums => {
                if(!dataUser[nums] || !dataUser[nums].premium) return data.reply(`User @${nums.split('@')[0]} not premium!`)
                dataUser[nums].premium = false
                data.reply(`Usuario premium eliminado @${nums.split('@')[0]}`)
            })
            fs.writeFileSync('./lib/json/dataUser.json', JSON.stringify(dataUser))
        } else if(data.args[0].toLowerCase() == 'list') {
            strings = `LIST PREMIUM\n\n`
            for(var [num, val] of Object.entries(dataUser))
            if(val.premium) strings += `~> @${num.split('@')[0]}\n`
            data.reply(strings)
        } else data.reply(`Ejemplo: ${data.prefix}premium add @tag\no\n${data.prefix}premium add 573xxxxxx`)
    })
/*###### FIN DUEÑO ######*/


/*######## DESCARGAS ########*/
    Client.cmd.on('yt', async (data) => {
	//	if(isLimit(data.sender)) return data.reply(mess.limit)
		if(data.body == "") return data.reply(`*Que deseas buscar?*\nEjemplo: ${data.prefix}yt Careless Neffex`)
        data.reply(mess.wait)
        res = await yts(data.body)
        ytm = res.all
		const mediaMsg = await client.prepareMessageMedia(await getBuffer(ytm[0].image), 'imageMessage')
        const buttonMessage = {
            contentText: `${ytm[0].title}`,
            footerText: 'En que formato vas a descargar?',
            "contextInfo": {
                participant: data.sender,
                stanzaId: data.message.key.id,
                quotedMessage: data.message.message,
			},
            buttons: [
                {
                    buttonId: `${data.prefix}song ${ytm[0].url}`,
                    buttonText: {
                        displayText: `🎧 AUDIO`
                    },
                    "type": "RESPONSE"
                },
                {
                    buttonId: `${data.prefix}video ${ytm[0].url}`,
                    buttonText: {
                        displayText: `🎬 VIDEO`
                    },
                    "type": "RESPONSE"
                },
            ],
            headerType: 4,
            ...mediaMsg 
        }
        let zz = await client.prepareMessageFromContent(data.from, {buttonsMessage: buttonMessage}, {})
        client.relayWAMessage(zz, {waitForAck: true}) 
	})

    Client.cmd.on('video', async (data) => {
        try {
            //if(isLimit(data.sender)) return data.reply(mess.limit)
            if(data.body == "") return data.reply(`*Necesito el link.*\nEjemplo: ${data.prefix}video https://youtu.be/Z6L4u2i97Rw`)
            data.reply(mess.wait)
            res = await ytv(data.body)
            ytm = res
            if(Number(ytm.size.split(' MB')[0]) >= 99.00) return Client.sendFileFromUrl(data.from, `${ytm.thumb}`, 'thumb.jpg', `*Link* : ${ytm.link}\n\n🤖 Descarga no permitida por whatsapp.\nDescargalo manual.`, data.message)
            Client.sendFileFromUrl(data.from, `${ytm.link}`, 'video.mp4', 'Hecho por *MiniBot*', data.message)
        } catch (e) {
            data.reply('🤖 Parece que tenemos un error.')
        }
    })

    Client.cmd.on('song', async (data) => {
        try {
           //if(isLimit(data.sender)) return data.reply(mess.limit)
            if(data.body == "") return data.reply(`*Necesito el link.*\nEjemplo: ${data.prefix}song https://youtu.be/Z6L4u2i97Rw`)
            data.reply(mess.wait)
            res = await yta(data.body)
            ytm = res
            if(Number(ytm.size.split(' MB')[0]) >= 99.00) return Client.sendFileFromUrl(data.from, `${ytm.thumb}`, 'thumb.jpg', `*Link* : ${ytm.link}\n\n🤖 Descarga no permitida por whatsapp.\nDescargalo manual.`, data.message)
            Client.sendFileFromUrl(data.from, `${ytm.link}`, 'Download.mp3', ``, data.message)
        } catch {
            data.reply('🤖 Parece que tenemos un error.')
        }
    })
/*######## FIN DESCARGAS ########*/

/*######## MAKER ########*/
    Client.cmd.on('calendario', async (data) => {
            if(isLimit(data.sender)) return data.reply(mess.limit)
            data.reply(mess.wait)
            if(data.isQuotedImage || data.type == 'imageMessage') {
                const getbuffs = data.isQuotedImage ? await data.downloadMediaQuotedMessage() : await data.downloadMediaMessage()
                bodyForm = new FormData()
                bodyForm.append('image', getbuffs, 'myimg.jpeg')
                const getAxios = await axios(`${configs.apiUrl}/api/calender?apikey=${configs.zeksKey}`, {
                    method: 'POST',
                    responseType: "arraybuffer",
                    headers: {
                        ...bodyForm.getHeaders()
                    },
                    data: bodyForm.getBuffer()
                })
                Client.sendFileFromBase64(data.from, getAxios.data.toString('base64'), 'p.jpg', 'Hecho por *MiniBot*', data.message)
            } else if(data.mentionedJidList.length > 0) {
                ppUrl = await client.getProfilePicture(data.mentionedJidList[0])
                if(!ppUrl) return data.reply('Foto de perfil no encontrada!')
                Client.sendFileFromUrl(data.from, `${configs.apiUrl}/api/calender?apikey=${configs.zeksKey}&image=${encodeURIComponent(ppUrl)}`, 'calender.jpg', 'Hecho por *MiniBot*', data.message)
            } else data.reply(`Formato incorrecto, etiqueta a alguien o responde la imagen con ${data.prefix}calender`)

        })
        
        Client.cmd.on('drawing', async (data) => {
            if(isLimit(data.sender)) return data.reply(mess.limit)
            data.reply(mess.wait)
            if(data.isQuotedImage || data.type == 'imageMessage') {
                const getbuffs = data.isQuotedImage ? await data.downloadMediaQuotedMessage() : await data.downloadMediaMessage()
                bodyForm = new FormData()
                bodyForm.append('image', getbuffs, 'myimg.jpeg')
                const getAxios = await axios(`${configs.apiUrl}/api/draw-image?apikey=${configs.zeksKey}`, {
                    method: 'POST',
                    responseType: "arraybuffer",
                    headers: {
                        ...bodyForm.getHeaders()
                    },
                    data: bodyForm.getBuffer()
                })
                Client.sendFileFromBase64(data.from, getAxios.data.toString('base64'), 'p.jpg', 'Hecho por *MiniBot*', data.message)
            } else if(data.mentionedJidList.length > 0) {
                ppUrl = await client.getProfilePicture(data.mentionedJidList[0])
                if(!ppUrl) return data.reply('Foto de perfil no encontrada!')
                Client.sendFileFromUrl(data.from, `${configs.apiUrl}/api/draw-image?apikey=${configs.zeksKey}&image=${encodeURIComponent(ppUrl)}`, 'calender.jpg', 'Hecho por *MiniBot*', data.message)
            } else data.reply(`Formato incorrecto, etiqueta a alguien o responde la imagen con ${data.prefix}drawing`)
        })
        
        Client.cmd.on('removebg', async (data) => {
            if(isLimit(data.sender)) return data.reply(mess.limit)
            data.reply(mess.wait)
            if(data.isQuotedImage || data.type == 'imageMessage') {
                const getbuffs = data.isQuotedImage ? await data.downloadMediaQuotedMessage() : await data.downloadMediaMessage()
                bodyForm = new FormData()
                bodyForm.append('image', getbuffs, 'myimg.jpeg')
                const getAxios = await axios(`${configs.apiUrl}/api/removebg?apikey=${configs.zeksKey}`, {
                    method: 'POST',
                    responseType: "arraybuffer",
                    headers: {
                        ...bodyForm.getHeaders()
                    },
                    data: bodyForm.getBuffer()
                })
                Client.sendFileFromBase64(data.from, getAxios.data.toString('base64'), 'p.jpg', 'Hecho por *MiniBot*', data.message)
            } else if(data.mentionedJidList.length > 0) {
                ppUrl = await client.getProfilePicture(data.mentionedJidList[0])
                if(!ppUrl) return data.reply('Foto de perfil no encontrada!')
                Client.sendFileFromUrl(data.from, `${configs.apiUrl}/api/removebg?apikey=${configs.zeksKey}&image=${encodeURIComponent(ppUrl)}`, 'calender.jpg', 'Hecho por *MiniBot*', data.message)
            } else data.reply(`Formato incorrecto, etiqueta a alguien o responde la imagen con ${data.prefix}removebg`)
        })


    //If you want case method
    Client.cmd.on('*', async (data) => {
        const {
            args,
            body,
            message,
            prefix,
            from,
            sender,
            command,
            isOwner,
            igGroup,
            type,
            isQuotedVideo,
            isQuotedImage,
            isQuotedSticker,
            isQuotedAudio,
            groupMetadata,
            isAdmin,
            botIsAdmin,
            pushname,
            t
        } = data
        switch(command.toLowerCase()) {
/*###### DUEÑO ######*/
            case 'private':
        		if (!isOwner) return data.reply(mess.ownerOnly)
        		if (Client.self) return data.reply('🤖 BOT modo Privado')
        		Client.self = true
        		data.reply('OK')
        	break
        	
            case 'public':
        		if (!isOwner) return data.reply(mess.ownerOnly)
        		if (!Client.self) return data.reply('🤖 BOT modo Publico')
        		Client.self = false
        		data.reply('OK')
        	break

            case 'menu':
                const mediaMsg = await client.prepareMessageMedia(await getBuffer(configs.imgUrl), 'imageMessage')
                const buttonMessage = {
                    contentText: menu(data.prefix, data.pushname),
                    footerText: 'MiniBot',
                    "contextInfo": {
                        mentionedJid: [configs.ownerList[0]],
                        participant: sender,
                        stanzaId: message.key.id,
                        quotedMessage: message.message,
                    },
                    buttons: [
                        {
                            buttonId: `${data.prefix}info`,
                            buttonText: {
                                displayText: "📒 𝐈𝐍𝐅𝐎"
                            },
                            "type": "RESPONSE"
                        },
                        {
                            buttonId: `${data.prefix}owner`,
                            buttonText: {
                                    displayText: "🪀 𝐎𝐖𝐍𝐄𝐑"
                            },
                            "type": "RESPONSE"
                        },
                    ],
                    headerType: 4,
                    ...mediaMsg 
                }
                let zz = await client.prepareMessageFromContent(from, {buttonsMessage: buttonMessage}, {})
                client.relayWAMessage(zz, {waitForAck: true})     
            break

            case 'update':
                data.reply(update)
            break

            case 'info':
                data.reply(ingfo)
            break
            
            case 'shazam':
                if(isLimit(data.sender)) return data.reply(mess.limit)
                data.reply(mess.wait)
                if(data.isQuotedAudio) {
                    files = await client.downloadMediaMessage(JSON.parse(JSON.stringify(message).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo)
                    bodyForm = new FormData()
                    bodyForm.append('audio', files, 'music.mp3')
                    axios(`${configs.apiUrl}/api/searchmusic?apikey=${configs.zeksKey}`, {
                        method: 'POST',
                        headers: {
                            ...bodyForm.getHeaders()
                        },
                        data: bodyForm.getBuffer()
                    })
                    .then(({
                        data
                    }) => {
                        if(data.status) {
                            data.reply(from, `✪〘 *DATOS ENCONTRADOS* 〙✪\n\n➡️ *Titulo:* ${data.data.title}\n➡️ *Artista:* ${data.data.artists}\n➡️ *Genero:* ${data.data.genre}\n➡️ *Album:* ${data.data.album}\n➡️ *Lanzamiento:* ${data.data.release_date}`, message)
                        } else data.reply(from, data.message, message)
                    }).catch(() => data.reply(from, '🤖 Parece que tenemos un error!, intente nuevamente.', message))
                } else data.reply(from, '🤖 Formato invalido!', message)
            break
            
            case 'tiktok':
                if(data.body == "") return data.reply(`🤖 Necesito el enlace`)
                data.reply(mess.wait)
                res = await Ttdl(data.body)
                ytm = res.result
                Client.sendFileFromUrl(data.from, `${ytm.nowatermark}`, 'video.mp4', 'Hecho por *MiniBot*', data.message)
            break
            
            case 'igdl':
                if(data.body == "") return data.reply(`🤖 Necesito el enlace`)
                data.reply(mess.wait)
                res = await igDownloader(data.body)
                ytm = res.result
                const msg = `${ytm.link}`
                if (msg.includes('.jpg')){Client.sendFileFromUrl(data.from, `${ytm.link}`, 'ig.jpg', 'Hecho por *MiniBot*', data.message)}
                if (msg.includes('.mp4')){Client.sendFileFromUrl(data.from, `${ytm.link}`, 'ig.mp4', 'Hecho por *MiniBot*', data.message)}
            break

            case 'google':
                try {
                    if(data.body == "") return data.reply(`🤖 Que deseas buscar?`)
                    let search = await ggle({ query: data.body })
                    let ggsm = ``
                    for (let i of search) {
                            ggsm += `*Titulo :* ${i.title}\n*Link :* ${i.link}\n*Contenido :* ${i.snippet}`
                        }
                    var nyangg = ggsm.trim()
                    data.reply(`🔍Busqueda realizada por *MiniBot*\n\n${nyangg}`)
                } catch {
                  data.reply('🤖 Parece que tenemos un error.')
                }
            break
            
            case 'tomp3':
                if(isLimit(data.sender)) return data.reply(mess.limit)
                data.reply(mess.wait)
                if(type != 'videoMessage' && !isQuotedVideo) return data.reply('Formato erróneo!')
                const getbuffz = data.isQuotedVideo ? JSON.parse(JSON.stringify(message).replace('quotedM','m')).message.extendedTextMessage.contextInfo : data.message 
                const dlfilez = await client.downloadMediaMessage(getbuffz)
                convertMp3(dlfilez).then(data =>Client.sendFileFromUrl(from, data, 'p.mp3', '', message)).catch(er => Client.reply(from, 'Error inesperado!', message))
            break
            
            case 'sticker':
                if(isLimit(data.sender)) return data.reply(mess.limit)
                if(type != 'videoMessage' && !isQuotedVideo && !isQuotedImage && type != 'imageMessage') return data.reply('Wrong format!')
                const getbuff = data.isQuotedVideo || data.isQuotedImage ? JSON.parse(JSON.stringify(data.message).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : data.message
                const dlfile = await client.downloadMediaMessage(getbuff)
                if(type == 'videoMessage' || isQuotedVideo) Client.sendMp4AsSticker(from, dlfile.toString('base64'), message, { pack: `${configs.pack}`, author: `${configs.author}` })
                else Client.sendImageAsSticker(from, dlfile.toString('base64'), message, { pack: `${configs.pack}`, author: `${configs.author}` })
            break
            
            case 'igstalk':
                if(data.body == "") return data.reply(`🤖 Necesito el nombre de usuario`)
                data.reply(mess.wait)
                res = await dbot.igstalk(data.body)
                ytm = res
                caption = `*Nombre:* ${ytm.fullName}\n*Usuario:* ${ytm.username}\n*Seguidores:* ${ytm.followers}\n*Siguiendo:* ${ytm.following}`
                Client.sendFileFromUrl(data.from, `${ytm.profilePicHD}`, 'ig.jpg', `${caption}`, data.message)
            break

/*###### ADMIN ######*/
            case 'hidetag':
                if(!data.isGroup) return data.reply(mess.group)
                if(!data.isAdmin) return data.reply(mess.admin)
                var mention = []
                data.groupMetadata.participants.forEach((member, i) => {
                    mention.push(member.jid)
                })
                data.reply(`${data.body}`, {
                    contextInfo: {
                        "mentionedJid": mention
                    }
                })
            break
        }
    })
} catch (e) {
        console.log(e)
    }
}

function isLimit(sender, count) {
    const dataUser = JSON.parse(fs.readFileSync('./lib/json/dataUser.json'))
    if(dataUser[sender].premium) return false
    if(dataUser[sender].limit >= configs.maxLimit) return true
    dataUser[sender].limit += count || 1
    fs.writeFileSync('./lib/json/dataUser.json', JSON.stringify(dataUser))
    return false
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}