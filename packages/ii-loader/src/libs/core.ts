import loaderUtils from 'loader-utils';
import { assign } from 'lodash';
import { loader } from 'webpack';
import { searchFiles } from '../utils/searchFiles';
import { formatter } from './formatter';
import { extract } from './imageDataExtraction';

export const core = async (self: loader.LoaderContext, source: string) => {
    if (self.cacheable) {
        self.cacheable();
    }

    const options = assign(
        {
            path: '',
            resolvePath: '',
            test: /\.(jpe?g|png)/,
        },
        loaderUtils.getOptions(self)
    );
    const files = await searchFiles(options.path, options.test);
    const imageData = await extract(options.path, options.resolvePath, files);
    const style = formatter.sass(options.resolvePath, imageData);
    const result = [style, source].join('\n');

    return result;
};
