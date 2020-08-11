import loaderUtils from 'loader-utils';
import { assign } from 'lodash';
import { searchFiles } from '../utils/searchFiles';
import { formatter } from './formatter';
import { extract } from './imageDataExtraction';

/**
 * @param source source code
 * @returns result
 */
export async function core(source: string): Promise<string> {
    const options = assign(
        {
            path: '',
            resolvePath: '',
            test: /\.(jpe?g|png)/,
        },
        // @ts-ignore
        loaderUtils.getOptions(this)
    );
    const files = await searchFiles(options.path, options.test);
    const imageData = await extract(options.path, options.resolvePath, files);
    const style = formatter.sass(options.resolvePath, imageData);
    const result = [style, source].join('\n');

    return result;
}
