import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const validatePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
}

export default __dirname;