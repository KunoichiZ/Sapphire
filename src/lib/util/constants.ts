import { PREFIX } from '#root/config';

export enum ConfigurableGuildKeys {
	Prefix = 'prefix',
	QuoteChannel = 'quoteChannel',
	ModlogsChannel = 'modlogsChannel',
	AnnouncementChannel = 'announcementChannel'
}

export const DefaultConfigurableGuildValues = {
	prefix: () => PREFIX,
	quoteChannel: 'quotes',
	announcementChannel: 'discord-announcements',
	modlogsChannel: 'mod-logs'
};
