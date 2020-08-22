import chalk, { Color } from 'chalk';
import { Command } from 'commander';
import consola from 'consola';
import { each, keys, pad, padStart, padEnd, sum } from 'lodash';
import { Annotations, REG_EXP, ANNOTATIONS } from '../constants';
import { CheckAnnotations } from '../libs/CheckAnnotations';
import { indent } from '../utils/indent';

type Options = {
    target: string;
    lower: boolean;
    colon: boolean;
};

const MARK = {
    SUCCESS: chalk.green('✓'),
    FAILED: chalk.magenta('×'),
};

const viewHelp = () => {
    each(ANNOTATIONS, (annotation, name) => {
        consola.info(`${chalk.bold(name)}: ${annotation.HELP}`);
    });
};

const viewAnnotations = (param: Options) => {
    const checkAnnotations = new CheckAnnotations<Annotations>({
        src: param.target,
        isAllowLowerCase: param.lower,
        isAllowNoColon: param.colon,
        annotations: keys(ANNOTATIONS) as Annotations[],
        annotationRegExpString: REG_EXP.ANNOTATION.replace(
            '__ANNOTATION__',
            (() => keys(ANNOTATIONS).join('|'))()
        ),
    });

    checkAnnotations.on('enter', (isSmall = false) => {
        console.log(isSmall ? '' : '\n');
    });

    checkAnnotations.on('start', () => {
        consola.start(`your-annotations.`);
    });

    checkAnnotations.on('loadFile', ({ path, isSuccess }) => {
        const splitedPath = path.split('/');
        const fileName = splitedPath.pop();

        consola.log(
            [
                indent(0),
                isSuccess ? MARK.SUCCESS : MARK.FAILED,
                '   ',
                chalk.gray(`${splitedPath.join('/')}/`),
                chalk.bold(fileName),
            ].join('')
        );
    });

    checkAnnotations.on(
        'loadAnnotation',
        ({ annotation, length }: { annotation: Annotations; length: number }) => {
            consola.log(
                [
                    indent(1),
                    chalk
                        .hex(ANNOTATIONS[annotation].FONT_COLOR)
                        .bold.underline(pad(annotation, 10, ' ')),
                    indent(1),
                    chalk.black.underline(` ${length} comment${length > 1 ? 's' : ''} `),
                ].join('')
            );
        }
    );

    checkAnnotations.on('loadComment', ({ content, number }) => {
        consola.log(
            [
                indent(2),
                chalk.bold(padStart(number, 4, ' ')),
                chalk.gray(`: ${content.length > 0 ? content : '---'}`),
            ].join('')
        );
    });

    checkAnnotations.on('result', ({ counter, files }) => {
        const total = sum(Object.values(counter));

        consola.log(
            '==================================== Result ===================================='
        );

        each(counter, (count, type) => {
            let color: typeof Color;

            if (count === 0) {
                color = 'green';
            } else if (count > 1) {
                color = 'magenta';
            } else {
                color = 'yellow';
            }

            consola.log(chalk[color](`${padEnd(type, 12, ' ')}: ${count}`));
        });

        consola.log(
            '================================================================================'
        );
        consola.log(
            `${chalk.bold(padEnd('Files', 12, ' '))}: ${files} file${files > 1 ? 's' : ''}.`
        );
        consola.log(
            `${chalk.bold(padEnd('Annotations', 12, ' '))}: ${total} annotation${
                total > 1 ? 's' : ''
            }.`
        );
    });

    checkAnnotations.on('end', () => {
        consola.log(`${chalk.green('end   ')}your-annotations.`);
    });

    checkAnnotations.on('error', file => {
        consola.error(new Error(`Error: ${file}`));
    });

    checkAnnotations.start();
};

(async () => {
    const { target, lower, colon, viewAnnotationsList } = new Command()
        .option('-t, --target <name>', 'target dir', 'src')
        .option('-l, --lower', 'convert lower case', false)
        .option('-c, --colon', 'use colon', false)
        .option('--viewAnnotationsList', 'list up available annotations', false)
        .parse(process.argv);

    if (viewAnnotationsList) {
        viewHelp();
    } else {
        viewAnnotations({ target, lower, colon });
    }
})();
