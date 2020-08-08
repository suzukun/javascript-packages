import { CONSTANTS } from '../constants';

export const sass = `
@function _ii-str-replace($str, $substr, $newsubstr, $all: false) {
    $pos: str-index($str, $substr);
    @while $pos != null {
        $strlen: str-length($substr);
        $start: str-slice($str, 0, $pos - 1);
        $end: str-slice($str, $pos + $strlen);
        $str: $start + $newsubstr + $end;
        @if $all == true {
            $pos: str-index($str, $substr);
        } @else {
            $pos: null;
        }
    }
    @return $str;
}
@function _ii-path2key($path) {
    @return _ii-str-replace(
        _ii-str-replace($path, '/', '${CONSTANTS.SLASH}', true),
        '.',
        '${CONSTANTS.PERIOD}',
        true
    );
}
@function _ii-image-data($path) {
    @return map-get(${CONSTANTS.VARIABLE_IMAGE_MAP}, _ii-path2key($path));
}
@function ii-height($path) {
    $_url: ii-resolve($path);
    @return map-get(_ii-image-data($_url), height);
}
@function ii-width($path) {
    $_url: ii-resolve($path);
    @return map-get(_ii-image-data($_url), width);
}
@function ii-ratio($path) {
    $height: ii-height($path);
    $width: ii-width($path);
    @return $height / $width;
}
@function ii-resolve($path) {
    @return '#{${CONSTANTS.VARIABLE_IMAGE_DIR}}/#{$path}';
}
@mixin ii-image($path, $position: center, $repeat: no-repeat, $size: cover) {
    background: {
        image: url(ii-resolve($path));
        position: $position;
        repeat: $repeat;
        size: $size;
    }
    height: ii-height($path);
    width: ii-width($path);
}
`;
