export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Navigation
    nav_home: 'Accueil',
    nav_courses: 'Formations',
    nav_categories: 'Catégories',
    nav_about: 'À propos',
    nav_contact: 'Contact',
    nav_login: 'Connexion Admin',
    nav_logout: 'Déconnexion',
    nav_student_login: 'Espace Étudiant',
    nav_student_dashboard: 'Mes Formations',

    // Hero
    hero_cta: 'Découvrir les formations',
    hero_secondary: 'En savoir plus',

    // Sections
    section_categories_title: 'Nos Catégories de Formation',
    section_categories_subtitle: 'Explorez nos domaines d\'expertise',
    section_courses_title: 'Formations en Vedette',
    section_courses_subtitle: 'Des programmes certifiants pour booster votre carrière',
    section_all_courses_title: 'Toutes nos Formations',
    section_testimonials_title: 'Ce que disent nos apprenants',
    section_testimonials_subtitle: 'Des témoignages qui inspirent',
    section_about_title: 'À propos d\'ISAC MLS',
    section_contact_title: 'Contactez-nous',
    section_contact_subtitle: 'Une question ? Nous sommes là pour vous aider.',

    // Course card
    course_level_beginner: 'Débutant',
    course_level_intermediate: 'Intermédiaire',
    course_level_advanced: 'Avancé',
    course_duration: 'heures',
    course_price: 'GNF',
    course_free: 'Gratuit',
    course_enroll: 'S\'inscrire',
    course_view_details: 'Voir les détails',

    // Filters
    filter_all: 'Toutes',
    filter_all_categories: 'Toutes les catégories',
    filter_all_levels: 'Tous les niveaux',
    filter_search: 'Rechercher une formation...',

    // Testimonials
    rating: 'Note',

    // Contact
    contact_email: 'Email',
    contact_phone: 'Téléphone',
    contact_address: 'Adresse',
    contact_name: 'Votre nom',
    contact_message: 'Votre message',
    contact_send: 'Envoyer le message',
    contact_sent: 'Message envoyé ! Nous vous répondrons bientôt.',

    // Footer
    footer_rights: 'Tous droits réservés.',
    footer_quick_links: 'Liens rapides',
    footer_categories: 'Catégories',
    footer_contact: 'Contact',

    // Admin login
    admin_login_title: 'Connexion Administrateur',
    admin_email: 'Adresse email',
    admin_password: 'Mot de passe',
    admin_login_button: 'Se connecter',
    admin_login_error: 'Email ou mot de passe incorrect.',
    admin_login_back: 'Retour au site',

    // Admin dashboard
    admin_dashboard: 'Tableau de bord',
    admin_welcome: 'Bienvenue',
    admin_tab_courses: 'Formations',
    admin_tab_categories: 'Catégories',
    admin_tab_instructors: 'Instructeurs',
    admin_tab_testimonials: 'Témoignages',
    admin_tab_settings: 'Paramètres du site',

    // Admin - generic
    admin_add: 'Ajouter',
    admin_edit: 'Modifier',
    admin_delete: 'Supprimer',
    admin_save: 'Enregistrer',
    admin_cancel: 'Annuler',
    admin_confirm_delete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    admin_name: 'Nom',
    admin_created: 'Créé le',
    admin_actions: 'Actions',
    admin_search: 'Rechercher...',

    // Admin - courses
    admin_courses_title: 'Gestion des Formations',
    admin_course_title_fr: 'Titre (Français)',
    admin_course_title_en: 'Titre (Anglais)',
    admin_course_desc_fr: 'Description (Français)',
    admin_course_desc_en: 'Description (Anglais)',
    admin_course_category: 'Catégorie',
    admin_course_instructor: 'Instructeur',
    admin_course_level: 'Niveau',
    admin_course_duration: 'Durée (heures)',
    admin_course_price: 'Prix (€)',
    admin_course_thumbnail: 'URL de l\'image',
    admin_course_featured: 'En vedette',
    admin_course_published: 'Publié',

    // Admin - categories
    admin_categories_title: 'Gestion des Catégories',
    admin_category_name_fr: 'Nom (Français)',
    admin_category_name_en: 'Nom (Anglais)',
    admin_category_desc_fr: 'Description (Français)',
    admin_category_desc_en: 'Description (Anglais)',
    admin_category_icon: 'Icône (nom Lucide)',
    admin_category_order: 'Ordre d\'affichage',

    // Admin - instructors
    admin_instructors_title: 'Gestion des Instructeurs',
    admin_instructor_name: 'Nom',
    admin_instructor_title_fr: 'Titre (Français)',
    admin_instructor_title_en: 'Titre (Anglais)',
    admin_instructor_bio_fr: 'Biographie (Français)',
    admin_instructor_bio_en: 'Biographie (Anglais)',
    admin_instructor_photo: 'URL de la photo',

    // Admin - testimonials
    admin_testimonials_title: 'Gestion des Témoignages',
    admin_testimonial_author: 'Auteur',
    admin_testimonial_author_title_fr: 'Titre de l\'auteur (Français)',
    admin_testimonial_author_title_en: 'Titre de l\'auteur (Anglais)',
    admin_testimonial_content_fr: 'Contenu (Français)',
    admin_testimonial_content_en: 'Contenu (Anglais)',
    admin_testimonial_avatar: 'URL de l\'avatar',
    admin_testimonial_rating: 'Note (1-5)',

    // Admin - settings
    admin_settings_title: 'Paramètres du Site',
    admin_settings_site_name: 'Nom du site',
    admin_settings_tagline_fr: 'Slogan (Français)',
    admin_settings_tagline_en: 'Slogan (Anglais)',
    admin_settings_hero_title_fr: 'Titre principal (Français)',
    admin_settings_hero_title_en: 'Titre principal (Anglais)',
    admin_settings_hero_subtitle_fr: 'Sous-titre (Français)',
    admin_settings_hero_subtitle_en: 'Sous-titre (Anglais)',
    admin_settings_about_fr: 'À propos (Français)',
    admin_settings_about_en: 'À propos (Anglais)',
    admin_settings_contact_email: 'Email de contact',
    admin_settings_contact_phone: 'Téléphone de contact',
    admin_settings_address_fr: 'Adresse (Français)',
    admin_settings_address_en: 'Adresse (Anglais)',
    admin_settings_facebook: 'URL Facebook',
    admin_settings_twitter: 'URL Twitter',
    admin_settings_linkedin: 'URL LinkedIn',
    admin_settings_instagram: 'URL Instagram',
    admin_settings_saved: 'Paramètres enregistrés avec succès !',

    // Errors
    error_load_data: 'Erreur lors du chargement des données',
    error_save: 'Erreur lors de l\'enregistrement',
    error_delete: 'Erreur lors de la suppression',
    error_generic: 'Une erreur est survenue',
    no_data: 'Aucune donnée disponible',

    // Student auth
    student_auth_title: 'Espace Étudiant',
    student_auth_signup_tab: 'Créer un compte',
    student_auth_login_tab: 'Se connecter',
    student_auth_signup_subtitle: 'Inscrivez-vous pour accéder à nos formations',
    student_auth_login_subtitle: 'Connectez-vous à votre compte étudiant',
    student_full_name: 'Nom complet',
    student_auth_email: 'Adresse email',
    student_auth_password: 'Mot de passe',
    student_auth_button_signup: 'Créer mon compte',
    student_auth_button_login: 'Se connecter',
    student_auth_error: 'Une erreur est survenue. Veuillez réessayer.',
    student_auth_success_signup: 'Compte créé ! Vous pouvez vous connecter.',
    student_auth_back: 'Retour au site',
    student_already_have_account: 'Vous avez déjà un compte ?',
    student_no_account: 'Pas encore de compte ?',

    // Student dashboard
    student_dashboard_title: 'Mes Formations',
    student_dashboard_welcome: 'Bonjour',
    student_dashboard_empty: 'Vous n\'êtes inscrit à aucune formation pour le moment.',
    student_dashboard_browse: 'Parcourir les formations',
    student_enrolled_on: 'Inscrit le',
    student_status_active: 'Actif',
    student_status_pending: 'En attente',
    student_status_completed: 'Terminé',
    student_unenroll: 'Se désinscrire',
    student_unenroll_confirm: 'Voulez-vous vraiment vous désinscrire de cette formation ?',
    student_enroll_success: 'Inscription réussie ! Vous êtes maintenant inscrit à cette formation.',
    student_enroll_already: 'Vous êtes déjà inscrit à cette formation.',
    student_enroll_need_login: 'Vous devez créer un compte ou vous connecter pour vous inscrire.',
    student_enroll_login_first: 'Connectez-vous pour vous inscrire',

    // Stats
    stats_courses: 'Formations',
    stats_students: 'Apprenants',
    stats_instructors: 'Instructeurs',
    stats_satisfaction: 'Satisfaction',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_courses: 'Courses',
    nav_categories: 'Categories',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_login: 'Admin Login',
    nav_logout: 'Logout',
    nav_student_login: 'Student Area',
    nav_student_dashboard: 'My Courses',

    // Hero
    hero_cta: 'Explore Courses',
    hero_secondary: 'Learn More',

    // Sections
    section_categories_title: 'Our Training Categories',
    section_categories_subtitle: 'Explore our areas of expertise',
    section_courses_title: 'Featured Courses',
    section_courses_subtitle: 'Certified programs to boost your career',
    section_all_courses_title: 'All Our Courses',
    section_testimonials_title: 'What our learners say',
    section_testimonials_subtitle: 'Inspiring testimonials',
    section_about_title: 'About ISAC MLS',
    section_contact_title: 'Contact Us',
    section_contact_subtitle: "Have a question? We're here to help.",

    // Course card
    course_level_beginner: 'Beginner',
    course_level_intermediate: 'Intermediate',
    course_level_advanced: 'Advanced',
    course_duration: 'hours',
    course_price: 'GNF',
    course_free: 'Free',
    course_enroll: 'Enroll Now',
    course_view_details: 'View Details',

    // Filters
    filter_all: 'All',
    filter_all_categories: 'All categories',
    filter_all_levels: 'All levels',
    filter_search: 'Search for a course...',

    // Testimonials
    rating: 'Rating',

    // Contact
    contact_email: 'Email',
    contact_phone: 'Phone',
    contact_address: 'Address',
    contact_name: 'Your name',
    contact_message: 'Your message',
    contact_send: 'Send message',
    contact_sent: 'Message sent! We will get back to you soon.',

    // Footer
    footer_rights: 'All rights reserved.',
    footer_quick_links: 'Quick Links',
    footer_categories: 'Categories',
    footer_contact: 'Contact',

    // Admin login
    admin_login_title: 'Administrator Login',
    admin_email: 'Email address',
    admin_password: 'Password',
    admin_login_button: 'Sign in',
    admin_login_error: 'Incorrect email or password.',
    admin_login_back: 'Back to site',

    // Admin dashboard
    admin_dashboard: 'Dashboard',
    admin_welcome: 'Welcome',
    admin_tab_courses: 'Courses',
    admin_tab_categories: 'Categories',
    admin_tab_instructors: 'Instructors',
    admin_tab_testimonials: 'Testimonials',
    admin_tab_settings: 'Site Settings',

    // Admin - generic
    admin_add: 'Add',
    admin_edit: 'Edit',
    admin_delete: 'Delete',
    admin_save: 'Save',
    admin_cancel: 'Cancel',
    admin_confirm_delete: 'Are you sure you want to delete this item?',
    admin_name: 'Name',
    admin_created: 'Created on',
    admin_actions: 'Actions',
    admin_search: 'Search...',

    // Admin - courses
    admin_courses_title: 'Course Management',
    admin_course_title_fr: 'Title (French)',
    admin_course_title_en: 'Title (English)',
    admin_course_desc_fr: 'Description (French)',
    admin_course_desc_en: 'Description (English)',
    admin_course_category: 'Category',
    admin_course_instructor: 'Instructor',
    admin_course_level: 'Level',
    admin_course_duration: 'Duration (hours)',
    admin_course_price: 'Price (€)',
    admin_course_thumbnail: 'Image URL',
    admin_course_featured: 'Featured',
    admin_course_published: 'Published',

    // Admin - categories
    admin_categories_title: 'Category Management',
    admin_category_name_fr: 'Name (French)',
    admin_category_name_en: 'Name (English)',
    admin_category_desc_fr: 'Description (French)',
    admin_category_desc_en: 'Description (English)',
    admin_category_icon: 'Icon (Lucide name)',
    admin_category_order: 'Display order',

    // Admin - instructors
    admin_instructors_title: 'Instructor Management',
    admin_instructor_name: 'Name',
    admin_instructor_title_fr: 'Title (French)',
    admin_instructor_title_en: 'Title (English)',
    admin_instructor_bio_fr: 'Biography (French)',
    admin_instructor_bio_en: 'Biography (English)',
    admin_instructor_photo: 'Photo URL',

    // Admin - testimonials
    admin_testimonials_title: 'Testimonial Management',
    admin_testimonial_author: 'Author',
    admin_testimonial_author_title_fr: 'Author title (French)',
    admin_testimonial_author_title_en: 'Author title (English)',
    admin_testimonial_content_fr: 'Content (French)',
    admin_testimonial_content_en: 'Content (English)',
    admin_testimonial_avatar: 'Avatar URL',
    admin_testimonial_rating: 'Rating (1-5)',

    // Admin - settings
    admin_settings_title: 'Site Settings',
    admin_settings_site_name: 'Site name',
    admin_settings_tagline_fr: 'Tagline (French)',
    admin_settings_tagline_en: 'Tagline (English)',
    admin_settings_hero_title_fr: 'Hero title (French)',
    admin_settings_hero_title_en: 'Hero title (English)',
    admin_settings_hero_subtitle_fr: 'Hero subtitle (French)',
    admin_settings_hero_subtitle_en: 'Hero subtitle (English)',
    admin_settings_about_fr: 'About (French)',
    admin_settings_about_en: 'About (English)',
    admin_settings_contact_email: 'Contact email',
    admin_settings_contact_phone: 'Contact phone',
    admin_settings_address_fr: 'Address (French)',
    admin_settings_address_en: 'Address (English)',
    admin_settings_facebook: 'Facebook URL',
    admin_settings_twitter: 'Twitter URL',
    admin_settings_linkedin: 'LinkedIn URL',
    admin_settings_instagram: 'Instagram URL',
    admin_settings_saved: 'Settings saved successfully!',

    // Errors
    error_load_data: 'Error loading data',
    error_save: 'Error saving',
    error_delete: 'Error deleting',
    error_generic: 'An error occurred',
    no_data: 'No data available',

    // Student auth
    student_auth_title: 'Student Area',
    student_auth_signup_tab: 'Create account',
    student_auth_login_tab: 'Sign in',
    student_auth_signup_subtitle: 'Sign up to access our courses',
    student_auth_login_subtitle: 'Sign in to your student account',
    student_full_name: 'Full name',
    student_auth_email: 'Email address',
    student_auth_password: 'Password',
    student_auth_button_signup: 'Create my account',
    student_auth_button_login: 'Sign in',
    student_auth_error: 'An error occurred. Please try again.',
    student_auth_success_signup: 'Account created! You can now sign in.',
    student_auth_back: 'Back to site',
    student_already_have_account: 'Already have an account?',
    student_no_account: 'No account yet?',

    // Student dashboard
    student_dashboard_title: 'My Courses',
    student_dashboard_welcome: 'Hello',
    student_dashboard_empty: 'You are not enrolled in any course yet.',
    student_dashboard_browse: 'Browse courses',
    student_enrolled_on: 'Enrolled on',
    student_status_active: 'Active',
    student_status_pending: 'Pending',
    student_status_completed: 'Completed',
    student_unenroll: 'Unenroll',
    student_unenroll_confirm: 'Do you really want to unenroll from this course?',
    student_enroll_success: 'Enrollment successful! You are now enrolled in this course.',
    student_enroll_already: 'You are already enrolled in this course.',
    student_enroll_need_login: 'You need to create an account or sign in to enroll.',
    student_enroll_login_first: 'Sign in to enroll',

    // Stats
    stats_courses: 'Courses',
    stats_students: 'Learners',
    stats_instructors: 'Instructors',
    stats_satisfaction: 'Satisfaction',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;
