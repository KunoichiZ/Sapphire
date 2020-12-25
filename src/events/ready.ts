import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions } from '@sapphire/framework';
import { red, black, white } from 'colorette';

@ApplyOptions<EventOptions>({ once: true })
export class UserEvent extends Event<'ready'> {
	public run() {
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
