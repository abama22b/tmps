const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let db = require('quick.db')
const { occupied } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Создать личную роль')
		.addStringOption(option => option.setName('color').setDescription('Цвет вашей будущей роли в формате `#000000`'))
		.addStringOption(option => option.setName('name').setDescription('Название вашей личной роли')),
	async execute(interaction) {

		const color = interaction.options.getString('color');
		const messages = interaction.options.getString('name');

		if (!messages)
			return interaction.reply({
				content: `<@${interaction.user.id}>, Вы **забыли** дать **название** своей **будущей** роли!`,
				ephemeral: true
			});
		if (!color)
			return interaction.reply({
				content: `<@${interaction.user.id}>, **Вы **забыли** дать **цвет** своей **будущей** роли!`,
				ephemeral: true
			});

		let uid = interaction.user.id
		let sid = interaction.guild.id

		let money = db.get(`money_${sid}_${uid}`)
		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		if (color.startsWith('#') && !(color.length == 7))
			return interaction.reply({
				content: `<@${interaction.user.id}>, **Неправильно** указан **цвет** пример \`#ffffff\``,
				ephemeral: true
			});
		if (occupied.find(dev => messages == dev))
			return await interaction.reply({
				content: `<@${interaction.user.id}>, **Это** приватная **роль** сервера!`,
				ephemeral: true
			});

		if (await interaction.guild.roles.cache.find(i => (i.name == messages)))
			return await interaction.reply({
				content: `<@${interaction.user.id}>, **Роль** с **таким** названием **существует**!`,
				ephemeral: true
			});

		if (money >= 5000) {

			const role = await interaction.guild.roles.create({
				name: messages,
				color: color,
				permissions: []
			})

			const embed = new MessageEmbed()
				.setTitle('Создать личную роль')
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				.setDescription(`<@${interaction.user.id}>, Вы **уверены**, что хотите **создать** роль <@&${role.id}> за 1000 <:durkas:975796782367907921>?`)

			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel('cancel')
					.setStyle("DANGER")
					.setCustomId("not"),
				new MessageButton()
					.setLabel('create')
					.setStyle("SUCCESS")
					.setCustomId("yes")
			);

			const collector = interaction.channel.createMessageComponentCollector({ max: 1, time: 15000 });
			await interaction.reply({
				embeds: [embed],
				components: [buttons],
			})


			collector.on('collect', async i => {
				if (i.user.id !== interaction.user.id) return

				if (i.customId === 'yes') {
					await i.member.roles.add(role)
					await db.set(`money_${sid}_${uid}`, money - 5000)
					const embed = new MessageEmbed()
						.setTitle('Cоздать личную роль')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}> **Роль** <@&${role.id}> **создана!**`)

					return await interaction.editReply({
						embeds: [embed],
						components: []
					});
				} else {
					await role.delete()
					const embed = new MessageEmbed()
						.setTitle('Создать личную роль')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы **отменили** создание **роли**.`)

					return await interaction.editReply({
						embeds: [embed],
						components: []
					});
				}
			});

		} else {
			return await interaction.reply({
				content: `<@${interaction.user.id}>, У вас **недостаточно** койнов кастомная **роль** стоит 1000 <:durkas:975796782367907921>.`,
				ephemeral: true
			});
		}

	},
};