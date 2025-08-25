import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { SendEmailDto } from "./dto/send-email.dto";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(emailData: SendEmailDto): Promise<{ isSent: boolean }> {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SERVICE,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: "expanders360",
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.body,
      };

      await transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${emailData.to}`);

      return { isSent: true };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return { isSent: false };
    }
  }
}
