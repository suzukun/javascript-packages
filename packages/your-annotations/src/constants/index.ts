export const Annotations = {
    TODO: 'TODO',
    FIXME: 'FIXME',
    HACK: 'HACK',
    XXX: 'XXX',
    REVIEW: 'REVIEW',
    OPTIMIZE: 'OPTIMIZE',
    CHANGED: 'CHANGED',
    NOTE: 'NOTE',
    WARNING: 'WARNING',
    IDEA: 'IDEA',
    NB: 'NB',
    BUG: 'BUG',
    QUESTION: 'QUESTION',
    COMBAK: 'COMBAK',
    TEMP: 'TEMP',
    DEBUG: 'DEBUG',
} as const;
export type Annotations = typeof Annotations[keyof typeof Annotations];

type AnnotationTree = {
    [key in Annotations]: {
        HELP: string;
        FONT_COLOR: string;
    };
};

export const REG_EXP = {
    FILE: '\\.(?!.*(js|tsx?|vue))',
    ANNOTATION: '\\b(__ANNOTATION__)[:;.,]__COLON__\\s*',
};

export const ANNOTATIONS: AnnotationTree = {
    [Annotations.TODO]: {
        HELP: 'あとで追加、修正するべき機能がある。',
        FONT_COLOR: '#40C4FF',
    },
    [Annotations.FIXME]: {
        HELP: '既知の不具合があるコード。修正が必要。',
        FONT_COLOR: '#FF5252',
    },
    [Annotations.HACK]: {
        HELP: 'あまりきれいじゃないコード。リファクタリングが必要。',
        FONT_COLOR: '#BC02CA',
    },
    [Annotations.XXX]: {
        HELP: '危険！動くけどなぜうごくかわからない。',
        FONT_COLOR: '#FC3841',
    },
    [Annotations.REVIEW]: {
        HELP: '意図した通りに動くか、見直す必要がある。',
        FONT_COLOR: '#FFD740',
    },
    [Annotations.OPTIMIZE]: {
        HELP: '無駄が多く、ボトルネックになっている。',
        FONT_COLOR: '#BC02CA',
    },
    [Annotations.CHANGED]: {
        HELP: 'コードをどのように変更したか。',
        FONT_COLOR: '#69F0AE',
    },
    [Annotations.NOTE]: {
        HELP: 'なぜ、こうなったという情報を残す。',
        FONT_COLOR: '#69F0AE',
    },
    [Annotations.WARNING]: {
        HELP: '注意が必要。',
        FONT_COLOR: '#FFD740',
    },
    [Annotations.IDEA]: {
        HELP: '案を残す。',
        FONT_COLOR: '#69F0AE',
    },
    [Annotations.NB]: {
        HELP: 'よく注意せよ。',
        FONT_COLOR: '#FFD740',
    },
    [Annotations.BUG]: {
        HELP: 'バグとなっているコード。',
        FONT_COLOR: '#FC3841',
    },
    [Annotations.QUESTION]: {
        HELP: '疑問点を残す。',
        FONT_COLOR: '#FFD740',
    },
    [Annotations.COMBAK]: {
        HELP: 'あとで戻ってくる必要があるコード。',
        FONT_COLOR: '#FFD740',
    },
    [Annotations.TEMP]: {
        HELP: '一時的なコード。',
        FONT_COLOR: '#435B67',
    },
    [Annotations.DEBUG]: {
        HELP: 'デバッグコード。',
        FONT_COLOR: '#435B67',
    },
};
