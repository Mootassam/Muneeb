
import Withdraw from "src/view/pages/withdraw/Withdraw";

const de = {
  app: {
    title: "Luxora Mall"
  },
  inputs: {
    username: "Benutzername",
    password: "Passwort",
    phoneNumber: "Telefonnummer",
    withdrawPassword: "Auszahlungs-Passwort",
    confirmPassword: "Passwort bestätigen",
    invitationcode: "Einladungscode",
    walletaddress: "Wallet-Adresse"
  },



  pages: {
    home: {
      levels: "VIP-Stufen",
      chooseLevel: "Wählen Sie Ihre Stufe, um Ihre Einnahmen zu maximieren",
      welcome: "Willkommen",
      announcement: "Liebe Benutzer, die Luxora Mall-Plattform ist wieder im besten und normalen Zustand, verdienen Sie weiterhin so viel wie möglich von der Plattform",

      // Action Buttons
      services: "Dienstleistungen",
      events: "Veranstaltungen",
      about: "Über uns",
      terms: "AGB",
      certificate: "Zertifikat",
      faqs: "FAQ",

      // VIP Level Cards
      currentLevel: "Aktuell",
      upgrade: "Upgrade",
      profitNormal: "Gewinn auf normale Produkte",
      profitPremium: "Gewinn auf Premium-Produkte",
      maxOrders: "Max. Bestellungen pro Tag",

      // Modal
      modal: {
        levelDetails: "Stufendetails",
        levelLimit: "Stufenlimit",
        dailyOrders: "Tägliche Bestellungen",
        commissionRate: "Provisionssatz",
        cancel: "Abbrechen",
        upgradeNow: "Jetzt upgraden"
      }
    },

    prizeModal: {
      congratulations: "Herzlichen Glückwunsch!",
      spinning: "Dreht sich...",
      prizeWon: "Sie haben gewonnen!",
      currency: "USD",
      prizeBreakdown: "Preisaufstellung",
      totalAmount: "Gesamtbetrag",
      yourWinnings: "Ihr Gewinn",
      claimPrize: "Preis beanspruchen",
      celebrationMessage: "Genießen Sie Ihre Belohnung!",
    },

    
    tabBottomNavigator: {
      home: "Startseite",
      grap: "Erfassen",
      records: "Aufzeichnungen",
      starting: "Starten",
      customerService: "Kundenservice",
      myProfile: "Mein Profil"
    },

    transaction: {
      title: "Transaktionsverlauf",
      filters: {
        all: "Alle",
        withdraw: "Auszahlung",
        deposit: "Einzahlung"
      },
      recentTransactions: "Letzte Transaktionen",
      transactionCount: "{0} Transaktionen",
      types: {
        deposit: "Einzahlung",
        withdrawal: "Auszahlung"
      },
      status: {
        completed: "Abgeschlossen",
        processing: "In Bearbeitung",
        canceled: "Storniert"
      },
      amount: {
        deposit: "+${0}",
        withdraw: "-${0}",
        canceled: "${0}"
      }
    },

    profile: {
      title: "Profil",
      invitationCode: "Einladungscode",
      creditScore: "Kredit-Score",
      balance: "Guthaben",
      todayProfit: "Heutiger Gewinn",
      frozenAmount: "Eingefrorener Betrag",
      usd: "USD",

      // Menu Sections
      myFinancial: "Meine Finanzen",
      myDetails: "Meine Details",
      other: "Andere",

      // Financial Items
      recharge: "Aufladen",
      withdraw: "Auszahlen",
      wallet: "Wallet",
      history: "Verlauf",

      // Details Items
      contactUs: "Kontaktieren Sie uns",
      profile: "Profil",
      updateWithdrawal: "Auszahlungsdetails aktualisieren",

      // Other Items
      transaction: "Transaktion",
      tasksHistory: "Aufgabenverlauf",
      security: "Sicherheit",
      notifications: "Benachrichtigungen",
      languages: "Sprachen",

      // Buttons
      logout: "Abmelden",
      confirm: "Bestätigen",
      copied: "Kopiert",

      // Modals
      rechargeModal: {
        title: "Aufladen",
        text: "Bitte kontaktieren Sie den Kundenservice zum Aufladen"
      },
      withdrawModal: {
        title: "Auszahlung",
        text: "Bitte kontaktieren Sie den Kundenservice, um mit Ihrer Auszahlung fortzufahren."
      }
    },

    team: {
      title: "Profil",
      personalInformation: "Persönliche Informationen",
      accountDetails: "Ihre Kontodetails und persönlichen Informationen",

      // Info Items
      fullName: "Vollständiger Name",
      email: "E-Mail",
      phoneNumber: "Telefonnummer",
      country: "Land",
      gender: "Geschlecht",
      invitationCode: "Einladungscode",

      // Gender Values
      genderNotSpecified: "Nicht angegeben",

      // Placeholders
      notAvailable: "—"
    },

    language: {
      title: "App-Sprache",
      selectLanguage: "Sprache auswählen",
      choosePreferred: "Wählen Sie Ihre bevorzugte Sprache",
      searchPlaceholder: "Sprachen suchen...",
      currentLanguage: "Aktuelle Sprache",

      // Language names (if needed for dynamic content)
      languages: {
        english: "Englisch",
        french: "Französisch",
        russian: "Russisch",
        german: "Deutsch",
        spanish: "Spanisch"
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
      title: "Kundenservice",
      description: "Wenn Sie Fragen haben oder auf Probleme stoßen, senden Sie uns bitte eine E-Mail oder chatten Sie mit unserem Online-Kundensupport-Team.",
      contactWhatsApp: "Auf WhatsApp kontaktieren",
      contactTelegram: "Auf Telegram kontaktieren",
      unavailableTitle: "Kein Support-Mitarbeiter verfügbar",
      unavailableMessage: "Unser Kundenservice-Team ist derzeit nicht verfügbar. Bitte schauen Sie später wieder vorbei."
    },

    notifications: {
      title: "Benachrichtigungen",
      filters: {
        all: "Alle",
        deposit: "Einzahlung",
        withdraw: "Auszahlung"
      },
      unreadCount: "{0} ungelesen",
      emptyState: {
        title: "Keine Benachrichtigungen gefunden",
        description: "Sie haben noch keine {0} Benachrichtigungen."
      },

      // Notification Types
      types: {
        deposit_success: "Einzahlung erfolgreich",
        deposit_canceled: "Einzahlung storniert",
        withdraw_success: "Auszahlung erfolgreich",
        withdraw_canceled: "Auszahlung storniert",
        system: "Systembenachrichtigung",
        alert: "Wichtige Warnung",
        default: "Benachrichtigung"
      },

      // Notification Messages
      messages: {
        deposit_success: "Ihre Einzahlung von ${0} wurde erfolgreich abgeschlossen.",
        deposit_canceled: "Ihre Einzahlungsanfrage für ${0} wurde storniert.",
        withdraw_success: "Ihre Auszahlung von ${0} wurde erfolgreich abgeschlossen.",
        withdraw_canceled: "Ihre Auszahlungsanfrage für ${0} wurde storniert.",
        system: "Systembenachrichtigung",
        alert: "Wichtige Warnbenachrichtigung",
        default: "Benachrichtigungsupdate"
      },

      // Status
      status: {
        unread: "ungelesen",
        read: "gelesen"
      }
    },

    portfolio: {
      // Status Tabs
      completed: "Abgeschlossen",
      pending: "Ausstehend",
      canceled: "Storniert",

      // Order Information
      orderTime: "Bestellzeit",
      orderNumber: "Bestellnummer",
      totalOrderAmount: "Gesamtbestellbetrag",
      commission: "Provision",
      estimatedReturn: "Voraussichtliche Rendite",

      // Product Details
      quantity: "X 1",
      currency: "USD",
      submit: "Absenden",

      // Status Labels
      status: {
        completed: "Abgeschlossen",
        pending: "Ausstehend",
        canceled: "Storniert"
      }
    },

    changePassword: {
      title: "Passwort ändern",
      header: "Passwort ändern",
      oldPassword: "Altes Passwort",
      newPassword: "Neues Passwort",
      confirmPassword: "Passwort bestätigen",
      submit: "Absenden",
      note: "Bitte füllen Sie diese Informationen sorgfältig aus",
      requiredField: "*"
    },

    withdraw: {
      title: "Auszahlung",
      withdrawAmount: "Auszahlungsbetrag",
      withdrawPassword: "Auszahlungspasswort",
      availableBalance: "Verfügbares Guthaben",
      confirm: "Bestätigen",
      rulesDescription: "Regelbeschreibung",
      rules: {
        minimum: "(1) Mindestauszahlung beträgt 100 USD",
        paymentTime: "(2) Die Zahlung wird innerhalb der nächsten Stunde nach Genehmigung des Auszahlungsantrags getätigt.",
        orderCompletion: "(3) Unvollständige tägliche Auftragserfüllung führt zu keiner Auszahlung, alle Produkte müssen für die Auszahlung eingereicht werden"
      }
    },

    wallet: {
      title: "Wallet",
      withdrawalMethod: "Informationen zur Auszahlungsmethode",
      username: "Benutzername",
      walletName: "Wallet-Name",
      walletAddress: "Wallet-Adresse",
      withdrawPassword: "Auszahlungspasswort",
      submit: "Absenden",
      note: "Bitte seien Sie vorsichtig beim Ausfüllen dieser Informationen",
      requiredField: "*"
    },

    grab: {
      // Header Section
      greeting: "Hallo {0} 👏",

      // Stats Cards
      totalAmount: "Gesamtbetrag",
      profitsAdded: "Gewinne werden hier hinzugefügt",
      todaysCommission: "Heutige Provision",
      commissionEarned: "Verdiente Provision",
      currency: "USD",

      // Optimization Section
      startOptimization: "Optimierung starten",
      progressCount: "{0}/{1}",

      // Game Section
      commissionRate: "Provisionssatz",
      exclusiveChannel: "Exklusiver Kanal für exklusive Mitglieder",
      startButton: "Starten",
      processing: "Wird verarbeitet...",

      // Notice Section
      notice: "Hinweis",
      supportHours: "Online-Supportzeiten 10:00 - 22:00",
      contactSupport: "Bitte kontaktieren Sie den Online-Support für Ihre Unterstützung!"
    },

    grapModal: {
      orderTime: "Bestellzeit",
      orderNumber: "Bestellnummer",
      totalOrderAmount: "Gesamtbestellbetrag",
      commission: "Provision",
      estimatedReturn: "Voraussichtliche Rendite",
      cancel: "Abbrechen",
      submit: "Absenden",
      quantity: "X 1",
      currency: "USD"
    },

    actions: {
      event: "Veranstaltungen",
      tc: "Geschäftsbedingungen",
      certificate: "Zertifikat",
      faq: "Häufig gestellte Fragen",
      company: "Unternehmen"
    },

    auth: {
      signin: {
        welcomeBack: "Willkommen zurück!",
        signinToAccount: "Melden Sie sich bei Ihrem Marketing-Konto an",
        signinButton: "Anmelden",
        noAccount: "Noch kein Konto?",
        signupHere: "Hier registrieren."
      },
      signup: {
        createAccount: "Konto erstellen",
        signupForAccount: "Registrieren Sie sich für ein Marketing-Konto",
        signupButton: "Registrieren",
        alreadyHaveAccount: "Haben Sie bereits ein Konto?",
        phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
        searchCountries: "Länder suchen..."
      }
    },

    csPage: {
      customerSupport: "Kundenservice",
      hereToHelp: "Wir sind hier, um Ihnen zu helfen!",
      howCanWeHelp: "Wie können wir Ihnen heute helfen?",
      platformNames: {
        whatsapp: "WhatsApp",
        telegram: "Telegram"
      }
    },
  },
  entities: {
    record: {
      menu: "Records",
      fields: {
        user: "Benutzer",
        product: "Produkt",
        number: "Record Nummer",
        status: "Status",
      },
      list: {
        title: "Liste der Records",
      },
      view: {
        title: "Record Details",
      },
      edit: {
        title: "Record bearbeiten",
      },
      create: {
        success: "Produkt erfolgreich eingereicht.",
      },
      update: {
        success: "Produkt erfolgreich eingereicht.",
      },
      destroy: {
        success: "Record erfolgreich gelöscht",
      },
      destroyAll: {
        success: "Record erfolgreich gelöscht",
      },
      enumerators: {
        status: {
          pending: "Ausstehend",
          completed: "Abgeschlossen",
          canceled: "Storniert",
        },
      },
    },

    category: {
      name: "Kategorie",
      label: "Kategorien",
      menu: "Kategorien",
      exporterFileName: "kategorie_export",
      list: {
        menu: "Kategorien",
        title: "Kategorien",
      },
      create: {
        success: "Kategorie erfolgreich gespeichert",
      },
      update: {
        success: "Kategorie erfolgreich gespeichert",
      },
      destroy: {
        success: "Kategorie erfolgreich gelöscht",
      },
      destroyAll: {
        success: "Kategorie(n) erfolgreich gelöscht",
      },
      edit: {
        title: "Kategorie bearbeiten",
      },
      fields: {
        id: "Id",
        name: "Name",
        slug: "Slug",
        photo: "Foto",
        metaKeywords: "Meta-Keywords",
        metaDescriptions: "Meta-Beschreibungen",
        status: "Status",
        isFeature: "Ist Feature",
        serialRange: "Seriennummer",
        serial: "Seriennummer",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        createdAtRange: "Erstellt am",
      },
      enumerators: {
        status: {
          enable: "Aktivieren",
          disable: "Deaktivieren",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Neue Kategorie",
      },
      view: {
        title: "Kategorie anzeigen",
      },
      importer: {
        title: "Kategorien importieren",
        fileName: "kategorie_import_vorlage",
        hint: "Datei-/Bildspalten müssen die URLs der Dateien sein, getrennt durch Leerzeichen.",
      },
    },

    product: {
      name: "produkt",
      label: "Produkte",
      menu: "Produkte",
      exporterFileName: "produkt_export",
      list: {
        menu: "Produkte",
        title: "Produkte",
      },
      create: {
        success: "Produkt erfolgreich gespeichert",
      },
      update: {
        success: "Produkt erfolgreich gespeichert",
      },
      destroy: {
        success: "Produkt erfolgreich gelöscht",
      },
      destroyAll: {
        success: "Produkt(e) erfolgreich gelöscht",
      },
      edit: {
        title: "Produkt bearbeiten",
      },
      fields: {
        id: "Id",
        name: "Name",
        slug: "Slug",
        tags: "Tags",
        video: "Video",
        specificationName: "Spezifikationsname",
        specificationDesciption: "Spezifikationsbeschreibung",
        isSpecification: "Ist Spezifikation",
        details: "Details",
        photo: "Foto",
        discountPriceRange: "Rabattpreis",
        discountPrice: "Aktueller Preis",
        previousPriceRange: "Vorheriger Preis",
        previousPrice: "Vorheriger Preis",
        stockRange: "Lagerbestand",
        stock: "Lagerbestand",
        metaKeywords: "Meta-Keywords",
        metaDesctiption: "Kurze Beschreibung",
        status: "Status",
        isType: "Typ",
        dateRange: "Datum",
        date: "Datum",
        itemType: "Artikeltyp",
        file: "Datei",
        link: "Link",
        fileType: "Dateityp",
        taxe: "Steuer",
        category: "Kategorie",
        subcategory: "Unterkategorie",
        childcategory: "Untergeordnete Kategorie",
        brand: "Marke",
        gallery: "Galerie",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        createdAtRange: "Erstellt am",
      },
      enumerators: {
        status: {
          enable: "Aktivieren",
          disable: "Deaktivieren",
        },
        itemType: {
          physical: "Physisch",
          digitale: "Digital",
        },
        fileType: {
          file: "Datei",
          link: "Link",
        },
        isType: {
          new_arrival: "Neuankömmling",
          feature_product: "Feature-Produkt",
          top_pdroduct: "Top-Produkt",
          best_product: "Bestes Produkt",
          flash_deal_product: "Flash-Deal-Produkt",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Neues Produkt",
      },
      view: {
        title: "Produkt anzeigen",
      },
      importer: {
        title: "Produkte importieren",
        fileName: "produkt_import_vorlage",
        hint: "Datei-/Bildspalten müssen die URLs der Dateien sein, getrennt durch Leerzeichen.",
      },
    },
    transaction: {
      name: "transaktion",
      label: "Transaktionen",
      menu: "Transaktionen",
      exporterFileName: "transaktion_export",
      list: {
        menu: "Transaktionen",
        title: "Transaktionen",
      },
      create: {
        success: "Transaktion erfolgreich gesendet",
      },
      update: {
        success: "Transaktion erfolgreich gespeichert",
      },
      destroy: {
        success: "Transaktion erfolgreich gelöscht",
      },
      destroyAll: {
        success: "Transaktion(en) erfolgreich gelöscht",
      },
      edit: {
        title: "Transaktion bearbeiten",
      },
      fields: {
        id: "Id",
        amountRange: "Betrag",
        amount: "Betrag",
        email: "E-Mail",
        tax: "Steuer",
        currencySign: "Währungssymbol",
        currencyValue: "Währungswert",
        orderId: "Bestell-ID",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        createdAtRange: "Erstellt am",
      },
      enumerators: {
        status: {
          pending: "Ausstehend",
          completed: "Erfolg",
          canceled: "Storniert",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Neue Transaktion",
      },
      view: {
        title: "Transaktion anzeigen",
      },
      importer: {
        title: "Transaktionen importieren",
        fileName: "transaktion_import_vorlage",
        hint: "Datei-/Bildspalten müssen die URLs der Dateien sein, getrennt durch Leerzeichen.",
      },
    },

    order: {
      name: "bestellung",
      label: "Bestellungen",
      menu: "Bestellungen",
      exporterFileName: "bestellung_export",
      list: {
        menu: "Bestellungen",
        title: "Bestellungen",
      },
      create: {
        success: "Bestellung erfolgreich gespeichert",
      },
      update: {
        success: "Bestellung erfolgreich gespeichert",
      },
      destroy: {
        success: "Bestellung erfolgreich gelöscht",
      },
      destroyAll: {
        success: "Bestellung(en) erfolgreich gelöscht",
      },
      edit: {
        title: "Bestellung bearbeiten",
      },
      fields: {
        id: "Id",
        userId: "Benutzer",
        cart: "Warenkorb",
        shipping: "Versand",
        discountRange: "Rabatt",
        discount: "Rabatt",
        paymentMethod: "Zahlungsmethode",
        taxe: "Steuer",
        transactionNumber: "Transaktionsnummer",
        orderStatus: "Bestellstatus",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        createdAtRange: "Erstellt am",
      },
      enumerators: {
        orderStatus: {
          pending: "Ausstehend",
          in_progress: "In Bearbeitung",
          delivered: "Geliefert",
          canceled: "Storniert",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Neue Bestellung",
      },
      view: {
        title: "Bestellung anzeigen",
      },
      importer: {
        title: "Bestellungen importieren",
        fileName: "bestellung_import_vorlage",
        hint: "Datei-/Bildspalten müssen die URLs der Dateien sein, getrennt durch Leerzeichen.",
      },
    },
  },


  user: {
    fields: {
      genre: "Geschlecht",
      username: "Benutzername",
      walletName: "Wallet-Name",
      id: "ID",
      confirmPassword: "Passwort bestätigen",
      avatars: "Avatar",
      invitationcode: "Einladungscode",
      email: "E-Mail",
      emails: "E-Mail(s)",
      erc20: "ERC20-Wallet-Adresse",
      trc20: "TRC20-Wallet-Adresse",
      fullName: "Name",
      balance: "Kontostand",
      firstName: "Vorname",
      lastName: "Nachname",
      status: "Status",
      phoneNumber: "Telefonnummer",
      withdrawPassword: "Auszahlungspasswort",
      sector: "Branche",
      employer: "Arbeitgeber",
      profession: "Beruf",
      address: "Adresse",
      birthDate: "Geburtsdatum",
      maritalStatus: "Familienstand",
      facebookLink: "Facebook-Link",
      sponsor: "Sponsor",
      role: "Rolle",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      roleUser: "Rolle/Benutzer",
      roles: "Rollen",
      createdAtRange: "Erstellt am",
      password: "Passwort",
      oldPassword: "Altes Passwort",
      newPassword: "Neues Passwort",
      newPasswordConfirmation: "Neues Passwort bestätigen",
      rememberMe: "Angemeldet bleiben",
    },
    sector: {
      AGRO_ALIMENTAIRE: "Lebensmittelindustrie",
      ASSURANCES: "Versicherung",
      AUDIOVISUEL: "Audiovisuell",
      BANCAIRE: "Bankwesen",
      CHIMIE: "Chemie",
      COMPOSANTS_AUTOMOBILES: "Automobilkomponenten",
      DISTRIBUTION: "Vertrieb",
      DISTRIBUTION_AUTOMOBILE: "Automobilvertrieb",
      DIVERS: "Verschiedenes",
      FINANCIER: "Finanzen",
      HOLDING: "Holding",
      IMMOBILIER: "Immobilien",
      INDUSTRIEL: "Industrie",
      LEASING: "Leasing",
      LOGISTIQUE_TRANSPORT: "Logistik und Transport",
      PHARMACEUTIQUE: "Pharmazeutisch",
      SANTÉ: "Gesundheit",
      TOURSIME: "Tourismus",
      INFORMATION_TECHNOLOGY: "Informationstechnologie",
    },
    maritalStatus: {
      célébataire: "Ledig",
      marié: "Verheiratet",
    },
    status: {
      active: "Aktiv",
      invited: "Eingeladen",
      "empty-permissions": "Warte auf Berechtigungen",
      inactive: "Inaktiv",
    },

    enumerators: {
      status: {
        USDT: "USDT",
        ETH: "ETH",
        BTC: "BTC",
      },
      gender: {
        male: "männlich",
        female: "weiblich",
      }
    },
    invite: "Einladen",
    validations: {
      // eslint-disable-next-line
      email: "E-Mail ${value} ist ungültig",
    },
    title: "Benutzer",
    menu: "Benutzer",
    doAddSuccess: "Benutzer erfolgreich gespeichert",
    doUpdateSuccess: "Benutzer erfolgreich gespeichert",
    exporterFileName: "benutzer_export",
    doDestroySuccess: "Benutzer erfolgreich gelöscht",
    doDestroyAllSelectedSuccess: "Benutzer erfolgreich gelöscht",
    edit: {
      title: "Benutzer bearbeiten",
    },
    new: {
      title: "Benutzer einladen",
      titleModal: "Benutzer einladen",
      emailsHint:
        "Trennen Sie mehrere E-Mail-Adressen durch Kommas.",
    },
    view: {
      title: "Benutzer anzeigen",
      activity: "Aktivität",
    },
    importer: {
      title: "Benutzer importieren",
      fileName: "benutzer_import_vorlage",
      hint: "Datei-/Bildspalten müssen die URLs der Dateien sein, getrennt durch Leerzeichen. Beziehungen müssen die IDs der referenzierten Datensätze sein, getrennt durch Leerzeichen. Rollen müssen die Rollen-IDs sein, getrennt durch Leerzeichen.",
    },
    errors: {
      userAlreadyExists: "Ein Benutzer mit dieser E-Mail existiert bereits",
      userNotFound: "Benutzer nicht gefunden",
      revokingOwnPermission: `Sie können Ihre eigene Administratorberechtigung nicht widerrufen`,
    },
  },


  buttons: {
    login: "Anmelden",
    registerNow: "Jetzt registrieren",
    signup: "Registrieren",
    start: "Start",
    orders: "Bestellungen",
    submit: "Absenden",
    backtohome: "Zurück zur Startseite",
    confirm: "Bestätigen",
    logout: "Abmelden",
    getstarted: "Loslegen",
  },


  text: {
    welcome: "Willkommen",
    discover: "Entdecken Sie exklusive Angebote nur für Sie",
    signin: "Anmelden",
    haveaccount: "Bereits ein Konto?",
    noaccount: "Noch kein Konto?",
    showingnow: "Jetzt im Kino",
    comingsoon: "Demnächst",
    termsconditions: "Allgemeine Geschäftsbedingungen",
    todayearning: "Heutiges Einkommen",
    accountbalance: "Kontostand",
    freezebalance: "Eingefrorenes Guthaben",
    sumbitInformation: "Informationen übermitteln",
    order: "Bestellung",
    pending: "Ausstehend",
    completed: "Abgeschlossen",
    canceled: "Storniert",
    notransaction: "Es gibt noch keine Transaktionen!",
    createdtime: "Erstellungszeit",
    creationtime: "Erstellungszeit",
    orderNumber: "Bestellnummer",
    orderamount: "Bestellbetrag",
    income: "Einkommen",
    buyerating: "Käuferbewertung",
    uid: "UID",
    promotioncode: "Rabattcode",
    walletamount: "Wallet-Betrag",
    creditassesment: "Kreditbewertung",
    myfinance: "Meine Finanzen",
    withdraw: "Auszahlen",
    mydetails: "Meine Daten",
    profile: "Profil",
    wallet: "Wallet",
    other: "Andere",
    customersupport: "Kundensupport",
    transaction: "Transaktion",
    taskshistory: "Aufgabenverlauf",
    security: "Sicherheit",
    sponsor: `Unsere Sicherheit hat oberste Priorität, und wir möchten sicherstellen, dass
              Sie vor potenziellen Risiken geschützt sind. Bitte beachten Sie, dass wir
              Sie niemals auffordern werden, Geld an eine unbekannte Adresse zu senden. Bevor
              Sie Zahlungen tätigen, überprüfen Sie bitte die Details bei uns.`,
  },
  errors: {
    backToHome: "Zurück zur Startseite",
    403: "Entschuldigung, Sie haben keinen Zugriff auf diese Seite",
    404: "Entschuldigung, die von Ihnen besuchte Seite existiert nicht",
    500: "Entschuldigung, der Server meldet einen Fehler",
    429: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
    forbidden: {
      message: "Zugriff verweigert",
    },
    validation: {
      message: "Ein Fehler ist aufgetreten",
    },
    defaultErrorMessage: "Hoppla, ein Fehler ist aufgetreten",
  },

  withdraw: {
    withdrawamount: "Auszahlungsbetrag",
    Withdrawpassword: "Auszahlungs-Passwort",
    availablebalance: "Verfügbares Guthaben",
    rules: "Regelbeschreibung",
    rule1: "Der Mindestbetrag für eine Auszahlung beträgt 20 $",
    rule2: "Die Zahlung erfolgt innerhalb von 24 Stunden nach Beantragung der Auszahlung",
    rule3: "Unvollständige tägliche Bestellungen können nicht ausgezahlt werden, alle Produkte müssen eingereicht werden"
  },
  profile: {
    profile: "Profil",
    fullname: "Vollständiger Name",
    email: "E-Mail",
    phonenumber: "Telefonnummer",
    country: "Land",
    Invitationcode: "Einladungscode"
  },
  wallet: {
    wallet: "Wallet",
    info: "Informationen zur Auszahlungsmethode",
    username: "Benutzername",
    walletname: "Wallet-Name",
    walletaddress: "Wallet-Adresse",
    note: "Hinweis",
    notedesctiption: "Bitte seien Sie vorsichtig beim Ausfüllen dieser Informationen."
  },

  cs: {
    cs: "Kundendienst",
    note: "Wenn Sie Fragen haben oder auf Probleme stoßen, senden Sie uns eine E-Mail oder chatten Sie mit unserem Online-Kundendienstteam.",
    contactnow: "Jetzt kontaktieren"
  },
  transaction: {
    transaction: "Transaktion",
    all: "Alle",
    withdraw: "Auszahlung",
    dposit: "Einzahlung",
    notransaction: "Es gibt noch keine Transaktionen!"
  },
  order: {
    order: "Bestellung",
    completed: "Abgeschlossen",
    pending: "Ausstehend",
    canceled: "Storniert",
    ordertime: "Bestellzeit",
    ordernumber: "Bestellnummer",
    total: "Gesamtbetrag der Bestellung",
    commission: "Provision",
    return: "Geschätzte Rückzahlung"
  },

  security: {
    changepassword: "Passwort ändern",
    oldpassword: "Altes Passwort",
    newpassword: "Neues Passwort",
    confirmpassword: "Passwort bestätigen",
    note: "Hinweis",
    notedesc: "Bitte füllen Sie diese Informationen sorgfältig aus"
  },





  auth: {
    tenants: "Arbeitsbereiche",
    singindesc: "Geben Sie Ihre E-Mail und Ihr Passwort ein, um sich anzumelden",
    signupdesc: "Geben Sie Ihre E-Mail und Ihr Passwort ein, um sich zu registrieren",
    profile: {
      title: "Profil",
      success: "Profil erfolgreich aktualisiert",
      vip: "Herzlichen Glückwunsch zum Abonnement",
    },
    createAnAccount: "Ein Konto erstellen",
    rememberMe: "Angemeldet bleiben",
    forgotPassword: "Passwort vergessen?",
    signin: "Anmelden",
    signup: "Registrieren",
    signout: "Abmelden",
    alreadyHaveAnAccount: "Haben Sie bereits ein Konto? Anmelden.",
    social: {
      errors: {
        "auth-invalid-provider":
          "Diese E-Mail ist bereits bei einem anderen Anbieter registriert.",
        "auth-no-email": "Die mit diesem Konto verknüpfte E-Mail ist privat oder nicht vorhanden.",
      },
    },
    signinWithAnotherAccount: "Mit einem anderen Konto anmelden",
    emailUnverified: {
      message: `Bitte bestätigen Sie Ihre E-Mail unter <strong>{0}</strong>, um fortzufahren.`,
      submit: "E-Mail-Bestätigung erneut senden",
    },
    emptyPermissions: {
      message: "Sie haben noch keine Berechtigungen. Warten Sie, bis der Administrator Ihnen Zugriffsrechte erteilt.",
    },
    passwordResetEmail: {
      message: "E-Mail zum Zurücksetzen des Passworts senden",
      error: "E-Mail nicht erkannt",
    },
    passwordReset: {
      message: "Passwort zurücksetzen",
    },
    passwordChange: {
      title: "Passwort ändern",
      success: "Passwort erfolgreich geändert",
      mustMatch: "Die Passwörter müssen übereinstimmen",
    },
    emailAddressVerificationEmail: {
      error: "E-Mail nicht erkannt",
    },
    verificationEmailSuccess: "Bestätigungs-E-Mail erfolgreich gesendet",
    passwordResetEmailSuccess: "Passwort-Reset-E-Mail erfolgreich gesendet",
    passwordResetSuccess: "Passwort erfolgreich geändert",
    verifyEmail: {
      success: "E-Mail erfolgreich bestätigt.",
      message: "Einen Moment, Ihre E-Mail wird überprüft...",
    },
  },

  tabbarmenue: {
    home: "Startseite",
    rate: "Bewerten",
    profile: "Profil"
  },

  validation: {
    mixed: {
      default: "${path} ist ungültig",
      required: "${path} ist erforderlich",
      oneOf: "${path} muss einer der folgenden Werte sein: ${values}",
      notOneOf: "${path} darf keiner der folgenden Werte sein: ${values}",
      notType: ({ path, type, value, originalValue }) => {
        return `${path} muss ein ${type} sein`;
      },
    },
    string: {
      length: "${path} muss genau ${length} Zeichen lang sein",
      min: "${path} muss mindestens ${min} Zeichen lang sein",
      max: "${path} darf höchstens ${max} Zeichen lang sein",
      matches: '${path} muss folgendem Muster entsprechen: "${regex}"',
      email: "${path} muss eine gültige E-Mail-Adresse sein",
      url: "${path} muss eine gültige URL sein",
      trim: "${path} darf keine führenden oder nachgestellten Leerzeichen enthalten",
      lowercase: "${path} muss in Kleinbuchstaben sein",
      uppercase: "${path} muss in Großbuchstaben sein",
      selected: "${path} muss ausgewählt sein",
    },
    number: {
      min: "${path} muss größer oder gleich ${min} sein",
      max: "${path} muss kleiner oder gleich ${max} sein",
      lessThan: "${path} muss kleiner als ${less} sein",
      moreThan: "${path} muss größer als ${more} sein",
      notEqual: "${path} darf nicht gleich ${notEqual} sein",
      positive: "${path} muss eine positive Zahl sein",
      negative: "${path} muss eine negative Zahl sein",
      integer: "${path} muss eine ganze Zahl sein",
    },
    date: {
      min: "${path} muss nach ${min} liegen",
      max: "${path} muss vor ${max} liegen",
    },
    boolean: {},
    object: {
      noUnknown:
        "${path} darf keine nicht definierten Schlüssel enthalten",
    },
    array: {
      min: ({ min, path }) =>
        min === 1
          ? `${path} ist erforderlich`
          : `${path} muss mindestens ${min} Elemente enthalten`,
      max: "${path} darf höchstens ${max} Elemente enthalten",
    },
  },
  /* eslint-disable */
  fileUploader: {
    upload: "Hochladen",
    image: "Sie müssen ein Bild hochladen",
    size: "Die Datei ist zu groß. Die maximal erlaubte Größe beträgt {0}",
    formats: `Ungültiges Format. Muss eines der folgenden sein: {0}.`,
  },

};

export default de;
