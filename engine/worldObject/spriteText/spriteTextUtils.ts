namespace SpriteTextUtils {
    export function splitIntoStyledChars(text: string) {
        let tokens = SpriteTextTokenizer.tokenize(text);

        if (tokens.length === 0) {
            return [];
        }

        let tagsStart: string = '';
        let tagsEnd: string = '';
        let result: string[][] = [];
        let line: string[] = [];

        for (let token of tokens) {
            if (token.type === 'starttag') {
                tagsStart += stringifyTag(token.tag, token.params);
                tagsEnd += '[/]';
                continue;
            }

            if (token.type === 'endtag') {
                tagsStart = tagsStart.substring(0, tagsStart.lastIndexOf('['));
                tagsEnd = tagsEnd.substring(0, tagsEnd.lastIndexOf('['));
                continue;
            }

            if (token.type === 'char') {
                line.push(`${tagsStart}\\${token.name}${tagsEnd}`);
                continue;
            }

            if (token.type === 'customchar') {
                line.push(`${tagsStart}<${token.name}>${tagsEnd}`);
                continue;
            }

            if (token.type === 'space') {
                line.push(`${tagsStart} ${tagsEnd}`);
                continue;
            }

            if (token.type === 'newline') {
                result.push(line);
                line = [];
                continue;
            }

            assertUnreachable(token);
        }

        result.push(line);
        return result;
    }

    export function stringifyTag(tag: string, params: string[]) {
        if (params.length === 0) {
            return `[${tag}]`;
        }
        return `[${tag} ${params.join(' ')}]`;
    }
}