import chalk from 'chalk';
import { Command } from 'commander';
import consola from 'consola';
import { each, map, pad, padEnd } from 'lodash';
import { FileChecker } from './FileChecker';

const indent = (len = 0) => map(Array(4 * len), () => ' ').join('');

(async () => {
    const param = new Command().parse(process.argv);

    const fileChecker = new FileChecker({
        src: param.args[0] || './src',
    });

    fileChecker.on('start', () => {
        consola.log(chalk.hex('#F0F')('your-project-detail.'));
    });
    fileChecker.on('result', ({ counter, files }) => {
        consola.log(
            chalk.gray(
                '==================================== Result ===================================='
            )
        );
        each(counter, (count, type) => {
            consola.log(
                [
                    chalk.hex('#F0F').bold.underline(`${pad(type, 12, ' ')}`),
                    chalk
                        .hex('#666')
                        .bold.underline(padEnd(`${count} file${count > 1 ? 's' : ''}`, 10, ' ')),
                ].join(indent(1))
            );
        });
        consola.log(
            chalk.gray(
                '================================================================================'
            )
        );
        consola.log(
            chalk.hex('#666')(
                `${chalk.bold(padEnd('Files', 6, ' '))}: ${files} file${files > 1 ? 's' : ''}.`
            )
        );
    });
    fileChecker.on('end', () => {
        consola.log(chalk.hex('#F0F')('(๑╹ω╹๑ ).'));
    });
    fileChecker.on('error', file => {
        consola.error(new Error(`Error: ${file}`));
    });
    fileChecker.on('enter', (isSmall = false) => {
        console.log(isSmall ? '' : '\n');
    });

    await fileChecker.start();
})();
