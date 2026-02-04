import Brevo from '@getbrevo/brevo';
import { env } from '../config/env.js';

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY);

export interface EmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
}

export const sendEmail = async ({ to, subject, htmlContent }: EmailPayload): Promise<void> => {
  await apiInstance.sendTransacEmail({
    sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME },
    to: [{ email: to }],
    subject,
    htmlContent
  });
};
