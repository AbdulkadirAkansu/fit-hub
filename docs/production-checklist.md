# FitHub yayın kontrol listesi

Bu liste, kod yayımlanmadan önce bir kez tamamlanması gereken Vercel, Supabase ve Google ayarlarını içerir. Gizli anahtarları hiçbir zaman GitHub'a veya `NEXT_PUBLIC_*` değişkenlerine eklemeyin.

## 1. Vercel

- [ ] Production domain: `https://fit-hub-xi.vercel.app`
- [ ] `NEXT_PUBLIC_SITE_URL=https://fit-hub-xi.vercel.app`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` production ortamına ekli.
- [ ] `SENTEZ_API_KEY` yalnızca server environment variable olarak ekli; `NEXT_PUBLIC_` ile başlamıyor.
- [ ] Vercel Dashboard > Analytics'ten Web Analytics etkinleştirildi.
- [ ] Bu kontrol listesindeki ayarlardan sonra Vercel'de yeni bir production deployment başlatıldı.

## 2. Supabase e-posta doğrulaması

FitHub'ın kayıt ekranı doğrulama e-postası ve yeniden gönderme akışını hazırlar. Bunun çalışması için Supabase panelindeki canlı ayarların aşağıdaki şekilde olması gerekir:

- [ ] Authentication > Sign In / Providers > Email bölümünde **Confirm email** açık.
- [ ] Authentication > Email Templates > **Confirm signup** şablonu bağlantı yerine `{{ .Token }}` ile 8 haneli kod gönderiyor. Önerilen konu: `FitHub doğrulama kodun: {{ .Token }}`. Önerilen içerik: `<h2>E-posta adresini doğrula</h2><p>FitHub hesabını etkinleştirmek için bu kodu uygulamaya gir:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p><p>Bu kod tek kullanımlıktır.</p>`
- [ ] Authentication > URL Configuration bölümünde **Site URL** `https://fit-hub-xi.vercel.app`.
- [ ] Aynı bölümde Redirect URLs listesine şunlar eklendi:
  - `https://fit-hub-xi.vercel.app/hesap/giris`
  - `https://fit-hub-xi.vercel.app/hesap/sifre-sifirla`
  - Yerel test gerekiyorsa `http://localhost:3000/**`
- [ ] Authentication > SMTP Settings bölümünde üretim SMTP sağlayıcısı yapılandırıldı. Varsayılan Supabase e-posta servisi gerçek kullanıcılar için uygun değildir.
- [ ] Gönderici alan adı için SPF, DKIM ve DMARC kayıtları etkin.
- [ ] Yeni bir e-posta hesabıyla kayıt, doğrulama, tekrar gönderme ve şifre sıfırlama akışı test edildi.

## 3. Google ile giriş

- [ ] Google Cloud Console'da OAuth 2.0 Web Client oluşturuldu.
- [ ] Authorized redirect URI olarak tam şu değer eklendi:
  `https://curordwaoaxfytrneuey.supabase.co/auth/v1/callback`
- [ ] Supabase > Authentication > Providers > Google bölümünde Client ID ve Client Secret kaydedilip provider etkinleştirildi.
- [ ] Production domainiyle `/hesap/giris` sayfasından Google girişi ve geri dönüş test edildi.

## 4. Güvenlik ve işletim

- [ ] Supabase Database Advisors çalıştırıldı; RLS uyarıları çözüldü.
- [ ] Tüm kullanıcıya ait tabloların RLS politikaları kullanıcı sahipliği (`auth.uid() = user_id`) ile test edildi.
- [ ] Authentication > Rate Limits ve CAPTCHA ayarları kontrol edildi.
- [ ] Vercel Analytics verileri ve Supabase Auth logs haftalık gözden geçiriliyor.
- [ ] Bir gizlilik/silme talebinin `destek@fithub.com` adresinden gerçekten karşılanabildiği doğrulandı.

## 5. Her sürüm öncesi

```bash
npm ci
npm run lint
npm run build
npm audit --omit=dev
```

`npm audit fix --force` komutunu doğrudan production dalında çalıştırmayın. Önce güncellemenin Next.js ve PDF çıktılarıyla uyumunu ayrı bir dalda doğrulayın.
