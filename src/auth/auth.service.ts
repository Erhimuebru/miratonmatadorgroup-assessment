// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { fullName: user.fullName, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

//   async validateUser(username: string, pass: string): Promise<any> {
//     // Add your user validation logic here (e.g., check credentials)
//     // If valid, return the user object (without the password)
//     // Otherwise, return null
//     const user = ;
//     if (user && user.password === pass) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }
}
