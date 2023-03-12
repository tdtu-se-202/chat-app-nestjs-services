import * as bcrypt from 'bcrypt';

export class AuthHelper {
  public static async isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return bcrypt.hash(password, salt);
  }
}
