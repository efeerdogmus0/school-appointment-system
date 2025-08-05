# Nişantaşı Nuri Akın Anadolu Lisesi - Okul Ziyaret Randevu Sistemi

Bu proje, Nişantaşı Nuri Akın Anadolu Lisesi'nin okul tanıtım ve ziyaret günleri için veli ve öğrencilerin online randevu almasını sağlayan modern ve kullanıcı dostu bir web uygulamasıdır.

## ✨ Özellikler

- **Modern ve Kullanıcı Dostu Arayüz:** `react-bootstrap` ile geliştirilmiş, sade ve şık bir tasarım.
- **Tamamen Duyarlı (Responsive):** Mobil, tablet ve masaüstü cihazlarda sorunsuz bir deneyim sunar.
- **İki Adımlı Saat Seçimi:** Önce saat, sonra dakika seçimi yapılarak randevu saatinin kolayca belirlenmesini sağlar.
- **Kolay Randevu Akışı:**
    1.  Takvimden size uygun bir gün seçin.
    2.  İstediğiniz saati ve dakikayı seçin.
    3.  Ziyaretçi ve öğrenci bilgilerini içeren formu doldurun.
    4.  Randevunuzu onaylayın.
- **Belirli Randevu Tarihleri:** Randevular sadece okul yönetimi tarafından belirlenen tarihlerde (örn: 18-22 ve 25-26 Ağustos) alınabilir. Diğer günler takvimde pasiftir.
- **Özelleştirilmiş Zamanlama:** Randevu saatleri **10:00 - 16:00** arasında, 5 dakikalık periyotlarla ve **12:00-12:20** arası mola olacak şekilde ayarlanmıştır.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
- **Backend API:** Next.js API Routes
- **UI Kütüphaneleri:**
    - [React Bootstrap](https://react-bootstrap.github.io/)
    - [React Day Picker](http://react-day-picker.js.org/)
- **Dil:** TypeScript
- **Styling:** Bootstrap

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Projeyi klonlayın veya indirin.**

2.  **Gerekli bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```

4.  **Uygulamayı açın:**
    Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini ziyaret edin.

## ☁️ Vercel ile Yayınlama

Bu proje, Next.js'in yaratıcıları tarafından geliştirilen [Vercel](https://vercel.com/) platformu üzerinden kolayca yayınlanabilir. Projenizi bir GitHub repositorisine yükledikten sonra Vercel'e bağlayarak saniyeler içinde canlıya alabilirsiniz.

**⚠️ Önemli Not:** Mevcut uygulama, randevuları ana dizindeki `db.json` dosyasına kaydetmektedir. Bu yöntem geliştirme ve test için uygun olsa da, Vercel gibi platformlarda kalıcı değildir. Her yeni dağıtımda (deploy) veya sunucu yeniden başlatıldığında bu dosya sıfırlanacaktır. Kalıcı veri depolama için projenin bir veritabanına (PostgreSQL, MongoDB, Firebase vb.) bağlanması şiddetle tavsiye edilir.

### ⚠️ Önemli Not

Mevcut yapılandırmada, alınan randevular projenin ana dizinindeki `appointments.json` dosyasına kaydedilmektedir. Vercel'in dosya sistemi kalıcı değildir (ephemeral). Bu, sunucu yeniden başladığında veya yeni bir sürüm yayınlandığında **bu dosyanın sıfırlanacağı ve içindeki tüm randevu verilerinin kaybolacağı** anlamına gelir.

Bu haliyle sistem, kısa süreli kullanımlar veya testler için uygundur. Uzun vadeli ve kalıcı bir çözüm için randevu verilerinin **Vercel Postgres** veya benzeri harici bir veritabanında saklanması gerekmektedir.
