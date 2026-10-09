import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../../company-management/companies/companies.service';

@Injectable()
export class GoogleService {
  private readonly client: OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly auth: AuthService,
    private readonly companies: CompaniesService,
  ) {
    this.client = new OAuth2Client(this.config.get<string>('GOOGLE_CLIENT_ID'));
  }

  async authenticate(
    response: Response,
    body: { credential: string; domainName?: string },
  ) {
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

    const email = payload.email.toLowerCase().trim();
    let user = await this.users.findByEmail(email);
    if (!user) {
      if (!body.domainName?.trim()) {
        throw new BadRequestException({
          message: 'Company domain is required for new Google accounts',
        });
      }

      const submittedDomain = body.domainName.toLowerCase().trim();
      const emailDomain = email.split('@')[1];
      if (submittedDomain !== emailDomain) {
        throw new BadRequestException({
          message: 'Company domain must match the Google account email domain',
        });
      }

      const company = await this.companies.findByDomainName(submittedDomain);
      if (!company) {
        throw new BadRequestException({
          message: 'No company was found for this domain',
        });
      }

      const firstName = payload.given_name ?? email.split('@')[0];
      const lastName = payload.family_name ?? '';
      user = await this.users.createGoogleUser(
        firstName,
        lastName,
        email,
        company.id,
      );
    }

    return this.auth.issueTokens(response, user);
  }
}
