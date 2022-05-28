const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let db = require('quick.db')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Отправить койны выбранному пользователю')
		.addUserOption(option => option.setName('target').setDescription('Пользователь'))
		.addIntegerOption(option => option.setName('amount').setDescription('Сумма перевода')),
	async execute(interaction) {
		const user = interaction.options.getUser('target')
		let amount = interaction.options.getInteger('amount')

		if (!amount) return interaction.reply('**Заполните все поля!**')
		if (!user) return interaction.reply('**Заполните все поля!**')

		let uid = interaction.user.id
		let sid = interaction.guild.id

		let fid = user.id
		let fmoney = db.get(`money_${sid}_${fid}`)
		if (!fmoney) {
			db.set(`money_${sid}_${fid}`, 0)
			fmoney = 0
		}

		let money = db.get(`money_${sid}_${uid}`)
		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		if (!(user && amount)) return interaction.reply('**Заполните** все **поля**')
		if (!(money > amount)) return interaction.reply('У **вас** недостаточно **койнов!**')
		if (!(amount <= 50)) return interaction.reply('**Минимальнальная** сумма перевода **50 койнов**')
		if (user) {
			db.set(`money_${sid}_${uid}`, money - amount)
			db.set(`money_${sid}_${fid}`, fmoney + Math.floor(amount * 0.96))

			const embed = new MessageEmbed()
				.setTitle('Передача валюты')
				.setDescription(`<@${interaction.user.id}>,  Вы передали пользователю <@${user.id}> ${amount} <:durkas:975796782367907921>, включая комиссию 4%`)
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
			return interaction.reply({
				"embeds": [embed],
			});
		}
	},
};