export const BRACKETS = ['1', '2', '3Fa', '3Fo', '4', '5'] as const;
export type BracketValue = typeof BRACKETS[number];

export const BRACKET_LABELS: Record<string, string> = {
    '1':   'Bracket 1',
    '2':   'Bracket 2',
    '3Fa': 'Bracket 3 Bas',
    '3Fo': 'Bracket 3 Haut',
    '4':   'Bracket 4',
    '5':   'Bracket 5',
};

export const BRACKET_SHORT: Record<string, string> = {
    '1':   'Br1',
    '2':   'Br2',
    '3Fa': 'Br3 Bas',
    '3Fo': 'Br3 Haut',
    '4':   'Br4',
    '5':   'Br5',
};
