import jwt_decode from 'jwt-decode';

export class AuthHelper {
  static getEmailFromToken(token: string) {
    const payload: Record<string, any> = jwt_decode(token);

    return payload.email;
  }
}
