type Shader = string;

type Shaders<T extends string> = {
    [key in T]?: Shader;
};

type ShadersTree<T extends string, U extends string> = {
    [key in U]: Shaders<T>;
};

const DEFAULT_IDENTIFIER = '__COMMON_SHADER__';
type DEFAULT_IDENTIFIER = typeof DEFAULT_IDENTIFIER;

/**
 * シェーダーモジュール解決クラス。
 */
export class Spencer<TNames extends string, TIdentifiers extends string> {
    private _shadersTree: ShadersTree<TNames, TIdentifiers | DEFAULT_IDENTIFIER>;

    private _importMarker: string = 'import';

    private _importPattern: RegExp = new RegExp(
        `^[\\s\\t]*#${this._importMarker}\\s+(([\\w\\d./]+)\\s+)?<([\\w\\d./]+)>`,
        'gm'
    );

    public constructor(shadersTree: ShadersTree<TNames, TIdentifiers | DEFAULT_IDENTIFIER>) {
        this._shadersTree = shadersTree;
    }

    public static get COMMON_SHADER(): DEFAULT_IDENTIFIER {
        return DEFAULT_IDENTIFIER;
    }

    public static createMessage(text: string) {
        return `Spencer: ${text}`;
    }

    public get(
        name: TNames,
        identifier: TIdentifiers | DEFAULT_IDENTIFIER = DEFAULT_IDENTIFIER
    ): string {
        if (!this._checkShaderExistence(name, identifier)) {
            return `#log not found ${identifier} <${name.replace(/\r?\n/g, '')}>`;
        }

        return (
            this._shadersTree[identifier][name]?.replace(
                this._importPattern,
                (substring: string, ...args) => {
                    const [, moduleIdentifier, moduleName] = args;

                    return this._replacer(moduleName, moduleIdentifier);
                }
            ) || ''
        );
    }

    private _checkShaderExistence(name: TNames, identifier: TIdentifiers | DEFAULT_IDENTIFIER) {
        return this._shadersTree[identifier] && this._shadersTree[identifier][name];
    }

    private _replacer(
        name: TNames,
        identifier: TIdentifiers | DEFAULT_IDENTIFIER = DEFAULT_IDENTIFIER
    ): string {
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
