import { EventEmitter } from 'events';
import path from 'path';
import { promisify } from 'util';
import async, { ErrorCallback } from 'async';
import { imageSize } from 'image-size';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import fs from 'mz/fs';
import { SLASH, PERIOD } from '../constants';
import { mixin } from '../constants/mixin';
import { asyncMkdir } from '../utils/asyncMkdir';
import { indent } from '../utils/indent';

export type ImageDataExtractionOptions = {
    files: string[];
    root: string;
    dist: string;
    fileName: string;
};

type Result = {
    [key: string]: {
        width: number;
        height: number;
    };
};

const sizeOf = promisify(imageSize);

export class ImageDataExtraction extends EventEmitter {
    private _files: string[];

    private _root: string;

    private _dist: string;

    private _fileName: string;

    private _result: Result[];

    public constructor(opts: ImageDataExtractionOptions) {
        super();

        this._files = opts.files;
        this._root = opts.root;
        this._dist = opts.dist;
        this._fileName = opts.fileName;
        this._result = [];
    }

    public add(file: string) {
        if (!this.includes(file)) {
            this._files.push(file);
        }
    }

    public build() {
        return Promise.resolve()
            .then(() => this.reset())
            .then(() => this.read())
            .then(() => this.write());
    }

    public extract(
        file: string,
        data: { size: ISizeCalculationResult },
        resolve: ErrorCallback<unknown>
    ) {
        const { size } = data;
        const name = file
            .replace(`${this._root}/`, '')
            .replace(/\//g, SLASH)
            .replace(/\./g, PERIOD);

        this._result.push({
            [name]: {
                width: size.width ?? 0,
                height: size.height ?? 0,
            },
        });

        resolve();
    }

    public includes(file: string) {
        return this._files.includes(file);
    }

    public read() {
        return new Promise(resolve => {
            async.forEach(this._files, (file, next) => this.request(file, next), resolve);
        });
    }

    public remove(file: string) {
        const targetIndex = this._files.indexOf(file);

        if (targetIndex < 0) {
            return;
        }

        this._files = ([] as string[]).concat(
            this._files.slice(0, targetIndex),
            this._files.slice(targetIndex + 1)
        );
    }

    public request(file: string, next: ErrorCallback<unknown>) {
        sizeOf(file)
            .then(dimensions => {
                if (!dimensions) {
                    next();
                    return;
                }

                this.extract(file, { size: dimensions }, next);
            })
            .catch(() => {
                next();
            });
    }

    public reset() {
        this._result = [];
    }

    public write() {
        const output = path.join(this._dist, this._fileName);
        const size: {
            [key: string]: string;
        } = {};

        return Promise.resolve()
            .then(() => asyncMkdir(this._dist))
            .then(() => {
                this._result.forEach(val => {
                    const key = Object.keys(val)[0];
                    const data = val[key];
                    const header = `${indent(1)}${key}: (`;
                    const footer = `${indent(1)}),`;
                    const width = `${indent(2)}width: ${data.width}px,`;
                    const height = `${indent(2)}height: ${data.height}px,`;

                    size[key] = [header, width, height, footer].join('\n');
                });
                const result = [
                    ([] as string[])
                        .concat(['$image_map: ('], Object.values(size), [');'])
                        .join('\n'),
                    mixin,
                ];

                return fs.writeFile(output, result.join('\n'));
            });
    }
}
