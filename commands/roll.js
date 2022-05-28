const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let db = require('quick.db')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Ежедневная награда'),
	async execute(interaction) {
		let uid = interaction.user.id
		let sid = interaction.guild.id

		let money = db.get(`money_${sid}_${uid}`)
		let date = db.get(`date_${sid}_${uid}`)
		let today = Date.now();


		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}
		if (!date) {
			db.set(`date_${sid}_${uid}`, 0)
			date = 0
		}

		if (today >= date) {
			let roll = Math.floor(Math.random() * 100)
			db.add(`money_${sid}_${uid}`, roll)
			db.set(`date_${sid}_${uid}`, today + 43200000)

			const embed = new MessageEmbed()
				.setTitle('Ежедневная награды')
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
				.setDescription(`<@${interaction.user.id}> Ваша **награда** на сегодня **${roll}** <:durkas:975796782367907921>. **Возвращайтесь** через **12** часов.`, true)
			return interaction.reply({
				"embeds": [embed],
			});

		} else {
			let term = date - today
			let hours = Math.floor((term / (1000 * 60 * 60)) % 24);
			let minutes = Math.floor((term / (1000 * 60)) % 60);
			let seconds = Math.floor((term / 1000) % 60);

			const embed = new MessageEmbed()
				.setTitle('Ежедневная награда')
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
				.setDescription(`<@${interaction.user.id}> Вы **уже** забрали **ежедневную** награду! Вы можете **получить** следующую через **${hours}** часа, **${minutes}** минут, **${seconds}** секунду`, true)
			return interaction.reply({
				"embeds": [embed],
			});
		}
	},
};