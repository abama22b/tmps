const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Жалоба на участника сервера Currente Calamo')
		.addUserOption(option => option.setName('target').setDescription('Пользователь'))
		.addStringOption(option => option.setName('message').setDescription('Комментарий')),
	async execute(interaction) {

		const user = interaction.options.getUser('target');
		const message = interaction.options.getString('message');

		if (user && message) {
			const embed = new MessageEmbed()
				.addField('Отправитель', interaction.user.toString(), true)
				.addField('Пользователь', user.toString(), true)
				.addField('Канал', interaction.channel.toString(), true)
				.addField('Комментарий', message)
				.setTimestamp()
			await interaction.guild.channels.cache.get("973998435285999707").send({ embeds: [embed] })

			return await interaction.reply({
				content: `<@${interaction.user.id}>, **Жалоба** на пользователяя <@${user.id}> **отправлена!**`,
				ephemeral: true
			});
		} else {

			return await interaction.reply({
				content: `<@${interaction.user.id}>, Пожалуйста **заполните** все **поля!**`,
				ephemeral: true
			});
		}
	},
};