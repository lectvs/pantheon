namespace SpriteTextTokenizer {
    export type Token = {
        type: 'char';
        name: string;
    } | {
        type: 'customchar';
        name: string;
    } | {
        type: 'space';
    } | {
        type: 'newline';
    } | {
        type: 'starttag';
        tag: string;
        params: string[];
    } | {
        type: 'endtag';
    };

    export function tokenize(text: string) {
        let tokens: Token[] = [];
        let i = 0;
        while (i < text.length) {

            let nextChar = i+1 < text.length ? text[i+1] : undefined;

            /* Double chars like [[ or << are escaped. */

            if (text[i] === '[' && nextChar === '[') {
                tokens.push({ type: 'char', name: '[' });
                i += 2;
                continue;
            }
            if (text[i] === ']' && nextChar === ']') {
                tokens.push({ type: 'char', name: ']' });
                i += 2;
                continue;
            }
            if (text[i] === '<' && nextChar === '<') {
                tokens.push({ type: 'char', name: '<' });
                i += 2;
                continue;
            }
            if (text[i] === '>' && nextChar === '>') {
                tokens.push({ type: 'char', name: '>' });
                i += 2;
                continue;
            }

            /* Single versions are not escaped. */

            if (text[i] === '[') {
                let closingBracketIndex = text.indexOf(']', i);
                if (closingBracketIndex < i+1) {
                    console.error(`Text '${text}' has an unclosed tag bracket at position ${i}`);
                    i++;
                    continue;
                }

                let parts = St.splitOnWhitespace(text.substring(i+1, closingBracketIndex));
                if (A.isEmpty(parts)) {
                    console.error(`Text '${text}' has an empty tag at position ${i}`);
                    parts = [SpriteText.NOOP_TAG];
                }

                if (parts[0].startsWith('/')) {
                    tokens.push({ type: 'endtag' });
                } else {
                    let tag = parts.shift()!;
                    tokens.push({ type: 'starttag', tag: tag, params: parts });
                }

                i = closingBracketIndex + 1;
                continue;
            }

            if (text[i] === '<') {
                let closingBracketIndex = text.indexOf('>', i); 
                if (closingBracketIndex < i+1) {
                    console.error(`Text '${text}' has an unclosed custom character bracket at position ${i}`);
                    i++;
                    continue;
                }

                let customCharName = text.substring(i+1, closingBracketIndex);
                if (St.isBlank(customCharName)) {
                    console.error(`Text '${text}' has a blank custom character at position ${i}`);
                    customCharName = 'none';
                }

                tokens.push({ type: 'customchar', name: customCharName });

                i = closingBracketIndex + 1;
                continue;
            }

            if (text[i] === '\\') i++;

            /* Below are unescapable characters. */

            if (text[i] === ' ') {
                tokens.push({ type: 'space' });
                i++;
                continue;
            }

            if (text[i] === '\n') {
                tokens.push({ type: 'newline' });
                i++;
                continue;
            }

            // A normal character.
            tokens.push({ type: 'char', name: text[i] });
            i++;
        }

        return tokens;
    }
}