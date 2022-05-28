const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let db = require('quick.db')
const { lock } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Создать личную роль')
		.addStringOption(option => option.setName('color').setDescription('Цвет вашей будущей роли в формате #000000'))
		.addStringOption(option => option.setName('name').setDescription('Название вашей личной роли')),
	async execute(interaction) {
		const color = interaction.options.getString('color');
		const messages = interaction.options.getString('name');
		if (!messages) return interaction.reply(`<@${interaction.user.id}>, Вы **забыли** дать **название** своей **будущей** роли!`);
		if (!color) return interaction.reply(`<@${interaction.user.id}>, **Вы **забыли** дать **цвет** своей **будущей** роли!`);

		let uid = interaction.user.id
		let sid = interaction.guild.id

		let money = db.get(`money_${sid}_${uid}`)
		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		if (color.startsWith('#') && !(color.length == 7))
			return interaction.reply(`<@${interaction.user.id}>, **Неправильно** указан **цвет** ( пример #ffffff )`);
		if (lock.find(dev => messages == dev))
			return interaction.reply(`**Это** приватная **роль** сервера!`);

		if (money >= 1) {
			await interaction.guild.roles.create({
				name: messages,
				color: color,
				permissions: []
			})

			const role = await interaction.guild.roles.cache.find(i => (i.name == messages))
			const embed = new MessageEmbed()
				.setTitle('Создать личную роль')
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				.setDescription(`<@${interaction.user.id}>, Вы **уверены**, что хотите **создать** роль ${role} за 1000 <:durkas:975796782367907921>?`)

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
					db.set(`money_${sid}_${uid}`, money - 1)
					const embed = new MessageEmbed()
						.setTitle('Cоздать личную роль')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}> **Роль** ${role} **создана!**`)
					await i.update({ embeds: [embed], components: [] });
				} else {
					const embed = new MessageEmbed()
						.setTitle('Создать личную роль')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы **отменили** создание **роли**.`)
					await i.update({ embeds: [embed], components: [] });
				}

			});

		} else {
			await interaction.reply(`У вас **недостаточно** койнов кастомная **роль** стоит 1000 <:durkas:975796782367907921>. Вам нехватает **${1000 - money} <:durkas:975796782367907921>**`);
		}

	},
};