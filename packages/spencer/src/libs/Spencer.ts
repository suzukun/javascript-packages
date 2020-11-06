type Shader = string;

type Shaders = {
    [key: string]: Shader;
};

type ShadersTree = {
    [key: string]: Shaders;
};

const DEFAULT_IDENTIFIER = '__NONE_IDENTIFIER__';

/**
 * シェーダーモジュール解決クラス。
 */
export class Spencer {
    private static _singleton: Spencer;

    private _shadersTree: ShadersTree = {};

    private _importMarker: string = 'import';

    private _importPattern: RegExp = new RegExp(
        `^[\\s\\t]*#${this._importMarker}\\s+(([\\w\\d./]+)\\s+)?<([\\w\\d./]+)>`,
        'gm'
    );

    public static get singleton() {
        if (!this._singleton) {
            this._singleton = new this();
        }

        return this._singleton;
    }

    public static createMessage(text: string) {
        return `Spencer: ${text}`;
    }

    public get(name: string, identifier: string = DEFAULT_IDENTIFIER): string {
        if (!this._checkShaderExistence(name, identifier)) {
            return `#log not found ${identifier} <${name.replace(/\r?\n/g, '')}>`;
        }

        return this._shadersTree[identifier][name].replace(
            this._importPattern,
            (substring: string, ...args) => {
                const [, moduleIdentifier, moduleName] = args;

                return this._replacer(moduleName, moduleIdentifier);
            }
        );
    }

    public set(name: string, shader: Shader, identifier: string = DEFAULT_IDENTIFIER) {
        if (this._checkShaderExistence(name, identifier)) {
            throw new Error(Spencer.createMessage(`${name} には、すでに登録されています。`));
        }

        if (!this._shadersTree[identifier]) {
            this._shadersTree[identifier] = {};
        }

        this._shadersTree[identifier][name] = shader;
    }

    private _checkShaderExistence(name: string, identifier: string) {
        return this._shadersTree[identifier] && this._shadersTree[identifier][name];
    }

    private _replacer(name: string, identifier: string = DEFAULT_IDENTIFIER): string {
        if (!this._checkShaderExistence(name, identifier)) {
            throw new Error(
                Spencer.createMessage(
                    `${
                        identifier === DEFAULT_IDENTIFIER ? '' : `${identifier} `
                    }${name} は、登録されていません。`
                )
            );
        }

        return this.get(name, identifier) || '';
    }
}
