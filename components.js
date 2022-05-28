const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let db = require('quick.db')
const { channels } = require('./config.json');
const { Permissions } = require('discord.js');

function getMessages(message) {
	return new MessageEmbed()
		.addField('Отправитель', message.member.toString(), true)
		.addField('Канал', message.channel.toString(), true)
		.addField('Содержание', message.content ? message.content : `null`)
		.setTimestamp()
}

function setTimeCounter(oM, nM) {
	if (!oM.channel && nM.channel) {

		let tmpTime = db.get(`voiceTmpTime.${nM.member.id}`)
		if (!tmpTime)
			db.set(`voiceTmpTime.${nM.member.id}`, Date.now())


		let allTime = db.get(`voiceAllTime.${nM.member.id}`)
		if (!allTime)
			db.set(`voiceAllTime.${nM.member.id}`, 0)


		let dayTime = db.get(`voiceAllTime.${nM.member.id}`)
		if (!dayTime)
			db.set(`voiceDayTime.${nM.member.id}`, 0)


		let todayTime = new Date()
		var dd = String(todayTime.getDate()).padStart(2, '0');
		var mm = String(todayTime.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = todayTime.getFullYear();

		todayTime = mm + dd + yyyy;
		let lastTime = db.get(`voiceLastTime`)
		if (!lastTime) {
			db.set(`voiceLastTime`, 0)
			lastTime = 0
		}

		if (lastTime < todayTime) {
			db.set(`voiceLastTime`, Number(todayTime))
			db.set(`voiceDayTime.${nM.member.id}`, 0)
		}

	} else if (!nM.channel) {
		var endTime = Date.now();
		let tmpTime = db.get(`voiceTmpTime.${nM.member.id}`)
		if (!tmpTime) return;

		let time = endTime - tmpTime;

		db.add(`voiceAllTime.${oM.member.id}`, time);
		db.add(`voiceDayTime.${oM.member.id}`, time);
		db.set(`voiceTmpTime.${oM.member.id}`, null);
	}




}
function removeRoom(oM, nM) {
	if (!nM.channel) {
		const tmp = oM.guild.channels.cache.find(channel => channel.name === nM.guild.name)
		if (tmp) tmp.delete()
	}
}

function getRandomRoom(oM, nM) {
	if (nM.channel && nM.channel.name.startsWith('┌random')) {
		nM.setChannel(channels[(Math.floor(Math.random() * 49))])
	}

}
function getPersonalRoom(oM, nM) {
	if (nM.channel != null && nM.channel.name.startsWith('├personal')) {
		nM.guild.channels.create(nM.member.user.username, {
			type: 'GUILD_VOICE',
			parent: '972491122981077012',
		}).then(cloneChannel => nM.setChannel(cloneChannel))
	}
}

function getPrivateRoom(oM, nM) {
	if (nM.channel != null && nM.channel.name.startsWith('└private')) {
		nM.guild.channels.create(nM.member.user.username, {
			type: "GUILD_VOICE", parent: '972490997969862777',
			permissionOverwrites: [{
				id: nM.guild.id,
				deny: [Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.CONNECT],
				allow: [Permissions.FLAGS.VIEW_CHANNEL]
			}]

		}).then(cloneChannel => nM.setChannel(cloneChannel))
	}
}

function setUserLvl(message) {
	let uid = message.author.id
	let sid = message.guild.id
	let xp = db.get(`xp_${sid}_${uid}`)
	let lvl = db.get(`lvl_${sid}_${uid}`)

	if (!xp) {
		db.set(`xp_${sid}_${uid}`, 0)
		xp = 0
	}
	if (!lvl) {
		db.set(`lvl_${sid}_${uid}`, 1)
		lvl = 1
	}
	db.add(`xp_${sid}_${uid}`, 1)
	if (xp >= 90) {
		db.add(`lvl_${sid}_${uid}`, 1)
		db.set(`xp_${sid}_${uid}`, 0)
	}
	switch (lvl) {
		case 1: {
			message.member.roles.add('974343451678244904')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974343451678244904> `)
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 5: {
			message.member.roles.remove('974343451678244904')
			message.member.roles.add('974343448930959390')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974343448930959390> `)
			message.member.send("Теперь вы можете собирать ежедневные награды.");

			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 25: {
			message.member.roles.remove('974343448930959390')
			message.member.roles.add('974343445491621889')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974343445491621889> `)
			message.member.send("Теперь вы можете создавать приватные комнаты");
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 50: {
			message.member.roles.remove('974343445491621889')
			message.member.roles.add('974343442656272494')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974343442656272494> `)
			message.member.send("Теперь вы можете делится изображениями.");
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 100: {
			message.member.roles.remove('974343442656272494')
			message.member.roles.add('974343439284052087')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974343439284052087> `)
			message.member.send("Теперь вам начинает вести в ежедневных наградах.");
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 250: {
			message.member.roles.remove('974343439284052087')
			message.member.roles.add('974342727514849290')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974342727514849290> `)
			message.member.send("Тепер ваша комиссия в магазине составит 0%.");
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 500: {
			message.member.roles.remove('974342727514849290')
			message.member.roles.add('974342721630249021')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974342721630249021> `)
			message.member.send("Вам открывается доступ к закрытому каналу.");
			db.add(`lvl_${sid}_${uid}`, 1)


			break;
		} case 1000: {
			message.member.roles.remove('974342721630249021')
			message.member.roles.add('974342141230845973')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974342141230845973> `)
			message.member.send("Вам открывается привилегии модератора.");
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		} case 2500: {
			message.member.roles.remove('974342141230845973')
			message.member.roles.add('974340757198630952')
			message.channel.send(`${message.author}, ты поднял(-а) уровень! Теперь ты <@&974340757198630952> `)
			message.member.send("Мы любим вас! Будущее сервера в ваших руках.");
			db.add(`lvl_${sid}_${uid}`, 1)

			break;
		}
	}
}
function getTimeStr(time) {


	let days = Math.floor(time / (1000 * 60 * 60 * 24) % 30)

	let hours = Math.floor((time / (1000 * 60 * 60)) % 24)
	let minutes = Math.floor((time / (1000 * 60)) % 60)
	if (days == 0) return `** ${hours}** часов, ** ${minutes}** минут`
	else return `** ${days}** дней, ** ${hours}** часов, ** ${minutes}** минут`
}
function getShopList(array, page) {
	const tmp = array.filter((d, i) => i >= (page) && i < (page + 5))
	return tmp.map((d, i) => {
		return { name: `${page + i + 1})`, value: ` <@&${d.role.id}>\n**Ценна:** ${d.match} <:durkas:975796782367907921>\n**Продает:** <@${d.id}>` }
	})

}

function getShopButtons(array, page) {
	const tmp = array.filter((d, i) => i >= (page) && i < (page + 5))

	return new MessageActionRow().addComponents(
		tmp.map((d, i) => {
			return new MessageButton()
				.setLabel(`${page + i + 1}`)
				.setStyle("SUCCESS")
				.setCustomId(`${page + i}`)
		})


	);


}
module.exports = {
	setTimeCounter, getMessages,
	getPersonalRoom, getPrivateRoom,
	getShopButtons, setUserLvl,
	getTimeStr, removeRoom,
	getShopList, getRandomRoom
}
