# Node.js ile Kullanıcı Yönetimi Uygulaması

Bu Node.js uygulaması, kullanıcı yönetimi işlemlerini gerçekleştirmek için tasarlanmıştır. Uygulama, kullanıcıların
kaydolması, oturum açması, parolalarını sıfırlaması, parolalarını değiştirmesi ve e-posta adreslerini doğrulaması gibi
temel işlemleri destekler.

## Özellikler

<ul>
<li>Kullanıcı Kaydı: Kullanıcılar uygulamaya kayıt olabilir.</li>
<li>Oturum Açma: Kayıtlı kullanıcılar kullanıcı adı ve parolalarıyla oturum açabilir.</li>
<li>Parola Sıfırlama: Kullanıcılar parolalarını sıfırlamak için e-posta adreslerini kullanabilirler.</li>
<li>Parola Değiştirme: Oturum açmış kullanıcılar parolalarını değiştirebilirler.
</li>
<li>E-posta Doğrulama: Kullanıcılar kayıt olduktan sonra e-posta adreslerini doğrulayabilirler.</li>
</ul>


## Kullanılan Paketler

- bcrypt: ^5.1.1
- body-parser: ^1.20.2
- cors: ^2.8.5
- dotenv: ^16.3.2
- express: ^4.18.2
- http-status-codes: ^2.3.0
- joi: ^17.12.0
- jsonwebtoken: ^9.0.2
- mongoose: ^8.1.0
- nodemailer: ^6.9.9
- nodemon: ^3.0.3
- uuid: ^9.0.1

### Başlangıç

Aşağıdaki adımları izleyerek uygulamayı yerel ortamınızda çalıştırabilirsiniz:

1. Depoyu klonlayın:

```bash
git clone https://github.com/mchtyener/nodejs-auth.git
```

2. Gerekli paketleri yükleyin:

```bash
npm install
```

3. Uygulamayı başlatın:

```bash
npm start
```

## Kullanım

<ul>
<li><b>POST localhost:3000/api/register</b> Yeni bir kullanıcı kaydı oluşturmak için.</li>
<li><b>POST localhost:3000/api/login</b> Kayıtlı bir kullanıcı olarak oturum açmak için.</li>
<li><b>POST localhost:3000/api/forgot-password</b> Parola sıfırlama işlemi için e-posta göndermek için.</li>
<li><b>POST localhost:3000/api/change-password/:id</b> Oturum açmış bir kullanıcının parolasını değiştirmek için.
</li>
<li><b>POST localhost:3000/api/verify-email/:id</b> Yeni bir kullanıcının e-posta adresini doğrulamak için.</li>
</ul>

##  Katkılar
Katkılarınızı bekliyoruz! Lütfen yeni özellikler eklemek, hata düzeltmek veya belgelendirmeye katkıda bulunmak için bir
çekme isteği açın.


