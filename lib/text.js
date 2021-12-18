const moment = require('moment-timezone');
const menu = (prefix, pushname) => {
	var time = moment().tz('America/Bogota').format('HH:mm:ss')
	if(time < "05:00:00"){var saludo = 'Es muy temprano, duerme un poco mas.'}
	else if(time < "12:00:00"){var saludo = 'Buenos Dias'}
	else if(time < "19:00:00"){var saludo = 'Buenas Tardes'}
	else if(time < "23:59:00"){var saludo = 'Buenas Noches'}

	let p = "╠❖"
	return `══✪〘 *MiniBot* 〙✪══

Hola ${pushname} ${saludo}

*🪀 Owner* : @${configs.ownerList[0].split('@')[0]}
*🖊️ Prefix* : ${configs.prefix}
*⏰ Hora* : ${moment().utcOffset('1000').format('DD-MM-YYYY HH:mm:ss')}

╔══✪〘 *MENU* 〙✪══
${p} ${configs.prefix}alive
${p} ${configs.prefix}menu
${p} ${configs.prefix}update
${p} ${configs.prefix}info
${p} ${configs.prefix}owner
${p} ${configs.prefix}donar
${p} ${configs.prefix}limit
╠══✪〘 *GRUPOS* 〙✪══
${p} ${configs.prefix}group
${p} ${configs.prefix}antilink
${p} ${configs.prefix}welcome
${p} ${configs.prefix}setppgroup
${p} ${configs.prefix}setgroupname
${p} ${configs.prefix}setgroupdesc
${p} ${configs.prefix}promote _@mensiona_
${p} ${configs.prefix}demote _@mensiona_
${p} ${configs.prefix}add _numero_
${p} ${configs.prefix}kick _@mensiona_
${p} ${configs.prefix}tagall
${p} ${configs.prefix}difusion texto
${p} ${configs.prefix}linkgroup
${p} ${configs.prefix}revoke
╠══✪〘 *DESCARGAS* 〙✪══
${p} ${configs.prefix}sfw
${p} ${configs.prefix}nsfw
${p} ${configs.prefix}google texto
${p} ${configs.prefix}yt texto
${p} ${configs.prefix}song _url_
${p} ${configs.prefix}video _url_
${p} ${configs.prefix}tiktok _url_
${p} ${configs.prefix}shazam _reply audio_
${p} ${configs.prefix}igstalk _usuario_
${p} ${configs.prefix}igdl _url_
╠══✪〘 *MAKER* 〙✪══
${p} ${configs.prefix}tomp3 _reply video_
${p} ${configs.prefix}sticker _reply imagen_
${p} ${configs.prefix}calendario _reply imagen_
${p} ${configs.prefix}drawing _reply imagen_
${p} ${configs.prefix}removebg _reply imagen_
╠══✪〘 *OWNER* 〙✪══
${p} ${configs.prefix}join link-grupo
${p} ${configs.prefix}resetlimit
${p} ${configs.prefix}premium add|del 57xxxxx
${p} ${configs.prefix}private
${p} ${configs.prefix}public
╚══✪〘 *MiniBot* 〙✪══`
}

const update = `╔══✪〘 *MiniBot* 〙✪══
╠❖ NUEVA ACTUALIZACIÓN
╠⊷️ *Version:* ${configs.version}
╠⊷️ *Prefix:* [${configs.prefix}]
╠══✪〘 *CAMBIOS* 〙✪══
╠⊷️ 
╠⊷️ 
╚══════════════════`

const ingfo = `BOT programado en *Node.js / JavaScript*
Codigo del repositorio: https://github.com/
Si encuentra algún error, contacté al propietario de BOT escribiendo ${configs.prefix}owner

Geupo del Oficial del BOT: https://chat.whatsapp.com/GxjXaj3SxNDAWh8oMQ5bkg

Grupo de soporte: https://chat.whatsapp.com/IeRNuoNY1IQJS8JE02duW8

Muchas Gracias.`

const listCode = `Codigo de idioma no existe.\nen-us English (United States)\nes Spanish`

const mess = {
    wait: '🤖 Espera un momento.',
			 group: '🤖 Comando solo para grupos!',
			 admin: '🤖 Comando solo para admins!',
			 botAdmin: '🤖 Comando solo si el BOT es admin',
			 limit: '🤖 Limite de uso expirado.\n\n*Nota:* El limite se restablece a las 00.00',
			 ownerOnly: '🤖 Esté comando solo lo puede usar el dueño del BOT'
}

module.exports = {
	menu,
	ingfo,
	listCode,
	mess,
	update
}
