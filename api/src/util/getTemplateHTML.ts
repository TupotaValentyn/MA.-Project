import path from 'path';
import ejs from 'ejs';

/* eslint-disable-next-line */
export default (templateName: string, data?: object): Promise<string> => {
    return ejs.renderFile(path.join(__dirname, `../templates/${templateName}.ejs`), data || {});
};
