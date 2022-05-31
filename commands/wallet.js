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
		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}
		const embed = new MessageEmbed()
			.setTitle(`Текущий баланс — ${interaction.user.username}`)
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
			.addField(
				"койнов:", `${money}`, true
			)
		return await interaction.reply({
			embeds: [embed],
		});
	},
};