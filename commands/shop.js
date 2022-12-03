const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let db = require('quick.db')
const { getShopButtons, getShopList, } = require('../components')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Магазин ролей'),
	async execute(interaction) {

		let uid = interaction.user.id
		let sid = interaction.guild.id
		let page = 1
		let pages = 0
		let money = db.get(`money_${sid}_${uid}`)
		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		let myItems = db.get('myItems')
		if (!myItems) {
			db.set('myItems', [])
		}

		let tmppage = Math.floor((myItems.length) / 5) + 1
		const listRole = getShopList(myItems, 0)
		const byeButtons = getShopButtons(myItems, 0)


		const embed = new MessageEmbed()
			.setTitle('Магазин личных ролей!')
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
			.addFields(...listRole)

		const buttons = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel("Last")
				.setStyle("DANGER")
				.setCustomId("last")
				.setDisabled(page == 1 ? true : false),
			new MessageButton()
				.setLabel("Next")
				.setStyle("PRIMARY")
				.setCustomId("next")
				.setDisabled(page == tmppage ? true : false)
		);

		const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });
		await interaction.reply({
			embeds: [embed],
			components: [buttons, byeButtons],
			ephemeral: true,
		})
		let aboba
		collector.on('collect', async i => {
			if (i.user.id !== interaction.user.id) return;

			switch (i.customId) {
				case 'next': {
					page += 1
					pages += 4
					const buttons = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel("Last")
							.setStyle("DANGER")
							.setCustomId("last")
							.setDisabled(page == 1 ? true : false),
						new MessageButton()
							.setLabel("Next")
							.setStyle("PRIMARY")
							.setCustomId("next")
							.setDisabled(page == tmppage ? true : false)
					);
					const embed = new MessageEmbed()
						.setTitle('Магазин личных ролей')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.addFields(...getShopList(myItems, pages))
					

					return await interaction.editReply({
						embeds: [embed],
						components: [buttons, getShopButtons(myItems, pages)],
						ephemeral: true,
					})
				}
				case 'last': {
					page -= 1
					pages -= 4
					const buttons = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel("Last")
							.setStyle("DANGER")
							.setCustomId("last")
							.setDisabled(page == 1 ? true : false),
						new MessageButton()
							.setLabel("Next")
							.setStyle("PRIMARY")
							.setCustomId("next")
							.setDisabled(page == tmppage ? true : false)
					);
					const embed = new MessageEmbed()
						.setTitle('Магазин личных ролей')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.addFields(...getShopList(myItems, pages))
					// .setFooter(`${page}/${tmppage}`)
					return await interaction.editReply({
						embeds: [embed],
						components: [buttons, getShopButtons(myItems, pages)],
						ephemeral: true,
					})
				}
				case 'yes': {
					const role = myItems[aboba].role
					let amount = myItems[aboba].match
					if (money >= amount) {
						await db.set('myItems', myItems.filter(i => i !== myItems[aboba]))
						i.member.roles.add(role.id)
						await db.set(`money_${sid}_${uid}`, money - amount)

						const embed = new MessageEmbed()
							.setTitle('Купить роль в магазине')
							.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
							.setDescription(`<@${interaction.user.id}>, Вы **купили** роль <@&${role.id}>`)
						return await interaction.editReply({
							embeds: [embed],
							components: [],
							ephemeral: true
						});
					} else {
						const embed = new MessageEmbed()
							.setTitle('Купить роль в магазине')
							.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
							.setDescription(`<@${interaction.user.id}>, у Вас недостаточно  <:durkas:975796782367907921> для покупки роли <@&${role.role.id}>. Необходимо ${amount - money}  <:durkas:975796782367907921>`)
						return await interaction.editReply({
							embeds: [embed],
							components: [],
							ephemeral: true
						});
					}
				}
				case 'not': {
					const role = myItems[aboba].role
					const embed = new MessageEmbed()
						.setTitle('Купить роль в магазине')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы **отменили** покупку роли <@&${role.id}>`)
					return await interaction.editReply({
						embeds: [embed],
						components: [],
						ephemeral: true
					});
				}
				default: {
					aboba = Number(i.customId)
					const tmp = myItems[aboba]
					let embedes = new MessageEmbed()
						.setTitle('Купить роль в магазине')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы уверены, что хотите купить роль <@&${tmp.role.id}> за ${tmp.match}  <:durkas:975796782367907921>?`)
					const buttonse = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel('cancel')
							.setStyle("DANGER")
							.setCustomId("not"),
						new MessageButton()
							.setLabel('yes')
							.setStyle("SUCCESS")
							.setCustomId("yes")
					);
					return await interaction.editReply({
						embeds: [embedes],
						components: [buttonse],
						ephemeral: true,
					})
				}
			}


		})


	},
}
