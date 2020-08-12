import { EventEmitter } from 'events';
import { each } from 'lodash';
import { searchFiles } from './searchFiles';

type CheckOptions = {
    src: string;
};

type Counter = {
    [key: string]: number;
};

/**
 * 対象ディレクトリのファイルを探し出す。
 */
export class FileChecker extends EventEmitter {
    private _src: string;

    public constructor(opts: CheckOptions) {
        super();

        this._src = opts.src;
    }

    public async start() {
        this.emit('enter', true);
        this.emit('start');

        const counter: Counter = {};
        const files = await searchFiles(this._src);

        each(files, file => {
            if (/^\./.test(file)) {
                counter.hidden = counter.hidden ? counter.hidden + 1 : 1;
            } else {
                const extension = file.split('.').pop() || '';

                counter[extension] = counter[extension] ? counter[extension] + 1 : 1;
            }
        });

        this.emit('result', { counter, files: files.length });
        this.emit('end');
        this.emit('enter', true);
    }
}
