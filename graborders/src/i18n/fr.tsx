import Withdraw from "src/view/pages/withdraw/Withdraw";

const fr = {
  app: {
    title: "E-clicks Digital"
  },
  
  pages: {
    home: {
      levels: "Niveaux VIP",
      chooseLevel: "Choisissez votre niveau pour maximiser vos gains",
      welcome: "Bienvenue",
      announcement: "Chers utilisateurs, la plateforme E-clicks Digital est de retour au meilleur et normal, continuez à gagner autant que possible depuis la plateforme",

      // Action Buttons
      services: "Services",
      events: "Événements",
      about: "À propos",
      terms: "CG",
      certificate: "Certificat",
      faqs: "FAQ",

      // VIP Level Cards
      currentLevel: "Actuel",
      upgrade: "Mettre à niveau",
      profitNormal: "de profit sur les produits normaux",
      profitPremium: "de profit sur les produits premium",
      maxOrders: "Commandes max par jour",

      // Modal
      modal: {
        levelDetails: "Détails du niveau",
        levelLimit: "Limite de niveau",
        dailyOrders: "Commandes quotidiennes",
        commissionRate: "Taux de commission",
        cancel: "Annuler",
        upgradeNow: "Mettre à niveau maintenant"
      }
    },

tabBottomNavigator: {
    home: "Accueil",
    grap: "Saisir",
    records: "Enregistrements",
    starting: "Démarrer",
    customerService: "Service Client",
    myProfile: "Mon Profil"
  },
    transaction: {
      title: "Historique des Transactions",
      filters: {
        all: "Toutes",
        withdraw: "Retrait",
        deposit: "Dépôt"
      },
      recentTransactions: "Transactions Récentes",
      transactionCount: "{0} transactions",
      types: {
        deposit: "Dépôt",
        withdrawal: "Retrait"
      },
      status: {
        completed: "Terminé",
        processing: "En traitement",
        canceled: "Annulé"
      },
      amount: {
        deposit: "+${0}",
        withdraw: "-${0}",
        canceled: "${0}"
      }
    },


    profile: {
      title: "Profil",
      invitationCode: "Code d'invitation",
      creditScore: "Score de crédit",
      balance: "Solde",
      todayProfit: "Profit du jour",
      frozenAmount: "Montant gelé",
      usd: "USD",

      // Menu Sections
      myFinancial: "Mes finances",
      myDetails: "Mes détails",
      other: "Autre",

      // Financial Items
      recharge: "Recharger",
      withdraw: "Retirer",
      wallet: "Portefeuille",
      history: "Historique",

      // Details Items
      contactUs: "Nous contacter",
      profile: "Profil",
      updateWithdrawal: "Mettre à jour les détails de retrait",

      // Other Items
      transaction: "Transaction",
      tasksHistory: "Historique des tâches",
      security: "Sécurité",
      notifications: "Notifications",
      languages: "Langues",

      // Buttons
      logout: "Déconnexion",
      confirm: "Confirmer",
      copied: "Copié",

      // Modals
      rechargeModal: {
        title: "Rechargement",
        text: "Veuillez contacter le service client pour recharger"
      },
      withdrawModal: {
        title: "Retrait",
        text: "Veuillez contacter le service client pour procéder à votre retrait."
      }
    },

    team: {
      title: "Profil",
      personalInformation: "Informations personnelles",
      accountDetails: "Vos détails de compte et informations personnelles",

      // Info Items
      fullName: "Nom complet",
      email: "Email",
      phoneNumber: "Numéro de téléphone",
      country: "Pays",
      gender: "Genre",
      invitationCode: "Code d'invitation",

      // Gender Values
      genderNotSpecified: "Non spécifié",

      // Placeholders
      notAvailable: "—"
    },

    language: {
      title: "Langue de l'application",
      selectLanguage: "Sélectionner la langue",
      choosePreferred: "Choisissez votre langue préférée",
      searchPlaceholder: "Rechercher des langues...",
      currentLanguage: "Langue actuelle",

      // Language names (if needed for dynamic content)
      languages: {
        english: "Anglais",
        french: "Français",
        russian: "Russe",
        german: "Allemand",
        spanish: "Espagnol"
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
      title: "Service client",
      description: "Si vous avez des questions ou rencontrez des problèmes, veuillez nous envoyer un email ou discuter avec notre équipe de support client en ligne.",
      contactWhatsApp: "Contacter sur WhatsApp",
      contactTelegram: "Contacter sur Telegram"
    },

    notifications: {
      title: "Notifications",
      filters: {
        all: "Toutes",
        deposit: "Dépôt",
        withdraw: "Retrait"
      },
      unreadCount: "{0} non lues",
      emptyState: {
        title: "Aucune notification trouvée",
        description: "Vous n'avez pas encore de notifications {0}."
      },

      // Notification Types
      types: {
        deposit_success: "Dépôt réussi",
        deposit_canceled: "Dépôt annulé",
        withdraw_success: "Retrait réussi",
        withdraw_canceled: "Retrait annulé",
        system: "Notification système",
        alert: "Alerte importante",
        default: "Notification"
      },

      // Notification Messages
      messages: {
        deposit_success: "Votre dépôt de ${0} a été complété avec succès.",
        deposit_canceled: "Votre demande de dépôt de ${0} a été annulée.",
        withdraw_success: "Votre retrait de ${0} a été complété avec succès.",
        withdraw_canceled: "Votre demande de retrait de ${0} a été annulée.",
        system: "Notification système",
        alert: "Notification d'alerte importante",
        default: "Mise à jour de notification"
      },

      // Status
      status: {
        unread: "non lue",
        read: "lue"
      }
    },

    portfolio: {
      // Status Tabs
      completed: "Terminées",
      pending: "En attente",
      canceled: "Annulées",

      // Order Information
      orderTime: "Heure de commande",
      orderNumber: "Numéro de commande",
      totalOrderAmount: "Montant total de la commande",
      commission: "Commission",
      estimatedReturn: "Retour estimé",

      // Product Details
      quantity: "X 1",
      currency: "USD",
      submit: "Soumettre",

      // Status Labels
      status: {
        completed: "Terminée",
        pending: "En attente",
        canceled: "Annulée"
      }
    },

    changePassword: {
      title: "Changer le mot de passe",
      header: "Changer le mot de passe",
      oldPassword: "Ancien mot de passe",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Soumettre",
      note: "Veuillez remplir ces informations soigneusement",
      requiredField: "*"
    },

    withdraw: {
      title: "Retrait",
      withdrawAmount: "Montant du retrait",
      withdrawPassword: "Mot de passe de retrait",
      availableBalance: "Solde disponible",
      confirm: "Confirmer",
      rulesDescription: "Description des règles",
      rules: {
        minimum: "(1) Le retrait minimum est de 100 USD",
        paymentTime: "(2) Le paiement sera effectué dans l'heure suivante, après l'approbation de la demande de retrait.",
        orderCompletion: "(3) La soumission incomplète des commandes quotidiennes est soumise à aucun retrait, tous les produits doivent être soumis pour le retrait"
      }
    },

    wallet: {
      title: "Portefeuille",
      withdrawalMethod: "Informations sur la méthode de retrait",
      username: "Nom d'utilisateur",
      walletName: "Nom du portefeuille",
      walletAddress: "Adresse du portefeuille",
      withdrawPassword: "Mot de passe de retrait",
      submit: "Soumettre",
      note: "Veuillez être prudent lors du remplissage de ces informations",
      requiredField: "*"
    },

    grab: {
      // Header Section
      greeting: "Salut {0} 👏",

      // Stats Cards
      totalAmount: "Montant total",
      profitsAdded: "Les profits seront ajoutés ici",
      todaysCommission: "Commission du jour",
      commissionEarned: "Commission gagnée",
      currency: "USD",

      // Optimization Section
      startOptimization: "Démarrer l'optimisation",
      progressCount: "{0}/{1}",

      // Game Section
      commissionRate: "Taux de commission",
      exclusiveChannel: "Canal exclusif pour les membres exclusifs",
      startButton: "Démarrer",
      processing: "Traitement en cours...",

      // Notice Section
      notice: "Avis",
      supportHours: "Heures de support en ligne 10:00 - 22:00",
      contactSupport: "Veuillez contacter le support en ligne pour votre assistance!"
    },

    grapModal: {
      orderTime: "Heure de commande",
      orderNumber: "Numéro de commande",
      totalOrderAmount: "Montant total de la commande",
      commission: "Commission",
      estimatedReturn: "Retour estimé",
      cancel: "Annuler",
      submit: "Soumettre",
      quantity: "X 1",
      currency: "USD"
    },

    actions: {
      event: "Événements",
      tc: "Conditions générales",
      certificate: "Certificat",
      faq: "Foire aux questions",
      company: "Entreprise"
    },

    auth: {
      signin: {
        welcomeBack: "Content de vous revoir!",
        signinToAccount: "Connectez-vous à votre compte marketing",
        signinButton: "Se connecter",
        noAccount: "Vous n'avez pas de compte?",
        signupHere: "Inscrivez-vous ici."
      },
      signup: {
        createAccount: "Créer un compte",
        signupForAccount: "Inscrivez-vous pour un compte marketing",
        signupButton: "S'inscrire",
        alreadyHaveAccount: "Vous avez déjà un compte?",
        phonePlaceholder: "Entrez votre numéro de téléphone",
        searchCountries: "Rechercher des pays..."
      }
    },

    csPage: {
      customerSupport: "Service client",
      hereToHelp: "Nous sommes là pour vous aider!",
      howCanWeHelp: "Comment pouvons-nous vous aider aujourd'hui?",
      platformNames: {
        whatsapp: "WhatsApp",
        telegram: "Telegram"
      }
    },
  },


  entities: {
    record: {
      menu: "Enregistrements",
      fields: {
        user: "utilisateur",
        product: "produit",
        number: "numéro d'enregistrement",
        status: "statut",
      },
      list: {
        title: "Liste des enregistrements",
      },
      view: {
        title: "Détail de l'enregistrement",
      },
      edit: {
        title: "Modifier l'enregistrement",
      },
      create: {
        success: "Produit soumis avec succès.",
      },
      update: {
        success: "Produit soumis avec succès.",
      },
      destroy: {
        success: "Enregistrement supprimé avec succès",
      },
      destroyAll: {
        success: "Enregistrement supprimé avec succès",
      },
      enumerators: {
        status: {
          pending: "En attente",
          completed: "Terminé",
          canceled: "Annulé",
        },
      },
    },

    category: {
      name: "catégorie",
      label: "Catégories",
      menu: "Catégories",
      exporterFileName: "export_categorie",
      list: {
        menu: "Catégories",
        title: "Catégories",
      },
      create: {
        success: "Catégorie enregistrée avec succès",
      },
      update: {
        success: "Catégorie enregistrée avec succès",
      },
      destroy: {
        success: "Catégorie supprimée avec succès",
      },
      destroyAll: {
        success: "Catégorie(s) supprimée(s) avec succès",
      },
      edit: {
        title: "Modifier la catégorie",
      },
      fields: {
        id: "Id",
        name: "Nom",
        slug: "Slug",
        photo: "Photo",
        metaKeywords: "Mots-clés Meta",
        metaDescriptions: "Descriptions Meta",
        status: "Statut",
        isFeature: "Est en vedette",
        serialRange: "Série",
        serial: "Série",
        createdAt: "Créé à",
        updatedAt: "Mis à jour à",
        createdAtRange: "Créé à",
      },
      enumerators: {
        status: {
          enable: "Activer",
          disable: "Désactiver",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Nouvelle catégorie",
      },
      view: {
        title: "Voir la catégorie",
      },
      importer: {
        title: "Importer des catégories",
        fileName: "modèle_import_categorie",
        hint: "Les colonnes Fichiers/Images doivent être les URL des fichiers séparés par un espace.",
      },
    },

    product: {
      name: "produit",
      label: "Produits",
      menu: "Produits",
      exporterFileName: "export_produit",
      list: {
        menu: "Produits",
        title: "Produits",
      },
      create: {
        success: "Produit enregistré avec succès",
      },
      update: {
        success: "Produit enregistré avec succès",
      },
      destroy: {
        success: "Produit supprimé avec succès",
      },
      destroyAll: {
        success: "Produit(s) supprimé(s) avec succès",
      },
      edit: {
        title: "Modifier le produit",
      },
      fields: {
        id: "Id",
        name: "Nom",
        slug: "Slug",
        tags: "Tags",
        video: "Vidéo",
        specificationName: "Nom de la spécification",
        specificationDesciption: "Description de la spécification",
        isSpecification: "Est une spécification",
        details: "Détails",
        photo: "Photo",
        discountPriceRange: "Prix remisé",
        discountPrice: "Prix actuel",
        previousPriceRange: "Prix précédent",
        previousPrice: "Prix précédent",
        stockRange: "Stock",
        stock: "Stock",
        metaKeywords: "Mots-clés Meta",
        metaDesctiption: "Description courte",
        status: "Statut",
        isType: "Type",
        dateRange: "Date",
        date: "Date",
        itemType: "Type d'article",
        file: "Fichier",
        link: "Lien",
        fileType: "Type de fichier",
        taxe: "Taxe",
        category: "Catégorie",
        subcategory: "Sous-catégorie",
        childcategory: "Sous-sous-catégorie",
        brand: "Marque",
        gallery: "Galerie",
        createdAt: "Créé à",
        updatedAt: "Mis à jour à",
        createdAtRange: "Créé à",
      },
      enumerators: {
        status: {
          enable: "Activer",
          disable: "Désactiver",
        },
        itemType: {
          physical: "physique",
          digitale: "Numérique",
        },
        fileType: {
          file: "Fichier",
          link: "Lien",
        },
        isType: {
          new_arrival: "Nouvelle arrivée",
          feature_product: "Produit vedette",
          top_pdroduct: "Produit populaire",
          best_product: "Meilleur produit",
          flash_deal_product: "Produit en promotion flash",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Nouveau produit",
      },
      view: {
        title: "Voir le produit",
      },
      importer: {
        title: "Importer des produits",
        fileName: "modèle_import_produit",
        hint: "Les colonnes Fichiers/Images doivent être les URL des fichiers séparés par un espace.",
      },
    },
    transaction: {
      name: "transaction",
      label: "Transactions",
      menu: "Transactions",
      exporterFileName: "export_transaction",
      list: {
        menu: "Transactions",
        title: "Transactions",
      },
      create: {
        success: "Transaction envoyée avec succès",
      },
      update: {
        success: "Transaction enregistrée avec succès",
      },
      destroy: {
        success: "Transaction supprimée avec succès",
      },
      destroyAll: {
        success: "Transaction(s) supprimée(s) avec succès",
      },
      edit: {
        title: "Modifier la transaction",
      },
      fields: {
        id: "Id",
        amountRange: "Montant",
        amount: "Montant",
        email: "Email",
        tax: "Taxe",
        currencySign: "Signe monétaire",
        currencyValue: "Valeur monétaire",
        orderId: "ID de commande",
        createdAt: "Créé à",
        updatedAt: "Mis à jour à",
        createdAtRange: "Créé à",
      },
      enumerators: {
        status: {
          pending: "En attente",
          completed: "Succès",
          canceled: "Annulé",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Nouvelle transaction",
      },
      view: {
        title: "Voir la transaction",
      },
      importer: {
        title: "Importer des transactions",
        fileName: "modèle_import_transaction",
        hint: "Les colonnes Fichiers/Images doivent être les URL des fichiers séparés par un espace.",
      },
    },

    order: {
      name: "commande",
      label: "Commandes",
      menu: "Commandes",
      exporterFileName: "export_commande",
      list: {
        menu: "Commandes",
        title: "Commandes",
      },
      create: {
        success: "Commande enregistrée avec succès",
      },
      update: {
        success: "Commande enregistrée avec succès",
      },
      destroy: {
        success: "Commande supprimée avec succès",
      },
      destroyAll: {
        success: "Commande(s) supprimée(s) avec succès",
      },
      edit: {
        title: "Modifier la commande",
      },
      fields: {
        id: "Id",
        userId: "Utilisateur",
        cart: "Panier",
        shipping: "Livraison",
        discountRange: "Remise",
        discount: "Remise",
        paymentMethod: "Méthode de paiement",
        taxe: "Taxe",
        transactionNumber: "Numéro de transaction",
        orderStatus: "Statut de commande",
        createdAt: "Créé à",
        updatedAt: "Mis à jour à",
        createdAtRange: "Créé à",
      },
      enumerators: {
        orderStatus: {
          pending: "En attente",
          in_progress: "En cours",
          delivered: "Livré",
          canceled: "Annulé",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Nouvelle commande",
      },
      view: {
        title: "Voir la commande",
      },
      importer: {
        title: "Importer des commandes",
        fileName: "modèle_import_commande",
        hint: "Les colonnes Fichiers/Images doivent être les URL des fichiers séparés par un espace.",
      },
    },
  },


  user: {
    fields: {
      genre: "Genre",
      username: "Nom d'utilisateur",
      walletName: "Nom du portefeuille",
      id: "Id",
      confirmPassword: "Confirmer le mot de passe",
      avatars: "Avatar",
      invitationcode: "Code d'invitation",
      email: "E-mail",
      emails: "E-mail(s)",
      erc20: "Adresse du portefeuille ERC20",
      trc20: "Adresse du portefeuille TRC20",
      fullName: "Nom",
      balance: "Solde",
      firstName: "Prénom",
      lastName: "Nom de famille",
      status: "Statut",
      phoneNumber: "Numéro de téléphone",
      withdrawPassword: "Mot de passe de retrait",
      sector: "Secteur",
      employer: "Employeur",
      profession: "Profession",
      address: "Adresse",
      birthDate: "Date de naissance",
      maritalStatus: "Statut matrimonial",
      facebookLink: "Lien Facebook",
      sponsor: "Sponsor",
      role: "Rôle",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
      roleUser: "Rôle/Utilisateur",
      roles: "Rôles",
      createdAtRange: "Créé le",
      password: "Mot de passe",
      oldPassword: "Ancien mot de passe",
      newPassword: "Nouveau mot de passe",
      newPasswordConfirmation: "Confirmation du nouveau mot de passe",
      rememberMe: "Se souvenir de moi",
    },
    sector: {
      AGRO_ALIMENTAIRE: "Industrie alimentaire",
      ASSURANCES: "Assurance",
      AUDIOVISUEL: "Audiovisuel",
      BANCAIRE: "Bancaire",
      CHIMIE: "Chimie",
      COMPOSANTS_AUTOMOBILES: "Composants automobiles",
      DISTRIBUTION: "Distribution",
      DISTRIBUTION_AUTOMOBILE: "Distribution automobile",
      DIVERS: "Divers",
      FINANCIER: "Financier",
      HOLDING: "Holding",
      IMMOBILIER: "Immobilier",
      INDUSTRIEL: "Industriel",
      LEASING: "Leasing",
      LOGISTIQUE_TRANSPORT: "Logistique et transport",
      PHARMACEUTIQUE: "Pharmaceutique",
      SANTÉ: "Santé",
      TOURSIME: "Tourisme",
      INFORMATION_TECHNOLOGY: "Technologie de l'information",
    },
    maritalStatus: {
      célébataire: "Célibataire",
      marié: "Marié",
    },
    status: {
      active: "Actif",
      invited: "Invité",
      "empty-permissions": "En attente des autorisations",
      inactive: "Inactif",
    },

    enumerators: {
      status: {
        USDT: "USDT",
        ETH: "ETH",
        BTC: "BTC",
      },
      gender: {
        male: "masculin",
        female: "féminin",
      }
    },
    invite: "Inviter",
    validations: {
      // eslint-disable-next-line
      email: "L'e-mail ${value} est invalide",
    },
    title: "Utilisateurs",
    menu: "Utilisateurs",
    doAddSuccess: "Utilisateur(s) enregistré(s) avec succès",
    doUpdateSuccess: "Utilisateur enregistré avec succès",
    exporterFileName: "utilisateurs_export",
    doDestroySuccess: "Utilisateur supprimé avec succès",
    doDestroyAllSelectedSuccess: "Utilisateurs supprimés avec succès",
    edit: {
      title: "Modifier l'utilisateur",
    },
    new: {
      title: "Inviter un ou des utilisateur(s)",
      titleModal: "Inviter un utilisateur",
      emailsHint:
        "Séparez les adresses e-mail multiples par une virgule.",
    },
    view: {
      title: "Voir l'utilisateur",
      activity: "Activité",
    },
    importer: {
      title: "Importer des utilisateurs",
      fileName: "modèle_import_utilisateurs",
      hint: "Les colonnes Fichiers/Images doivent être les URL des fichiers séparées par un espace. Les relations doivent être l'ID des enregistrements référencés séparés par un espace. Les rôles doivent être les identifiants de rôles séparés par un espace.",
    },
    errors: {
      userAlreadyExists: "Un utilisateur avec cet e-mail existe déjà",
      userNotFound: "Utilisateur non trouvé",
      revokingOwnPermission: `Vous ne pouvez pas révoquer votre propre permission d'administrateur`,
    },
  },

  errors: {
    backToHome: "Retour à l'accueil",
    403: `Désolé, vous n'avez pas accès à cette page`,
    404: "Désolé, la page que vous avez visitée n'existe pas",
    500: "Désolé, le serveur signale une erreur",
    429: "Trop de requêtes. Veuillez réessayer plus tard.",
    forbidden: {
      message: "Interdit",
    },
    validation: {
      message: "Une erreur s'est produite",
    },
    defaultErrorMessage: "Oups, une erreur s'est produite",
  },

  withdraw: {
    withdrawamount: "Montant du retrait",
    Withdrawpassword: "Mot de passe de retrait",
    availablebalance: "Solde disponible",
    rules: "Description des règles",
    rule1: "Le retrait minimum est de 20 $",
    rule2: "Le paiement sera effectué dans les 24 heures suivant la demande de retrait",
    rule3: "L'absence de soumission des commandes quotidiennes entraîne l'impossibilité de retrait, tous les produits doivent être soumis pour retrait"
  },
  profile: {
    profile: "Profil",
    fullname: "Nom complet",
    email: "Email",
    phonenumber: "Numéro de téléphone",
    country: "Pays",
    Invitationcode: "Code d’invitation"
  },
  wallet: {
    wallet: "Portefeuille",
    info: "Informations sur la méthode de retrait",
    username: "Nom d'utilisateur",
    walletname: 'Nom du portefeuille',
    walletaddress: 'Adresse du portefeuille',
    note: "Remarque",
    notedesctiption: "Veuillez remplir ces informations avec précaution."
  },


  cs: {
    cs: "Service client",
    note: "Si vous avez des questions ou rencontrez des problèmes, veuillez nous envoyer un email ou discuter avec notre équipe de support client en ligne.",
    contactnow: "Contacter maintenant"
  },
  transaction: {
    transaction: "Transaction",
    all: "Tout",
    withdraw: "Retrait",
    dposit: "Dépôt",
    notransaction: "Aucune transaction pour le moment !"
  },
  order: {
    order: "Commande",
    completed: "Complété",
    pending: "En attente",
    canceled: "Annulé",
    ordertime: "Heure de la commande",
    ordernumber: "Numéro de commande",
    total: "Montant total de la commande",
    commission: "Commission",
    return: "Retour estimé"
  },

  security: {
    changepassword: "Changer le mot de passe",
    oldpassword: "Ancien mot de passe",
    newpassword: "Nouveau mot de passe",
    confirmpassword: "Confirmer le mot de passe",
    note: "Remarque",
    notedesc: "Veuillez remplir ces informations avec précaution"
  },

  auth: {
    tenants: "Espaces de travail",
    singindesc: "Entrez votre email et votre mot de passe pour vous connecter",
    signupdesc: "Entrez votre email et votre mot de passe pour vous inscrire",
    profile: {
      title: "Profil",
      success: "Profil mis à jour avec succès",
      vip: "Félicitations pour votre abonnement",
    },
    createAnAccount: "Créer un compte",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié",
    signin: "Se connecter",
    signup: "S'inscrire",
    signout: "Se déconnecter",
    alreadyHaveAnAccount: "Vous avez déjà un compte ? Connectez-vous.",
    social: {
      errors: {
        "auth-invalid-provider":
          "Cet email est déjà enregistré avec un autre fournisseur.",
        "auth-no-email": `L'email associé à ce compte est privé ou inexistant.`,
      },
    },
    signinWithAnotherAccount: "Se connecter avec un autre compte",
    emailUnverified: {
      message: `Veuillez confirmer votre email à <strong>{0}</strong> pour continuer.`,
      submit: `Renvoyer l'email de vérification`,
    },
    emptyPermissions: {
      message: `Vous n'avez encore aucune permission. Attendez que l'administrateur vous accorde des privilèges.`,
    },
    passwordResetEmail: {
      message: "Envoyer un email de réinitialisation du mot de passe",
      error: `Email non reconnu`,
    },
    passwordReset: {
      message: "Réinitialiser le mot de passe",
    },
    passwordChange: {
      title: "Changer le mot de passe",
      success: "Mot de passe changé avec succès",
      mustMatch: "Les mots de passe doivent correspondre",
    },
    emailAddressVerificationEmail: {
      error: `Email non reconnu`,
    },
    verificationEmailSuccess: `Email de vérification envoyé avec succès`,
    passwordResetEmailSuccess: `Email de réinitialisation du mot de passe envoyé avec succès`,
    passwordResetSuccess: `Mot de passe changé avec succès`,
    verifyEmail: {
      success: "Email vérifié avec succès.",
      message: "Un instant, votre email est en cours de vérification...",
    },
  },

  tabbarmenue: {
    home: "Accueil",
    rate: "Évaluer",
    profile: "Profil"
  },


  validation: {
    mixed: {
      default: "${path} est invalide",
      required: "${path} est requis",
      oneOf: "${path} doit être l'une des valeurs suivantes : ${values}",
      notOneOf: "${path} ne doit pas être l'une des valeurs suivantes : ${values}",
      notType: ({ path, type, value, originalValue }) => {
        return `${path} doit être un(e) ${type}`;
      },
    },
    string: {
      length: "${path} doit contenir exactement ${length} caractères",
      min: "${path} doit contenir au moins ${min} caractères",
      max: "${path} doit contenir au maximum ${max} caractères",
      matches: '${path} doit correspondre au format suivant : "${regex}"',
      email: "${path} doit être une adresse e-mail valide",
      url: "${path} doit être une URL valide",
      trim: "${path} doit être une chaîne sans espaces au début et à la fin",
      lowercase: "${path} doit être en minuscules",
      uppercase: "${path} doit être en majuscules",
      selected: "${path} doit être sélectionné",
    },
    number: {
      min: "${path} doit être supérieur ou égal à ${min}",
      max: "${path} doit être inférieur ou égal à ${max}",
      lessThan: "${path} doit être inférieur à ${less}",
      moreThan: "${path} doit être supérieur à ${more}",
      notEqual: "${path} ne doit pas être égal à ${notEqual}",
      positive: "${path} doit être un nombre positif",
      negative: "${path} doit être un nombre négatif",
      integer: "${path} doit être un nombre entier",
    },
    date: {
      min: "${path} doit être postérieur à ${min}",
      max: "${path} doit être antérieur à ${max}",
    },
    boolean: {},
    object: {
      noUnknown:
        "${path} ne doit pas contenir de clés non spécifiées dans l'objet",
    },
    array: {
      min: ({ min, path }) =>
        min === 1
          ? `${path} est requis`
          : `${path} doit contenir au moins ${min} éléments`,
      max: "${path} doit contenir au maximum ${max} éléments",
    },
  },
  /* eslint-disable */
  fileUploader: {
    upload: "Téléverser",
    image: "Vous devez téléverser une image",
    size: "Le fichier est trop volumineux. La taille maximale autorisée est de {0}",
    formats: `Format invalide. Doit être l'un des suivants : {0}.`,
  },


};

export default fr;
