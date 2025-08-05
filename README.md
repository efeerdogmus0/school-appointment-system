# Nişantaşı Nuri Akın Anadolu Lisesi - Ön Kayıt ve Randevu Sistemi

Bu proje, Nişantaşı Nuri Akın Anadolu Lisesi için geliştirilmiş, velilerin okul ziyaret randevusu almasını ve aynı zamanda kapsamlı bir ön kayıt başvurusu yapmasını sağlayan modern bir web uygulamasıdır.

## ✨ Temel Özellikler

- **Dinamik Randevu Takvimi:** Belirlenen gün ve saatlerde randevu alabilme.
- **Gerçek Zamanlı Doluluk Kontrolü:** Bir randevu saati alındığında başkası tarafından seçilemez.
- **Kapsamlı Başvuru Formu:** Öğrenci, veli, baba, LGS ve görüş/öneri gibi birçok detayı içeren çok adımlı form.
- **Anlık Form Validasyonu:** Kullanıcı dostu hata mesajları ile eksiksiz ve doğru veri girişi sağlanır.
- **Tamamen Duyarlı (Responsive):** Mobil, tablet ve masaüstü cihazlarda sorunsuz çalışır.
- **Şifre Korumalı Yönetici Paneli:**
  - Tüm başvuruları listeleme, görüntüleme ve silme.
  - Başvuru detaylarını düzenleme.
  - Her başvuruyu formatlanmış bir **PDF olarak indirme**.

## 🛠️ Kullanılan Teknolojiler

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Dil:** TypeScript
- **Veritabanı:** [Vercel KV](https://vercel.com/storage/kv) (Upstash Redis tabanlı)
- **UI Kütüphanesi:** [React Bootstrap](https://react-bootstrap.github.io/)
- **Form Yönetimi:** React Hook Form
- **PDF Oluşturma:** jsPDF, html2canvas
- **Hosting:** [Vercel](https://vercel.com/)

## 🚀 Projeyi Çalıştırma

### 1. Vercel Kurulumu ve Klonlama

Bu proje, veri depolama için Vercel KV'ye ihtiyaç duyar. En kolay başlangıç yolu, projeyi doğrudan Vercel'e deploy etmektir.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fefeerdogmus0%2Fschool-appointment-system&env=NEXT_PUBLIC_ADMIN_PASSWORD&envDescription=Admin%20paneli%20i%C3%A7in%20bir%20%C5%9Fifre%20belirleyin.&project-name=okul-randevu-sistemi&repository-name=okul-randevu-sistemi&integration-ids=oac_V3R1GIpkoJorr6eKpl_1O2Y2)

Yukarıdaki butona tıklayarak:
1.  Projeyi kendi GitHub hesabınıza klonlayabilirsiniz.
2.  Vercel üzerinde yeni bir proje oluşturulur.
3.  Gerekli **Vercel KV veritabanı otomatik olarak oluşturulur** ve projenize bağlanır.
4.  Admin paneli şifresi için `NEXT_PUBLIC_ADMIN_PASSWORD` ortam değişkenini belirlemeniz istenir.

### 2. Yerel (Local) Geliştirme Ortamı

Vercel'de projenizi oluşturduktan sonra, yerel makinenizde çalışmak için aşağıdaki adımları izleyin:

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/<kendi-kullanici-adiniz>/okul-randevu-sistemi.git
    cd okul-randevu-sistemi
    ```

2.  **Vercel CLI ile Bağlantı Kurun:**
    Vercel CLI'ı yükleyin ve projenizi Vercel'deki projenize bağlayın. Bu komut, Vercel'deki tüm ortam değişkenlerini (`KV_...` dahil) yerel projenize çeker ve `.env.local` dosyası oluşturur.
    ```bash
    npm install -g vercel
    vercel link
    vercel env pull .env.local
    ```

3.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

4.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```

5.  Uygulama artık [http://localhost:3000](http://localhost:3000) adresinde çalışıyor olacaktır.

## 🔑 Yönetici Paneli

- **Adres:** `/admin`
- **Şifre:** Projeyi kurarken belirlediğiniz `NEXT_PUBLIC_ADMIN_PASSWORD` ortam değişkenindeki değerdir.
