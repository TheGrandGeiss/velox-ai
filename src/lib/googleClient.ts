// import { google } from 'googleapis';
// import { prisma } from '@/prisma';

// export async function getGoogleOAuthClientForUser(userId: string) {
//   const ga = await prisma.googleAccount.findUnique({ where: { userId } });
//   if (!ga) throw new Error('No linked Google account');

//   const oauth2Client = new google.auth.OAuth2(
//     process.env.AUTH_GOOGLE_ID,
//     process.env.AUTH_GOOGLE_SECRET,
//     process.env.GOOGLE_OAUTH_CALLBACK
//   );

//   oauth2Client.setCredentials({
//     access_token: ga.accessToken,
//     refresh_token: ga.refreshToken,
//     expiry_date: ga.expiresAt.getTime(),
//   });

//   // If token expired (or near expiry), refresh
//   const now = Date.now();
//   if (now >= ga.expiresAt.getTime() - 60 * 1000) {
//     // refresh 60s before expiry
//     try {
//       const { credentials } = await oauth2Client.refreshAccessToken(); // note: deprecated in some googleapis versions; alternative: oauth2Client.getAccessToken/refreshToken
//       const newAccessToken = credentials.access_token!;
//       const newExpiry = credentials.expiry_date
//         ? new Date(credentials.expiry_date)
//         : new Date(Date.now() + 3600 * 1000);

//       // update DB
//       await prisma.googleAccount.update({
//         where: { userId },
//         data: {
//           accessToken: newAccessToken,
//           expiresAt: newExpiry,
//           // only update refresh token if Google returned one (rare)
//           refreshToken: credentials.refresh_token ?? ga.refreshToken,
//         },
//       });

//       oauth2Client.setCredentials({
//         access_token: newAccessToken,
//         refresh_token: credentials.refresh_token ?? ga.refreshToken,
//         expiry_date: credentials.expiry_date,
//       });
//     } catch (err) {
//       console.error('Failed to refresh token:', err);
//       throw err;
//     }
//   }

//   return oauth2Client;
// }
