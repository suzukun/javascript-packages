import { Command } from 'commander';
import { GLImageAdjuster } from '../libs/GLImageAdjuster';

type Result = {
    file: string;
    width: number;
    height: number;
};

(() => {
    /* ><><><><><><><><><><>< *\
        Option
    \* ><><><><><><><><><><>< */
    const { args, dist, resize, center } = new Command()
        .option('-d, --dist <name>', 'dist dir', 'dist')
        .option('-r, --resize <name>', 'use resize', true)
        .option('-c, --center <name>', 'fixed center', true)
        .parse(process.argv);

    /* ><><><><><><><><><><>< *\
        Instance
    \* ><><><><><><><><><><>< */
    const glImageAdjuster = new GLImageAdjuster({
        dist,
        files: args,
        isResize: resize,
        isCenter: center,
    });

    /* ><><><><><><><><><><>< *\
        Log
    \* ><><><><><><><><><><>< */
    glImageAdjuster.on('start', (err: Error) => {
        if (err) {
            console.log('[error]', err);
        } else {
            console.log('<><><>', '[start]', '<><><>');
        }
    });

    glImageAdjuster.on('pass', (e: Result) => {
        console.error(
            ['[pass]  ', e.width || e.height ? `${e.width}x${e.height}` : '(error)', e.file].join(
                '\t'
            )
        );
    });

    glImageAdjuster.on('resolve', (e: Result) => {
        console.log(['[resolve]', `${e.width}x${e.height}`, e.file].join('\t'));
    });

    glImageAdjuster.on('end', (err: Error) => {
        if (err) {
            console.log('[error]', err);
        } else {
            console.log('<><><>', '[done]', '<><><>');
        }
    });

    /* ><><><><><><><><><><>< *\
        Start
    \* ><><><><><><><><><><>< */
    glImageAdjuster.start();
})();
