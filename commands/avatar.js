const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Получить аватара выбранного пользователя или свой собственный аватар')
		.addUserOption(option => option.setName('target').setDescription('Пользователь')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (user) {
			const embed = new MessageEmbed()
				.setTitle(`Аватар ${user.username}`)
				.setDescription(`<@${interaction.user.id}>, ниже аватарка <@${user.id}>`)
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				.setImage(`${user.displayAvatarURL({ size: 2048, dynamic: true })}`)

			return interaction.reply({
				"embeds": [embed],
			});
		} else {
			const embed = new MessageEmbed()
				.setTitle('Аватар')
				.setDescription(`<@${interaction.user.id}>, ниже **Ваша** аватарка`)
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				.setImage(`${interaction.user.displayAvatarURL({ size: 2048, dynamic: true })}`)

			return interaction.reply({
				"embeds": [embed],
			});
		}
	}
};