import chalk from 'chalk';
import chokidar from 'chokidar';
import { Command } from 'commander';
import { SASS_FILE_NAME, FILE_REG_EXP, FILE_EXTENTIONS } from '../constants';
import { ImageDataExtraction, ImageDataExtractionOptions } from '../libs/ImageDataExtraction';
import { searchFiles } from '../utils/searchFiles';

const WATCHER_OPTION = {
    ignored: [/(^|[/\\])\../, FILE_REG_EXP],
    usePolling: true,
    interval: 100,
};

(async () => {
    /* ><><><><><><><><><><>< *\
        Option
    \* ><><><><><><><><><><>< */
    const { args, dist, fileName, watch } = new Command()
        .option('-d, --dist <name>', 'dist dir', 'dist')
        .option('-f, --file-name <name>', 'file name', SASS_FILE_NAME)
        .option('-w, --watch', 'use watch mode', false)
        .parse(process.argv);

    const options: ImageDataExtractionOptions = {
        dist,
        fileName,
        files: [],
        root: args[0],
    };

    /* ><><><><><><><><><><>< *\
        Read existing files.
    \* ><><><><><><><><><><>< */
    options.files = await searchFiles(options.root, FILE_EXTENTIONS);

    /* ><><><><><><><><><><>< *\
        Instance
    \* ><><><><><><><><><><>< */
    const imageDataExtraction = new ImageDataExtraction(options);

    /* ><><><><><><><><><><>< *\
        Log
    \* ><><><><><><><><><><>< */
    imageDataExtraction.on('start', () => {
        console.log('sass-image-data-extraction start!');
    });
    imageDataExtraction.on('end', () => {
        console.log('sass-image-data-extraction end!');
    });
    imageDataExtraction.on('watch', () => {
        console.log('sass-image-data-extraction watching...');
    });
    imageDataExtraction.on('default', e => {
        console.log(['[default]', e.file].join('\t'));
    });
    imageDataExtraction.on('add', e => {
        console.log([chalk.green('[add]'), e.file].join('\t\t'));
    });
    imageDataExtraction.on('change', e => {
        console.log([chalk.yellow('[change]'), e.file].join('\t'));
    });
    imageDataExtraction.on('remove', e => {
        console.log([chalk.red('[remove]'), e.file].join('\t'));
    });

    /* ><><><><><><><><><><>< *\
        Function
    \* ><><><><><><><><><><>< */
    const extract = (opts: { path?: string; eventName?: string; isRemove?: boolean } = {}) => {
        if (opts.path) {
            imageDataExtraction.emit(opts.eventName ?? '', { file: opts.path });

            if (opts.isRemove) {
                imageDataExtraction.remove(opts.path);
            } else if (!imageDataExtraction.includes(opts.path)) {
                imageDataExtraction.add(opts.path);
            }
        }

        imageDataExtraction.build();
    };

    /* ><><><><><><><><><><>< *\
        Main
    \* ><><><><><><><><><><>< */
    imageDataExtraction.emit('start');
    options.files.forEach(file => {
        imageDataExtraction.emit('default', { file });
    });
    extract();

    if (watch) {
        const watcher = chokidar.watch(options.root, WATCHER_OPTION);

        watcher.on('ready', () => {
            imageDataExtraction.emit('watch');
            watcher
                .on('add', path => extract({ path, eventName: 'add' }))
                .on('change', path => extract({ path, eventName: 'change' }))
                .on('unlink', path => extract({ path, eventName: 'remove', isRemove: true }));
        });
    } else {
        imageDataExtraction.emit('end');
    }
})();
