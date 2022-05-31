let db = require('quick.db')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getTimeStr } = require('../components');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Получить профиль выбранного пользователя или свой собственный')
		.addUserOption(option => option.setName('target').setDescription('Пользователь')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (user) {
			let uid = user.id
			let sid = interaction.guild.id


			let allTime = db.get(`voiceAllTime.${uid}`)

			if (!allTime) {
				db.set(`voiceAllTime.${uid}`, 0)
				allTime = 0
			}
			let lvl = db.get(`lvl_${sid}_${uid}`)
			if (!lvl) {
				db.set(`lvl_${sid}_${uid}`, 1)
				lvl = 1
			}

			let money = db.get(`money_${sid}_${uid}`)
			if (!money) {
				db.set(`money_${sid}_${uid}`, 0)
				money = 0
			}

			const embed = new MessageEmbed()
				.setTitle(`Профиль — ${user.username}`)
				.setThumbnail(`${user.displayAvatarURL({ dynamic: false })}`)
				.addFields(
					{ name: "уровень:", value: `${lvl}`, inline: true },
					{ name: "койнов:", value: `${money}`, inline: true },
					{ name: "онлайн:", value: getTimeStr(allTime), inline: true },
				)
			return await interaction.reply({
				embeds: [embed],
			});
		} else {

			let uid = interaction.user.id
			let sid = interaction.guild.id

			let allTime = db.get(`voiceAllTime.${uid}`)

			if (!allTime) {
				db.set(`voiceAllTime.${uid}`, 0)
				allTime = 0
			}
			let lvl = db.get(`lvl_${sid}_${uid}`)
			if (!lvl) {
				db.set(`lvl_${sid}_${uid}`, 1)
				lvl = 1
			}

			let money = db.get(`money_${sid}_${uid}`)
			if (!money) {
				db.set(`money_${sid}_${uid}`, 0)
				money = 0
			}

			const embed = new MessageEmbed()
				.setTitle(`Профиль — ${interaction.user.username}`)
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				.addFields(
					{ name: "уровень:", value: `${lvl}`, inline: true },
					{ name: "койнов:", value: `${money}`, inline: true },
					{ name: "онлайн:", value: getTimeStr(allTime), inline: true },
				)
			return await interaction.reply({
				embeds: [embed],
			});
		}
	}
}