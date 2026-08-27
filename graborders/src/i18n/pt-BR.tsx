

const ptBR = {
  app: {
    title: "E-clicks Digital"
  },
  inputs: {
    username: "Nome de Usuário",
    password: "Senha",
    phoneNumber: "Número de Telefone",
    withdrawPassword: "Senha de Saque",
    confirmPassword: "Confirmar Senha",
    invitationcode: "Código de Convite",
    walletaddress: "Endereço da carteira"

  },




  pages: {
    home: {
      levels: "Níveis VIP",
      chooseLevel: "Escolha seu nível para maximizar seus ganhos",
      welcome: "Bem-vindo",
      announcement: "Caros usuários, a plataforma E-clicks Digital está de volta ao melhor e normal, continuem a ganhar o máximo possível da plataforma",

      // Action Buttons
      services: "Serviços",
      events: "Eventos",
      about: "Sobre",
      terms: "T&C",
      certificate: "Certificado",
      faqs: "FAQ",

      // VIP Level Cards
      currentLevel: "Atual",
      upgrade: "Atualizar",
      profitNormal: "lucro em produtos normais",
      profitPremium: "lucro em produtos premium",
      maxOrders: "Máximo de pedidos por dia",

      // Modal
      modal: {
        levelDetails: "Detalhes do Nível",
        levelLimit: "Limite do Nível",
        dailyOrders: "Pedidos Diários",
        commissionRate: "Taxa de Comissão",
        cancel: "Cancelar",
        upgradeNow: "Atualizar Agora"
      }
    },


    prizeModal: {
      congratulations: "Parabéns!",
      spinning: "Girando...",
      prizeWon: "Você ganhou!",
      currency: "USD",
      prizeBreakdown: "Detalhes do Prêmio",
      totalAmount: "Valor Total",
      yourWinnings: "Seu Ganho",
      claimPrize: "Resgatar Prêmio",
      celebrationMessage: "Aproveite sua recompensa!",
    },

    tabBottomNavigator: {
      home: "Início",
      grap: "Capturar",
      records: "Registros",
      starting: "Iniciar",
      customerService: "Atendimento ao Cliente",
      myProfile: "Meu Perfil"
    },
    transaction: {
      title: "Histórico de Transações",
      filters: {
        all: "Todas",
        withdraw: "Saque",
        deposit: "Depósito"
      },
      recentTransactions: "Transações Recentes",
      transactionCount: "{0} transações",
      types: {
        deposit: "Depósito",
        withdrawal: "Saque"
      },
      status: {
        completed: "Concluído",
        processing: "Processando",
        canceled: "Cancelado"
      },
      amount: {
        deposit: "+${0}",
        withdraw: "-${0}",
        canceled: "${0}"
      }
    },

    profile: {
      title: "Perfil",
      invitationCode: "Código de Convite",
      creditScore: "Pontuação de Crédito",
      balance: "Saldo",
      todayProfit: "Lucro de Hoje",
      frozenAmount: "Valor Congelado",
      usd: "USD",

      // Menu Sections
      myFinancial: "Minhas Finanças",
      myDetails: "Meus Detalhes",
      other: "Outro",

      // Financial Items
      recharge: "Recarregar",
      withdraw: "Sacar",
      wallet: "Carteira",
      history: "Histórico",

      // Details Items
      contactUs: "Contate-nos",
      profile: "Perfil",
      updateWithdrawal: "Atualizar detalhes de saque",

      // Other Items
      transaction: "Transação",
      tasksHistory: "Histórico de Tarefas",
      security: "Segurança",
      notifications: "Notificações",
      languages: "Idiomas",

      // Buttons
      logout: "Sair",
      confirm: "Confirmar",
      copied: "Copiado",

      // Modals
      rechargeModal: {
        title: "Recarregar",
        text: "Por favor, entre em contato com o serviço ao cliente para recarregar"
      },
      withdrawModal: {
        title: "Saque",
        text: "Por favor, entre em contato com o serviço ao cliente para proceder com seu saque."
      }
    },

    team: {
      title: "Perfil",
      personalInformation: "Informações Pessoais",
      accountDetails: "Seus detalhes da conta e informações pessoais",

      // Info Items
      fullName: "Nome Completo",
      email: "E-mail",
      phoneNumber: "Número de Telefone",
      country: "País",
      gender: "Gênero",
      invitationCode: "Código de Convite",

      // Gender Values
      genderNotSpecified: "Não especificado",

      // Placeholders
      notAvailable: "—"
    },

    language: {
      title: "Idioma do App",
      selectLanguage: "Selecionar Idioma",
      choosePreferred: "Escolha seu idioma preferido",
      searchPlaceholder: "Pesquisar idiomas...",
      currentLanguage: "Idioma Atual",

      // Language names (if needed for dynamic content)
      languages: {
        english: "Inglês",
        french: "Francês",
        russian: "Russo",
        german: "Alemão",
        spanish: "Espanhol"
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
      title: "Serviço ao Cliente",
      description: "Se você tiver alguma dúvida ou encontrar problemas, por favor envie-nos um e-mail ou converse com nossa equipe de suporte ao cliente online.",
      contactWhatsApp: "Contatar no WhatsApp",
      contactTelegram: "Contatar no Telegram"
    },

    notifications: {
      title: "Notificações",
      filters: {
        all: "Todas",
        deposit: "Depósito",
        withdraw: "Saque"
      },
      unreadCount: "{0} não lidas",
      emptyState: {
        title: "Nenhuma notificação encontrada",
        description: "Você ainda não tem notificações {0}."
      },

      // Notification Types
      types: {
        deposit_success: "Depósito Bem-sucedido",
        deposit_canceled: "Depósito Cancelado",
        withdraw_success: "Saque Bem-sucedido",
        withdraw_canceled: "Saque Cancelado",
        system: "Notificação do Sistema",
        alert: "Alerta Importante",
        default: "Notificação"
      },

      // Notification Messages
      messages: {
        deposit_success: "Seu depósito de ${0} foi concluído com sucesso.",
        deposit_canceled: "Sua solicitação de depósito de ${0} foi cancelada.",
        withdraw_success: "Seu saque de ${0} foi concluído com sucesso.",
        withdraw_canceled: "Sua solicitação de saque de ${0} foi cancelada.",
        system: "Notificação do sistema",
        alert: "Notificação de alerta importante",
        default: "Atualização de notificação"
      },

      // Status
      status: {
        unread: "não lida",
        read: "lida"
      }
    },

    portfolio: {
      // Status Tabs
      completed: "Concluídos",
      pending: "Pendentes",
      canceled: "Cancelados",

      // Order Information
      orderTime: "Hora do Pedido",
      orderNumber: "Número do Pedido",
      totalOrderAmount: "Valor total do pedido",
      commission: "Comissão",
      estimatedReturn: "Retorno estimado",

      // Product Details
      quantity: "X 1",
      currency: "USD",
      submit: "Enviar",

      // Status Labels
      status: {
        completed: "Concluído",
        pending: "Pendente",
        canceled: "Cancelado"
      }
    },

    changePassword: {
      title: "Alterar Senha",
      header: "Alterar Senha",
      oldPassword: "Senha Antiga",
      newPassword: "Nova Senha",
      confirmPassword: "Confirmar Senha",
      submit: "Enviar",
      note: "Por favor, preencha estas informações com cuidado",
      requiredField: "*"
    },

    withdraw: {
      title: "Saque",
      withdrawAmount: "Valor do Saque",
      withdrawPassword: "Senha de Saque",
      availableBalance: "Saldo disponível",
      confirm: "Confirmar",
      rulesDescription: "Descrição das Regras",
      rules: {
        minimum: "(1) O saque mínimo é de 100 USD",
        paymentTime: "(2) O pagamento será feito dentro da próxima hora, após a aprovação do pedido de saque.",
        orderCompletion: "(3) O envio incompleto de pedidos diários está sujeito a nenhum saque, todos os produtos devem ser enviados para saque"
      }
    },

    wallet: {
      title: "Carteira",
      withdrawalMethod: "Informações do método de saque",
      username: "Nome de Usuário",
      walletName: "Nome da Carteira",
      walletAddress: "Endereço da Carteira",
      withdrawPassword: "Senha de Saque",
      submit: "Enviar",
      note: "Por favor, tenha cuidado ao preencher estas informações",
      requiredField: "*"
    },

    grab: {
      // Header Section
      greeting: "Olá {0} 👏",

      // Stats Cards
      totalAmount: "Valor Total",
      profitsAdded: "Os lucros serão adicionados aqui",
      todaysCommission: "Comissão de Hoje",
      commissionEarned: "Comissão Ganha",
      currency: "USD",

      // Optimization Section
      startOptimization: "Iniciar Otimização",
      progressCount: "{0}/{1}",

      // Game Section
      commissionRate: "Taxa de Comissão",
      exclusiveChannel: "Canal exclusivo para membros exclusivos",
      startButton: "Iniciar",
      processing: "Processando...",

      // Notice Section
      notice: "Aviso",
      supportHours: "Horário de Suporte Online 10:00 - 22:00",
      contactSupport: "Por favor, entre em contato com o suporte online para sua assistência!"
    },

    grapModal: {
      orderTime: "Hora do Pedido",
      orderNumber: "Número do Pedido",
      totalOrderAmount: "Valor total do pedido",
      commission: "Comissão",
      estimatedReturn: "Retorno estimado",
      cancel: "Cancelar",
      submit: "Enviar",
      quantity: "X 1",
      currency: "USD"
    },

    actions: {
      event: "Eventos",
      tc: "Termos e Condições",
      certificate: "Certificado",
      faq: "Perguntas Frequentes",
      company: "Empresa"
    },

    auth: {
      signin: {
        welcomeBack: "Bem-vindo de volta!",
        signinToAccount: "Entre na sua conta de marketing",
        signinButton: "Entrar",
        noAccount: "Não tem uma conta?",
        signupHere: "Cadastre-se aqui."
      },
      signup: {
        createAccount: "Criar Conta",
        signupForAccount: "Cadastre-se para uma conta de marketing",
        signupButton: "Cadastrar",
        alreadyHaveAccount: "Já tem uma conta?",
        phonePlaceholder: "Digite seu número de telefone",
        searchCountries: "Pesquisar países..."
      }
    },

    csPage: {
      customerSupport: "Serviço ao Cliente",
      hereToHelp: "Estamos aqui para ajudá-lo!",
      howCanWeHelp: "Como podemos ajudá-lo hoje?",
      platformNames: {
        whatsapp: "WhatsApp",
        telegram: "Telegram"
      }
    },
  },



  entities: {
    record: {
      menu: "Registros",
      fields: {
        user: "usuário",
        product: "produto",
        number: "número do registro",
        status: "status",
      },
      list: {
        title: "Lista de registros",
      },
      view: {
        title: "Detalhe do Registro",
      },
      edit: {
        title: "Editar Registro",
      },
      create: {
        success: "Produto enviado com sucesso.",
      },
      update: {
        success: "Produto enviado com sucesso.",
      },
      destroy: {
        success: "Registro excluído com sucesso",
      },
      destroyAll: {
        success: "Registro excluído com sucesso",
      },
      enumerators: {
        status: {
          pending: "Pendente",
          completed: "Concluído",
          canceled: "Cancelado",
        },
      },
    },

    category: {
      name: "categoria",
      label: "Categorias",
      menu: "Categorias",
      exporterFileName: "exportacao_categoria",
      list: {
        menu: "Categorias",
        title: "Categorias",
      },
      create: {
        success: "Categoria salva com sucesso",
      },
      update: {
        success: "Categoria salva com sucesso",
      },
      destroy: {
        success: "Categoria excluída com sucesso",
      },
      destroyAll: {
        success: "Categoria(s) excluída(s) com sucesso",
      },
      edit: {
        title: "Editar Categoria",
      },
      fields: {
        id: "Id",
        name: "Nome",
        slug: "Slug",
        photo: "Foto",
        metaKeywords: "Palavras-chave Meta",
        metaDescriptions: "Descrições Meta",
        status: "Status",
        isFeature: "É Destaque",
        serialRange: "Serial",
        serial: "Serial",
        createdAt: "Criado em",
        updatedAt: "Atualizado em",
        createdAtRange: "Criado em",
      },
      enumerators: {
        status: {
          enable: "Ativar",
          disable: "Desativar",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Nova Categoria",
      },
      view: {
        title: "Ver Categoria",
      },
      importer: {
        title: "Importar Categorias",
        fileName: "modelo_importacao_categoria",
        hint: "As colunas Arquivos/Imagens devem ser os URLs dos arquivos separados por espaço.",
      },
    },

    product: {
      name: "produto",
      label: "Produtos",
      menu: "Produtos",
      exporterFileName: "exportacao_produto",
      list: {
        menu: "Produtos",
        title: "Produtos",
      },
      create: {
        success: "Produto salvo com sucesso",
      },
      update: {
        success: "Produto salvo com sucesso",
      },
      destroy: {
        success: "Produto excluído com sucesso",
      },
      destroyAll: {
        success: "Produto(s) excluído(s) com sucesso",
      },
      edit: {
        title: "Editar Produto",
      },
      fields: {
        id: "Id",
        name: "Nome",
        slug: "Slug",
        tags: "Tags",
        video: "Vídeo",
        specificationName: "Nome da Especificação",
        specificationDesciption: "Descrição da Especificação",
        isSpecification: "É Especificação",
        details: "Detalhes",
        photo: "Foto",
        discountPriceRange: "Preço com Desconto",
        discountPrice: "Preço Atual",
        previousPriceRange: "Preço Anterior",
        previousPrice: "Preço Anterior",
        stockRange: "Estoque",
        stock: "Estoque",
        metaKeywords: "Palavras-chave Meta",
        metaDesctiption: "Descrição Curta",
        status: "Status",
        isType: "Tipo",
        dateRange: "Data",
        date: "Data",
        itemType: "Tipo de Item",
        file: "Arquivo",
        link: "Link",
        fileType: "Tipo de Arquivo",
        taxe: "Imposto",
        category: "Categoria",
        subcategory: "Subcategoria",
        childcategory: "Sub-subcategoria",
        brand: "Marca",
        gallery: "Galeria",
        createdAt: "Criado em",
        updatedAt: "Atualizado em",
        createdAtRange: "Criado em",
      },
      enumerators: {
        status: {
          enable: "Ativar",
          disable: "Desativar",
        },
        itemType: {
          physical: "físico",
          digitale: "Digital",
        },
        fileType: {
          file: "Arquivo",
          link: "Link",
        },
        isType: {
          new_arrival: "Novo Lançamento",
          feature_product: "Produto em Destaque",
          top_pdroduct: "Produto Popular",
          best_product: "Melhor Produto",
          flash_deal_product: "Produto em Promoção Relâmpago",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Novo Produto",
      },
      view: {
        title: "Ver Produto",
      },
      importer: {
        title: "Importar Produtos",
        fileName: "modelo_importacao_produto",
        hint: "As colunas Arquivos/Imagens devem ser os URLs dos arquivos separados por espaço.",
      },
    },
    transaction: {
      name: "transação",
      label: "Transações",
      menu: "Transações",
      exporterFileName: "exportacao_transacao",
      list: {
        menu: "Transações",
        title: "Transações",
      },
      create: {
        success: "Transação enviada com sucesso",
      },
      update: {
        success: "Transação salva com sucesso",
      },
      destroy: {
        success: "Transação excluída com sucesso",
      },
      destroyAll: {
        success: "Transação(ões) excluída(s) com sucesso",
      },
      edit: {
        title: "Editar Transação",
      },
      fields: {
        id: "Id",
        amountRange: "Valor",
        amount: "Valor",
        email: "Email",
        tax: "Imposto",
        currencySign: "Símbolo da Moeda",
        currencyValue: "Valor da Moeda",
        orderId: "ID do Pedido",
        createdAt: "Criado em",
        updatedAt: "Atualizado em",
        createdAtRange: "Criado em",
      },
      enumerators: {
        status: {
          pending: "Pendente",
          completed: "Sucesso",
          canceled: "Cancelado",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Nova Transação",
      },
      view: {
        title: "Ver Transação",
      },
      importer: {
        title: "Importar Transações",
        fileName: "modelo_importacao_transacao",
        hint: "As colunas Arquivos/Imagens devem ser os URLs dos arquivos separados por espaço.",
      },
    },

    order: {
      name: "pedido",
      label: "Pedidos",
      menu: "Pedidos",
      exporterFileName: "exportacao_pedido",
      list: {
        menu: "Pedidos",
        title: "Pedidos",
      },
      create: {
        success: "Pedido salvo com sucesso",
      },
      update: {
        success: "Pedido salvo com sucesso",
      },
      destroy: {
        success: "Pedido excluído com sucesso",
      },
      destroyAll: {
        success: "Pedido(s) excluído(s) com sucesso",
      },
      edit: {
        title: "Editar Pedido",
      },
      fields: {
        id: "Id",
        userId: "Usuário",
        cart: "Carrinho",
        shipping: "Envio",
        discountRange: "Desconto",
        discount: "Desconto",
        paymentMethod: "Método de Pagamento",
        taxe: "Imposto",
        transactionNumber: "Número da Transação",
        orderStatus: "Status do Pedido",
        createdAt: "Criado em",
        updatedAt: "Atualizado em",
        createdAtRange: "Criado em",
      },
      enumerators: {
        orderStatus: {
          pending: "Pendente",
          in_progress: "Em Andamento",
          delivered: "Entregue",
          canceled: "Cancelado",
        },
      },
      placeholders: {},
      hints: {},
      new: {
        title: "Novo Pedido",
      },
      view: {
        title: "Ver Pedido",
      },
      importer: {
        title: "Importar Pedidos",
        fileName: "modelo_importacao_pedido",
        hint: "As colunas Arquivos/Imagens devem ser os URLs dos arquivos separados por espaço.",
      },
    },
  },


  user: {
    fields: {
      genre: "Gênero",
      username: "Nome de usuário",
      walletName: "Nome da carteira",
      id: "Id",
      confirmPassword: "Confirmar senha",
      avatars: "Avatar",
      invitationcode: "Código de convite",
      email: "E-mail",
      emails: "E-mail(s)",
      erc20: "Endereço da carteira ERC20",
      trc20: "Endereço da carteira TRC20",
      fullName: "Nome",
      balance: "Saldo",
      firstName: "Primeiro nome",
      lastName: "Sobrenome",
      status: "Status",
      phoneNumber: "Número de telefone",
      withdrawPassword: "Senha de saque",
      sector: "Setor",
      employer: "Empregador",
      profession: "Profissão",
      address: "Endereço",
      birthDate: "Data de nascimento",
      maritalStatus: "Estado civil",
      facebookLink: "Link do Facebook",
      sponsor: "Patrocinador",
      role: "Função",
      createdAt: "Criado em",
      updatedAt: "Atualizado em",
      roleUser: "Função/Usuário",
      roles: "Funções",
      createdAtRange: "Criado em",
      password: "Senha",
      oldPassword: "Senha antiga",
      newPassword: "Nova senha",
      newPasswordConfirmation: "Confirmação da nova senha",
      rememberMe: "Lembrar de mim",
    },
    sector: {
      AGRO_ALIMENTAIRE: "Indústria alimentícia",
      ASSURANCES: "Seguros",
      AUDIOVISUEL: "Audiovisual",
      BANCAIRE: "Bancário",
      CHIMIE: "Química",
      COMPOSANTS_AUTOMOBILES: "Componentes automotivos",
      DISTRIBUTION: "Distribuição",
      DISTRIBUTION_AUTOMOBILE: "Distribuição automotiva",
      DIVERS: "Diversos",
      FINANCIER: "Financeiro",
      HOLDING: "Holding",
      IMMOBILIER: "Imobiliário",
      INDUSTRIEL: "Industrial",
      LEASING: "Leasing",
      LOGISTIQUE_TRANSPORT: "Logística e transporte",
      PHARMACEUTIQUE: "Farmacêutico",
      SANTÉ: "Saúde",
      TOURSIME: "Turismo",
      INFORMATION_TECHNOLOGY: "Tecnologia da informação",
    },
    maritalStatus: {
      célébataire: "Solteiro",
      marié: "Casado",
    },
    status: {
      active: "Ativo",
      invited: "Convidado",
      "empty-permissions": "Aguardando permissões",
      inactive: "Inativo",
    },

    enumerators: {
      status: {
        USDT: "USDT",
        ETH: "ETH",
        BTC: "BTC",
      },
      gender: {
        male: "masculino",
        female: "feminino",
      }
    },
    invite: "Convidar",
    validations: {
      // eslint-disable-next-line
      email: "O e-mail ${value} é inválido",
    },
    title: "Usuários",
    menu: "Usuários",
    doAddSuccess: "Usuário(s) salvo(s) com sucesso",
    doUpdateSuccess: "Usuário salvo com sucesso",
    exporterFileName: "usuarios_exportacao",
    doDestroySuccess: "Usuário excluído com sucesso",
    doDestroyAllSelectedSuccess: "Usuários excluídos com sucesso",
    edit: {
      title: "Editar Usuário",
    },
    new: {
      title: "Convidar Usuário(s)",
      titleModal: "Convidar Usuário",
      emailsHint:
        "Separe múltiplos endereços de e-mail usando o caractere de vírgula.",
    },
    view: {
      title: "Visualizar Usuário",
      activity: "Atividade",
    },
    importer: {
      title: "Importar Usuários",
      fileName: "modelo_importacao_usuarios",
      hint: "As colunas de Arquivos/Imagens devem ser os URLs dos arquivos separados por espaço. Os relacionamentos devem ser o ID dos registros referenciados separados por espaço. As funções devem ser os ids de funções separados por espaço.",
    },
    errors: {
      userAlreadyExists: "Já existe um usuário com este e-mail",
      userNotFound: "Usuário não encontrado",
      revokingOwnPermission: `Você não pode revogar sua própria permissão de administrador`,
    },
  },
  buttons: {
    login: "Entrar",
    registerNow: "Registrar Agora",
    signup: "Cadastrar-se",
    start: "Iniciar",
    orders: "Pedidos",
    submit: "Enviar",
    backtohome: "Voltar para a Página Inicial",
    confirm: "Confirmar",
    logout: "Sair",
    getstarted: "Começar",
  },
  text: {
    welcome: "Bem-vindo",
    discover: "Descubra ofertas exclusivas para você",
    signin: "Entrar",
    haveaccount: "Já tem uma conta?",
    noaccount: "Não tem uma conta?",
    showingnow: "Em Exibição",
    comingsoon: "Em Breve",
    termsconditions: "Termos & Condições",
    todayearning: "Ganhos de Hoje",
    accountbalance: "Saldo da Conta",
    freezebalance: "Saldo Congelado",
    sumbitInformation: "Enviar Informações",
    order: "Pedido",
    pending: "Pendente",
    completed: "Concluído",
    canceled: "Cancelado",
    notransaction: "Nenhuma transação até agora!",
    createdtime: "Data de Criação",
    creationtime: "Hora de criação",
    orderNumber: "Número do Pedido",
    orderamount: "Valor do Pedido",
    income: "Rendimento",
    buyerating: "Avaliação do Comprador",
    uid: "UID",
    promotioncode: "Código Promocional",
    walletamount: "Saldo da Carteira",
    creditassesment: "Avaliação de Crédito",
    myfinance: "Minhas Finanças",
    withdraw: "Saque",
    mydetails: "Meus Dados",
    profile: "Perfil",
    wallet: "Carteira",
    other: "Outros",
    customersupport: "Atendimento ao Cliente",
    transaction: "Transação",
    taskshistory: "Histórico de Tarefas",
    security: "Segurança",
    sponsor: `Nossa segurança é nossa maior prioridade e queremos garantir que 
              você esteja protegido contra qualquer risco potencial. Lembre-se 
              de que nunca pediremos para enviar dinheiro para um endereço desconhecido. 
              Antes de fazer qualquer pagamento, pedimos que verifique as informações conosco.`,
  },
  errors: {
    backToHome: "Voltar para a Página Inicial",
    403: "Desculpe, você não tem acesso a esta página",
    404: "Desculpe, a página que você visitou não existe",
    500: "Desculpe, o servidor está reportando um erro",
    429: "Muitas solicitações. Tente novamente mais tarde.",
    forbidden: {
      message: "Acesso Negado",
    },
    validation: {
      message: "Ocorreu um erro",
    },
    defaultErrorMessage: "Ops, ocorreu um erro",
  },

  withdraw: {
    withdrawamount: "Valor do Saque",
    Withdrawpassword: "Senha de Saque",
    availablebalance: "Saldo Disponível",
    rules: "Descrição das Regras",
    rule1: "O saque mínimo é de $20",
    rule2: "O pagamento será feito dentro de 24 horas após a solicitação de saque",
    rule3: "A submissão incompleta dos pedidos diários impede o saque; todos os produtos devem ser enviados para retirada"
  },
  profile: {
    profile: "Perfil",
    fullname: "Nome Completo",
    email: "E-mail",
    phonenumber: "Número de Telefone",
    country: "País",
    Invitationcode: "Código de Convite"
  },
  wallet: {
    wallet: "Carteira",
    info: "Informações sobre o método de saque",
    username: "Nome de Usuário",
    walletname: "Nome da Carteira",
    walletaddress: "Endereço da Carteira",
    note: "Nota",
    notedesctiption: "Por favor, preencha estas informações com cuidado."
  },

  cs: {
    cs: "Atendimento ao Cliente",
    note: "Se tiver alguma dúvida ou encontrar problemas, envie-nos um e-mail ou converse com nossa equipe de suporte online.",
    contactnow: "Entre em Contato Agora"
  },
  transaction: {
    transaction: "Transação",
    all: "Todos",
    withdraw: "Saque",
    dposit: "Depósito",
    notransaction: "Nenhuma transação até agora!"
  },
  order: {
    order: "Pedido",
    completed: "Concluído",
    pending: "Pendente",
    canceled: "Cancelado",
    ordertime: "Hora do Pedido",
    ordernumber: "Número do Pedido",
    total: "Valor Total do Pedido",
    commission: "Comissão",
    return: "Retorno Estimado"
  },

  security: {
    changepassword: "Alterar Senha",
    oldpassword: "Senha Antiga",
    newpassword: "Nova Senha",
    confirmpassword: "Confirmar Senha",
    note: "Nota",
    notedesc: "Por favor, preencha estas informações com cuidado"
  },

  auth: {
    tenants: "Espaços de Trabalho",
    singindesc: "Digite seu e-mail e senha para entrar",
    signupdesc: "Digite seu e-mail e senha para se cadastrar",
    profile: {
      title: "Perfil",
      success: "Perfil atualizado com sucesso",
      vip: "Parabéns por sua assinatura",
    },
    createAnAccount: "Criar uma Conta",
    rememberMe: "Lembrar-me",
    forgotPassword: "Esqueceu a Senha",
    signin: "Entrar",
    signup: "Cadastrar-se",
    signout: "Sair",
    alreadyHaveAnAccount: "Já tem uma conta? Faça login.",
    social: {
      errors: {
        "auth-invalid-provider":
          "Este e-mail já está registrado em outro provedor.",
        "auth-no-email": "O e-mail associado a esta conta é privado ou inexistente.",
      },
    },
    signinWithAnotherAccount: "Entrar com outra conta",
    emailUnverified: {
      message: `Por favor, confirme seu e-mail em <strong>{0}</strong> para continuar.`,
      submit: "Reenviar e-mail de verificação",
    },
    emptyPermissions: {
      message: "Você ainda não tem permissões. Aguarde a concessão de privilégios pelo administrador.",
    },
    passwordResetEmail: {
      message: "Enviar e-mail para redefinição de senha",
      error: "E-mail não reconhecido",
    },
    passwordReset: {
      message: "Redefinir Senha",
    },
    passwordChange: {
      title: "Alterar Senha",
      success: "Senha alterada com sucesso",
      mustMatch: "As senhas devem coincidir",
    },
    emailAddressVerificationEmail: {
      error: "E-mail não reconhecido",
    },
    verificationEmailSuccess: "E-mail de verificação enviado com sucesso",
    passwordResetEmailSuccess: "E-mail de redefinição de senha enviado com sucesso",
    passwordResetSuccess: "Senha alterada com sucesso",
    verifyEmail: {
      success: "E-mail verificado com sucesso.",
      message: "Aguarde um momento, seu e-mail está sendo verificado...",
    },
  },

  tabbarmenue: {
    home: "Início",
    rate: "Avaliar",
    profile: "Perfil"
  },
  validation: {
    mixed: {
      default: "${path} é inválido",
      required: "${path} é obrigatório",
      oneOf: "${path} deve ser um dos seguintes valores: ${values}",
      notOneOf: "${path} não deve ser um dos seguintes valores: ${values}",
      notType: ({ path, type, value, originalValue }) => {
        return `${path} deve ser um ${type}`;
      },
    },
    string: {
      length: "${path} deve ter exatamente ${length} caracteres",
      min: "${path} deve ter pelo menos ${min} caracteres",
      max: "${path} deve ter no máximo ${max} caracteres",
      matches: '${path} deve corresponder ao seguinte padrão: "${regex}"',
      email: "${path} deve ser um e-mail válido",
      url: "${path} deve ser um URL válido",
      trim: "${path} deve ser uma string sem espaços extras",
      lowercase: "${path} deve estar em letras minúsculas",
      uppercase: "${path} deve estar em letras maiúsculas",
      selected: "${path} deve ser selecionado",
    },
    number: {
      min: "${path} deve ser maior ou igual a ${min}",
      max: "${path} deve ser menor ou igual a ${max}",
      lessThan: "${path} deve ser menor que ${less}",
      moreThan: "${path} deve ser maior que ${more}",
      notEqual: "${path} não deve ser igual a ${notEqual}",
      positive: "${path} deve ser um número positivo",
      negative: "${path} deve ser um número negativo",
      integer: "${path} deve ser um número inteiro",
    },
    date: {
      min: "${path} deve ser posterior a ${min}",
      max: "${path} deve ser anterior a ${max}",
    },
    boolean: {},
    object: {
      noUnknown:
        "${path} não pode conter chaves não especificadas na estrutura do objeto",
    },
    array: {
      min: ({ min, path }) =>
        min === 1
          ? `${path} é obrigatório`
          : `${path} deve ter pelo menos ${min} itens`,
      max: "${path} deve ter no máximo ${max} itens",
    },
  },
  /* eslint-disable */
  fileUploader: {
    upload: "Enviar",
    image: "Você deve enviar uma imagem",
    size: "O arquivo é muito grande. O tamanho máximo permitido é {0}",
    formats: `Formato inválido. Deve ser um dos seguintes: {0}.`,
  },



};

export default ptBR;
