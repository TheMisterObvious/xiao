const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class DistractedBoyfriendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'distracted-boyfriend',
			aliases: ['man-looking-at-other-woman'],
			group: 'avatar-edit',
			memberName: 'distracted-boyfriend',
			description: 'Draws three user\'s avatars over the "Distracted Boyfriend" meme.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'otherGirl',
					label: 'other girl',
					prompt: 'Which user should be the "other girl"?',
					type: 'user'
				},
				{
					key: 'girlfriend',
					prompt: 'Which user should be the girlfriend?',
					type: 'user'
				},
				{
					key: 'boyfriend',
					prompt: 'Which user should be the boyfriend?',
					type: 'user',
					default: ''
				},
			]
		});
	}

	async run(msg, { otherGirl, girlfriend, boyfriend }) {
		if (!boyfriend) boyfriend = msg.author;
		const boyfriendAvatarURL = boyfriend.displayAvatarURL({
			format: 'png',
			size: 256
		});
		const girlfriendAvatarURL = girlfriend.displayAvatarURL({
			format: 'png',
			size: 256
		});
		const otherGirlAvatarURL = otherGirl.displayAvatarURL({
			format: 'png',
			size: 256
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'distracted-boyfriend.png'));
			const boyfriendAvatarData = await snekfetch.get(boyfriendAvatarURL);
			const boyfriendAvatar = await loadImage(boyfriendAvatarData.body);
			const girlfriendAvatarData = await snekfetch.get(girlfriendAvatarURL);
			const girlfriendAvatar = await loadImage(girlfriendAvatarData.body);
			const otherGirlAvatarData = await snekfetch.get(otherGirlAvatarURL);
			const otherGirlAvatar = await loadImage(otherGirlAvatarData.body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(-18.06 * (Math.PI / 180));
			ctx.drawImage(boyfriendAvatar, 318, 67, 125, 125);
			ctx.rotate(18.06 * (Math.PI / 180));
			ctx.rotate(3.11 * (Math.PI / 180));
			ctx.drawImage(girlfriendAvatar, 534, 95, 100, 125);
			ctx.rotate(-3.11 * (Math.PI / 180));
			ctx.drawImage(otherGirlAvatar, 120, 96, 175, 175);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'distracted-boyfriend.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
