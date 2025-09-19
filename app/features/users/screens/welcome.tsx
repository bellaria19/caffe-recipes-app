import type { Route } from '.react-router/types/app/features/users/screens/+types/welcome';

import { render } from '@react-email/components';
import { WelcomeUser } from 'react-email-starter/emails/welcome-user';
import { Resend } from 'resend';

const client = new Resend(process.env.RESEND_API_KEY);

// export const loader = async ({ params }: Route.LoaderArgs) => {
//   const emailHtml = await render(<WelcomeUser username={params.username} />);
//   const { data, error } = await client.emails.send({
//     from: 'Bellaria <bellaria@mail.modu.cafe>',
//     to: ['current11@naver.com'],
//     subject: 'Welcome to Moca',
//     html: emailHtml,
//   });

//   return Response.json({ data, error, emailHtml });
// };

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { data, error } = await client.emails.send({
    from: 'Bellaria <bellaria@mail.modu.cafe>',
    to: ['current11@naver.com'],
    subject: 'Welcome to Moca',
    react: <WelcomeUser username={params.username} />,
  });

  return Response.json({ data, error });
};
