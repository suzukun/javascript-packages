import { EventEmitter } from 'events';
import { ReadStream } from 'fs';
import readline from 'readline';
import commentRegex from 'comment-regex';
import { each, map, mapKeys, mapValues, keys, assign, toUpper } from 'lodash';
import fs from 'mz/fs';
import { searchFiles } from '../utils/searchFiles';

type CheckAnnotationsOptions<T> = {
    src: string;
    isAllowLowerCase?: boolean;
    isAllowNoColon?: boolean;
    annotations?: T[];
    annotationRegExpString?: string;
};

type Result = {
    content: string;
    number: number;
};

type Results = {
    [key: string]: Result[];
};

type ResultsTree = {
    [key: string]: Results;
};

const GARBAGE_REG_EXP = new RegExp('^\\s*|\\s*$', 'g');

export class CheckAnnotations<TAnnotations> extends EventEmitter {
    private _src: string;

    private _isAllowLowerCase: boolean;

    private _isAllowNoColon: boolean;

    private _annotations: TAnnotations[];

    private _annotationRegExp: RegExp;

    public constructor(opts: CheckAnnotationsOptions<TAnnotations>) {
        super();

        this._src = opts.src;
        this._isAllowLowerCase = opts.isAllowLowerCase || false;
        this._isAllowNoColon = opts.isAllowNoColon || false;
        this._annotations = opts.annotations || [];
        this._annotationRegExp = new RegExp(
            (opts.annotationRegExpString || '').replace(
                '__COLON__',
                this._isAllowNoColon ? '*' : '+'
            ),
            this._isAllowLowerCase ? 'i' : ''
        );
    }

    public async start() {
        this.emit('start');
        this.emit('enter', true);

        const counter = mapValues(mapKeys(this._annotations), () => 0);
        const files = await searchFiles(this._src);
        const annotations: ResultsTree = await Promise.all(
            map(files, async file => {
                return {
                    [file]: await this._extractAnnotations(file),
                };
            })
        ).then(result => assign({}, ...result));

        each(annotations, (annotation, path) => {
            const isSuccess = !keys(annotation).length;
            this.emit('loadFile', { path, isSuccess });

            each(annotation, (comments, type) => {
                counter[type] =
                    counter[type] === undefined ? comments.length : counter[type] + comments.length;
                this.emit('loadAnnotation', {
                    annotation: type,
                    length: comments.length,
                });

                each(comments, comment => {
                    this.emit('loadComment', comment);
                });

                this.emit('enter', true);
            });
        });

        this.emit('result', { counter, files: files.length });
        this.emit('end');
        this.emit('enter', true);
    }

    private async _extractAnnotations(file: string): Promise<Results> {
        try {
            const code = fs.createReadStream(file, 'utf-8');
            const result = await this._readAnnotations(code);

            return result;
        } catch (error) {
            this.emit('error', file);

            return {};
        }
    }

    private _readAnnotations(code: ReadStream): Promise<Results> {
        return new Promise(resolve => {
            const result: Results = {};
            const extractAnnotationRegExp = new RegExp(
                `(${this._annotations.join('|')})`,
                this._isAllowLowerCase ? 'i' : ''
            );
            let counter = 0;
            let isBlockComment = false;

            readline
                .createInterface(code)
                .on('line', line => {
                    if (!isBlockComment) {
                        isBlockComment = /(\/\*)/.test(line);
                    }

                    counter += 1;

                    const comment = isBlockComment
                        ? [line, line.replace(/(\/\*|\*\/)|^(\s*\*)/g, ''), '']
                        : commentRegex().exec(line);

                    if (comment) {
                        const content = (comment[1] || comment[2]).replace(GARBAGE_REG_EXP, '');

                        if (this._annotationRegExp.test(content)) {
                            const matchs = content.match(extractAnnotationRegExp) || [];
                            const annotation = toUpper(matchs[0]);
                            const value = content.replace(this._annotationRegExp, '');

                            if (!result[annotation]) {
                                result[annotation] = [];
                            }

                            result[annotation].push({
                                content: value,
                                number: counter,
                            });
                        }
                    }

                    if (isBlockComment) {
                        isBlockComment = !/(\*\/)/.test(line);
                    }
                })
                .on('close', () => {
                    resolve(result);
                });
        });
    }
}
