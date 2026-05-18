export type QType = "likert" | "binary" | "weighted";

export interface Question {
  id: string;
  text: string;
  type: QType;
  weight: number;
  options?: string[];
}

export interface Dimension {
  code: string;
  name: string;
  color: string;
  badgeClass: string;
  normRef: string;
  questions: Question[];
}

const likertOpts = [
  "1 — Initial / Inexistant",
  "2 — Géré",
  "3 — Défini",
  "4 — Quantifié",
  "5 — Optimisé",
];
const binaryOpts = ["Non (1)", "Oui (5)"];

export const DIMENSIONS: Dimension[] = [
  {
    code: "D1",
    name: "Gouvernance des données",
    color: "#2563eb",
    badgeClass: "bg-blue-600",
    normRef: "ISO/IEC 38500:2015 · ISO/IEC 38505-1:2017 · DCAM v3 Comp.3",
    questions: [
      {
        id: "Q-D1-01",
        weight: 0.22,
        type: "likert",
        text: "Votre organisation dispose-t-elle d'une politique de gestion des données formalisée (règles de collecte, d'utilisation, de conservation et de suppression) ?",
      },
      {
        id: "Q-D1-02",
        weight: 0.2,
        type: "likert",
        text: "Des rôles et responsabilités clairs sont-ils définis autour de la gestion des données (propriétaire de données, gestionnaire, responsable qualité) ?",
      },
      {
        id: "Q-D1-03",
        weight: 0.18,
        type: "likert",
        text: "Existe-t-il un processus formalisé pour gérer les demandes d'accès aux données et les droits d'utilisation ?",
      },
      {
        id: "Q-D1-04",
        weight: 0.15,
        type: "likert",
        text: "Votre organisation dispose-t-elle d'un catalogue ou registre des données recensant les principales sources et leurs caractéristiques ?",
      },
      {
        id: "Q-D1-05",
        weight: 0.13,
        type: "likert",
        text: "La gouvernance des données est-elle formellement alignée sur la stratégie globale de l'organisation ?",
      },
      {
        id: "Q-D1-06",
        weight: 0.12,
        type: "likert",
        text: "Des indicateurs de performance (KPIs) relatifs à la gouvernance des données sont-ils définis et suivis régulièrement ?",
      },
    ],
  },
  {
    code: "D2",
    name: "Qualité des données",
    color: "#16a34a",
    badgeClass: "bg-green-600",
    normRef: "ISO 9001:2015 §8 · DAMA-DMBOK Ch.13 · DCAM v3 Comp.5",
    questions: [
      {
        id: "Q-D2-01",
        weight: 0.22,
        type: "likert",
        text: "Votre organisation a-t-elle défini des critères de qualité des données (exactitude, complétude, cohérence, fraîcheur) ?",
      },
      {
        id: "Q-D2-02",
        weight: 0.2,
        type: "likert",
        text: "Existe-t-il un processus régulier de nettoyage et de validation des données (détection de doublons, correction d'erreurs) ?",
      },
      {
        id: "Q-D2-03",
        weight: 0.2,
        type: "likert",
        text: "Les données utilisées pour la prise de décision sont-elles fiables et cohérentes entre les différents systèmes de l'organisation ?",
      },
      {
        id: "Q-D2-04",
        weight: 0.15,
        type: "binary",
        text: "Des contrôles de qualité sont-ils effectués lors de la saisie des données (validation de format, vérification de complétude) ?",
      },
      {
        id: "Q-D2-05",
        weight: 0.13,
        type: "likert",
        text: "Votre organisation mesure-t-elle régulièrement le taux d'erreur ou de complétude de ses données critiques ?",
      },
      {
        id: "Q-D2-06",
        weight: 0.1,
        type: "binary",
        text: "Les responsabilités liées à la qualité des données sont-elles formellement attribuées à des personnes spécifiques ?",
      },
    ],
  },
  {
    code: "D3",
    name: "Infrastructure technologique",
    color: "#ea580c",
    badgeClass: "bg-orange-600",
    normRef: "DCAM v3 Comp.4 · DAMA-DMBOK Ch.4 · ISO/IEC 27001:2022 §8.13",
    questions: [
      {
        id: "Q-D3-01",
        weight: 0.25,
        type: "likert",
        text: "Comment qualifieriez-vous le niveau d'intégration entre les différents systèmes d'information de votre organisation ?",
      },
      {
        id: "Q-D3-02",
        weight: 0.22,
        type: "weighted",
        text: "Quel est le niveau de maturité de votre infrastructure de stockage et de traitement des données ?",
        options: [
          "1 — Stockage sur fichiers locaux ou tableurs uniquement",
          "2 — Bases de données relationnelles basiques sans architecture formelle",
          "3 — Serveur d'entreprise centralisé avec sauvegardes régulières",
          "4 — Infrastructure cloud ou hybride avec gestion structurée des données",
          "5 — Data Warehouse ou Data Lake alimenté par des pipelines automatisés",
        ],
      },
      {
        id: "Q-D3-03",
        weight: 0.2,
        type: "likert",
        text: "Votre organisation dispose-t-elle d'une politique de sauvegarde et de reprise après sinistre (PCA/PRA) pour ses données critiques ?",
      },
      {
        id: "Q-D3-04",
        weight: 0.18,
        type: "weighted",
        text: "Votre organisation utilise-t-elle des outils de Business Intelligence ou de reporting analytique ?",
        options: [
          "1 — Aucun outil BI, rapports créés manuellement sur Excel",
          "2 — Excel avancé (tableaux croisés dynamiques, macros)",
          "3 — Outil BI basique gratuit (Google Looker Studio, Power BI Desktop)",
          "4 — Outil BI professionnel déployé (Power BI Pro, Tableau, Qlik)",
          "5 — Plateforme analytique avancée avec self-service BI et alertes automatiques",
        ],
      },
      {
        id: "Q-D3-05",
        weight: 0.1,
        type: "binary",
        text: "La capacité de votre infrastructure IT est-elle régulièrement évaluée et planifiée pour la croissance future des données ?",
      },
      {
        id: "Q-D3-06",
        weight: 0.05,
        type: "likert",
        text: "Dans quelle mesure votre organisation exploite-t-elle les technologies cloud pour ses données et applications ?",
      },
    ],
  },
  {
    code: "D4",
    name: "Culture et compétences data",
    color: "#9333ea",
    badgeClass: "bg-purple-600",
    normRef: "DAMA-DMBOK Ch.1 §4 · DCAM v3 Comp.2 · ISO 9001:2015 §7.2",
    questions: [
      {
        id: "Q-D4-01",
        weight: 0.25,
        type: "likert",
        text: "Comment évalueriez-vous le niveau de culture data de vos collaborateurs (capacité à lire, interpréter et utiliser des données dans leur travail quotidien) ?",
      },
      {
        id: "Q-D4-02",
        weight: 0.22,
        type: "likert",
        text: "Votre organisation a-t-elle mis en place des formations spécifiques liées aux données et au digital pour ses collaborateurs ?",
      },
      {
        id: "Q-D4-03",
        weight: 0.22,
        type: "likert",
        text: "Le management soutient-il activement les initiatives data et les perçoit-il comme un levier stratégique ?",
      },
      {
        id: "Q-D4-04",
        weight: 0.15,
        type: "weighted",
        text: "Votre organisation dispose-t-elle ou recrute-t-elle des profils spécialisés en data ?",
        options: [
          "1 — Aucun recrutement data envisagé",
          "2 — Sujet identifié sans plan de recrutement concret",
          "3 — Un profil data en cours de recrutement ou récemment recruté",
          "4 — Une équipe data de 2 à 5 personnes constituée",
          "5 — Département data complet (Engineer, Analyst, Scientist, CDO) opérationnel",
        ],
      },
      {
        id: "Q-D4-05",
        weight: 0.1,
        type: "binary",
        text: "Existe-t-il des rituels organisationnels autour de la donnée (réunions de revue des KPIs, comités data, sessions de partage d'insights) ?",
      },
      {
        id: "Q-D4-06",
        weight: 0.06,
        type: "likert",
        text: "Les collaborateurs non-techniques sont-ils à l'aise pour accéder et utiliser les outils de reporting en autonomie ?",
      },
    ],
  },
  {
    code: "D5",
    name: "Sécurité et conformité data",
    color: "#dc2626",
    badgeClass: "bg-red-600",
    normRef: "ISO/IEC 27001:2022 · Loi n°2004-63 (Tunisie) · DCAM v3 Comp.6",
    questions: [
      {
        id: "Q-D5-01",
        weight: 0.25,
        type: "binary",
        text: "Votre organisation dispose-t-elle d'une politique formalisée de sécurité des données, documentée et communiquée à l'ensemble des collaborateurs ?",
      },
      {
        id: "Q-D5-02",
        weight: 0.22,
        type: "likert",
        text: "Le contrôle d'accès aux données sensibles est-il géré selon le principe du moindre privilège (chaque utilisateur n'a accès qu'aux données nécessaires à sa fonction) ?",
      },
      {
        id: "Q-D5-03",
        weight: 0.18,
        type: "binary",
        text: "Votre organisation a-t-elle réalisé une analyse formelle des risques liés à la sécurité des données au cours des deux dernières années ?",
      },
      {
        id: "Q-D5-04",
        weight: 0.18,
        type: "likert",
        text: "Existe-t-il un plan de réponse aux incidents de sécurité des données (fuite, ransomware, accès non autorisé) ?",
      },
      {
        id: "Q-D5-05",
        weight: 0.12,
        type: "likert",
        text: "Votre organisation est-elle en conformité avec la loi organique tunisienne n°2004-63 sur la protection des données personnelles (notification à l'INPDP) ?",
      },
      {
        id: "Q-D5-06",
        weight: 0.05,
        type: "likert",
        text: "Les collaborateurs reçoivent-ils régulièrement des sensibilisations à la cybersécurité et à la protection des données ?",
      },
    ],
  },
  {
    code: "D6",
    name: "Exploitation analytique",
    color: "#0d9488",
    badgeClass: "bg-teal-600",
    normRef: "DAMA-DMBOK Ch.14 · DCAM v3 Comp.8",
    questions: [
      {
        id: "Q-D6-01",
        weight: 0.25,
        type: "likert",
        text: "Dans quelle mesure les décisions stratégiques de votre organisation sont-elles fondées sur des analyses de données plutôt que sur l'intuition ?",
      },
      {
        id: "Q-D6-02",
        weight: 0.22,
        type: "weighted",
        text: "Votre organisation utilise-t-elle des analyses prédictives ou des modèles statistiques pour anticiper des tendances ?",
        options: [
          "1 — Aucune analyse prédictive, tout est rétrospectif",
          "2 — Projections basiques sur Excel",
          "3 — Analyses statistiques descriptives et comparatives structurées",
          "4 — Modèles prédictifs (régression, classification) pour certains cas d'usage",
          "5 — Modèles de machine learning ou d'IA en production pour des décisions clés",
        ],
      },
      {
        id: "Q-D6-03",
        weight: 0.2,
        type: "weighted",
        text: "À quelle fréquence les équipes métier reçoivent-elles des rapports ou tableaux de bord basés sur les données ?",
        options: [
          "1 — Jamais ou très rarement (annuellement)",
          "2 — Trimestriellement ou à la demande",
          "3 — Mensuellement",
          "4 — Hebdomadairement",
          "5 — En temps réel ou quotidiennement via tableaux de bord dynamiques",
        ],
      },
      {
        id: "Q-D6-04",
        weight: 0.15,
        type: "binary",
        text: "Votre organisation mesure-t-elle le retour sur investissement (ROI) de ses initiatives data et analytics ?",
      },
      {
        id: "Q-D6-05",
        weight: 0.1,
        type: "likert",
        text: "Votre organisation partage-t-elle des données ou analyses avec ses partenaires, clients ou fournisseurs ?",
      },
      {
        id: "Q-D6-06",
        weight: 0.08,
        type: "likert",
        text: "Votre organisation a-t-elle identifié des cas d'usage data concrets générant une valeur métier mesurable ?",
      },
    ],
  },
  {
    code: "D7",
    name: "Stratégie et transformation digitale",
    color: "#4f46e5",
    badgeClass: "bg-indigo-600",
    normRef: "MIT/Capgemini (2014) · Deloitte DMM (2018) · Gartner DMF · McKinsey",
    questions: [
      {
        id: "Q-D7-01",
        weight: 0.25,
        type: "likert",
        text: "Votre organisation dispose-t-elle d'une stratégie de transformation digitale formalisée, avec des objectifs définis, un budget alloué et un responsable identifié ?",
      },
      {
        id: "Q-D7-02",
        weight: 0.22,
        type: "likert",
        text: "Dans quelle mesure les processus internes de votre organisation sont-ils numérisés et automatisés (facturation, RH, gestion de projet, workflows) ?",
      },
      {
        id: "Q-D7-03",
        weight: 0.2,
        type: "likert",
        text: "Votre organisation offre-t-elle à ses clients des canaux digitaux pour interagir avec elle (portail client, application mobile, chat en ligne, commande en ligne) ?",
      },
      {
        id: "Q-D7-04",
        weight: 0.18,
        type: "likert",
        text: "Votre organisation a-t-elle fait évoluer son modèle d'affaires ou développé de nouveaux produits grâce au digital ?",
      },
      {
        id: "Q-D7-05",
        weight: 0.1,
        type: "binary",
        text: "Des indicateurs de performance digitaux (taux de conversion, trafic web, NPS digital, adoption des outils digitaux) sont-ils définis et suivis ?",
      },
      {
        id: "Q-D7-06",
        weight: 0.05,
        type: "likert",
        text: "Votre organisation se dote-t-elle de compétences et de partenariats pour expérimenter des technologies émergentes (IA, IoT, automatisation) ?",
      },
    ],
  },
];

// Patch likert/binary options for runtime
DIMENSIONS.forEach((d) =>
  d.questions.forEach((q) => {
    if (!q.options) {
      q.options = q.type === "binary" ? binaryOpts : likertOpts;
    }
  }),
);

export const SECTOR_WEIGHTS: Record<string, Record<string, number>> = {
  industrie: { D1: 0.15, D2: 0.17, D3: 0.2, D4: 0.1, D5: 0.14, D6: 0.1, D7: 0.14 },
  commerce: { D1: 0.13, D2: 0.14, D3: 0.13, D4: 0.11, D5: 0.15, D6: 0.19, D7: 0.15 },
  services: { D1: 0.2, D2: 0.14, D3: 0.11, D4: 0.13, D5: 0.16, D6: 0.14, D7: 0.12 },
  sante: { D1: 0.17, D2: 0.2, D3: 0.1, D4: 0.08, D5: 0.26, D6: 0.1, D7: 0.09 },
  finance: { D1: 0.22, D2: 0.18, D3: 0.1, D4: 0.08, D5: 0.22, D6: 0.09, D7: 0.11 },
  generic: { D1: 0.17, D2: 0.16, D3: 0.13, D4: 0.1, D5: 0.2, D6: 0.12, D7: 0.12 },
};

export const SECTORS = [
  { id: "industrie", label: "Industrie / Manufacturing" },
  { id: "commerce", label: "Commerce / Distribution / Retail" },
  { id: "services", label: "Services (B2B ou B2C)" },
  { id: "sante", label: "Santé / Médical / Pharmaceutique" },
  { id: "finance", label: "Finance / Banque / Assurance / Fintech" },
  { id: "generic", label: "Autre" },
];

export const SIZES = [
  "Moins de 10 (Micro-entreprise)",
  "10 à 49 (Petite entreprise)",
  "50 à 249 (Moyenne entreprise)",
  "250 à 999 (Grande entreprise)",
  "1 000 et plus (Très grande entreprise)",
];

export const IT_FUNCTIONS = [
  "Non, aucune fonction IT dédiée",
  "Oui, une personne parmi d'autres responsabilités",
  "Oui, un responsable IT dédié (DSI)",
  "Oui, une direction IT avec équipe constituée",
];

export const REGULATED_DATA = [
  "Non, pas de données sensibles",
  "Données personnelles de clients",
  "Données médicales ou de santé",
  "Données financières ou bancaires",
  "Données soumises à un régulateur (BCT, INPDP)",
];

export const SYSTEMS = [
  "Aucun système structurant",
  "Logiciel de comptabilité / facturation",
  "ERP (SAP, Odoo, Microsoft Dynamics)",
  "CRM (Salesforce, HubSpot, Zoho)",
  "Outil BI ou reporting analytique",
  "Data Warehouse ou plateforme data",
];

export const RECO_MAP: Record<
  string,
  { title: string; ref: string; action: string; effort: string }
> = {
  D1: {
    title: "Formaliser une politique de gouvernance des données",
    ref: "ISO/IEC 38505-1:2017",
    action:
      "Rédiger et diffuser une charte data, désigner un Data Owner et un comité de gouvernance.",
    effort: "Moyen · 2-4 mois",
  },
  D2: {
    title: "Mettre en place un processus de qualité des données",
    ref: "ISO 9001:2015 §8",
    action:
      "Définir des KPIs de qualité, automatiser les contrôles à la saisie et un cycle de nettoyage mensuel.",
    effort: "Moyen · 3-6 mois",
  },
  D3: {
    title: "Renforcer l'infrastructure de stockage et d'intégration",
    ref: "DCAM v3 Comp.4",
    action:
      "Migrer vers une architecture centralisée (cloud/hybride), mettre en place des pipelines ETL.",
    effort: "Élevé · 6-12 mois",
  },
  D4: {
    title: "Développer un programme de formation data",
    ref: "DAMA-DMBOK Ch.1 §4",
    action: "Lancer des parcours data literacy par métier et instaurer un comité data mensuel.",
    effort: "Faible · 2-3 mois",
  },
  D5: {
    title: "Initier une démarche de sécurité ISO/IEC 27001",
    ref: "ISO/IEC 27001:2022",
    action:
      "Réaliser une analyse de risques, formaliser une PSSI, déployer le contrôle d'accès au moindre privilège.",
    effort: "Élevé · 6-12 mois",
  },
  D6: {
    title: "Déployer un outil de Business Intelligence",
    ref: "DAMA-DMBOK Ch.14",
    action:
      "Choisir et déployer un outil BI (Power BI/Tableau), construire 3 tableaux de bord prioritaires.",
    effort: "Moyen · 3-6 mois",
  },
  D7: {
    title: "Formaliser une stratégie de transformation digitale",
    ref: "MIT/Capgemini (2014)",
    action:
      "Élaborer une feuille de route digitale 3 ans avec budget, gouvernance et KPIs digitaux.",
    effort: "Élevé · 6-12 mois",
  },
};
