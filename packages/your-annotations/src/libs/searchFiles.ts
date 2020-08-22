import path from 'path';
import fs from 'mz/fs';

/**
 * 対象ディレクトリの中にあるファイルのパスを返す。
 *
 * @param dir 対象ディレクトリ
 * @param extentions 対象の拡張子
 * @returns 見つかったファイルのパス
 */
export const searchFiles = async (dir: string, extentions: string[] = []): Promise<string[]> => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    return Promise.all<string | string[]>(
        dirents.map(dirent => {
            const name = path.join(dir, dirent.name);

            if (dirent.isDirectory()) {
                return searchFiles(name, extentions);
            }

            return Promise.resolve(name);
        })
    )
        .then(result => {
            return ([] as string[]).concat(...result);
        })
        .then(result => {
            return result.filter(
                file => !new RegExp(`\\.(?!.*(${extentions.join('|')}))`).test(file)
            );
        });
};
