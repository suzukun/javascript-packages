import { EventEmitter } from 'events';
import path from 'path';
import async, { ErrorCallback } from 'async';
import gm, { ImageInfo, State } from 'gm';
import mkdirp from 'mkdirp-promise';
import { nearPow2 } from '../utils/calc';

type GLImageAdjusterOptions = {
    files: string[];
    dist: string;
    isResize: boolean;
    isCenter: boolean;
};

type TransformOptions = {
    resizedWidth: number;
    resizedHeight: number;
    filledWidth: number;
    filledHeight: number;
    resolve: ErrorCallback<Error>;
    cargo: State;
    status: boolean;
};

export class GLImageAdjuster extends EventEmitter {
    private _files: string[];

    private _dist: string;

    private _isResize: boolean;

    private _isCenter: boolean;

    public constructor(opts: GLImageAdjusterOptions) {
        super();

        this._files = opts.files;
        this._dist = opts.dist;
        this._isResize = opts.isResize;
        this._isCenter = opts.isCenter;

        if (!this._files.length) {
            throw new Error('no files');
        }
    }

    public adjust(file: string, data: ImageInfo, resolve: ErrorCallback<Error>) {
        const { dist, resultPath } = this._getDist(file);
        const { width } = data.size;
        const { height } = data.size;
        const pow2Width = nearPow2(width);
        const pow2Height = nearPow2(height);
        const toWidth = this._isResize ? pow2Width.near : pow2Width.greater;
        const toHeight = this._isResize ? pow2Height.near : pow2Height.greater;
        const isFitWidth = toWidth - width <= toHeight - height;
        const resizedWidth = Math.floor(isFitWidth ? toWidth : toHeight * (width / height));
        const resizedHeight = Math.floor(isFitWidth ? toWidth * (height / width) : toHeight);
        const pow2ResizedWidth = nearPow2(resizedWidth);
        const pow2ResizedHeight = nearPow2(resizedHeight);
        let filledWidth: number;
        let filledHeight: number;

        if (isFitWidth) {
            filledWidth = resizedWidth;
        } else if (pow2ResizedWidth.near >= resizedWidth) {
            filledWidth = pow2ResizedWidth.near;
        } else {
            filledWidth = pow2ResizedWidth.greater;
        }

        if (!isFitWidth) {
            filledHeight = resizedHeight;
        } else if (pow2ResizedHeight.near >= resizedHeight) {
            filledHeight = pow2ResizedHeight.near;
        } else {
            filledHeight = pow2ResizedHeight.greater;
        }

        Promise.resolve()
            .then(() => mkdirp(dist))
            .then(() => ({
                resolve,
                filledWidth,
                filledHeight,
                resizedWidth: this._isResize ? resizedWidth : width,
                resizedHeight: this._isResize ? resizedHeight : height,
                cargo: gm(file),
                status: false,
            }))
            .then(result => this.resize(result))
            .then(result => this.padding(result))
            .then(result => {
                result.cargo.write(resultPath, error => {
                    if (result.status) {
                        this.emit('resolve', {
                            width: toWidth,
                            height: toHeight,
                            file: resultPath,
                        });
                    } else {
                        this.emit('pass', {
                            width: toWidth,
                            height: toHeight,
                            file: resultPath,
                        });
                    }

                    resolve(error);
                });
            });
    }

    public padding({
        resizedWidth,
        resizedHeight,
        filledWidth,
        filledHeight,
        resolve,
        cargo,
        status,
    }: TransformOptions) {
        const align = this._isCenter ? 0.5 : 1.0;
        const offsetX = Math.max(filledWidth - resizedWidth, 0);
        const offsetY = Math.max(filledHeight - resizedHeight, 0);

        cargo
            .borderColor('transparent')
            .border(offsetX, offsetY)
            .crop(
                resizedWidth + offsetX,
                resizedHeight + offsetY,
                offsetX * align,
                offsetY * align
            );

        return {
            resolve,
            resizedWidth,
            resizedHeight,
            filledWidth,
            filledHeight,
            cargo,
            status: status || offsetX !== 0 || offsetY !== 0,
        };
    }

    public resize({
        resizedWidth,
        resizedHeight,
        filledWidth,
        filledHeight,
        resolve,
        cargo,
        status,
    }: TransformOptions) {
        if (this._isResize) {
            cargo.resize(resizedWidth, resizedHeight);
        }

        return {
            resolve,
            resizedWidth,
            resizedHeight,
            filledWidth,
            filledHeight,
            cargo,
            status: status || resizedWidth !== 0 || resizedHeight !== 0,
        };
    }

    public start() {
        this.emit('start');

        async.forEach(
            this._files,
            (file, next) => {
                gm(file).identify((error, data) => {
                    if (error) {
                        this.emit('pass', { file, error });
                        next();
                    } else {
                        this.adjust(file, data, next);
                    }
                });
            },
            error => {
                this.emit('end', error);
            }
        );
    }

    private _getDist(file: string) {
        const dir = file.split(/\//g);
        const home = dir[0];
        const name = dir.pop();

        dir[0] = this._dist !== '' && this._dist !== '.' ? this._dist : '/';

        const dist = path.join(home, ...dir);
        const resultPath = path.join(dist, name ?? '');

        return { dist, resultPath };
    }
}
