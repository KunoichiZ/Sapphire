import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions } from '@sapphire/framework';
import { red, black, white } from 'colorette';
import { DEV, PGSQL_ENABLED } from '#root/config';

@ApplyOptions<EventOptions>({ once: true })
export class UserEvent extends Event<'ready'> {
	public async run() {
        if (this.context.client.ownerID === undefined) {
			const application = await this.context.client.fetchApplication();
			this.context.client.ownerID = application.owner?.id;
		}
		if (PGSQL_ENABLED) {
			console.log(`
            ${black('        ▄███████████▄        ')}
            ${black('     ▄███')}${red('▓▓▓▓▓▓▓▓▓▓▓')}${black('███▄     ')}
            ${black('    ███')}${red('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')}${black('███    ')}
            ${black('   ██')}${red('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')}${black('██   ')}
            ${black('  ██')}${red('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')}${black('██  ')}
            ${black(' ██')}${red('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')}${black('██ ')}
            ${black('██')}${red('▓▓▓▓▓▓▓▓▓')}${black('███████')}${red('▓▓▓▓▓▓▓▓▓')}${black('██')}
            ${black('██')}${red('▓▓▓▓▓▓▓▓')}${black('██')}${white('░░░░░')}${black('██')}${red('▓▓▓▓▓▓▓▓')}${black('██')}
            ${black('██')}${red('▓▓▓▓▓▓▓')}${black('██')}${white('░░')}${black('███')}${white('░░')}${black('██')}${red('▓▓▓▓▓▓▓')}${black('██')}
            ${black('███████████')}${white('░░')}${black('███')}${white('░░')}${black('███████████')}
            ${black('██')}${white('░░░░░░░')}${black('██')}${white('░░')}${black('███')}${white('░░')}${black('██')}${white('░░░░░░░')}${black('██')}
            ${black('██')}${white('░░░░░░░░')}${black('██')}${white('░░░░░')}${black('██')}${white('░░░░░░░░')}${black('██')}
            ${black('██')}${white('░░░░░░░░░')}${black('███████')}${white('░░░░░░░░░')}${black('██')}
            ${black(' ██')}${white('░░░░░░░░░░░░░░░░░░░░░░░')}${black('██ ')}
            ${black('  ██')}${white('░░░░░░░░░░░░░░░░░░░░░')}${black('██  ')}
            ${black('   ██')}${white('░░░░░░░░░░░░░░░░░░░')}${black('██   ')}
            ${black('    ███')}${white('░░░░░░░░░░░░░░░')}${black('███    ')}
            ${black('     ▀███')}${white('░░░░░░░░░░░')}${black('███▀     ')}
            ${black('        ▀███████████▀        ')}
        `);
			if (DEV) console.log('Ruby ready!');
			else console.log('Sapphire ready!');
		}
	}
}
