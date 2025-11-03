import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App Password (16 ký tự)
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      return await this.transporter.sendMail({
        from: `Support <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      });
    } catch (err: any) {
      console.error('[Mailer] sendMail failed', {
        code: err?.code,
        responseCode: err?.responseCode,
        command: err?.command,
        response: err?.response,
        message: err?.message,
      });
      throw err;
    }
  }

  private baseTemplate(opts: {
    heading: string;
    bodyHtml: string;
    primaryBtn?: { href: string; text: string };
    noteBelowBtnHtml?: string;
  }) {
    const btn =
      opts.primaryBtn
        ? `<a href="${opts.primaryBtn.href}"
               style="display:inline-block;padding:10px 16px;font-weight:600;background:#111;color:#fff;text-decoration:none;border-radius:6px">
               ${opts.primaryBtn.text}
           </a>`
        : '';

    return `
    <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;background:#f6f7f9;padding:24px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
             style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb">
        <tr>
          <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb">
            <div style="font-weight:800;font-size:16px;letter-spacing:.02em">CHAMVAN</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px">
            <h1 style="margin:0 0 12px 0;font-size:18px">${opts.heading}</h1>
            <div style="font-size:14px;line-height:1.6;color:#111">
              ${opts.bodyHtml}
            </div>
            ${btn ? `<div style="margin-top:18px">${btn}</div>` : ''}
            ${opts.noteBelowBtnHtml ? `<div style="margin-top:12px;color:#6b7280;font-size:12px">${opts.noteBelowBtnHtml}</div>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px">
            © ${new Date().getFullYear()} Chamvan. All rights reserved.
          </td>
        </tr>
      </table>
    </div>`;
  }

  resetPasswordEmail(to: string, newPass: string) {
    const loginUrl =
      (process.env.WEB_BASE_URL || 'http://localhost:3000') + '/dang-nhap';

    const bodyHtml = `
      <p>Mật khẩu của bạn đã được đặt lại. Mật khẩu mới:</p>
      <div style="margin:12px 0;padding:10px 12px;border:1px dashed #d1d5db;background:#f9fafb">
        <code style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:16px;user-select:all">
          ${newPass}
        </code>
      </div>
      <p>Hãy đăng nhập và đổi mật khẩu trong mục Tài khoản &rarr; Thay đổi mật khẩu.</p>
    `;

    const html = this.baseTemplate({
      heading: 'Đặt lại mật khẩu',
      bodyHtml,
      primaryBtn: { href: loginUrl, text: 'Đi đến đăng nhập' },
      noteBelowBtnHtml:
        'Bạn có thể bôi đen để sao chép mật khẩu mới ở khung phía trên.',
    });

    return this.sendMail(to, 'Chamvan — Mật khẩu mới của bạn', html);
  }
}
