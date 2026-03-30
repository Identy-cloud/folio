const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://folio.identy.cloud";

export { APP_URL };

export function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="background:#0a0a0a;padding:24px 32px;border-radius:12px 12px 0 0">
<a href="${APP_URL}" style="color:#fff;font-size:22px;font-weight:700;text-decoration:none;letter-spacing:-0.5px">Folio</a>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px">
${body}
</td></tr>
<tr><td style="padding:20px 32px;text-align:center;color:#a1a1aa;font-size:12px">
&copy; ${new Date().getFullYear()} Folio by Identy. All rights reserved.
</td></tr>
</table>
</td></tr></table></body></html>`;
}

export function button(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td>
<a href="${href}" style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">${label}</a>
</td></tr></table>`;
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#18181b">${text}</h1>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46">${text}</p>`;
}
