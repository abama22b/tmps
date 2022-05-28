const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} = require("discord.js");
let db = require('quick.db')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("duel")
        .setDescription("Вызвать на дуэль")
        .addIntegerOption(option => option.setName('amount').setDescription('Укажите вашу ставку')),

    execute: async (interaction) => {
        let amount = interaction.options.getInteger('amount');
        let uid = interaction.user.id
        let sid = interaction.guild.id

        let money = db.get(`money_${sid}_${uid}`)
        if (!money) {
            db.set(`money_${sid}_${uid}`, 0)
            money = 0
        }
        if (money < amount) return interaction.reply(`<@${interaction.user.id}>, **У** вас **недостаточно ${amount - money}** <:durkas:975796782367907921>`)
        if (!(amount >= 50)) return interaction.reply(`<@${interaction.user.id}>, **Минимальна** ставка **50**<:durkas:975796782367907921>`)
        if (!amount) return interaction.reply(`<@${interaction.user.id}>, **Минимальна** ставка **50**<:durkas:975796782367907921>`)

        const embed = new MessageEmbed()
            .setTitle('Дуэли')
            .setDescription(`<@${interaction.user.id}>, хочет с кем-то сразиться на ${amount} <:durkas:975796782367907921>`)
            .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Cразится")
                .setStyle("SUCCESS")
                .setCustomId("paper")
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
            if (i.user.id == interaction.user.id) return
            let eid = i.user.id

            let emoney = db.get(`money_${sid}_${eid}`)
            if (!emoney) {
                db.set(`money_${sid}_${eid}`, 0)
                emoney = 0
            }

            if (emoney < amount) return

            const roll = Math.floor(Math.random() * 10)
            if (roll >= 5) {
                const embedwin = new MessageEmbed()
                    .setTitle('Дуэли')
                    .setDescription(`В **дуэли** одержал **победу** <@${i.user.id}> и **получил** ${amount} <:durkas:975796782367907921>`)
                    .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
                db.set(`money_${sid}_${eid}`, emoney + amount)
                db.set(`money_${sid}_${uid}`, money - amount)
                return i.update({ embeds: [embedwin], components: [] });
            } else {
                const embedlose = new MessageEmbed()
                    .setTitle('Дуэли')
                    .setDescription(`В **дуэли** одержал **победу** <@${interaction.user.id}> и **получил** ${amount} <:durkas:975796782367907921>`)
                    .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
                db.set(`money_${sid}_${eid}`, emoney - amount)
                db.set(`money_${sid}_${uid}`, money + amount)
                return i.update({ embeds: [embedlose], components: [] });
            }
        });
    },
};

