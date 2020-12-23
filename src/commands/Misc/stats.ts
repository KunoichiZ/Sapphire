// Stats command from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions } from '@sapphire/framework';
import { roundNumber } from '@sapphire/utilities';
import { format } from '@utils/durationFormat';
import { Branding } from '@utils/Branding';
import { Message, MessageEmbed } from 'discord.js';
import { cpus } from 'os';
import SapphireCommand from '@lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	description: 'View bot statistics'
})
export default class StatsCommand extends SapphireCommand {

	public async run(message: Message) {
		return message.channel.send(await this.buildEmbed(message));
	}

	private async buildEmbed(message: Message) {
		const prefix = await this.context.client.fetchPrefix(message);
		const { generalStatistics, serverStatistics } = this;
		return new MessageEmbed()
			.setColor(Branding.BrandingColors.Primary)
			.setAuthor(this.context.client.user!.username, this.context.client.user!.displayAvatarURL({ format: 'png' }))
			.setDescription(`To add ${this.context.client.user!.username} to your server, use the \`${Array.isArray(prefix) ? prefix[0] : prefix}invite\` command.`)
			.addField('Connected To', [
				`**Servers**: ${generalStatistics.guilds}`,
				`**Users**: ${generalStatistics.members}`,
				`**Channels**: ${generalStatistics.channels}`
			].join('\n'), true)
			.addField('Server Stats', [
				`**CPU Load**: ${serverStatistics.cpuLoad.map(load => `${load}%`).join(' | ')}`,
				`**RAM Used**: ${serverStatistics.ramUsed} (Total: ${serverStatistics.ramTotal})`,
				`**Uptime**: ${format(this.context.client.uptime ?? 0)}`
			].join('\n'), true);
	}

	private get generalStatistics() {
		return {
			guilds: this.context.client.guilds.cache.size.toLocaleString('en-US'),
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			members: this.context.client.guilds.cache.reduce((a, b) => b.memberCount + a, 0).toLocaleString('en-US'),
			channels: this.context.client.channels.cache.size.toLocaleString('en-US')
		};
	}

	private get serverStatistics() {
		const usage = process.memoryUsage();
		return {
			cpuLoad: cpus().map(({ times }) => roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100),
			ramTotal: `${Math.round(100 * (usage.heapTotal / 1048576)) / 100}MB`,
			ramUsed: `${Math.round(100 * (usage.heapUsed / 1048576)) / 100}MB`
		};
	}

}