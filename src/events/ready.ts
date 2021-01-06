import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions } from '@sapphire/framework';
import { red, black, white } from 'colorette';
import { PGSQL_ENABLED } from '#root/config';
import { connect } from '#orm/ormConfig';

@ApplyOptions<EventOptions>({ once: true })
export class UserEvent extends Event<'ready'> {
	public async run() {
		if (PGSQL_ENABLED) {
			await connect().then((value) => {
                console.log(`Connected to the ${value.options.database} database.`);
            });

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
			console.log('Sapphire ready!');
		}
	}
}
