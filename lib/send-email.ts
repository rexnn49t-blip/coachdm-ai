import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY!
);

const emailFrom =
  process.env.EMAIL_FROM!;

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions) {
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    });

    if (result.error) {
      console.error(
        "Resend email error:",
        result.error
      );

      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error(
      "Send email error:",
      error
    );

    return {
      success: false,
      error,
    };
  }
}