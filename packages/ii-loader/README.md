ii-loader
----

画像に関するデータを抽出し、それらを利用するための `function`, `mixin` を突っ込みます。

## 使用例

### webpack config の書き方

```js
{
    test: /\.scss$/,
    use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader'
        'sass-loader',
        {
            loader: 'ii-loader',
            options: {
                path: path.resolve(__dirname, 'static/img'),
                resolvePath: '/ii-name/img',
            },
        },
    ],
}
```

### Sass で使用する

```scss
.ii-div {
    @include ii-image('html5.png');
}
```
 ↓
```css
.ii-div {
    background-image: url("/ii-name/img/html5.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 128px;
    width: 128px;
}
```

## オプション

|名前|内容|初期値|
|---|---|---|
|path|画像を入れいるフォルダのパス|''|
|resolvePath|実際に画像フォルダが置かれる場所のパス|''|
|test|対象ファイルを決める正規表現|/\\.(jpe?g\|png)/|

## ドキュメント

### functions

#### ii-resolve

`ii-resolve($path)`

解決したパスを返す。

#### ii-height

`ii-height($path)`

縦幅を返す。

#### ii-width

`ii-width($path)`

横幅を返す。

#### ii-ratio

`ii-ratio($path)`

(縦幅 / 横幅) を返す。

### mixins

#### ii-image

`ii-image($path, $position: center, $repeat: no-repeat, $size: cover)`

もうあなたの目の前に…という状態のスタイルを適用してくれる。  
中身は background-image です。
