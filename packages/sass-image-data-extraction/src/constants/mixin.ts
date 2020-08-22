export const mixin = `
@function str-replace($str, $substr, $newsubstr, $all: false) {
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
@function _path2key($path) {
    @return str-replace(
        str-replace($path, '/', '__SLASH__', true),
        '.',
        '__PERIOD__',
        true
    );
}
@function _image($path) {
    @return map-get($image_map, _path2key($path));
}
@function height($path) {
    @return map-get(_image($path), height);
}
@function width($path) {
    @return map-get(_image($path), width);
}
@function aspect($path) {
    $height: height($path);
    $width: width($path);
    @return $height / $width;
}
`;
