# 🧹 Discord Sunucu Temizleme Botu

Bu proje, Discord sunucularında **toplu silme, banlama ve oda oluşturma** gibi güçlü işlemleri yapabilen bir bottur.  
Bot, sadece **whitelist** listesinde bulunan kullanıcıların komut çalıştırabilmesine izin verir.  

---

## 🚀 Özellikler
- **/herseyi_sil** → Sunucudaki tüm kanalları ve rolleri siler. Yeni yönetici rolü oluşturur.
- **/herkesi_banla [sebep]** → Sunucudaki tüm üyeleri (botlar hariç) banlar.
- **/wl_ekle [kullanıcı]** → Kullanıcıyı whitelist listesine ekler.
- **/wl_kaldir [kullanıcı]** → Kullanıcıyı whitelist listesinden çıkarır.
- **/oda [isim] [adet] [açıklama] [everyone] [dosya]**  
  - Belirtilen sayıda kanal açar.  
  - Açıklama mesajı gönderir.  
  - `everyone` seçeneği ile herkesi etiketleyebilir.  
  - İsteğe bağlı olarak resim/video dosyası eklenebilir.  

---

## 🔧 Kurulum
1. Bu projeyi indir:
   ```
   git clone https://github.com/kullanici/Discord-Sunucu-Temizleme-Botu.git
   cd Discord-Sunucu-Temizleme-Botu
2. Gerekli paketleri yükle:

   ```bash
   npm install discord.js dotenv
   ```
3. `.env` dosyası oluştur ve bilgilerini gir:

   ```env
   TOKEN=BOT_TOKENIN
   CLIENT_ID=BOT_CLIENT_ID
   BOT_OWNER_ID=DISCORD_ID
   ```
4. Botu başlat:

   ```bash
   node main.js
   ```

---

## 📂 Dosya Yapısı

* **main.js** → Botun ana dosyası
* **whitelist.json** → Whitelist kullanıcılarının tutulduğu dosya

---

## ⚠️ Kullanım Notları

* Bot, **çok güçlü komutlara** sahiptir. Yanlış kullanım sunucunuza ciddi zarar verebilir.
* Whitelist’e eklenmemiş kullanıcılar komut çalıştıramaz.
* Sadece **kendi sunucularınızda ve test ortamlarında** denemeniz tavsiye edilir.

---

## 📜 Sorumluluk Reddi

Bu yazılım **yalnızca eğitim ve kişisel kullanım amaçlıdır**.
Yanlış veya kötüye kullanım sonucu oluşabilecek **tüm sorumluluk kullanıcıya aittir**.
Geliştirici(ler), bu botun kullanımından doğabilecek **hiçbir zarardan sorumlu tutulamaz**.

---

## 📖 Lisans

Bu proje **GNU General Public License v3.0 (GPL-3.0)** ile lisanslanmıştır.
Daha fazla bilgi için [LICENSE](https://www.gnu.org/licenses/gpl-3.0.html) dosyasına göz atabilirsiniz.
