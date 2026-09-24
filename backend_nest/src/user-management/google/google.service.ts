import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleService {
  private readonly client: OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly auth: AuthService,
  ) {
    this.client = new OAuth2Client(this.config.get<string>('GOOGLE_CLIENT_ID'));
  }

  async authenticate(response: Response, body: Record<string, unknown>) {
    if (typeof body.credential !== 'string' || !body.credential) {
      throw new BadRequestException({ message: 'No credential provided' });
    }

    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) throw new Error('GOOGLE_CLIENT_ID must be set before using Google authentication.');

    let payload;
    try {
      const ticket = await this.client.verifyIdToken({ idToken: body.credential, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException({ message: 'Invalid Google token' });
    }

    if (!payload?.email) {
      throw new UnauthorizedException({ message: 'Invalid Google token' });
    }

    const firstName = payload.given_name ?? payload.email.split('@')[0];
    const lastName = payload.family_name ?? '';
    let user = await this.users.findByEmail(payload.email);
    if (!user) {
      user = await this.users.createGoogleUser(firstName, lastName, payload.email);
    }

    return this.auth.issueTokens(response, user);
  }
}
