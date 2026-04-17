import type { Locale } from "./config"

export type TranslationDict = {
  common: {
    save: string
    saving: string
    cancel: string
    close: string
    delete: string
    edit: string
    create: string
    search: string
    loading: string
    open: string
    navigate: string
    results: string
    noResults: string
    send: string
    reply: string
    yes: string
    no: string
    confirm: string
    back: string
    next: string
    previous: string
    all: string
    none: string
    today: string
    tomorrow: string
    yesterday: string
    justNow: string
    minutesAgoShort: string
    hoursAgoShort: string
    daysAgo: string
    clearFilter: string
  }
  nav: {
    dashboard: string
    projects: string
    tasks: string
    kanban: string
    calendar: string
    checklists: string
    documents: string
    forum: string
    chat: string
    activity: string
    reports: string
    workload: string
    compare: string
    achievements: string
    notifications: string
    admin: string
    adminPanel: string
    settings: string
    sectionAnalytics: string
    sectionAdmin: string
  }
  header: {
    searchPlaceholder: string
    typeToSearch: string
    myProfile: string
    settings: string
    logout: string
    toggleMenu: string
    changeLanguage: string
    changeTheme: string
  }
  theme: {
    light: string
    dark: string
    system: string
    lightActivated: string
    darkActivated: string
    systemActivated: string
  }
  login: {
    tagline: string
    email: string
    emailPlaceholder: string
    password: string
    signIn: string
    signingIn: string
    errorGeneric: string
    errorNetwork: string
    demoMode: string
    allRightsReserved: string
    admin: string
    projectManager: string
    worker: string
  }
  commandPalette: {
    placeholder: string
    noResultsFor: string
    categoryPages: string
    categoryAnalytics: string
    categorySystem: string
    categoryProjects: string
    categoryTasks: string
    categoryPeople: string
    workloadTitle: string
    compareTitle: string
  }
  dashboard: {
    goodMorning: string
    goodAfternoon: string
    goodEvening: string
    summary: string
    commandPalette: string
    activeProjects: string
    totalTasks: string
    completed: string
    pending: string
    overdue: string
    team: string
    avgProgress: string
    activity: string
    totalCount: string
    inProgressCount: string
    ofTotal: string
    withOverdue: string
    noDelays: string
    needsAttention: string
    onSchedule: string
    activeMembers: string
    allProjects: string
    totalItems: string
    quickNewProject: string
    quickNewProjectDesc: string
    quickNewTask: string
    quickNewTaskDesc: string
    quickNewEvent: string
    quickNewEventDesc: string
    quickUploadDoc: string
    quickUploadDocDesc: string
    taskMap: string
    activeTasks: string
    noActiveTasks: string
    bubbleSize: string
    clickToOpen: string
    priority: string
    complete: string
  }
  notifications: {
    title: string
    unreadCount: string
    unreadCountMany: string
    allRead: string
    markAllRead: string
    markAllReadDone: string
    urgent: string
    highPriority: string
    normal: string
    lowPriority: string
    tabAll: string
    tabUnread: string
    tabTasks: string
    tabMentions: string
    tabProjects: string
    tabMessages: string
    noNotifications: string
    allCaughtUp: string
    nothingToShow: string
    typeTask: string
    typeMention: string
    typeProject: string
    typeMessage: string
    typeSystem: string
    new: string
    completeTask: string
    taskCompleted: string
    replyPlaceholder: string
    replySent: string
    snooze: string
    snoozed: string
    oneHour: string
    fourHours: string
    nextWeek: string
    markRead: string
    markedRead: string
    openAction: string
    notificationDeleted: string
    settings: string
  }
  settings: {
    title: string
    subtitle: string
    saveChanges: string
    saved: string
    tabProfile: string
    tabNotifications: string
    tabSecurity: string
    tabAppearance: string
    tabLanguage: string
    profileTitle: string
    profileSubtitle: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    department: string
    notifTitle: string
    notifSubtitle: string
    emailNotifs: string
    pushNotifs: string
    notifAssignedTasks: string
    notifForumMentions: string
    notifDirectMessages: string
    notifCalendarReminders: string
    notifWeeklyDigest: string
    notifChatMessages: string
    notifSecurityAlerts: string
    notifProjectUpdates: string
    securityTitle: string
    securitySubtitle: string
    changePassword: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    updatePassword: string
    twoFactor: string
    twoFactorDesc: string
    setupTwoFactor: string
    activeSessions: string
    thisDevice: string
    currentSession: string
    lastActivityNow: string
    appearanceTitle: string
    appearanceSubtitle: string
    theme: string
    accentColor: string
    languageTitle: string
    languageSubtitle: string
    interfaceLanguage: string
    dateFormat: string
    timeFormat: string
    firstDayOfWeek: string
    monday: string
    sunday: string
    time24: string
    time12: string
  }
  languageToggle: {
    label: string
  }
}

const ca: TranslationDict = {
  common: {
    save: "Desar",
    saving: "Desant...",
    cancel: "Cancel·lar",
    close: "Tancar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    search: "Cercar",
    loading: "Carregant...",
    open: "Obre",
    navigate: "Navega",
    results: "resultats",
    noResults: "Sense resultats",
    send: "Enviar",
    reply: "Respondre",
    yes: "Sí",
    no: "No",
    confirm: "Confirmar",
    back: "Enrere",
    next: "Següent",
    previous: "Anterior",
    all: "Tots",
    none: "Cap",
    today: "Avui",
    tomorrow: "Demà",
    yesterday: "Ahir",
    justNow: "Ara mateix",
    minutesAgoShort: "Fa {n} min",
    hoursAgoShort: "Fa {n}h",
    daysAgo: "Fa {n} dies",
    clearFilter: "Treure filtre",
  },
  nav: {
    dashboard: "Dashboard",
    projects: "Projectes",
    tasks: "Tasques",
    kanban: "Kanban",
    calendar: "Calendari",
    checklists: "Checklists",
    documents: "Documents",
    forum: "Fòrum",
    chat: "Xat",
    activity: "Activitat",
    reports: "Informes",
    workload: "Càrrega",
    compare: "Comparador",
    achievements: "Assoliments",
    notifications: "Notificacions",
    admin: "Administració",
    adminPanel: "Panel Admin",
    settings: "Configuració",
    sectionAnalytics: "Analítica",
    sectionAdmin: "Administració",
  },
  header: {
    searchPlaceholder: "Cercar projectes, tasques...",
    typeToSearch: "Escriu per cercar...",
    myProfile: "El meu perfil",
    settings: "Configuració",
    logout: "Tancar sessió",
    toggleMenu: "Obrir menú",
    changeLanguage: "Canviar idioma",
    changeTheme: "Canviar tema",
  },
  theme: {
    light: "Clar",
    dark: "Fosc",
    system: "Sistema",
    lightActivated: "Tema clar activat",
    darkActivated: "Tema fosc activat",
    systemActivated: "Tema del sistema activat",
  },
  login: {
    tagline: "Organitza, controla, flueix. - Sistema de Gestió",
    email: "Correu electrònic",
    emailPlaceholder: "usuari@matepro.com",
    password: "Contrasenya",
    signIn: "Iniciar sessió",
    signingIn: "Iniciant sessió...",
    errorGeneric: "Error al iniciar sessió",
    errorNetwork: "Error de connexió. Intenta-ho de nou.",
    demoMode: "Mode demo - Credencials de prova:",
    allRightsReserved: "Tots els drets reservats.",
    admin: "Admin",
    projectManager: "Project Manager",
    worker: "Operari",
  },
  commandPalette: {
    placeholder: "Cerca projectes, tasques, persones o pàgines...",
    noResultsFor: "Sense resultats per",
    categoryPages: "Pàgines",
    categoryAnalytics: "Analítica",
    categorySystem: "Sistema",
    categoryProjects: "Projectes",
    categoryTasks: "Tasques",
    categoryPeople: "Persones",
    workloadTitle: "Càrrega de treball",
    compareTitle: "Comparador de projectes",
  },
  dashboard: {
    goodMorning: "Bon dia",
    goodAfternoon: "Bona tarda",
    goodEvening: "Bona nit",
    summary: "Aquí tens un resum de l'activitat del drassana",
    commandPalette: "Paleta de comandes",
    activeProjects: "Projectes Actius",
    totalTasks: "Tasques Totals",
    completed: "Completades",
    pending: "Pendents",
    overdue: "Endarrerides",
    team: "Equip",
    avgProgress: "Progrés Mitjà",
    activity: "Activitat",
    totalCount: "{n} total",
    inProgressCount: "{n} en curs",
    ofTotal: "{n}% del total",
    withOverdue: "{n} endarrerides",
    noDelays: "Sense retards",
    needsAttention: "Requereix atenció",
    onSchedule: "Al dia",
    activeMembers: "{n} actius",
    allProjects: "Tots els projectes",
    totalItems: "Elements totals",
    quickNewProject: "Nou Projecte",
    quickNewProjectDesc: "Crear un projecte nou",
    quickNewTask: "Nova Tasca",
    quickNewTaskDesc: "Afegir una tasca",
    quickNewEvent: "Nou Esdeveniment",
    quickNewEventDesc: "Programar al calendari",
    quickUploadDoc: "Pujar Document",
    quickUploadDocDesc: "Afegir arxiu o plànol",
    taskMap: "Mapa de tasques",
    activeTasks: "tasques actives",
    noActiveTasks: "No hi ha tasques actives",
    bubbleSize: "Mida = prioritat",
    clickToOpen: "Fes clic per obrir",
    priority: "prioritat",
    complete: "completat",
  },
  notifications: {
    title: "Notificacions",
    unreadCount: "Tens {n} notificació sense llegir",
    unreadCountMany: "Tens {n} notificacions sense llegir",
    allRead: "Totes les notificacions llegides",
    markAllRead: "Marcar tot llegit",
    markAllReadDone: "Totes les notificacions marcades com a llegides",
    urgent: "Urgent",
    highPriority: "Prioritat alta",
    normal: "Normal",
    lowPriority: "Baixa prioritat",
    tabAll: "Totes",
    tabUnread: "Sense llegir",
    tabTasks: "Tasques",
    tabMentions: "Mencions",
    tabProjects: "Projectes",
    tabMessages: "Missatges",
    noNotifications: "Cap notificació",
    allCaughtUp: "Estàs al dia!",
    nothingToShow: "No hi ha notificacions per mostrar",
    typeTask: "Tasca",
    typeMention: "Menció",
    typeProject: "Projecte",
    typeMessage: "Missatge",
    typeSystem: "Sistema",
    new: "Nou",
    completeTask: "Completar tasca",
    taskCompleted: "Tasca marcada com a completada",
    replyPlaceholder: "Escriu una resposta ràpida...",
    replySent: "Resposta enviada",
    snooze: "Posposar",
    snoozed: "Notificació posposada {n}h",
    oneHour: "1 hora",
    fourHours: "4 hores",
    nextWeek: "La propera setmana",
    markRead: "Llegida",
    markedRead: "Marcada com a llegida",
    openAction: "Obrir",
    notificationDeleted: "Notificació eliminada",
    settings: "Configuració",
  },
  settings: {
    title: "Configuració",
    subtitle: "Gestiona les teves preferències personals",
    saveChanges: "Desar canvis",
    saved: "Configuració desada correctament",
    tabProfile: "Perfil",
    tabNotifications: "Notificacions",
    tabSecurity: "Seguretat",
    tabAppearance: "Aparença",
    tabLanguage: "Idioma",
    profileTitle: "Informació personal",
    profileSubtitle: "Actualitza la informació del teu perfil",
    firstName: "Nom",
    lastName: "Cognoms",
    email: "Correu electrònic",
    phone: "Telèfon",
    role: "Càrrec / Rol",
    department: "Departament",
    notifTitle: "Preferències de notificacions",
    notifSubtitle: "Configura com vols rebre les notificacions",
    emailNotifs: "Notificacions per correu",
    pushNotifs: "Notificacions push",
    notifAssignedTasks: "Tasques assignades",
    notifForumMentions: "Mencions al fòrum",
    notifDirectMessages: "Missatges directes",
    notifCalendarReminders: "Recordatoris de calendari",
    notifWeeklyDigest: "Resum setmanal",
    notifChatMessages: "Missatges de xat",
    notifSecurityAlerts: "Alertes de seguretat",
    notifProjectUpdates: "Actualitzacions de projectes",
    securityTitle: "Seguretat del compte",
    securitySubtitle: "Gestiona la seguretat del teu compte",
    changePassword: "Canviar contrasenya",
    currentPassword: "Contrasenya actual",
    newPassword: "Nova contrasenya",
    confirmPassword: "Confirmar nova contrasenya",
    updatePassword: "Actualitzar contrasenya",
    twoFactor: "Autenticació de dos factors",
    twoFactorDesc: "Afegeix una capa extra de seguretat al teu compte",
    setupTwoFactor: "Configurar 2FA",
    activeSessions: "Sessions actives",
    thisDevice: "Aquest dispositiu",
    currentSession: "Actual",
    lastActivityNow: "Última activitat: Ara",
    appearanceTitle: "Aparença",
    appearanceSubtitle: "Personalitza l'aspecte de l'aplicació",
    theme: "Tema",
    accentColor: "Color d'accent",
    languageTitle: "Idioma i regió",
    languageSubtitle: "Configura les teves preferències d'idioma",
    interfaceLanguage: "Idioma de la interfície",
    dateFormat: "Format de data",
    timeFormat: "Format d'hora",
    firstDayOfWeek: "Primer dia de la setmana",
    monday: "Dilluns",
    sunday: "Diumenge",
    time24: "24 hores (14:30)",
    time12: "12 hores (2:30 PM)",
  },
  languageToggle: {
    label: "Idioma",
  },
}

const en: TranslationDict = {
  common: {
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    loading: "Loading...",
    open: "Open",
    navigate: "Navigate",
    results: "results",
    noResults: "No results",
    send: "Send",
    reply: "Reply",
    yes: "Yes",
    no: "No",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    previous: "Previous",
    all: "All",
    none: "None",
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
    justNow: "Just now",
    minutesAgoShort: "{n} min ago",
    hoursAgoShort: "{n}h ago",
    daysAgo: "{n} days ago",
    clearFilter: "Clear filter",
  },
  nav: {
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Tasks",
    kanban: "Kanban",
    calendar: "Calendar",
    checklists: "Checklists",
    documents: "Documents",
    forum: "Forum",
    chat: "Chat",
    activity: "Activity",
    reports: "Reports",
    workload: "Workload",
    compare: "Compare",
    achievements: "Achievements",
    notifications: "Notifications",
    admin: "Administration",
    adminPanel: "Admin Panel",
    settings: "Settings",
    sectionAnalytics: "Analytics",
    sectionAdmin: "Administration",
  },
  header: {
    searchPlaceholder: "Search projects, tasks...",
    typeToSearch: "Type to search...",
    myProfile: "My profile",
    settings: "Settings",
    logout: "Sign out",
    toggleMenu: "Open menu",
    changeLanguage: "Change language",
    changeTheme: "Change theme",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
    lightActivated: "Light theme activated",
    darkActivated: "Dark theme activated",
    systemActivated: "System theme activated",
  },
  login: {
    tagline: "Organize, control, flow. - Management System",
    email: "Email",
    emailPlaceholder: "user@matepro.com",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    errorGeneric: "Sign in error",
    errorNetwork: "Connection error. Please try again.",
    demoMode: "Demo mode - Test credentials:",
    allRightsReserved: "All rights reserved.",
    admin: "Admin",
    projectManager: "Project Manager",
    worker: "Worker",
  },
  commandPalette: {
    placeholder: "Search projects, tasks, people or pages...",
    noResultsFor: "No results for",
    categoryPages: "Pages",
    categoryAnalytics: "Analytics",
    categorySystem: "System",
    categoryProjects: "Projects",
    categoryTasks: "Tasks",
    categoryPeople: "People",
    workloadTitle: "Workload",
    compareTitle: "Project comparator",
  },
  dashboard: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    summary: "Here is a summary of the shipyard activity",
    commandPalette: "Command palette",
    activeProjects: "Active Projects",
    totalTasks: "Total Tasks",
    completed: "Completed",
    pending: "Pending",
    overdue: "Overdue",
    team: "Team",
    avgProgress: "Avg Progress",
    activity: "Activity",
    totalCount: "{n} total",
    inProgressCount: "{n} in progress",
    ofTotal: "{n}% of total",
    withOverdue: "{n} overdue",
    noDelays: "No delays",
    needsAttention: "Needs attention",
    onSchedule: "On schedule",
    activeMembers: "{n} active",
    allProjects: "All projects",
    totalItems: "Total items",
    quickNewProject: "New Project",
    quickNewProjectDesc: "Create a new project",
    quickNewTask: "New Task",
    quickNewTaskDesc: "Add a task",
    quickNewEvent: "New Event",
    quickNewEventDesc: "Schedule in calendar",
    quickUploadDoc: "Upload Document",
    quickUploadDocDesc: "Add file or blueprint",
    taskMap: "Task Map",
    activeTasks: "active tasks",
    noActiveTasks: "No active tasks",
    bubbleSize: "Size = priority",
    clickToOpen: "Click to open",
    priority: "priority",
    complete: "complete",
  },
  notifications: {
    title: "Notifications",
    unreadCount: "You have {n} unread notification",
    unreadCountMany: "You have {n} unread notifications",
    allRead: "All notifications read",
    markAllRead: "Mark all read",
    markAllReadDone: "All notifications marked as read",
    urgent: "Urgent",
    highPriority: "High priority",
    normal: "Normal",
    lowPriority: "Low priority",
    tabAll: "All",
    tabUnread: "Unread",
    tabTasks: "Tasks",
    tabMentions: "Mentions",
    tabProjects: "Projects",
    tabMessages: "Messages",
    noNotifications: "No notifications",
    allCaughtUp: "You're all caught up!",
    nothingToShow: "There are no notifications to show",
    typeTask: "Task",
    typeMention: "Mention",
    typeProject: "Project",
    typeMessage: "Message",
    typeSystem: "System",
    new: "New",
    completeTask: "Complete task",
    taskCompleted: "Task marked as completed",
    replyPlaceholder: "Write a quick reply...",
    replySent: "Reply sent",
    snooze: "Snooze",
    snoozed: "Notification snoozed for {n}h",
    oneHour: "1 hour",
    fourHours: "4 hours",
    nextWeek: "Next week",
    markRead: "Read",
    markedRead: "Marked as read",
    openAction: "Open",
    notificationDeleted: "Notification deleted",
    settings: "Settings",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your personal preferences",
    saveChanges: "Save changes",
    saved: "Settings saved successfully",
    tabProfile: "Profile",
    tabNotifications: "Notifications",
    tabSecurity: "Security",
    tabAppearance: "Appearance",
    tabLanguage: "Language",
    profileTitle: "Personal information",
    profileSubtitle: "Update your profile information",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    role: "Position / Role",
    department: "Department",
    notifTitle: "Notification preferences",
    notifSubtitle: "Configure how you want to receive notifications",
    emailNotifs: "Email notifications",
    pushNotifs: "Push notifications",
    notifAssignedTasks: "Assigned tasks",
    notifForumMentions: "Forum mentions",
    notifDirectMessages: "Direct messages",
    notifCalendarReminders: "Calendar reminders",
    notifWeeklyDigest: "Weekly digest",
    notifChatMessages: "Chat messages",
    notifSecurityAlerts: "Security alerts",
    notifProjectUpdates: "Project updates",
    securityTitle: "Account security",
    securitySubtitle: "Manage the security of your account",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    updatePassword: "Update password",
    twoFactor: "Two-factor authentication",
    twoFactorDesc: "Add an extra layer of security to your account",
    setupTwoFactor: "Set up 2FA",
    activeSessions: "Active sessions",
    thisDevice: "This device",
    currentSession: "Current",
    lastActivityNow: "Last activity: Now",
    appearanceTitle: "Appearance",
    appearanceSubtitle: "Customize the look of the application",
    theme: "Theme",
    accentColor: "Accent color",
    languageTitle: "Language and region",
    languageSubtitle: "Configure your language preferences",
    interfaceLanguage: "Interface language",
    dateFormat: "Date format",
    timeFormat: "Time format",
    firstDayOfWeek: "First day of week",
    monday: "Monday",
    sunday: "Sunday",
    time24: "24 hours (14:30)",
    time12: "12 hours (2:30 PM)",
  },
  languageToggle: {
    label: "Language",
  },
}

const fr: TranslationDict = {
  common: {
    save: "Enregistrer",
    saving: "Enregistrement...",
    cancel: "Annuler",
    close: "Fermer",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
    search: "Rechercher",
    loading: "Chargement...",
    open: "Ouvrir",
    navigate: "Naviguer",
    results: "résultats",
    noResults: "Aucun résultat",
    send: "Envoyer",
    reply: "Répondre",
    yes: "Oui",
    no: "Non",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    all: "Tous",
    none: "Aucun",
    today: "Aujourd'hui",
    tomorrow: "Demain",
    yesterday: "Hier",
    justNow: "À l'instant",
    minutesAgoShort: "Il y a {n} min",
    hoursAgoShort: "Il y a {n}h",
    daysAgo: "Il y a {n} jours",
    clearFilter: "Effacer le filtre",
  },
  nav: {
    dashboard: "Tableau de bord",
    projects: "Projets",
    tasks: "Tâches",
    kanban: "Kanban",
    calendar: "Calendrier",
    checklists: "Listes de contrôle",
    documents: "Documents",
    forum: "Forum",
    chat: "Chat",
    activity: "Activité",
    reports: "Rapports",
    workload: "Charge",
    compare: "Comparateur",
    achievements: "Réussites",
    notifications: "Notifications",
    admin: "Administration",
    adminPanel: "Panneau admin",
    settings: "Paramètres",
    sectionAnalytics: "Analyses",
    sectionAdmin: "Administration",
  },
  header: {
    searchPlaceholder: "Rechercher projets, tâches...",
    typeToSearch: "Tapez pour rechercher...",
    myProfile: "Mon profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    toggleMenu: "Ouvrir le menu",
    changeLanguage: "Changer de langue",
    changeTheme: "Changer de thème",
  },
  theme: {
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    lightActivated: "Thème clair activé",
    darkActivated: "Thème sombre activé",
    systemActivated: "Thème système activé",
  },
  login: {
    tagline: "Organisez, contrôlez, fluez. - Système de gestion",
    email: "E-mail",
    emailPlaceholder: "utilisateur@matepro.com",
    password: "Mot de passe",
    signIn: "Se connecter",
    signingIn: "Connexion...",
    errorGeneric: "Erreur de connexion",
    errorNetwork: "Erreur de connexion. Veuillez réessayer.",
    demoMode: "Mode démo - Identifiants de test :",
    allRightsReserved: "Tous droits réservés.",
    admin: "Admin",
    projectManager: "Chef de projet",
    worker: "Opérateur",
  },
  commandPalette: {
    placeholder: "Rechercher projets, tâches, personnes ou pages...",
    noResultsFor: "Aucun résultat pour",
    categoryPages: "Pages",
    categoryAnalytics: "Analyses",
    categorySystem: "Système",
    categoryProjects: "Projets",
    categoryTasks: "Tâches",
    categoryPeople: "Personnes",
    workloadTitle: "Charge de travail",
    compareTitle: "Comparateur de projets",
  },
  dashboard: {
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    summary: "Voici un résumé de l'activité du chantier",
    commandPalette: "Palette de commandes",
    activeProjects: "Projets actifs",
    totalTasks: "Tâches totales",
    completed: "Terminées",
    pending: "En attente",
    overdue: "En retard",
    team: "Équipe",
    avgProgress: "Progression moyenne",
    activity: "Activité",
    totalCount: "{n} au total",
    inProgressCount: "{n} en cours",
    ofTotal: "{n}% du total",
    withOverdue: "{n} en retard",
    noDelays: "Aucun retard",
    needsAttention: "Nécessite de l'attention",
    onSchedule: "À jour",
    activeMembers: "{n} actifs",
    allProjects: "Tous les projets",
    totalItems: "Éléments totaux",
    quickNewProject: "Nouveau projet",
    quickNewProjectDesc: "Créer un nouveau projet",
    quickNewTask: "Nouvelle tâche",
    quickNewTaskDesc: "Ajouter une tâche",
    quickNewEvent: "Nouvel événement",
    quickNewEventDesc: "Planifier au calendrier",
    quickUploadDoc: "Téléverser un document",
    quickUploadDocDesc: "Ajouter un fichier ou un plan",
    taskMap: "Carte des taches",
    activeTasks: "taches actives",
    noActiveTasks: "Aucune tache active",
    bubbleSize: "Taille = priorite",
    clickToOpen: "Cliquer pour ouvrir",
    priority: "priorite",
    complete: "termine",
  },
  notifications: {
    title: "Notifications",
    unreadCount: "Vous avez {n} notification non lue",
    unreadCountMany: "Vous avez {n} notifications non lues",
    allRead: "Toutes les notifications lues",
    markAllRead: "Tout marquer lu",
    markAllReadDone: "Toutes les notifications marquées comme lues",
    urgent: "Urgent",
    highPriority: "Priorité haute",
    normal: "Normal",
    lowPriority: "Priorité basse",
    tabAll: "Toutes",
    tabUnread: "Non lues",
    tabTasks: "Tâches",
    tabMentions: "Mentions",
    tabProjects: "Projets",
    tabMessages: "Messages",
    noNotifications: "Aucune notification",
    allCaughtUp: "Vous êtes à jour !",
    nothingToShow: "Aucune notification à afficher",
    typeTask: "Tâche",
    typeMention: "Mention",
    typeProject: "Projet",
    typeMessage: "Message",
    typeSystem: "Système",
    new: "Nouveau",
    completeTask: "Terminer la tâche",
    taskCompleted: "Tâche marquée comme terminée",
    replyPlaceholder: "Écrire une réponse rapide...",
    replySent: "Réponse envoyée",
    snooze: "Reporter",
    snoozed: "Notification reportée de {n}h",
    oneHour: "1 heure",
    fourHours: "4 heures",
    nextWeek: "La semaine prochaine",
    markRead: "Lue",
    markedRead: "Marquée comme lue",
    openAction: "Ouvrir",
    notificationDeleted: "Notification supprimée",
    settings: "Paramètres",
  },
  settings: {
    title: "Paramètres",
    subtitle: "Gérez vos préférences personnelles",
    saveChanges: "Enregistrer les modifications",
    saved: "Paramètres enregistrés avec succès",
    tabProfile: "Profil",
    tabNotifications: "Notifications",
    tabSecurity: "Sécurité",
    tabAppearance: "Apparence",
    tabLanguage: "Langue",
    profileTitle: "Informations personnelles",
    profileSubtitle: "Mettez à jour les informations de votre profil",
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    role: "Poste / Rôle",
    department: "Département",
    notifTitle: "Préférences de notifications",
    notifSubtitle: "Configurez la façon dont vous recevez les notifications",
    emailNotifs: "Notifications par e-mail",
    pushNotifs: "Notifications push",
    notifAssignedTasks: "Tâches assignées",
    notifForumMentions: "Mentions au forum",
    notifDirectMessages: "Messages directs",
    notifCalendarReminders: "Rappels du calendrier",
    notifWeeklyDigest: "Résumé hebdomadaire",
    notifChatMessages: "Messages de chat",
    notifSecurityAlerts: "Alertes de sécurité",
    notifProjectUpdates: "Mises à jour des projets",
    securityTitle: "Sécurité du compte",
    securitySubtitle: "Gérez la sécurité de votre compte",
    changePassword: "Changer le mot de passe",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le nouveau mot de passe",
    updatePassword: "Mettre à jour le mot de passe",
    twoFactor: "Authentification à deux facteurs",
    twoFactorDesc: "Ajoutez une couche de sécurité à votre compte",
    setupTwoFactor: "Configurer 2FA",
    activeSessions: "Sessions actives",
    thisDevice: "Cet appareil",
    currentSession: "Actuelle",
    lastActivityNow: "Dernière activité : Maintenant",
    appearanceTitle: "Apparence",
    appearanceSubtitle: "Personnalisez l'aspect de l'application",
    theme: "Thème",
    accentColor: "Couleur d'accent",
    languageTitle: "Langue et région",
    languageSubtitle: "Configurez vos préférences de langue",
    interfaceLanguage: "Langue de l'interface",
    dateFormat: "Format de date",
    timeFormat: "Format d'heure",
    firstDayOfWeek: "Premier jour de la semaine",
    monday: "Lundi",
    sunday: "Dimanche",
    time24: "24 heures (14:30)",
    time12: "12 heures (2:30 PM)",
  },
  languageToggle: {
    label: "Langue",
  },
}

const it: TranslationDict = {
  common: {
    save: "Salva",
    saving: "Salvataggio...",
    cancel: "Annulla",
    close: "Chiudi",
    delete: "Elimina",
    edit: "Modifica",
    create: "Crea",
    search: "Cerca",
    loading: "Caricamento...",
    open: "Apri",
    navigate: "Naviga",
    results: "risultati",
    noResults: "Nessun risultato",
    send: "Invia",
    reply: "Rispondi",
    yes: "Sì",
    no: "No",
    confirm: "Conferma",
    back: "Indietro",
    next: "Avanti",
    previous: "Precedente",
    all: "Tutti",
    none: "Nessuno",
    today: "Oggi",
    tomorrow: "Domani",
    yesterday: "Ieri",
    justNow: "Proprio ora",
    minutesAgoShort: "{n} min fa",
    hoursAgoShort: "{n}h fa",
    daysAgo: "{n} giorni fa",
    clearFilter: "Rimuovi filtro",
  },
  nav: {
    dashboard: "Dashboard",
    projects: "Progetti",
    tasks: "Attività",
    kanban: "Kanban",
    calendar: "Calendario",
    checklists: "Checklist",
    documents: "Documenti",
    forum: "Forum",
    chat: "Chat",
    activity: "Attività",
    reports: "Report",
    workload: "Carico",
    compare: "Confronto",
    achievements: "Obiettivi",
    notifications: "Notifiche",
    admin: "Amministrazione",
    adminPanel: "Pannello Admin",
    settings: "Impostazioni",
    sectionAnalytics: "Analisi",
    sectionAdmin: "Amministrazione",
  },
  header: {
    searchPlaceholder: "Cerca progetti, attività...",
    typeToSearch: "Digita per cercare...",
    myProfile: "Il mio profilo",
    settings: "Impostazioni",
    logout: "Esci",
    toggleMenu: "Apri menu",
    changeLanguage: "Cambia lingua",
    changeTheme: "Cambia tema",
  },
  theme: {
    light: "Chiaro",
    dark: "Scuro",
    system: "Sistema",
    lightActivated: "Tema chiaro attivato",
    darkActivated: "Tema scuro attivato",
    systemActivated: "Tema di sistema attivato",
  },
  login: {
    tagline: "Organizza, controlla, fluisci. - Sistema di gestione",
    email: "E-mail",
    emailPlaceholder: "utente@matepro.com",
    password: "Password",
    signIn: "Accedi",
    signingIn: "Accesso in corso...",
    errorGeneric: "Errore durante l'accesso",
    errorNetwork: "Errore di connessione. Riprova.",
    demoMode: "Modalità demo - Credenziali di prova:",
    allRightsReserved: "Tutti i diritti riservati.",
    admin: "Admin",
    projectManager: "Project Manager",
    worker: "Operaio",
  },
  commandPalette: {
    placeholder: "Cerca progetti, attività, persone o pagine...",
    noResultsFor: "Nessun risultato per",
    categoryPages: "Pagine",
    categoryAnalytics: "Analisi",
    categorySystem: "Sistema",
    categoryProjects: "Progetti",
    categoryTasks: "Attività",
    categoryPeople: "Persone",
    workloadTitle: "Carico di lavoro",
    compareTitle: "Confronto progetti",
  },
  dashboard: {
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio",
    goodEvening: "Buonasera",
    summary: "Ecco un riepilogo dell'attività del cantiere",
    commandPalette: "Palette comandi",
    activeProjects: "Progetti attivi",
    totalTasks: "Attività totali",
    completed: "Completate",
    pending: "In attesa",
    overdue: "In ritardo",
    team: "Team",
    avgProgress: "Progresso medio",
    activity: "Attività",
    totalCount: "{n} totali",
    inProgressCount: "{n} in corso",
    ofTotal: "{n}% del totale",
    withOverdue: "{n} in ritardo",
    noDelays: "Nessun ritardo",
    needsAttention: "Richiede attenzione",
    onSchedule: "In regola",
    activeMembers: "{n} attivi",
    allProjects: "Tutti i progetti",
    totalItems: "Elementi totali",
    quickNewProject: "Nuovo progetto",
    quickNewProjectDesc: "Crea un nuovo progetto",
    quickNewTask: "Nuova attività",
    quickNewTaskDesc: "Aggiungi un'attività",
    quickNewEvent: "Nuovo evento",
    quickNewEventDesc: "Pianifica nel calendario",
    quickUploadDoc: "Carica documento",
    quickUploadDocDesc: "Aggiungi file o progetto",
    taskMap: "Mappa attivita",
    activeTasks: "attivita attive",
    noActiveTasks: "Nessuna attivita attiva",
    bubbleSize: "Dimensione = priorita",
    clickToOpen: "Clicca per aprire",
    priority: "priorita",
    complete: "completato",
  },
  notifications: {
    title: "Notifiche",
    unreadCount: "Hai {n} notifica non letta",
    unreadCountMany: "Hai {n} notifiche non lette",
    allRead: "Tutte le notifiche lette",
    markAllRead: "Segna tutto letto",
    markAllReadDone: "Tutte le notifiche segnate come lette",
    urgent: "Urgente",
    highPriority: "Priorità alta",
    normal: "Normale",
    lowPriority: "Priorità bassa",
    tabAll: "Tutte",
    tabUnread: "Non lette",
    tabTasks: "Attività",
    tabMentions: "Menzioni",
    tabProjects: "Progetti",
    tabMessages: "Messaggi",
    noNotifications: "Nessuna notifica",
    allCaughtUp: "Sei aggiornato!",
    nothingToShow: "Nessuna notifica da mostrare",
    typeTask: "Attività",
    typeMention: "Menzione",
    typeProject: "Progetto",
    typeMessage: "Messaggio",
    typeSystem: "Sistema",
    new: "Nuovo",
    completeTask: "Completa attività",
    taskCompleted: "Attività segnata come completata",
    replyPlaceholder: "Scrivi una risposta rapida...",
    replySent: "Risposta inviata",
    snooze: "Posticipa",
    snoozed: "Notifica posticipata di {n}h",
    oneHour: "1 ora",
    fourHours: "4 ore",
    nextWeek: "La prossima settimana",
    markRead: "Letta",
    markedRead: "Segnata come letta",
    openAction: "Apri",
    notificationDeleted: "Notifica eliminata",
    settings: "Impostazioni",
  },
  settings: {
    title: "Impostazioni",
    subtitle: "Gestisci le tue preferenze personali",
    saveChanges: "Salva modifiche",
    saved: "Impostazioni salvate con successo",
    tabProfile: "Profilo",
    tabNotifications: "Notifiche",
    tabSecurity: "Sicurezza",
    tabAppearance: "Aspetto",
    tabLanguage: "Lingua",
    profileTitle: "Informazioni personali",
    profileSubtitle: "Aggiorna le informazioni del tuo profilo",
    firstName: "Nome",
    lastName: "Cognome",
    email: "E-mail",
    phone: "Telefono",
    role: "Ruolo / Posizione",
    department: "Dipartimento",
    notifTitle: "Preferenze notifiche",
    notifSubtitle: "Configura come vuoi ricevere le notifiche",
    emailNotifs: "Notifiche via e-mail",
    pushNotifs: "Notifiche push",
    notifAssignedTasks: "Attività assegnate",
    notifForumMentions: "Menzioni nel forum",
    notifDirectMessages: "Messaggi diretti",
    notifCalendarReminders: "Promemoria calendario",
    notifWeeklyDigest: "Riepilogo settimanale",
    notifChatMessages: "Messaggi chat",
    notifSecurityAlerts: "Avvisi di sicurezza",
    notifProjectUpdates: "Aggiornamenti progetti",
    securityTitle: "Sicurezza account",
    securitySubtitle: "Gestisci la sicurezza del tuo account",
    changePassword: "Cambia password",
    currentPassword: "Password attuale",
    newPassword: "Nuova password",
    confirmPassword: "Conferma nuova password",
    updatePassword: "Aggiorna password",
    twoFactor: "Autenticazione a due fattori",
    twoFactorDesc: "Aggiungi un ulteriore livello di sicurezza",
    setupTwoFactor: "Configura 2FA",
    activeSessions: "Sessioni attive",
    thisDevice: "Questo dispositivo",
    currentSession: "Corrente",
    lastActivityNow: "Ultima attività: Adesso",
    appearanceTitle: "Aspetto",
    appearanceSubtitle: "Personalizza l'aspetto dell'applicazione",
    theme: "Tema",
    accentColor: "Colore d'accento",
    languageTitle: "Lingua e regione",
    languageSubtitle: "Configura le tue preferenze di lingua",
    interfaceLanguage: "Lingua dell'interfaccia",
    dateFormat: "Formato data",
    timeFormat: "Formato ora",
    firstDayOfWeek: "Primo giorno della settimana",
    monday: "Lunedì",
    sunday: "Domenica",
    time24: "24 ore (14:30)",
    time12: "12 ore (2:30 PM)",
  },
  languageToggle: {
    label: "Lingua",
  },
}

const de: TranslationDict = {
  common: {
    save: "Speichern",
    saving: "Speichern...",
    cancel: "Abbrechen",
    close: "Schließen",
    delete: "Löschen",
    edit: "Bearbeiten",
    create: "Erstellen",
    search: "Suchen",
    loading: "Lädt...",
    open: "Öffnen",
    navigate: "Navigieren",
    results: "Ergebnisse",
    noResults: "Keine Ergebnisse",
    send: "Senden",
    reply: "Antworten",
    yes: "Ja",
    no: "Nein",
    confirm: "Bestätigen",
    back: "Zurück",
    next: "Weiter",
    previous: "Vorherige",
    all: "Alle",
    none: "Keine",
    today: "Heute",
    tomorrow: "Morgen",
    yesterday: "Gestern",
    justNow: "Gerade eben",
    minutesAgoShort: "Vor {n} Min.",
    hoursAgoShort: "Vor {n} Std.",
    daysAgo: "Vor {n} Tagen",
    clearFilter: "Filter entfernen",
  },
  nav: {
    dashboard: "Dashboard",
    projects: "Projekte",
    tasks: "Aufgaben",
    kanban: "Kanban",
    calendar: "Kalender",
    checklists: "Checklisten",
    documents: "Dokumente",
    forum: "Forum",
    chat: "Chat",
    activity: "Aktivität",
    reports: "Berichte",
    workload: "Auslastung",
    compare: "Vergleich",
    achievements: "Erfolge",
    notifications: "Benachrichtigungen",
    admin: "Verwaltung",
    adminPanel: "Admin-Panel",
    settings: "Einstellungen",
    sectionAnalytics: "Analyse",
    sectionAdmin: "Verwaltung",
  },
  header: {
    searchPlaceholder: "Projekte, Aufgaben suchen...",
    typeToSearch: "Tippen zum Suchen...",
    myProfile: "Mein Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    toggleMenu: "Menü öffnen",
    changeLanguage: "Sprache ändern",
    changeTheme: "Design ändern",
  },
  theme: {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
    lightActivated: "Helles Design aktiviert",
    darkActivated: "Dunkles Design aktiviert",
    systemActivated: "Systemdesign aktiviert",
  },
  login: {
    tagline: "Organisieren, kontrollieren, fließen. - Verwaltungssystem",
    email: "E-Mail",
    emailPlaceholder: "benutzer@matepro.com",
    password: "Passwort",
    signIn: "Anmelden",
    signingIn: "Anmeldung...",
    errorGeneric: "Fehler bei der Anmeldung",
    errorNetwork: "Verbindungsfehler. Bitte erneut versuchen.",
    demoMode: "Demo-Modus - Test-Zugangsdaten:",
    allRightsReserved: "Alle Rechte vorbehalten.",
    admin: "Admin",
    projectManager: "Projektleiter",
    worker: "Arbeiter",
  },
  commandPalette: {
    placeholder: "Projekte, Aufgaben, Personen oder Seiten suchen...",
    noResultsFor: "Keine Ergebnisse für",
    categoryPages: "Seiten",
    categoryAnalytics: "Analyse",
    categorySystem: "System",
    categoryProjects: "Projekte",
    categoryTasks: "Aufgaben",
    categoryPeople: "Personen",
    workloadTitle: "Arbeitsauslastung",
    compareTitle: "Projektvergleich",
  },
  dashboard: {
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    summary: "Hier ist eine Zusammenfassung der Werft-Aktivität",
    commandPalette: "Befehlspalette",
    activeProjects: "Aktive Projekte",
    totalTasks: "Aufgaben gesamt",
    completed: "Abgeschlossen",
    pending: "Ausstehend",
    overdue: "Überfällig",
    team: "Team",
    avgProgress: "Ø Fortschritt",
    activity: "Aktivität",
    totalCount: "{n} gesamt",
    inProgressCount: "{n} in Bearbeitung",
    ofTotal: "{n}% der gesamten",
    withOverdue: "{n} überfällig",
    noDelays: "Keine Verzögerungen",
    needsAttention: "Benötigt Aufmerksamkeit",
    onSchedule: "Im Zeitplan",
    activeMembers: "{n} aktiv",
    allProjects: "Alle Projekte",
    totalItems: "Elemente gesamt",
    quickNewProject: "Neues Projekt",
    quickNewProjectDesc: "Neues Projekt erstellen",
    quickNewTask: "Neue Aufgabe",
    quickNewTaskDesc: "Aufgabe hinzufügen",
    quickNewEvent: "Neues Ereignis",
    quickNewEventDesc: "Im Kalender planen",
    quickUploadDoc: "Dokument hochladen",
    quickUploadDocDesc: "Datei oder Plan hinzufügen",
    taskMap: "Aufgabenkarte",
    activeTasks: "aktive Aufgaben",
    noActiveTasks: "Keine aktiven Aufgaben",
    bubbleSize: "Grosse = Prioritat",
    clickToOpen: "Klicken zum Offnen",
    priority: "Prioritat",
    complete: "abgeschlossen",
  },
  notifications: {
    title: "Benachrichtigungen",
    unreadCount: "Du hast {n} ungelesene Benachrichtigung",
    unreadCountMany: "Du hast {n} ungelesene Benachrichtigungen",
    allRead: "Alle Benachrichtigungen gelesen",
    markAllRead: "Alle als gelesen markieren",
    markAllReadDone: "Alle Benachrichtigungen als gelesen markiert",
    urgent: "Dringend",
    highPriority: "Hohe Priorität",
    normal: "Normal",
    lowPriority: "Niedrige Priorität",
    tabAll: "Alle",
    tabUnread: "Ungelesen",
    tabTasks: "Aufgaben",
    tabMentions: "Erwähnungen",
    tabProjects: "Projekte",
    tabMessages: "Nachrichten",
    noNotifications: "Keine Benachrichtigungen",
    allCaughtUp: "Alles auf dem neuesten Stand!",
    nothingToShow: "Keine Benachrichtigungen anzuzeigen",
    typeTask: "Aufgabe",
    typeMention: "Erwähnung",
    typeProject: "Projekt",
    typeMessage: "Nachricht",
    typeSystem: "System",
    new: "Neu",
    completeTask: "Aufgabe abschließen",
    taskCompleted: "Aufgabe als abgeschlossen markiert",
    replyPlaceholder: "Schreibe eine schnelle Antwort...",
    replySent: "Antwort gesendet",
    snooze: "Später",
    snoozed: "Benachrichtigung um {n}h verschoben",
    oneHour: "1 Stunde",
    fourHours: "4 Stunden",
    nextWeek: "Nächste Woche",
    markRead: "Gelesen",
    markedRead: "Als gelesen markiert",
    openAction: "Öffnen",
    notificationDeleted: "Benachrichtigung gelöscht",
    settings: "Einstellungen",
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Verwalte deine persönlichen Einstellungen",
    saveChanges: "Änderungen speichern",
    saved: "Einstellungen erfolgreich gespeichert",
    tabProfile: "Profil",
    tabNotifications: "Benachrichtigungen",
    tabSecurity: "Sicherheit",
    tabAppearance: "Aussehen",
    tabLanguage: "Sprache",
    profileTitle: "Persönliche Informationen",
    profileSubtitle: "Aktualisiere deine Profilinformationen",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    phone: "Telefon",
    role: "Position / Rolle",
    department: "Abteilung",
    notifTitle: "Benachrichtigungseinstellungen",
    notifSubtitle: "Konfiguriere, wie du Benachrichtigungen erhalten möchtest",
    emailNotifs: "E-Mail-Benachrichtigungen",
    pushNotifs: "Push-Benachrichtigungen",
    notifAssignedTasks: "Zugewiesene Aufgaben",
    notifForumMentions: "Forum-Erwähnungen",
    notifDirectMessages: "Direktnachrichten",
    notifCalendarReminders: "Kalendererinnerungen",
    notifWeeklyDigest: "Wochenrückblick",
    notifChatMessages: "Chat-Nachrichten",
    notifSecurityAlerts: "Sicherheitswarnungen",
    notifProjectUpdates: "Projektaktualisierungen",
    securityTitle: "Kontosicherheit",
    securitySubtitle: "Verwalte die Sicherheit deines Kontos",
    changePassword: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Neues Passwort bestätigen",
    updatePassword: "Passwort aktualisieren",
    twoFactor: "Zwei-Faktor-Authentifizierung",
    twoFactorDesc: "Füge eine zusätzliche Sicherheitsebene hinzu",
    setupTwoFactor: "2FA einrichten",
    activeSessions: "Aktive Sitzungen",
    thisDevice: "Dieses Gerät",
    currentSession: "Aktuell",
    lastActivityNow: "Letzte Aktivität: Jetzt",
    appearanceTitle: "Aussehen",
    appearanceSubtitle: "Passe das Aussehen der Anwendung an",
    theme: "Design",
    accentColor: "Akzentfarbe",
    languageTitle: "Sprache und Region",
    languageSubtitle: "Konfiguriere deine Spracheinstellungen",
    interfaceLanguage: "Oberflächensprache",
    dateFormat: "Datumsformat",
    timeFormat: "Zeitformat",
    firstDayOfWeek: "Erster Tag der Woche",
    monday: "Montag",
    sunday: "Sonntag",
    time24: "24 Stunden (14:30)",
    time12: "12 Stunden (2:30 PM)",
  },
  languageToggle: {
    label: "Sprache",
  },
}

export const TRANSLATIONS: Record<Locale, TranslationDict> = { ca, en, fr, it, de }
