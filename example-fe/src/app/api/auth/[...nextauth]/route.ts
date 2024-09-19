import { access } from 'fs';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { AuthOptions } from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

const refreshAccessToken = async (token: JWT) => {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID!);
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET!);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', token.refresh_token as string);

    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return {
      ...token,
      error: 'RefreshAccessToken',
    };
  }
};

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: `${process.env.KEYCLOAK_ISSUER}`,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/admin';
    },
    async jwt({ token, account }) {
      if (account) {
        token.role = jwtDecode(account.access_token);
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000;
        token.refresh_token = account.refresh_token;
        token.provider = account.provider;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        name: token.name,
        email: token.email,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        role: token.role.realm_access.roles,
      };
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut({ token }: { token: JWT }) {
      if (token.provider === 'keycloak') {
        try {
          // Rimuove la sessione utente da keycloak
          const logOutUrl = new URL(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`);
          logOutUrl.searchParams.set('id_token_hint', `${token.id_token!}`);
          logOutUrl.searchParams.set('post_logout_redirect_uri', `${encodeURIComponent(process.env.NEXTAUTH_URL)}`);

          await fetch(logOutUrl);
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { authOptions, handler as GET, handler as POST };
