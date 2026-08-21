

import Withdraw from "src/view/pages/withdraw/Withdraw";

const tr = {
  app: {
    title: "E-clicks Digital"
  },
  inputs: {
    username: "Kullanıcı Adı",
    password: "Şifre",
    phoneNumber: "Telefon Numarası",
    withdrawPassword: "Çekim Şifresi",
    confirmPassword: "Şifreyi Onayla",
    invitationcode: "Davet Kodu",
    walletaddress: "Cüzdan adresi"


  },



  pages: {
    home: {
      levels: "VIP Seviyeleri",
      chooseLevel: "Kazançlarınızı maksimize etmek için seviyenizi seçin",
      welcome: "Hoş Geldiniz",
      announcement: "Değerli kullanıcılar, E-clicks Digital platformu en iyi ve normal haline geri döndü, platformdan mümkün olduğunca fazla kazanmaya devam edin",

      // Action Buttons
      services: "Hizmetler",
      events: "Etkinlikler",
      about: "Hakkımızda",
      terms: "Şartlar",
      certificate: "Sertifika",
      faqs: "SSS",

      // VIP Level Cards
      currentLevel: "Mevcut",
      upgrade: "Yükselt",
      profitNormal: "normal ürünlerde kâr",
      profitPremium: "premium ürünlerde kâr",
      maxOrders: "Günlük maksimum sipariş",

      // Modal
      modal: {
        levelDetails: "Seviye Detayları",
        levelLimit: "Seviye Limiti",
        dailyOrders: "Günlük Siparişler",
        commissionRate: "Komisyon Oranı",
        cancel: "İptal",
        upgradeNow: "Hemen Yükselt"
      }
    },




    prizeModal: {
      congratulations: "Tebrikler!",
      spinning: "Dönüyor...",
      prizeWon: "Kazandınız!",
      currency: "USD",
      prizeBreakdown: "Ödül Detayları",
      totalAmount: "Toplam Tutar",
      yourWinnings: "Kazancınız",
      claimPrize: "Ödülü Al",
      celebrationMessage: "Ödülünüzün tadını çıkarın!",
    },

    tabBottomNavigator: {
      home: "Ana Sayfa",
      grap: "Yakala",
      records: "Kayıtlar",
      starting: "Başlat",
      customerService: "Müşteri Hizmetleri",
      myProfile: "Profilim"
    },



    transaction: {
      title: "İşlem Geçmişi",
      filters: {
        all: "Tümü",
        withdraw: "Çekim",
        deposit: "Yatırma"
      },
      recentTransactions: "Son İşlemler",
      transactionCount: "{0} işlem",
      types: {
        deposit: "Yatırma",
        withdrawal: "Çekim"
      },
      status: {
        completed: "Tamamlandı",
        processing: "İşleniyor",
        canceled: "İptal Edildi"
      },
      amount: {
        deposit: "+${0}",
        withdraw: "-${0}",
        canceled: "${0}"
      }
    },
    profile: {
      title: "Profil",
      invitationCode: "Davet Kodu",
      creditScore: "Kredi Skoru",
      balance: "Bakiye",
      todayProfit: "Bugünkü Kâr",
      frozenAmount: "Dondurulmuş Miktar",
      usd: "USD",

      // Menu Sections
      myFinancial: "Finansal İşlemlerim",
      myDetails: "Detaylarım",
      other: "Diğer",

      // Financial Items
      recharge: "Yükleme",
      withdraw: "Çekim",
      wallet: "Cüzdan",
      history: "Geçmiş",

      // Details Items
      contactUs: "Bize Ulaşın",
      profile: "Profil",
      updateWithdrawal: "Çekim detaylarını güncelle",

      // Other Items
      transaction: "İşlem",
      tasksHistory: "Görev Geçmişi",
      security: "Güvenlik",
      notifications: "Bildirimler",
      languages: "Diller",

      // Buttons
      logout: "Çıkış Yap",
      confirm: "Onayla",
      copied: "Kopyalandı",

      // Modals
      rechargeModal: {
        title: "Yükleme",
        text: "Yükleme yapmak için lütfen müşteri hizmetleriyle iletişime geçin"
      },
      withdrawModal: {
        title: "Çekim",
        text: "Çekim işleminize devam etmek için lütfen müşteri hizmetleriyle iletişime geçin."
      }
    },

    team: {
      title: "Profil",
      personalInformation: "Kişisel Bilgiler",
      accountDetails: "Hesap detaylarınız ve kişisel bilgileriniz",

      // Info Items
      fullName: "Tam Adı",
      email: "E-posta",
      phoneNumber: "Telefon Numarası",
      country: "Ülke",
      gender: "Cinsiyet",
      invitationCode: "Davet Kodu",

      // Gender Values
      genderNotSpecified: "Belirtilmemiş",

      // Placeholders
      notAvailable: "—"
    },

    language: {
      title: "Uygulama Dili",
      selectLanguage: "Dil Seçin",
      choosePreferred: "Tercih ettiğiniz dili seçin",
      searchPlaceholder: "Dillerde ara...",
      currentLanguage: "Mevcut Dil",

      // Language names (if needed for dynamic content)
      languages: {
        english: "İngilizce",
        french: "Fransızca",
        russian: "Rusça",
        german: "Almanca",
        spanish: "İspanyolca"
      },
      nativeNames: {
        english: "English",
        french: "Français",
        russian: "Русский",
        german: "Deutsch",
        spanish: "Español"
      }
    },

    online: {
      title: "Müşteri Hizmetleri",
      description: "Herhangi bir sorunuz varsa veya sorunlarla karşılaşırsanız, lütfen bize e-posta gönderin veya çevrimiçi müşteri destek ekibimizle sohbet edin.",
      contactWhatsApp: "WhatsApp'tan iletişime geç",
      contactTelegram: "Telegram'dan iletişime geç"
    },

    notifications: {
      title: "Bildirimler",
      filters: {
        all: "Tümü",
        deposit: "Yatırma",
        withdraw: "Çekim"
      },
      unreadCount: "{0} okunmamış",
      emptyState: {
        title: "Bildirim bulunamadı",
        description: "Henüz {0} bildiriminiz yok."
      },

      // Notification Types
      types: {
        deposit_success: "Yatırma Başarılı",
        deposit_canceled: "Yatırma İptal Edildi",
        withdraw_success: "Çekim Başarılı",
        withdraw_canceled: "Çekim İptal Edildi",
        system: "Sistem Bildirimi",
        alert: "Önemli Uyarı",
        default: "Bildirim"
      },

      // Notification Messages
      messages: {
        deposit_success: "${0} tutarındaki yatırma işleminiz başarıyla tamamlandı.",
        deposit_canceled: "${0} tutarındaki yatırma talebiniz iptal edildi.",
        withdraw_success: "${0} tutarındaki çekim işleminiz başarıyla tamamlandı.",
        withdraw_canceled: "${0} tutarındaki çekim talebiniz iptal edildi.",
        system: "Sistem bildirimi",
        alert: "Önemli uyarı bildirimi",
        default: "Bildirim güncellemesi"
      },

      // Status
      status: {
        unread: "okunmamış",
        read: "okundu"
      }
    },

    portfolio: {
      // Status Tabs
      completed: "Tamamlandı",
      pending: "Beklemede",
      canceled: "İptal Edildi",

      // Order Information
      orderTime: "Sipariş Zamanı",
      orderNumber: "Sipariş Numarası",
      totalOrderAmount: "Toplam sipariş tutarı",
      commission: "Komisyon",
      estimatedReturn: "Tahmini getiri",

      // Product Details
      quantity: "X 1",
      currency: "USD",
      submit: "Gönder",

      // Status Labels
      status: {
        completed: "Tamamlandı",
        pending: "Beklemede",
        canceled: "İptal Edildi"
      }
    },

    changePassword: {
      title: "Şifre Değiştir",
      header: "Şifre Değiştir",
      oldPassword: "Eski Şifre",
      newPassword: "Yeni Şifre",
      confirmPassword: "Şifreyi Onayla",
      submit: "Gönder",
      note: "Lütfen bu bilgileri dikkatlice doldurun",
      requiredField: "*"
    },

    withdraw: {
      title: "Çekim",
      withdrawAmount: "Çekim Miktarı",
      withdrawPassword: "Çekim Şifresi",
      availableBalance: "Kullanılabilir bakiye",
      confirm: "Onayla",
      rulesDescription: "Kural Açıklaması",
      rules: {
        minimum: "(1) Minimum çekim 100 USD'dir",
        paymentTime: "(2) Ödeme, çekim başvurusu onaylandıktan sonraki 1 saat içinde yapılacaktır.",
        orderCompletion: "(3) Eksik günlük sipariş gönderimi çekime tabi değildir, çekim için tüm ürünler gönderilmelidir"
      }
    },

    wallet: {
      title: "Cüzdan",
      withdrawalMethod: "Çekim yöntemi bilgileri",
      username: "Kullanıcı Adı",
      walletName: "Cüzdan Adı",
      choosePreferredCoin: "Tercih edilen coin'i seçin",
      walletAddress: "Cüzdan Adresi",
      withdrawPassword: "Çekim Şifresi",
      submit: "Gönder",
      note: "Bu bilgileri doldururken lütfen dikkatli olun",
      requiredField: "*"
    },

    grab: {
      // Header Section
      greeting: "Merhaba {0} 👏",

      // Stats Cards
      totalAmount: "Toplam Tutar",
      profitsAdded: "Kârlar buraya eklenecek",
      todaysCommission: "Bugünkü Komisyon",
      commissionEarned: "Kazanılan Komisyon",
      currency: "USD",

      // Optimization Section
      startOptimization: "Optimizasyonu Başlat",
      progressCount: "{0}/{1}",

      // Game Section
      commissionRate: "Komisyon Oranı",
      exclusiveChannel: "Özel üyeler için özel kanal",
      startButton: "Başlat",
      processing: "İşleniyor...",

      // Notice Section
      notice: "Uyarı",
      supportHours: "Çevrimiçi Destek Saatleri 10:00 - 22:00",
      contactSupport: "Yardım için lütfen çevrimiçi destekle iletişime geçin!"
    },

    grapModal: {
      orderTime: "Sipariş Zamanı",
      orderNumber: "Sipariş Numarası",
      totalOrderAmount: "Toplam sipariş tutarı",
      commission: "Komisyon",
      estimatedReturn: "Tahmini getiri",
      cancel: "İptal",
      submit: "Gönder",
      quantity: "X 1",
      currency: "USD"
    },

    actions: {
      event: "Etkinlikler",
      tc: "Şartlar ve Koşullar",
      certificate: "Sertifika",
      faq: "Sıkça Sorulan Sorular",
      company: "Şirket"
    },

    auth: {
      signin: {
        welcomeBack: "Tekrar Hoş Geldiniz!",
        signinToAccount: "Pazarlama hesabınıza giriş yapın",
        signinButton: "Giriş Yap",
        noAccount: "Hesabınız yok mu?",
        signupHere: "Buradan kaydolun."
      },
      signup: {
        createAccount: "Hesap Oluştur",
        signupForAccount: "Bir pazarlama hesabı için kaydolun",
        signupButton: "Kaydol",
        alreadyHaveAccount: "Zaten hesabınız var mı?",
        phonePlaceholder: "Telefon numaranızı girin",
        searchCountries: "Ülkelerde ara..."
      }
    },

    csPage: {
      customerSupport: "Müşteri Hizmetleri",
      hereToHelp: "Size yardımcı olmak için buradayız!",
      howCanWeHelp: "Bugün size nasıl yardımcı olabiliriz?",
      platformNames: {
        whatsapp: "WhatsApp",
        telegram: "Telegram"
      }
    },
  },


  entities: {
    record: {
      menu: "Kayıtlar",
      fields: {
        user: "kullanıcı",
        product: "ürün",
        number: "kayıt numarası",
        status: "durum",
      },
      list: {
        title: "Kayıt listesi",
      },
      view: {
        title: "Kayıt Detayı",
      },
      edit: {
        title: "Kaydı Düzenle",
      },
      create: {
        success: "Ürün başarıyla gönderildi.",
      },
      update: {
        success: "Ürün başarıyla gönderildi.",
      },
      destroy: {
        success: "Kayıt başarıyla silindi",
      },
      destroyAll: {
        success: "Kayıt başarıyla silindi",
      },
      enumerators: {
        status: {
          pending: "Beklemede",
          completed: "Tamamlandı",
          canceled: "İptal edildi",
        },
      },
    },

    category: {
      name: "kategori",
      label: "Kategoriler",
      menu: "Kategoriler",
      exporterFileName: "kategori_dışa_aktar",
      list: {
        menu: "Kategoriler",
        title: "Kategoriler",
      },
      create: {
        success: "Kategori başarıyla kaydedildi",
      },
      update: {
        success: "Kategori başarıyla kaydedildi",
      },
      destroy: {
        success: "Kategori başarıyla silindi",
      },
      destroyAll: {
        success: "Kategori(ler) başarıyla silindi",
      },
      edit: {
        title: "Kategoriyi Düzenle",
      },
      fields: {
        id: "Id",
        name: "Ad",
        slug: "Slug",
        photo: "Fotoğraf",
        metaKeywords: "Meta Anahtar Kelimeler",
        metaDescriptions: "Meta Açıklamalar",
        status: "Durum",
        isFeature: "Öne Çıkan",
        serialRange: "Seri",
        serial: "Seri",
        createdAt: "Oluşturulma tarihi",
        updatedAt: "Güncelleme tarihi",
        createdAtRange: "Oluşturulma tarihi",
      },
      enumerators: {
        status: {
          enable: "Etkin",
          disable: "Devre dışı",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Yeni Kategori",
      },
      view: {
        title: "Kategoriyi Görüntüle",
      },
      importer: {
        title: "Kategorileri İçe Aktar",
        fileName: "kategori_içe_aktarım_şablonu",
        hint: "Dosya/Resim sütunları, dosyaların URL'leri olmalı ve boşlukla ayrılmalıdır.",
      },
    },

    product: {
      name: "ürün",
      label: "Ürünler",
      menu: "Ürünler",
      exporterFileName: "ürün_dışa_aktar",
      list: {
        menu: "Ürünler",
        title: "Ürünler",
      },
      create: {
        success: "Ürün başarıyla kaydedildi",
      },
      update: {
        success: "Ürün başarıyla kaydedildi",
      },
      destroy: {
        success: "Ürün başarıyla silindi",
      },
      destroyAll: {
        success: "Ürün(ler) başarıyla silindi",
      },
      edit: {
        title: "Ürünü Düzenle",
      },
      fields: {
        id: "Id",
        name: "Ad",
        slug: "Slug",
        tags: "Etiketler",
        video: "Video",
        specificationName: "Özellik Adı",
        specificationDesciption: "Özellik Açıklaması",
        isSpecification: "Özellik mi",
        details: "Detaylar",
        photo: "Fotoğraf",
        discountPriceRange: "İndirimli Fiyat",
        discountPrice: "Mevcut Fiyat",
        previousPriceRange: "Önceki Fiyat",
        previousPrice: "Önceki Fiyat",
        stockRange: "Stok",
        stock: "Stok",
        metaKeywords: "Meta Anahtar Kelimeler",
        metaDesctiption: "Kısa Açıklama",
        status: "Durum",
        isType: "Tür",
        dateRange: "Tarih",
        date: "Tarih",
        itemType: "Ürün Türü",
        file: "Dosya",
        link: "Bağlantı",
        fileType: "Dosya Türü",
        taxe: "Vergi",
        category: "Kategori",
        subcategory: "Alt Kategori",
        childcategory: "Alt Alt Kategori",
        brand: "Marka",
        gallery: "Galeri",
        createdAt: "Oluşturulma tarihi",
        updatedAt: "Güncelleme tarihi",
        createdAtRange: "Oluşturulma tarihi",
      },
      enumerators: {
        status: {
          enable: "Etkin",
          disable: "Devre dışı",
        },
        itemType: {
          physical: "Fiziksel",
          digitale: "Dijital",
        },
        fileType: {
          file: "Dosya",
          link: "Bağlantı",
        },
        isType: {
          new_arrival: "Yeni Gelen",
          feature_product: "Öne Çıkan Ürün",
          top_pdroduct: "En İyi Ürün",
          best_product: "En İyi Ürün",
          flash_deal_product: "Fırsat Ürünü",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Yeni Ürün",
      },
      view: {
        title: "Ürünü Görüntüle",
      },
      importer: {
        title: "Ürünleri İçe Aktar",
        fileName: "ürün_içe_aktarım_şablonu",
        hint: "Dosya/Resim sütunları, dosyaların URL'leri olmalı ve boşlukla ayrılmalıdır.",
      },
    },
    transaction: {
      name: "işlem",
      label: "İşlemler",
      menu: "İşlemler",
      exporterFileName: "işlem_dışa_aktar",
      list: {
        menu: "İşlemler",
        title: "İşlemler",
      },
      create: {
        success: "İşlem başarıyla gönderildi",
      },
      update: {
        success: "İşlem başarıyla kaydedildi",
      },
      destroy: {
        success: "İşlem başarıyla silindi",
      },
      destroyAll: {
        success: "İşlem(ler) başarıyla silindi",
      },
      edit: {
        title: "İşlemi Düzenle",
      },
      fields: {
        id: "Id",
        amountRange: "Tutar",
        amount: "Tutar",
        email: "E-posta",
        tax: "Vergi",
        currencySign: "Para Birimi Sembolü",
        currencyValue: "Para Birimi Değeri",
        orderId: "Sipariş Kimliği",
        createdAt: "Oluşturulma tarihi",
        updatedAt: "Güncelleme tarihi",
        createdAtRange: "Oluşturulma tarihi",
      },
      enumerators: {
        status: {
          pending: "Beklemede",
          completed: "Başarılı",
          canceled: "İptal edildi",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Yeni İşlem",
      },
      view: {
        title: "İşlemi Görüntüle",
      },
      importer: {
        title: "İşlemleri İçe Aktar",
        fileName: "işlem_içe_aktarım_şablonu",
        hint: "Dosya/Resim sütunları, dosyaların URL'leri olmalı ve boşlukla ayrılmalıdır.",
      },
    },


    order: {
      name: "sipariş",
      label: "Siparişler",
      menu: "Siparişler",
      exporterFileName: "sipariş_dışa_aktar",
      list: {
        menu: "Siparişler",
        title: "Siparişler",
      },
      create: {
        success: "Sipariş başarıyla kaydedildi",
      },
      update: {
        success: "Sipariş başarıyla kaydedildi",
      },
      destroy: {
        success: "Sipariş başarıyla silindi",
      },
      destroyAll: {
        success: "Sipariş(ler) başarıyla silindi",
      },
      edit: {
        title: "Siparişi Düzenle",
      },
      fields: {
        id: "Id",
        userId: "Kullanıcı",
        cart: "Sepet",
        shipping: "Nakliye",
        discountRange: "İndirim",
        discount: "İndirim",
        paymentMethod: "Ödeme Yöntemi",
        taxe: "Vergi",
        transactionNumber: "İşlem Numarası",
        orderStatus: "Sipariş Durumu",
        createdAt: "Oluşturulma tarihi",
        updatedAt: "Güncelleme tarihi",
        createdAtRange: "Oluşturulma tarihi",
      },
      enumerators: {
        orderStatus: {
          pending: "Beklemede",
          in_progress: "İşlemde",
          delivered: "Teslim edildi",
          canceled: "İptal edildi",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Yeni Sipariş",
      },
      view: {
        title: "Siparişi Görüntüle",
      },
      importer: {
        title: "Siparişleri İçe Aktar",
        fileName: "sipariş_içe_aktarım_şablonu",
        hint: "Dosya/Resim sütunları, dosyaların URL'leri olmalı ve boşlukla ayrılmalıdır.",
      },
    },
  },

  user: {
    fields: {
      genre: "Cinsiyet",
      username: "Kullanıcı Adı",
      walletName: "Cüzdan Adı",
      id: "Id",
      confirmPassword: "Şifreyi Onayla",
      avatars: "Avatar",
      invitationcode: "Davet Kodu",
      email: "E-posta",
      emails: "E-posta(lar)",
      erc20: "ERC20 cüzdan adresi",
      trc20: "TRC20 cüzdan adresi",
      fullName: "Ad",
      balance: "Bakiye",
      firstName: "Ad",
      lastName: "Soyad",
      status: "Durum",
      phoneNumber: "Telefon Numarası",
      withdrawPassword: "Para Çekme Şifresi",
      sector: "Sektör",
      employer: "İşveren",
      profession: "Meslek",
      address: "Adres",
      birthDate: "Doğum Tarihi",
      maritalStatus: "Medeni Durum",
      facebookLink: "Facebook Bağlantısı",
      sponsor: "Sponsor",
      role: "Rol",
      createdAt: "Oluşturulma tarihi",
      updatedAt: "Güncelleme tarihi",
      roleUser: "Rol/Kullanıcı",
      roles: "Roller",
      createdAtRange: "Oluşturulma tarihi",
      password: "Şifre",
      oldPassword: "Eski Şifre",
      newPassword: "Yeni Şifre",
      newPasswordConfirmation: "Yeni Şifre Onayı",
      rememberMe: "Beni hatırla",
    },
    sector: {
      AGRO_ALIMENTAIRE: "Gıda endüstrisi",
      ASSURANCES: "Sigorta",
      AUDIOVISUEL: "Görsel-işitsel",
      BANCAIRE: "Bankacılık",
      CHIMIE: "Kimya",
      COMPOSANTS_AUTOMOBILES: "Otomotiv bileşenleri",
      DISTRIBUTION: "Dağıtım",
      DISTRIBUTION_AUTOMOBILE: "Otomotiv Dağıtımı",
      DIVERS: "Çeşitli",
      FINANCIER: "Finansal",
      HOLDING: "Holding",
      IMMOBILIER: "Gayrimenkul",
      INDUSTRIEL: "Endüstriyel",
      LEASING: "Leasing",
      LOGISTIQUE_TRANSPORT: "Lojistik ve taşımacılık",
      PHARMACEUTIQUE: "İlaç",
      SANTÉ: "Sağlık",
      TOURSIME: "Turizm",
      INFORMATION_TECHNOLOGY: "Bilgi Teknolojisi",
    },
    maritalStatus: {
      célébataire: "Bekar",
      marié: "Evli",
    },
    status: {
      active: "Aktif",
      invited: "Davetli",
      "empty-permissions": "İzin Bekliyor",
      inactive: "Pasif",
    },

    enumerators: {
      status: {
        USDT: "USDT",
        ETH: "ETH",
        BTC: "BTC",
      },
      gender: {
        male: "erkek",
        female: "kadın",
      }
    },
    invite: "Davet Et",
    validations: {
      // eslint-disable-next-line
      email: "E-posta ${value} geçersiz",
    },
    title: "Kullanıcılar",
    menu: "Kullanıcılar",
    doAddSuccess: "Kullanıcı(lar) başarıyla kaydedildi",
    doUpdateSuccess: "Kullanıcı başarıyla kaydedildi",
    exporterFileName: "kullanıcılar_dışa_aktar",
    doDestroySuccess: "Kullanıcı başarıyla silindi",
    doDestroyAllSelectedSuccess: "Kullanıcılar başarıyla silindi",
    edit: {
      title: "Kullanıcıyı Düzenle",
    },
    new: {
      title: "Kullanıcı(lar) Davet Et",
      titleModal: "Kullanıcı Davet Et",
      emailsHint:
        "Birden fazla e-posta adresini virgül karakteri kullanarak ayırın.",
    },
    view: {
      title: "Kullanıcıyı Görüntüle",
      activity: "Aktivite",
    },
    importer: {
      title: "Kullanıcıları İçe Aktar",
      fileName: "kullanıcılar_içe_aktarım_şablonu",
      hint: "Dosya/Resim sütunları, dosyaların URL'leri olmalı ve boşlukla ayrılmalıdır. İlişkiler, referans verilen kayıtların ID'leri olmalı ve boşlukla ayrılmalıdır. Roller, rol id'leri olmalı ve boşlukla ayrılmalıdır.",
    },
    errors: {
      userAlreadyExists: "Bu e-posta ile kullanıcı zaten mevcut",
      userNotFound: "Kullanıcı bulunamadı",
      revokingOwnPermission: `Kendi admin izninizi iptal edemezsiniz`,
    },
  },
  buttons: {
    login: "Giriş Yap",
    registerNow: "Şimdi Kaydol",
    signup: "Kayıt Ol",
    start: "Başla",
    orders: "Siparişler",
    submit: "Gönder",
    backtohome: "Ana Sayfaya Dön",
    confirm: "Onayla",
    logout: "Çıkış Yap",
    getstarted: "Başla",
  },
  text: {
    welcome: "Hoş Geldiniz",
    discover: "Size özel fırsatları keşfedin",
    signin: "Giriş Yap",
    haveaccount: "Zaten bir hesabınız var mı?",
    noaccount: "Hesabınız yok mu?",
    showingnow: "Şu An Gösterimde",
    comingsoon: "Yakında",
    termsconditions: "Şartlar & Koşullar",
    todayearning: "Bugünkü Kazanç",
    accountbalance: "Hesap Bakiyesi",
    freezebalance: "Dondurulmuş Bakiye",
    sumbitInformation: "Bilgileri Gönder",
    order: "Sipariş",
    pending: "Beklemede",
    completed: "Tamamlandı",
    canceled: "İptal Edildi",
    notransaction: "Henüz işlem bulunmamaktadır!",
    createdtime: "Oluşturulma Zamanı",
    creationtime: "Oluşturma zamanı",
    orderNumber: "Sipariş Numarası",
    orderamount: "Sipariş Tutarı",
    income: "Gelir",
    buyerating: "Alıcı Puanı",
    uid: "UID",
    promotioncode: "Promosyon Kodu",
    walletamount: "Cüzdan Bakiyesi",
    creditassesment: "Kredi Değerlendirmesi",
    myfinance: "Finanslarım",
    withdraw: "Para Çek",
    mydetails: "Bilgilerim",
    profile: "Profil",
    wallet: "Cüzdan",
    other: "Diğer",
    customersupport: "Müşteri Desteği",
    transaction: "İşlem",
    taskshistory: "Görev Geçmişi",
    security: "Güvenlik",
    sponsor: `Güvenliğimiz en büyük önceliğimizdir ve sizi 
              potansiyel risklerden korumak istiyoruz. Lütfen unutmayın, 
              asla bilinmeyen bir adrese para göndermenizi istemeyiz. 
              Ödeme yapmadan önce lütfen bilgileri bizimle doğrulayın.`,
  },
  errors: {
    backToHome: "Ana Sayfaya Dön",
    403: "Üzgünüz, bu sayfaya erişim yetkiniz yok",
    404: "Üzgünüz, ziyaret ettiğiniz sayfa mevcut değil",
    500: "Üzgünüz, sunucu bir hata bildiriyor",
    429: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
    forbidden: {
      message: "Erişim Engellendi",
    },
    validation: {
      message: "Bir hata oluştu",
    },
    defaultErrorMessage: "Üzgünüz, bir hata oluştu",
  },

  withdraw: {
    withdrawamount: "Çekilecek Tutar",
    Withdrawpassword: "Çekim Şifresi",
    availablebalance: "Mevcut Bakiye",
    rules: "Kurallar Açıklaması",
    rule1: "Minimum çekim tutarı 20$",
    rule2: "Çekim talebi yapıldıktan sonra ödeme 24 saat içinde yapılacaktır",
    rule3: "Günlük siparişlerin tamamı verilmezse çekim yapılamaz, tüm ürünler sunulmalıdır"
  },
  profile: {
    profile: "Profil",
    fullname: "Tam Ad",
    email: "E-Posta",
    phonenumber: "Telefon Numarası",
    country: "Ülke",
    Invitationcode: "Davet Kodu"
  },
  wallet: {
    wallet: "Cüzdan",
    info: "Çekim yöntemi bilgileri",
    username: "Kullanıcı Adı",
    walletname: "Cüzdan Adı",
    walletaddress: "Cüzdan Adresi",
    note: "Not",
    notedesctiption: "Lütfen bu bilgileri doldururken dikkatli olun."
  },

  cs: {
    cs: "Müşteri Hizmetleri",
    note: "Sorularınız veya sorunlarınız varsa, lütfen bize e-posta gönderin veya çevrimiçi müşteri destek ekibimizle sohbet edin.",
    contactnow: "Şimdi İletişime Geç"
  },
  transaction: {
    transaction: "İşlem",
    all: "Tümü",
    withdraw: "Para Çekme",
    dposit: "Para Yatırma",
    notransaction: "Henüz işlem bulunmamaktadır!"
  },
  order: {
    order: "Sipariş",
    completed: "Tamamlandı",
    pending: "Beklemede",
    canceled: "İptal Edildi",
    ordertime: "Sipariş Zamanı",
    ordernumber: "Sipariş Numarası",
    total: "Toplam Sipariş Tutarı",
    commission: "Komisyon",
    return: "Tahmini Getiri"
  },

  security: {
    changepassword: "Şifre Değiştir",
    oldpassword: "Eski Şifre",
    newpassword: "Yeni Şifre",
    confirmpassword: "Şifreyi Onayla",
    note: "Not",
    notedesc: "Lütfen bu bilgileri dikkatlice doldurun"
  },

  auth: {
    tenants: "Çalışma Alanları",
    singindesc: "Giriş yapmak için e-postanızı ve şifrenizi girin",
    signupdesc: "Kaydolmak için e-postanızı ve şifrenizi girin",
    profile: {
      title: "Profil",
      success: "Profil başarıyla güncellendi",
      vip: "Aboneliğiniz için tebrikler",
    },
    createAnAccount: "Hesap Oluştur",
    rememberMe: "Beni Hatırla",
    forgotPassword: "Şifremi Unuttum",
    signin: "Giriş Yap",
    signup: "Kaydol",
    signout: "Çıkış Yap",
    alreadyHaveAnAccount: "Zaten bir hesabınız var mı? Giriş yapın.",
    social: {
      errors: {
        "auth-invalid-provider":
          "Bu e-posta başka bir sağlayıcıda zaten kayıtlı.",
        "auth-no-email": "Bu hesapla ilişkilendirilen e-posta özel veya mevcut değil.",
      },
    },
    signinWithAnotherAccount: "Başka bir hesapla giriş yap",
    emailUnverified: {
      message: `Lütfen devam etmek için e-postanızı <strong>{0}</strong> adresinde onaylayın.`,
      submit: "E-posta Doğrulamasını Tekrar Gönder",
    },
    emptyPermissions: {
      message: "Henüz herhangi bir izniniz yok. Yönetici tarafından yetki verilmesini bekleyin.",
    },
    passwordResetEmail: {
      message: "Şifre sıfırlama e-postası gönder",
      error: "E-posta tanınmıyor",
    },
    passwordReset: {
      message: "Şifreyi Sıfırla",
    },
    passwordChange: {
      title: "Şifreyi Değiştir",
      success: "Şifre başarıyla değiştirildi",
      mustMatch: "Şifreler eşleşmelidir",
    },
    emailAddressVerificationEmail: {
      error: "E-posta tanınmıyor",
    },
    verificationEmailSuccess: "Doğrulama e-postası başarıyla gönderildi",
    passwordResetEmailSuccess: "Şifre sıfırlama e-postası başarıyla gönderildi",
    passwordResetSuccess: "Şifre başarıyla değiştirildi",
    verifyEmail: {
      success: "E-posta başarıyla doğrulandı.",
      message: "Biraz bekleyin, e-postanız doğrulanıyor...",
    },
  },

  tabbarmenue: {
    home: "Ana Sayfa",
    rate: "Değerlendir",
    profile: "Profil"
  },
  validation: {
    mixed: {
      default: "${path} geçersiz",
      required: "${path} zorunludur",
      oneOf: "${path} şu değerlerden biri olmalıdır: ${values}",
      notOneOf: "${path} şu değerlerden biri olmamalıdır: ${values}",
      notType: ({ path, type, value, originalValue }) => {
        return `${path} bir ${type} olmalıdır`;
      },
    },
    string: {
      length: "${path} tam olarak ${length} karakter olmalıdır",
      min: "${path} en az ${min} karakter olmalıdır",
      max: "${path} en fazla ${max} karakter olmalıdır",
      matches: '${path} şu desenle eşleşmelidir: "${regex}"',
      email: "${path} geçerli bir e-posta adresi olmalıdır",
      url: "${path} geçerli bir URL olmalıdır",
      trim: "${path} başında ve sonunda boşluk olmamalıdır",
      lowercase: "${path} küçük harflerden oluşmalıdır",
      uppercase: "${path} büyük harflerden oluşmalıdır",
      selected: "${path} seçilmelidir",
    },
    number: {
      min: "${path} ${min} veya daha büyük olmalıdır",
      max: "${path} ${max} veya daha küçük olmalıdır",
      lessThan: "${path} ${less} değerinden küçük olmalıdır",
      moreThan: "${path} ${more} değerinden büyük olmalıdır",
      notEqual: "${path} ${notEqual} değerine eşit olmamalıdır",
      positive: "${path} pozitif bir sayı olmalıdır",
      negative: "${path} negatif bir sayı olmalıdır",
      integer: "${path} bir tam sayı olmalıdır",
    },
    date: {
      min: "${path} ${min} tarihinden sonra olmalıdır",
      max: "${path} ${max} tarihinden önce olmalıdır",
    },
    boolean: {},
    object: {
      noUnknown:
        "${path} belirtilmeyen anahtarlar içermemelidir",
    },
    array: {
      min: ({ min, path }) =>
        min === 1
          ? `${path} zorunludur`
          : `${path} en az ${min} öğe içermelidir`,
      max: "${path} en fazla ${max} öğe içermelidir",
    },
  },
  /* eslint-disable */
  fileUploader: {
    upload: "Yükle",
    image: "Bir resim yüklemelisiniz",
    size: "Dosya çok büyük. Maksimum izin verilen boyut {0}",
    formats: `Geçersiz format. Şunlardan biri olmalıdır: {0}.`,
  },

};

export default tr;
