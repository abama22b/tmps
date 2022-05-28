

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let db = require('quick.db')
const { lock } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Продажа роли')
		.addRoleOption(option => option.setName('role').setDescription('Выберите роль'))
		.addIntegerOption(option => option.setName('amount').setDescription('Цена при продаже')),
	async execute(interaction) {

		const role = interaction.options.getRole('role');
		const integer = interaction.options.getInteger('amount');
		if (!integer) return interaction.reply(`Вы **не** указали **цену** за которую хотите **продать**`);
		if (integer < 50) return interaction.reply(`**Минимальная** цена **продажи** роли 50 <:durkas:975796782367907921>`);
		if (lock.find(roles => roles == role.name)) return interaction.reply(`**Нельзя** продать **роль** ${role}`);

		const myItems = db.get('myItems')
		if (!myItems) {
			db.set('myItems', [])
		}

		let tmp = interaction.member._roles
		if (tmp.find(rolea => rolea == role.id)) {
			const embed = new MessageEmbed()
				.setTitle('Продажа роли')
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				.setDescription(`<@${interaction.user.id}>, Вы уверены, что хотите продать роль ${role} за ${integer} <:durkas:975796782367907921>?`)
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel('cancel')
					.setStyle("DANGER")
					.setCustomId("not"),
				new MessageButton()
					.setLabel('yes')
					.setStyle("SUCCESS")
					.setCustomId("yes")
			);
			const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });
			await interaction.reply({
				embeds: [embed],
				components: [buttons],
			})
			setTimeout(() => {
				interaction.deleteReply();
			}, 15000);

			collector.on('collect', async i => {
				if (i.user.id !== interaction.user.id) return

				if (i.customId === 'yes') {
					i.member.roles.add(role)
					const embed = new MessageEmbed()
						.setTitle('Продажа роли')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, **Роль** ${role} **выставлена на прадажу!**`)
					db.push('myItems', { id: interaction.user.id, role: role, match: integer })
					interaction.member.roles.remove(role)
					return i.update({ embeds: [embed], components: [] });
				} else {
					const embed = new MessageEmbed()
						.setTitle('Продажа роли')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы **отменили** действие с **ролью**`)
					return i.update({ embeds: [embed], components: [] });
				}
			});
		} else {
			return interaction.reply(`У вас нет роли ${role}`);
		}
	},
};