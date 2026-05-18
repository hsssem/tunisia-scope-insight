import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";

const outputPath = path.resolve("rapport.pdf");
const generatedAt = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Africa/Tunis",
}).format(new Date());

const doc = new jsPDF({ unit: "mm", format: "a4" });
const page = {
  width: doc.internal.pageSize.getWidth(),
  height: doc.internal.pageSize.getHeight(),
  marginX: 18,
  marginTop: 20,
  marginBottom: 18,
};

let y = page.marginTop;

function sanitize(text) {
  return text
    .replace(/[’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/·/g, "-")
    .replace(/₁/g, "1")
    .replace(/₂/g, "2")
    .replace(/₃/g, "3")
    .replace(/₄/g, "4")
    .replace(/₅/g, "5")
    .replace(/₆/g, "6")
    .replace(/₇/g, "7");
}

function footer() {
  const current = doc.getCurrentPageInfo().pageNumber;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Rapport technique PFE - EvalitX AI - Page ${current}`, page.marginX, page.height - 9);
}

function addPageIfNeeded(extra = 12) {
  if (y + extra > page.height - page.marginBottom) {
    footer();
    doc.addPage();
    y = page.marginTop;
  }
}

function title(text) {
  addPageIfNeeded(18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(32, 42, 92);
  doc.text(sanitize(text), page.marginX, y);
  y += 9;
}

function subtitle(text) {
  addPageIfNeeded(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 110);
  doc.text(sanitize(text), page.marginX, y);
  y += 7;
}

function paragraph(text, size = 10) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(35, 35, 35);
  const lines = doc.splitTextToSize(sanitize(text), page.width - page.marginX * 2);
  for (const line of lines) {
    addPageIfNeeded(6);
    doc.text(line, page.marginX, y);
    y += 5.3;
  }
  y += 2;
}

function bullet(items) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(35, 35, 35);
  for (const item of items) {
    const lines = doc.splitTextToSize(sanitize(item), page.width - page.marginX * 2 - 6);
    addPageIfNeeded(6);
    doc.text("-", page.marginX, y);
    doc.text(lines[0], page.marginX + 6, y);
    y += 5.2;
    for (const line of lines.slice(1)) {
      addPageIfNeeded(6);
      doc.text(line, page.marginX + 6, y);
      y += 5.2;
    }
  }
  y += 2;
}

function table(headers, rows, widths) {
  const x0 = page.marginX;
  const rowHeight = 8;
  addPageIfNeeded(rowHeight * 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setFillColor(240, 243, 250);
  doc.rect(
    x0,
    y - 5,
    widths.reduce((a, b) => a + b, 0),
    rowHeight,
    "F",
  );
  let x = x0;
  headers.forEach((h, i) => {
    doc.text(sanitize(h), x + 2, y);
    x += widths[i];
  });
  y += rowHeight;
  doc.setFont("helvetica", "normal");
  for (const row of rows) {
    addPageIfNeeded(rowHeight + 2);
    x = x0;
    const splitCells = row.map((cell, i) => doc.splitTextToSize(sanitize(cell), widths[i] - 4));
    const maxLines = Math.max(...splitCells.map((cell) => cell.length));
    const height = Math.max(rowHeight, maxLines * 4.3 + 3);
    doc.setDrawColor(220, 225, 235);
    doc.rect(
      x0,
      y - 5,
      widths.reduce((a, b) => a + b, 0),
      height,
    );
    splitCells.forEach((cell, i) => {
      doc.text(cell, x + 2, y);
      x += widths[i];
    });
    y += height;
  }
  y += 4;
}

doc.setFillColor(10, 14, 39);
doc.rect(0, 0, page.width, page.height, "F");
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(27);
doc.text("Chapitre 3", page.marginX, 56);
doc.setFontSize(18);
doc.text("Implementation et validation experimentale", page.marginX, 69);
doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.text("Application EvalitX AI - Digital and Data Readiness Advisor", page.marginX, 84);
doc.text("Projet de fin d'etudes - contexte academique et professionnel", page.marginX, 93);
doc.setFontSize(10);
doc.text(`Genere le ${sanitize(generatedAt)}`, page.marginX, 112);
doc.text("Workspace: tunisia-scope-insight", page.marginX, 119);
footer();
doc.addPage();
y = page.marginTop;

title("Chapitre 3 : Implementation et validation experimentale");
paragraph(
  "Ce chapitre presente la phase d'implementation et de validation experimentale de l'application EvalitX AI, developpee dans le cadre d'un projet de fin d'etudes. L'objectif est de transformer le modele theorique de maturite digitale et data, construit dans les chapitres precedents, en un MVP fonctionnel permettant de collecter un profil organisationnel, d'administrer un questionnaire structure, de calculer un score de maturite et de produire un rapport de conseil exploitable.",
);
paragraph(
  "Le sommaire initial prevoyait un backend Python/FastAPI. Apres analyse du code reel du MVP, cette information a ete rectifiee : l'application actuelle repose sur React, TanStack Start, Vite, TypeScript et Supabase. Le moteur de scoring est implemente en TypeScript dans le frontend, tandis que Supabase joue le role de backend as a service pour la base de donnees PostgreSQL, la securite Row Level Security et les futures operations de persistance.",
);

title("3.1 Architecture globale de l'application");
paragraph(
  "L'architecture globale de l'application est concue autour d'un parcours utilisateur simple et lineaire. L'utilisateur renseigne d'abord les informations de classification de son organisation, repond ensuite au questionnaire de maturite, puis obtient automatiquement un rapport contenant les scores, les lacunes critiques, les recommandations prioritaires et une feuille de route. Cette architecture est adaptee au contexte d'un PFE, car elle permet de relier clairement le cadre scientifique du modele a une implementation applicative concrete.",
);
subtitle("Backend : Supabase et couche serveur TanStack Start");
paragraph(
  "Le backend n'est pas implemente avec Python/FastAPI dans cette version du MVP. La solution retenue est Supabase, connectee au projet par les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY. Supabase fournit une base PostgreSQL, une API generee automatiquement, la possibilite d'ajouter l'authentification et des politiques de securite Row Level Security. En complement, TanStack Start fournit une couche serveur/SSR JavaScript via src/server.ts et src/start.ts, avec une gestion d'erreurs personnalisee pour les rendus serveur.",
);
bullet([
  "src/lib/supabase.ts initialise le client Supabase cote application.",
  "supabase/migrations contient la migration SQL de la table public.scoring_test_submissions.",
  "src/server.ts normalise les erreurs serveur et renvoie une page d'erreur personnalisee en cas d'incident SSR.",
  "wrangler.jsonc prepare un deploiement possible sur Cloudflare Workers avec compatibilite Node.js.",
]);
subtitle("Base de donnees");
paragraph(
  "La base de donnees cible est PostgreSQL via Supabase. Une table de soumissions a ete preparee pour stocker les evaluations realisees par les entreprises. Elle permet de conserver le profil organisationnel, les reponses au questionnaire, le score calcule, le score global, les sous-scores data et digital ainsi que le niveau de maturite final.",
);
table(
  ["Element stocke", "Utilite dans le PFE"],
  [
    [
      "Profil entreprise",
      "Permet de segmenter les resultats selon le secteur, la taille et le contexte SI.",
    ],
    ["Reponses jsonb", "Conserve les 42 reponses du questionnaire de maturite."],
    ["Score jsonb", "Garde une trace complete du calcul pour audit et reproductibilite."],
    [
      "Scores numeriques",
      "Facilite les analyses statistiques : moyenne, distribution et segmentation.",
    ],
    [
      "Niveau de maturite",
      "Permet l'interpretation N1 a N5 et la comparaison entre entreprises pilotes.",
    ],
  ],
  [55, 123],
);
subtitle("API scoring");
paragraph(
  "Le sommaire mentionne une API scoring. Dans le MVP actuel, le scoring n'est pas encore expose comme endpoint backend FastAPI. Il est implemente sous forme de module TypeScript local dans src/lib/maturity-engine.ts. Ce choix est coherent avec un MVP de PFE, car il permet de valider rapidement la logique mathematique du modele sans complexifier l'architecture. A moyen terme, cette logique pourra etre deplacee dans une Edge Function Supabase ou une route serveur TanStack afin de securiser le calcul cote backend.",
);
subtitle("Interface utilisateur");
paragraph(
  "L'interface utilisateur est developpee avec React, TypeScript, TanStack Router, Tailwind CSS, Radix UI, Framer Motion et Recharts. Elle guide l'utilisateur a travers les trois grandes etapes du diagnostic : profil, evaluation et rapport. L'interface a ete pensee pour rester professionnelle et lisible, car l'application s'adresse a des dirigeants, responsables IT, consultants ou encadrants academiques qui doivent comprendre rapidement les resultats.",
);
table(
  ["Ecran", "Role fonctionnel"],
  [
    ["Classification", "Collecte les 5 questions contextuelles sans impact direct sur le score."],
    ["Evaluation", "Affiche les 7 dimensions et les 42 questions scorees."],
    ["Loading", "Met en scene le calcul des scores et la generation du rapport."],
    ["Report", "Affiche les resultats, le radar, les recommandations et l'export PDF."],
  ],
  [45, 133],
);

title("3.2 Implementation du moteur de calcul");
subtitle("Algorithme de scoring");
paragraph(
  "Le moteur de calcul est le coeur scientifique de l'application. Il transforme les reponses du questionnaire en indicateurs quantitatifs interpretables. Chaque reponse est exprimee sur une echelle de 1 a 5. Les questions de type binaire sont converties en 1 pour une reponse negative et 5 pour une reponse positive. Les questions a choix pondere utilisent directement le niveau selectionne.",
);
paragraph(
  "Pour chaque dimension Di, le score brut est obtenu par la somme des produits entre la reponse r_i,k et le poids intra-dimension p_i,k. La somme des poids d'une dimension est egale a 1. Le score brut est ensuite normalise sur 100 selon la formule : Score_normalise = ((Score_brut - 1) / 4) x 100. Cette normalisation garantit qu'une organisation au niveau 1 obtient 0/100 et qu'une organisation au niveau 5 obtient 100/100.",
);
table(
  ["Etape", "Description"],
  [
    [
      "Collecte",
      "Recuperation des reponses utilisateur dans un objet answers indexe par identifiant de question.",
    ],
    ["Score dimensionnel", "Application des poids intra-dimension definis dans maturity-data.ts."],
    ["Normalisation", "Transformation du score brut 1-5 en score 0-100."],
    ["Score global", "Somme ponderee des scores dimensionnels selon le secteur."],
    [
      "Classification",
      "Attribution du niveau N1 a N5 selon l'intervalle du Score Global de Maturite.",
    ],
  ],
  [45, 133],
);
subtitle("Application des ponderations");
paragraph(
  "Les ponderations sont appliquees a deux niveaux. Le premier niveau concerne les poids intra-dimension des questions, par exemple 0,22 pour une question jugee plus structurante que d'autres. Le second niveau concerne les poids inter-dimensions, adaptes selon le secteur d'activite. Cette logique reprend l'esprit de la methode AHP presentee dans le memoire : certaines capacites sont plus critiques que d'autres selon le contexte.",
);
subtitle("Adaptation sectorielle");
paragraph(
  "L'adaptation sectorielle permet de tenir compte des priorites propres a chaque type d'organisation. Dans le secteur finance, par exemple, la gouvernance des donnees et la securite ont un poids plus eleve. Dans le secteur sante, la conformite et la qualite des donnees deviennent centrales. Dans l'industrie, l'infrastructure technologique prend davantage d'importance. Cette adaptation evite d'appliquer un modele uniforme a des organisations dont les contraintes sont differentes.",
);
table(
  ["Secteur", "Dimensions renforcees"],
  [
    ["Industrie", "Infrastructure technologique, qualite des donnees, transformation digitale."],
    ["Commerce", "Exploitation analytique, strategie digitale, securite."],
    ["Services", "Gouvernance, securite, exploitation analytique."],
    ["Sante", "Securite et conformite, qualite des donnees, gouvernance."],
    ["Finance", "Gouvernance, securite et conformite, qualite des donnees."],
  ],
  [40, 138],
);

title("3.3 Integration IA (si prevue)");
subtitle("Recommandations automatiques");
paragraph(
  "Dans l'etat actuel du MVP, les recommandations ne sont pas encore generees par un modele d'intelligence artificielle externe. Elles sont construites automatiquement a partir d'une table de correspondance entre chaque dimension et une recommandation prioritaire. Cette approche est volontairement controlee et justifiable dans un PFE, car elle garantit la coherence entre les lacunes identifiees et les referentiels normatifs utilises dans le memoire.",
);
paragraph(
  "Une integration IA peut etre prevue dans une version avancee. Elle pourrait enrichir les recommandations en generant des formulations adaptees au secteur, a la taille de l'entreprise et aux reponses critiques. Toutefois, pour conserver la rigueur scientifique, l'IA ne doit pas modifier le score. Elle doit intervenir uniquement comme couche de redaction et d'aide a l'interpretation.",
);
subtitle("Generation de rapports");
paragraph(
  "La generation de rapports est deja implementee dans l'application. Le composant Report.tsx presente un resume executif, des scores par dimension, un graphique radar, les lacunes critiques, les recommandations prioritaires et une roadmap. L'export PDF utilise jsPDF et html2canvas afin de transformer le rapport affiche a l'ecran en document partageable.",
);
bullet([
  "Rapport actuel : generation automatique basee sur les scores calcules.",
  "Amelioration possible : generation de commentaires textuels plus riches par IA, sous controle de prompts fixes.",
  "Precaution academique : distinguer clairement les calculs objectifs des textes generes automatiquement.",
]);

title("3.4 Experimentation");
paragraph(
  "L'experimentation a pour objectif de verifier que le modele produit des resultats coherents, interpretables et differenciants selon les profils d'entreprises. Elle doit egalement montrer que l'application peut etre utilisee dans un contexte reel ou semi-reel de diagnostic de maturite digitale et data. Pour un PFE, l'experimentation peut combiner des entreprises pilotes et des donnees simulees afin d'obtenir un nombre suffisant d'observations.",
);

subtitle("3.4.1 Jeu de donnees");
paragraph(
  "Le jeu de donnees experimental doit contenir les informations de classification, les 42 reponses de maturite, les scores dimensionnels, le Score Global de Maturite, le sous-score data, le sous-score digital et le niveau N1 a N5. La table Supabase scoring_test_submissions est adaptee a cette structure puisqu'elle stocke les reponses et les scores au format JSONB tout en conservant les champs numeriques utiles a l'analyse statistique.",
);
subtitle("Entreprises pilotes");
paragraph(
  "Les entreprises pilotes representent la forme de validation la plus pertinente. Idealement, l'echantillon doit inclure plusieurs secteurs : industrie, commerce, services, sante et finance. Meme un petit echantillon peut etre utile dans le cadre d'un PFE, a condition de presenter clairement ses limites et de l'utiliser comme validation exploratoire plutot que comme generalisation statistique.",
);
bullet([
  "PME de services avec faible formalisation data.",
  "Entreprise commerciale utilisant CRM ou BI basique.",
  "Organisation industrielle avec besoins forts en integration SI.",
  "Entreprise reglementee, par exemple sante ou finance, pour tester la dimension securite/conformite.",
]);
subtitle("Donnees simulees");
paragraph(
  "Les donnees simulees completent les entreprises pilotes lorsque le nombre de reponses reelles est insuffisant. Elles permettent de tester les cas extremes, par exemple une entreprise tres immature, une organisation intermediaire et une organisation avancee. Ces donnees doivent etre declarees comme simulees afin de respecter la rigueur academique.",
);

subtitle("3.4.2 Analyse statistique des scores");
paragraph(
  "L'analyse statistique vise a transformer les resultats individuels en observations exploitables. Elle peut etre realisee a partir des donnees stockees dans Supabase, puis exportee vers un tableur, Python, R ou un notebook d'analyse. Cette partie permet de montrer que l'application ne produit pas seulement un rapport individuel, mais peut aussi soutenir une lecture globale de la maturite digitale et data d'un echantillon d'entreprises.",
);
subtitle("Distribution");
paragraph(
  "La distribution des scores permet d'observer la repartition des entreprises par niveau de maturite. Elle peut etre representee par histogramme du Score Global de Maturite ou par diagramme en barres des niveaux N1 a N5. Une concentration en N1 ou N2 confirmerait l'hypothese d'une maturite encore faible, tandis qu'une dispersion plus large montrerait l'heterogeneite du tissu economique et sectoriel.",
);
subtitle("Moyenne");
paragraph(
  "La moyenne du score global donne une mesure synthetique du niveau de maturite de l'echantillon. Elle peut etre completee par la moyenne des scores par dimension. Par exemple, une moyenne faible en D1 et D2 indiquerait un manque de gouvernance et de qualite des donnees, meme si certaines entreprises disposent deja d'outils numeriques.",
);
subtitle("Ecart-type");
paragraph(
  "L'ecart-type mesure la dispersion des scores. Un ecart-type faible signifie que les entreprises etudiees se ressemblent en termes de maturite. Un ecart-type eleve indique au contraire des profils tres differents, ce qui justifie une adaptation sectorielle et des recommandations personnalisees.",
);
subtitle("Segmentation");
paragraph(
  "La segmentation peut etre realisee par secteur, taille d'entreprise, presence d'une fonction IT, donnees reglementees ou systemes utilises. Elle permet d'identifier les groupes les plus avances et les groupes les plus fragiles. Dans le contexte tunisien, cette analyse peut mettre en evidence les differences entre PME, grandes entreprises, secteurs reglementes et organisations encore peu structurees numeriquement.",
);

subtitle("3.4.3 Interpretation");
subtitle("Correlations");
paragraph(
  "L'etude des correlations permet d'examiner les relations entre dimensions. Par exemple, une correlation positive entre gouvernance des donnees et exploitation analytique indiquerait que les entreprises mieux organisees sur la gouvernance tirent plus facilement de la valeur de leurs donnees. Une relation entre fonction IT identifiee et infrastructure technologique pourrait egalement confirmer l'importance des competences internes.",
);
subtitle("Identification des faiblesses frequentes");
paragraph(
  "L'identification des faiblesses frequentes consiste a repérer les questions ou dimensions qui obtiennent regulierement les scores les plus faibles. Dans ce type de projet, les faiblesses attendues concernent souvent la gouvernance data, la qualite des donnees, la mesure du ROI analytique, l'absence de catalogue de donnees et la faible formalisation des pratiques de securite.",
);
bullet([
  "Faiblesses data : absence de politique de gouvernance, manque de KPIs de qualite, donnees dispersees.",
  "Faiblesses technologiques : integrations limitees, dependance a Excel, absence de data warehouse.",
  "Faiblesses culturelles : faible autonomie analytique, peu de formations data, manque de rituels de pilotage.",
  "Faiblesses digitales : strategie digitale non formalisee, KPIs digitaux absents, innovation limitee.",
]);
subtitle("Discussion critique");
paragraph(
  "Les resultats experimentaux doivent etre interpretes avec prudence. Le modele repose sur un questionnaire d'auto-evaluation, ce qui peut introduire des biais de perception. De plus, un echantillon reduit ne permet pas de generaliser les resultats a l'ensemble des entreprises tunisiennes. Cependant, l'approche reste pertinente pour un PFE, car elle demontre la faisabilite d'un outil de diagnostic structure, fonde sur des referentiels reconnus et adaptable a plusieurs secteurs.",
);
paragraph(
  "La principale limite technique actuelle est que le scoring est calcule cote application et non encore cote backend. Pour une version plus robuste, il faudrait persister automatiquement chaque evaluation dans Supabase, ajouter un endpoint serveur ou une Edge Function pour recalculer le score, renforcer les politiques RLS, puis construire un tableau de bord statistique pour exploiter les resultats collectes.",
);

title("Conclusion du chapitre");
paragraph(
  "Ce chapitre montre que le modele theorique de maturite digitale et data a ete transpose en application fonctionnelle. L'implementation actuelle correspond a un MVP coherent avec le cadre d'un projet de fin d'etudes : elle valide le parcours utilisateur, le questionnaire, le moteur de calcul, le rapport et la connexion initiale au backend Supabase. Les prochaines evolutions doivent porter sur la persistance complete des evaluations, l'analyse statistique des resultats et l'enrichissement controle des recommandations.",
);

footer();
doc.save(outputPath);

const stats = fs.statSync(outputPath);
console.log(`${outputPath} (${stats.size} bytes)`);
