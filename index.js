const {
	setTimeCounter, getMessages,
	getPersonalRoom, getPrivateRoom,
	setUserLvl,
	removeRoom, getRandomRoom
} = require('./components.js');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_PRESENCES,]
});

//	MEMBERADD
client.on('guildMemberAdd', (member) => {
	member.send("Welcome!");
});


// UPLOADING THE COMMANDS FOR INTERACTION
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}


//	INTERACTION
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


//	MESSAGEDELETE
client.on('messageDelete', (message) => {
	const channel = "972184647201062932"
	let files = []
	for (let val of message.attachments) files.push(val[1].proxyURL)
	const Embed = getMessages(message)
	client.channels.cache.get(channel).send({ files: files, embeds: [Embed] })

})


//	MESSAGEUPDATE
client.on('messageUpdate', (message) => {
	const channel = "974257431897051146"
	let files = []
	for (let val of message.attachments) files.push(val[1].proxyURL)
	const Embed = getMessages(message)
	client.channels.cache.get(channel).send({ files: files, embeds: [Embed] })
})


//	VOICESTATEUPDATE
client.on("voiceStateUpdate", (oldMember, newMember) => {
	setTimeCounter(oldMember, newMember)

	getRandomRoom(oldMember, newMember)
	getPrivateRoom(oldMember, newMember)
	getPersonalRoom(oldMember, newMember)

	removeRoom(oldMember, newMember)
})


//	MESSAGE
client.on('message', async (message) => {
	setUserLvl(message)
})


// LOGGING BOT
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.login(token);