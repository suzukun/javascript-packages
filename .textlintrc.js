module.exports = {
    filters: {
        allowlist: {
            allow: ["javascript-packages"],
        },
    },
    rules: {
        // NOTE: 正規表現内の?でも反応するため。
        "ja-technical-writing/no-exclamation-question-mark": false,
        "preset-ja-spacing": {
            "ja-space-between-half-and-full-width": {
                space: "always",
            },
        },
        "preset-ja-technical-writing": true,
        "spellcheck-tech-word": true,
    },
};
