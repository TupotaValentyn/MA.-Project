const ru = require('../translations/ru.json');
const ua = require('../translations/ua.json');

export default (
    textId: string,
    locale: string = 'ua',
    replacements: (string | number)[] = []
): string => {
    const idsParts = textId.split('.');
    const lastIdPart = idsParts.pop();

    let storage = locale === 'ru' ? ru : ua;

    // eslint-disable-next-line no-restricted-syntax
    for (const idPart of idsParts) {
        const innerStorage = storage[idPart];

        if (!(innerStorage && typeof innerStorage === 'object')) {
            return `No text with id: ${textId}`;
        }

        storage = innerStorage;
    }

    let text = storage[lastIdPart];

    if (!text) {
        return `No text with id: ${textId}`;
    }

    replacements.forEach((replacement) => {
        text = text.replace('%s', replacement.toString());
    });

    return text;
};
