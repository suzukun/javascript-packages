type Shader = string;

type Shaders = {
    [key: string]: Shader;
};

const IMPORT_PATTERN = /^[ \t]*#import +<([\w\d./]+)>/gm;

/**
 * シェーダーモジュール解決クラス。
 */
export class Spencer {
    private static _singleton: Spencer;

    private _shaders: Shaders = {};

    public static get singleton() {
        if (!this._singleton) {
            this._singleton = new this();
        }

        return this._singleton;
    }

    public static createMessage(text: string) {
        return `Spencer: ${text}`;
    }

    public get(name: string) {
        if (!this._shaders[name]) {
            return `#log not found <${name}>`;
        }

        this._shaders[name].replace(IMPORT_PATTERN, (substring: string, ...args) => {
            if (typeof args[0] === 'string') {
                return this._replacer(args[0]) || '';
            }

            return '';
        });
    }

    public set(name: string, shader: Shader, isForce: boolean = false) {
        if (this._shaders[name] && !isForce) {
            throw new Error(Spencer.createMessage(`${name} には、すでに登録されています。`));
        }

        this._shaders[name] = shader;
    }

    private _replacer(name: string) {
        const shader = this._shaders[name];

        if (!shader) {
            throw new Error(Spencer.createMessage(`${name} は、登録されていません。`));
        }

        return this.get(shader);
    }
}
