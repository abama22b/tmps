const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let db = require('quick.db')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallet')
		.setDescription('Показать мой текущий баланс'),
	async execute(interaction) {
		let uid = interaction.user.id
		let sid = interaction.guild.id
		let money = db.get(`money_${sid}_${uid}`)
		if (money == null) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}
		const Embed = new MessageEmbed()
			.setTitle(`Текущий баланс — ${interaction.user.username}`)
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
			.addFields(
				{ name: "койнов:", value: `${money}`, inline: true },
				{ name: "осколков:", value: `0`, inline: true },
			)
		return interaction.reply({
			"embeds": [Embed],
		});
	},
};