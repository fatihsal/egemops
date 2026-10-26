// E-posta sağlayıcısı soyutlaması. Satın alma tarafı bu arabirime bağımlıdır;
// Gmail bugün, Microsoft Graph gelecekte aynı arabirimi uygular.

export interface MailEki {
  dosyaAd: string;
  mimeType: string;
  icerik: Buffer;
}

export interface GidenMail {
  alici: string;
  konu: string;
  govde: string;
  ekler?: MailEki[];
}

export interface MailProvider {
  ad: string;
  gonder(mail: GidenMail): Promise<{ messageId: string; threadId?: string }>;
}
