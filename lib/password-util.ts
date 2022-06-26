import { randomBytes, createHmac } from 'crypto'

export function hashPassword(password: string, salt = randomBytes(32).toString('hex')) {
  const hashedPassword = createHmac('sha512', salt).update(password).digest('hex');
  return { salt, password: hashedPassword };
}

export function matchPassword(password: string, hashedPassword: string, salt: string) {
  return hashPassword(password, salt).password === hashedPassword;
}
