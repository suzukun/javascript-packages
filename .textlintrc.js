module.exports = {
    filters: {
        allowlist: {
            allow: ["javascript-packages"],
        },
    },
    rules: {
        "preset-ja-spacing": {
            "ja-space-between-half-and-full-width": {
                space: "always",
            },
        },
        "preset-ja-technical-writing": true,
        "spellcheck-tech-word": true,
        // NOTE: 正規表現内の?でも反応するため。
        "ja-technical-writing/no-exclamation-question-mark": false
    },
};
