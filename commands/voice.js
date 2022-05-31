const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let db = require('quick.db');
const { getTimeStr } = require('../components.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Показать мое время онлайн'),
	async execute(interaction) {
		let uid = interaction.user.id

		let allTime = db.get(`voiceAllTime.${uid}`)
		if (!allTime) {
			db.set(`voiceAllTime.${uid}`, 0)
			allTime = 0
		}

		let dayTime = db.get(`voiceDayTime.${uid}`)
		if (!dayTime) {
			db.set(`voiceDayTime.${uid}`, 0)
			dayTime = 0
		}

		let todayTime = new Date()
		var dd = String(todayTime.getDate()).padStart(2, '0')
		var mm = String(todayTime.getMonth() + 1).padStart(2, '0')
		var yyyy = todayTime.getFullYear()
		todayTime = mm + dd + yyyy;

		let lastTime = db.get(`voiceLastTime`)
		if (!lastTime) {
			db.set(`voiceLastTime`, 0)
			lastTime = 0
		}

		if (lastTime < todayTime) {
			db.set(`voiceLastTime`, Number(todayTime))
			db.set(`voiceDayTime.${uid}`, 0)
			dayTime = 0
		}

		const embed = new MessageEmbed()
			.setTitle(`Голосовой онлайн — ${interaction.user.username}`)
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
			.addFields(
				{ name: "За сутки", value: getTimeStr(dayTime), inline: true },
				{ name: "За всё время", value: getTimeStr(allTime), inline: true },
			)

		return await interaction.reply({
			embeds: [embed],
		});
	},
};