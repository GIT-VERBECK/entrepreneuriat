import { useEffect, useMemo, useState } from 'react'
import { CourseLayout } from './components/CourseLayout'
import { Icon } from './components/Icon'
import { images, pageMeta, searchSections } from './data/course'
import './App.css'

const routes = Object.keys(pageMeta)

function normalizeRoute(hash) {
  const cleaned = hash.replace(/^#\/?/, '')
  const [pageId = 'accueil', sectionId = ''] = cleaned.split('/')

  return {
    pageId: routes.includes(pageId) ? pageId : 'accueil',
    sectionId,
  }
}

function makeHash(pageId, sectionId) {
  return `#/${pageId}${sectionId ? `/${sectionId}` : ''}`
}

function SectionTitle({ number, title, id }) {
  return (
    <div className="mb-6 flex items-center gap-3" id={id}>
      {number && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container font-bold text-on-secondary-container">
          {number}
        </span>
      )}
      <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
    </div>
  )
}

function Hero({ eyebrow, title, subtitle, image, compact = false }) {
  return (
    <section
      className={`relative overflow-hidden bg-primary-container ${
        compact ? 'h-72 rounded-xl' : 'h-[420px]'
      } flex items-center px-gutter`}
    >
      {image && (
        <div className="absolute inset-0 opacity-40">
          <img alt="" className="h-full w-full object-cover" src={image} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
      <div className="relative z-10 max-w-4xl">
        <span className="mb-4 block font-label-md text-label-md uppercase tracking-widest text-secondary-fixed">
          {eyebrow}
        </span>
        <h1 className="font-display-lg text-display-lg leading-tight text-white">{title}</h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl font-body-lg text-body-lg text-primary-fixed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function HomePage({ onNavigate }) {
  return (
    <div className="mx-auto w-full max-w-[1140px] px-gutter py-margin">
      <Hero
        compact
        eyebrow="Module 1 : Fondamentaux"
        image={images.homeHero}
        subtitle={pageMeta.accueil.subtitle}
        title={pageMeta.accueil.title}
      />

      <section className="reading-container my-16" id="intro-cours">
        <SectionTitle number="1" title="Introduction au Cours" />
        <blockquote className="mb-8 border-l-4 border-secondary-fixed bg-surface-container-low py-3 pl-6 font-headline-sm text-body-lg italic text-on-surface-variant">
          "Le cours d’entrepreneuriat est destiné à former l’étudiant à la création, à la gestion et au
          développement des projets entrepreneuriaux..."
        </blockquote>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Cette formation offre les outils méthodologiques nécessaires pour appréhender le monde des
          affaires. Au-delà de la théorie, elle cultive un esprit d'innovation et une capacité
          d'analyse critique.
        </p>
      </section>

      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Icon className="text-3xl text-primary">track_changes</Icon>
            <h3 className="font-headline-sm text-headline-sm text-primary">Objectifs Pédagogiques</h3>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              "Comprendre les enjeux de la création d'entreprise.",
              'Acquérir les bases de la gestion de projet.',
              "Évaluer la faisabilité d'un modèle économique.",
              'Structurer une stratégie de lancement efficace.',
            ].map((item) => (
              <div className="flex gap-3" key={item}>
                <Icon className="text-tertiary">check_circle</Icon>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-primary text-on-primary">
          <Icon className="mb-5 text-4xl text-secondary-fixed">psychology</Icon>
          <h3 className="mb-4 font-headline-sm text-headline-sm">Compétences attendues</h3>
          <p className="text-on-primary/80">
            Analyser des situations complexes et utiliser un vocabulaire adapté au monde de
            l'entreprise.
          </p>
        </Card>
      </section>

      <section className="mb-16">
        <h3 className="mb-8 text-center font-headline-sm text-headline-sm text-primary">
          Explorez les modules de synthèse
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            ['chapitre-2', 'Étude de Marché', 'Validez vos hypothèses auprès de vos futurs clients.'],
            ['chapitre-3', 'Business Model', 'Structurez votre proposition de valeur et vos revenus.'],
            ['chapitre-4', 'Business Plan', 'Convainquez, pilotez et concluez votre projet.'],
          ].map(([pageId, title, text]) => (
            <button
              className="group rounded-xl border border-outline-variant bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-primary"
              key={pageId}
              type="button"
              onClick={() => onNavigate(pageId)}
            >
              <span className="font-label-md text-caption text-secondary">
                {pageMeta[pageId].label}
              </span>
              <h4 className="mt-2 font-headline-sm text-headline-sm text-primary">{title}</h4>
              <p className="mt-3 text-on-surface-variant">{text}</p>
              <span className="mt-5 flex items-center gap-2 font-bold text-primary">
                Explorer <Icon>chevron_right</Icon>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function ChapterOne({ onNavigate, forceDetailsOpen = false }) {
  const traits = ['Résilience', "Tolérance à l'ambiguïté", 'Auto-efficacité', 'Créativité', 'Leadership', "Sens de l'éthique"]

  return (
    <article className="mx-auto max-w-[900px] px-gutter py-margin">
      <div className="mb-12 border-b border-outline-variant pb-8">
        <p className="mb-2 font-label-md text-label-md font-bold uppercase tracking-widest text-secondary">
          Chapitre I
        </p>
        <h1 className="font-display-lg text-display-lg text-primary">LE CHAMP DE L'ENTREPRENEURIAT</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-on-surface-variant">
          <span className="flex items-center gap-1"><Icon>history_edu</Icon>Module Fondamental</span>
          <span className="flex items-center gap-1"><Icon>schedule</Icon>25 min de lecture</span>
        </div>
      </div>

      <div className="reading-container">
        <section className="mb-16" id="origines">
          <SectionTitle title="2. Origines de l'Entrepreneuriat" />
          <p className="font-body-lg text-body-lg">
            L'étymologie du terme « entrepreneur » remonte au XIIe siècle. Avec Richard Cantillon, le
            concept prend une dimension économique : l'entrepreneur achète à un prix certain pour
            revendre à un prix incertain, assumant ainsi un risque financier.
          </p>
        </section>

        <section className="mb-16" id="definition">
          <SectionTitle title="3. Définition de l'Entrepreneuriat" />
          <Card>
            <p className="font-body-lg text-body-lg italic">
              « L'entrepreneuriat est l'action de créer de la valeur par la mobilisation de ressources
              pour exploiter une opportunité identifiée dans un environnement donné. »
            </p>
          </Card>
          <p className="mt-6">
            Cette définition englobe la création d'organisations et l'innovation dans les structures
            existantes. Elle repose sur l'individu, l'opportunité et le contexte.
          </p>
        </section>

        <div className="relative mb-16 h-64 overflow-hidden rounded-xl">
          <img alt="" className="h-full w-full object-cover grayscale" src={images.chapter1} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
          <p className="absolute bottom-6 left-6 font-headline-sm text-headline-sm text-white">
            La vision au cœur de l'action
          </p>
        </div>

        <section className="mb-16" id="paradigmes">
          <SectionTitle title="4. Les Paradigmes de l'Entrepreneuriat" />
          <div className="space-y-4">
            {[
              ["L'opportunité d'affaires", 'Détecter, évaluer et exploiter des occasions de profit.'],
              ["La création d'organisation", 'Structurer un nouvel ensemble de ressources.'],
              ['La création de valeur', 'Transformer économiquement et socialement une situation.'],
              ["L'innovation", 'Mettre en œuvre de nouvelles combinaisons de facteurs de production.'],
            ].map(([title, text]) => (
              <div className="flex gap-4" key={title}>
                <Icon filled className="text-secondary">check_circle</Icon>
                <div>
                  <strong className="block text-primary">{title}</strong>
                  <p className="text-on-surface-variant">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16" id="formes">
          <SectionTitle title="12. Les Formes d'Entrepreneuriat" />
          <div className="space-y-4">
            {['Entrepreneuriat Ex Nihilo', "L'Intrapreneuriat", 'Entrepreneuriat Social', "Reprise d'Entreprise"].map(
              (title) => (
                <details
                  className="overflow-hidden rounded-lg border border-outline-variant"
                  key={title}
                  open={forceDetailsOpen || undefined}
                >
                  <summary className="flex cursor-pointer items-center justify-between bg-surface-container-low p-4 font-bold text-primary">
                    {title}
                    <Icon>expand_more</Icon>
                  </summary>
                  <p className="bg-white p-4 text-on-surface-variant">
                    Une modalité entrepreneuriale adaptée à un contexte, un niveau de ressources et une
                    intention stratégique spécifique.
                  </p>
                </details>
              ),
            )}
          </div>
        </section>

        <section className="mb-16">
          <SectionTitle title="8. Les Caractéristiques de l'Entrepreneur" />
          <div className="flex flex-wrap gap-base">
            {traits.map((trait) => (
              <span className="rounded-full bg-surface-container-high px-4 py-2 font-label-md text-label-md" key={trait}>
                {trait}
              </span>
            ))}
          </div>
        </section>

        <div className="flex justify-between border-t border-outline-variant pt-8">
          <button className="flex items-center gap-2 text-on-surface-variant" type="button" onClick={() => onNavigate('accueil')}>
            <Icon>arrow_back</Icon> Accueil
          </button>
          <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-on-primary" type="button" onClick={() => onNavigate('chapitre-2')}>
            Module Suivant <Icon>arrow_forward</Icon>
          </button>
        </div>
      </div>
    </article>
  )
}

function ChapterTwo() {
  return (
    <article className="mx-auto max-w-[900px] px-gutter py-margin">
      <div className="reading-container">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-2 font-label-md text-secondary">
            <Icon>menu_book</Icon>
            <span className="uppercase tracking-widest">Module Académique</span>
          </div>
          <h1 className="mb-6 font-display-lg text-display-lg text-primary">
            CHAPITRE II : L'ENTREPRISE ET SON ENVIRONNEMENT
          </h1>
          <div className="mb-8 h-1 w-24 bg-secondary" />
          <p className="font-body-lg text-body-lg italic text-on-surface-variant">
            Comprendre la structure fondamentale de l'organisation et les forces dynamiques qui
            l'entourent, avec un focus sur l'écosystème de la République Démocratique du Congo.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card id="notion-entreprise">
            <SectionTitle number="13" title="La Notion d'Entreprise" />
            <p>
              L'entreprise est une <strong>unité économique</strong> et juridique produisant des biens
              et services destinés à être vendus sur un marché pour réaliser un profit.
            </p>
            <blockquote className="my-6 border-l-4 border-secondary py-2 pl-4 italic">
              "L'entreprise n'est pas seulement une machine à profit, c'est une cellule sociale
              vivante au cœur de la cité."
            </blockquote>
            <ul className="space-y-3">
              <li className="flex gap-3"><Icon>check_circle</Icon><span><strong>Finalité économique :</strong> création de valeur ajoutée.</span></li>
              <li className="flex gap-3"><Icon>check_circle</Icon><span><strong>Finalité sociale :</strong> création d'emplois et distribution de revenus.</span></li>
            </ul>
          </Card>
          <Card id="classification">
            <SectionTitle number="14" title="Classification des Entreprises" />
            {['Selon la taille : TPE, PME, ETI et Grandes Entreprises.', "Selon le secteur : primaire, secondaire, tertiaire.", 'Selon la forme juridique : entreprise individuelle, SARL, SA, coopérative.'].map((item) => (
              <div className="mb-4 border-l-4 border-primary bg-surface p-4" key={item}>
                <p>{item}</p>
              </div>
            ))}
          </Card>
        </div>

        <section className="mb-16" id="environnement">
          <SectionTitle number="15" title="L'Environnement de l'Entreprise" />
          <p className="mb-8">
            L'entreprise évolue dans un système complexe d'interactions constantes. Trois niveaux
            d'analyse guident le stratège.
          </p>
          <div className="space-y-6">
            {[
              ['groups', 'Micro-environnement', 'Clients, fournisseurs, concurrents, banques et syndicats.'],
              ['hub', 'Méso-environnement', "Acteurs d'une même filière ou d'un même secteur géographique."],
              ['public', 'Macro-environnement (PESTEL)', 'Tendances politiques, économiques, sociales, technologiques, écologiques et légales.'],
            ].map(([icon, title, text]) => (
              <Card className="flex flex-col gap-5 md:flex-row" key={title}>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-container">
                  <Icon className="text-4xl text-white">{icon}</Icon>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-primary">{title}</h3>
                  <p className="text-on-surface-variant">{text}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="relative mb-16 h-80 overflow-hidden rounded-2xl">
          <img alt="" className="h-full w-full object-cover" src={images.chapter2} />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 to-transparent p-10">
            <h2 className="font-headline-md text-headline-md text-white">
              Focus Stratégique : Le Marché Congolais
            </h2>
          </div>
        </div>

        <section className="mb-16" id="rdc">
          <SectionTitle number="16" title="Le Contexte Spécifique de la RDC" />
          <Card className="bg-surface-container-high">
            {[
              ['gavel', 'Climat des affaires et réformes', "L'OHADA harmonise le droit des affaires malgré des défis judiciaires."],
              ['trending_up', 'Secteur informel prédominant', "Une large part de l'économie reste non structurée."],
              ['account_balance', 'Accès au financement', 'Le coût du crédit et les garanties restent des barrières majeures.'],
              ['diamond', 'Ressources vs Infrastructures', 'Un potentiel naturel immense face à des défis logistiques et énergétiques.'],
            ].map(([icon, title, text]) => (
              <div className="mb-6 flex gap-4" key={title}>
                <Icon className="text-secondary">{icon}</Icon>
                <div>
                  <h4 className="font-bold text-primary">{title}</h4>
                  <p className="text-on-surface-variant">{text}</p>
                </div>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </article>
  )
}

function ChapterThree({ onNavigate }) {
  return (
    <>
      <Hero
        eyebrow="Module Académique"
        image={images.chapter3Hero}
        subtitle={pageMeta['chapitre-3'].subtitle}
        title="CHAPITRE III : PROCESSUS DE CRÉATION D'UNE ENTREPRISE"
      />
      <article className="px-gutter py-margin">
        <div className="mx-auto max-w-5xl space-y-16">
          <section className="reading-container" id="prealables">
            <SectionTitle number="17" title="Les préalables à la création" />
            <Card>
              <p>
                Avant de se lancer, il est crucial d'évaluer ses motivations, ses capacités et
                l'adéquation entre la personne et le projet.
              </p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="border-l-4 border-secondary pl-4">
                  <h4 className="font-label-md text-label-md uppercase text-secondary">Bilan Personnel</h4>
                  <p className="text-on-surface-variant">Compétences, résilience et ressources financières.</p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h4 className="font-label-md text-label-md uppercase text-secondary">Contraintes</h4>
                  <p className="text-on-surface-variant">Engagements familiaux et limites temporelles.</p>
                </div>
              </div>
            </Card>
          </section>

          <section id="idee">
            <SectionTitle number="18" title="L'idée de création" />
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-primary text-white md:col-span-2">
                <Icon className="mb-4 text-4xl text-secondary-fixed">lightbulb</Icon>
                <h3 className="mb-4 font-headline-sm text-headline-sm">Genèse de l'opportunité</h3>
                <p>
                  L'idée naît d'une observation, d'une lacune sur le marché ou d'une innovation. Elle
                  devient opportunité lorsqu'elle répond à un besoin réel.
                </p>
              </Card>
              <Card>
                <h4 className="mb-4 font-bold text-primary">Sources d'idées</h4>
                <ul className="space-y-3">
                  {['Expérience professionnelle', "Observation de l'environnement", "Application d'un concept existant"].map((item) => (
                    <li className="flex gap-3" key={item}><Icon className="text-tertiary">check_circle</Icon>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>

          <section className="reading-container" id="etude-commerciale">
            <SectionTitle number="19" title="L'étude commerciale (Étude de marché)" />
            <p>
              Cette étape confronte l'idée à la réalité du terrain : clientèle, concurrence, prix,
              distribution et communication.
            </p>
            <div className="mt-6 space-y-4">
              {['La Clientèle', 'La Concurrence', "L'Offre"].map((item) => (
                <Card className="flex items-start gap-4" key={item}>
                  <Icon className="text-secondary">query_stats</Icon>
                  <div>
                    <strong>{item}</strong>
                    <p className="text-on-surface-variant">Analyse structurée pour valider le potentiel commercial.</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-primary px-gutter py-margin text-white" id="etude-technique">
            <SectionTitle number="20" title="L'étude technique" />
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p>
                  Elle détermine les moyens matériels et humains nécessaires pour produire dans les
                  conditions de qualité et de coût définies.
                </p>
                <ul className="mt-6 space-y-4">
                  {['Équipements et outils de production.', 'Matières premières et stocks.', 'Compétences humaines.'].map((item) => (
                    <li className="flex gap-3" key={item}><Icon className="text-secondary-fixed">factory</Icon>{item}</li>
                  ))}
                </ul>
              </div>
              <img alt="" className="aspect-video rounded-xl object-cover shadow-2xl" src={images.chapter3Tech} />
            </div>
          </section>

          <section className="reading-container" id="etude-financiere">
            <SectionTitle number="21" title="L'étude financière" />
            <div className="grid gap-4 sm:grid-cols-2">
              {['Plan de Financement', 'Compte de Résultat', 'Plan de Trésorerie', 'Seuil de Rentabilité'].map((item) => (
                <Card className="border-t-4 border-tertiary" key={item}>
                  <h4 className="font-bold text-primary">{item}</h4>
                  <p className="mt-2 text-on-surface-variant">Un outil de prévision et de décision financière.</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="reading-container" id="formalisation">
            <SectionTitle number="22" title="La formalisation de l'entreprise" />
            <Card>
              <p>
                La dernière étape donne une existence juridique à l'entreprise : statuts, capital
                social et immatriculation.
              </p>
              <button
                className="mt-8 rounded-full bg-secondary-container px-8 py-3 font-bold text-on-secondary-container"
                type="button"
                onClick={() => onNavigate('chapitre-4')}
              >
                Valider les acquis du Chapitre III
              </button>
            </Card>
          </section>
        </div>
      </article>
    </>
  )
}

function ChapterFour({ onNavigate }) {
  return (
    <article className="mx-auto max-w-[1140px] px-gutter py-margin">
      <Hero compact eyebrow="Module de Synthèse Final" image={images.chapter4} title="CHAPITRE IV : LE BUSINESS PLAN" />
      <div className="reading-container mt-12 space-y-12">
        <Card id="role-business-plan">
          <SectionTitle title="Section 23 - Le Rôle du Business Plan" />
          <p>
            Le Business Plan formalise la vision stratégique. Il sert à piloter le projet en interne
            et à convaincre banquiers, investisseurs et partenaires.
          </p>
          <blockquote className="mt-6 border-l-4 border-secondary-fixed py-2 pl-6 italic">
            "Un Business Plan n'est pas une prédiction du futur, mais un cadre pour réagir au présent
            avec agilité."
          </blockquote>
        </Card>

        <section id="piliers-business-plan">
          <SectionTitle title="Section 24 - Les 5 Piliers d'un BP Gagnant" />
          <div className="grid gap-4 md:grid-cols-6">
            {[
              ['person_celebrate', "L'Executive Summary", 'La vitrine du projet.'],
              ['groups', "L'Équipe", 'La complémentarité des profils.'],
            ].map(([icon, title, text]) => (
              <Card className="md:col-span-3" key={title}>
                <Icon className="mb-4 text-4xl text-primary">{icon}</Icon>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-on-surface-variant">{text}</p>
              </Card>
            ))}
            <Card className="bg-primary-container text-white md:col-span-4">
              <Icon className="mb-4 text-4xl text-secondary-fixed">query_stats</Icon>
              <h3 className="mb-4 text-2xl font-bold">La Stratégie &amp; Le Marché</h3>
              <p>SWOT, positionnement concurrentiel, proposition de valeur et plan commercial.</p>
            </Card>
            <Card className="bg-secondary-container text-center text-on-secondary-container md:col-span-2">
              <Icon className="mb-4 text-5xl">account_balance_wallet</Icon>
              <h3 className="font-bold">Le Financier</h3>
              <p className="mt-2">Prévisionnels, trésorerie et rentabilité.</p>
            </Card>
          </div>
        </section>

        <Card id="conclusion">
          <SectionTitle title="Section 25 - Conclusion Générale" />
          <p>
            La réussite dépend moins de l'idée seule que de l'exécution, de la persévérance et de la
            capacité à apprendre du terrain.
          </p>
          <div className="mt-6 space-y-4">
            {["L'Agilité face au marché", 'La Rigueur financière', "L'Humain au cœur des décisions"].map((item, index) => (
              <div className="flex items-center gap-4 rounded-lg bg-surface p-4" key={item}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container font-bold text-on-tertiary-container">
                  {index + 1}
                </span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        <section className="rounded-2xl bg-primary p-8 text-on-primary shadow-xl">
          <h3 className="mb-4 font-headline-sm text-headline-sm text-secondary-fixed">
            Résumé ultra-court à retenir
          </h3>
          <p className="border-l-4 border-tertiary-fixed pl-6 font-body-lg text-body-lg">
            L'entrepreneuriat, c'est transformer un <strong className="text-secondary-fixed">problème</strong> en{' '}
            <strong className="text-tertiary-fixed">solution durable</strong> grâce à une étude de
            marché sérieuse, un modèle économique viable et un business plan structuré.
          </p>
        </section>

        <div className="flex flex-col items-center py-8">
          <button
            className="flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-lg font-bold text-on-secondary"
            type="button"
            onClick={() => onNavigate('certificat')}
          >
            Valider le Cours &amp; Certifier
            <Icon filled>workspace_premium</Icon>
          </button>
          <p className="mt-4 font-caption text-caption italic text-on-surface-variant">
            Vous avez terminé l'intégralité des modules théoriques.
          </p>
        </div>
      </div>
    </article>
  )
}

function CertificatePage() {
  return (
    <article className="mx-auto max-w-[1100px] px-gutter py-margin">
      <section className="certificate-card relative overflow-hidden rounded-2xl border border-outline-variant bg-white p-8 shadow-xl md:p-14">
        <div className="absolute inset-x-0 top-0 h-3 bg-secondary" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary-container/60" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary-container/10" />

        <div className="relative z-10 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl">
            <Icon filled className="text-5xl">workspace_premium</Icon>
          </div>

          <p className="font-label-md text-label-md uppercase tracking-[0.28em] text-secondary">
            Certificat de réussite
          </p>
          <h1 className="mt-4 font-display-lg text-display-lg text-primary">Entrepreneuriat</h1>
          <p className="mx-auto mt-6 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Ce certificat atteste que le participant a complété et validé le parcours de synthèse en
            entrepreneuriat, couvrant les fondements, l'environnement de l'entreprise, le processus de
            création et le Business Plan.
          </p>

          <div className="my-12 border-y border-outline-variant py-10">
            <p className="font-caption text-caption uppercase tracking-widest text-on-surface-variant">
              Décerné à
            </p>
            <h2 className="mt-3 font-display-lg text-[42px] font-bold leading-tight text-primary md:text-[56px]">
              JEAN-MARC VERBECK
            </h2>
          </div>

          <div className="grid gap-6 text-left md:grid-cols-3">
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="font-caption text-caption uppercase text-on-surface-variant">Cours</p>
              <p className="mt-2 font-label-md text-label-md font-bold text-primary">
                Synthèse générale d'entrepreneuriat
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="font-caption text-caption uppercase text-on-surface-variant">Date</p>
              <p className="mt-2 font-label-md text-label-md font-bold text-primary">08 mai 2026</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="font-caption text-caption uppercase text-on-surface-variant">Référence</p>
              <p className="mt-2 font-label-md text-label-md font-bold text-primary">EA-JMV-2026-0508</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-8 border-t border-outline-variant pt-8 md:flex-row">
            <div className="text-center md:text-left">
              <p className="font-headline-sm text-headline-sm text-primary">Institut Supérieur d'Entrepreneuriat</p>
              <p className="font-caption text-caption text-on-surface-variant">Validation académique du parcours</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 h-px w-48 bg-primary" />
              <p className="font-label-md text-label-md font-bold text-primary">Direction académique</p>
            </div>
          </div>
        </div>
      </section>

      <div className="no-print mt-8 flex justify-center">
        <button
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-on-primary"
          type="button"
          onClick={() => window.print()}
        >
          <Icon>download</Icon>
          Télécharger le certificat
        </button>
      </div>
    </article>
  )
}

function FullCourse({ onNavigate }) {
  return (
    <div className="course-print-book">
      <section className="course-print-page print-cover-page">
        <div className="mx-auto flex min-h-[88vh] max-w-[900px] flex-col justify-between px-gutter py-margin">
          <div className="text-center">
            <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon filled className="text-5xl">school</Icon>
            </div>
            <p className="font-label-md text-label-md uppercase tracking-[0.28em] text-secondary">
              Support de cours
            </p>
            <h1 className="mt-5 font-display-lg text-display-lg text-primary">Entrepreneuriat</h1>
            <p className="mx-auto mt-6 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Synthèse générale : fondements, environnement de l'entreprise, processus de création
              et Business Plan.
            </p>
          </div>

          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-outline-variant bg-white p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="font-caption text-caption uppercase text-on-surface-variant">Préparé pour</p>
                <p className="mt-1 font-label-md text-label-md font-bold text-primary">JEAN-MARC VERBECK</p>
              </div>
              <div>
                <p className="font-caption text-caption uppercase text-on-surface-variant">Date</p>
                <p className="mt-1 font-label-md text-label-md font-bold text-primary">08 mai 2026</p>
              </div>
              <div>
                <p className="font-caption text-caption uppercase text-on-surface-variant">Institution</p>
                <p className="mt-1 font-label-md text-label-md font-bold text-primary">
                  Institut Supérieur d'Entrepreneuriat
                </p>
              </div>
              <div>
                <p className="font-caption text-caption uppercase text-on-surface-variant">Référence</p>
                <p className="mt-1 font-label-md text-label-md font-bold text-primary">EA-COURS-2026</p>
              </div>
            </div>
          </div>

          <div className="text-center font-caption text-caption text-on-surface-variant">
            Document généré depuis l'application Entrepreneuriat
          </div>
        </div>
      </section>
      <section className="course-print-page">
        <HomePage onNavigate={onNavigate} />
      </section>
      <section className="course-print-page">
        <ChapterOne forceDetailsOpen onNavigate={onNavigate} />
      </section>
      <section className="course-print-page">
        <ChapterTwo />
      </section>
      <section className="course-print-page">
        <ChapterThree onNavigate={onNavigate} />
      </section>
      <section className="course-print-page">
        <ChapterFour onNavigate={onNavigate} />
      </section>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.hash))
  const [query, setQuery] = useState('')
  const [printAll, setPrintAll] = useState(false)

  const currentMeta = pageMeta[route.pageId]

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (normalized.length < 2) return []

    return searchSections
      .filter((section) => `${section.title} ${section.text}`.toLowerCase().includes(normalized))
      .slice(0, 8)
      .map((section) => ({
        ...section,
        pageTitle: pageMeta[section.pageId].title,
      }))
  }, [query])

  const navigate = (pageId, sectionId = '') => {
    window.location.hash = makeHash(pageId, sectionId)
  }

  const downloadPdf = () => {
    setPrintAll(true)
  }

  useEffect(() => {
    const handleHashChange = () => setRoute(normalizeRoute(window.location.hash))

    window.addEventListener('hashchange', handleHashChange)
    if (!window.location.hash) navigate('accueil')

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    document.title = `${currentMeta.label} - Entrepreneuriat`

    window.setTimeout(() => {
      if (route.sectionId) {
        document.getElementById(route.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }, 0)
  }, [currentMeta.label, route.pageId, route.sectionId])

  useEffect(() => {
    if (!printAll) return undefined

    const handleAfterPrint = () => {
      delete document.body.dataset.printingCourse
      setPrintAll(false)
      document.title = `${currentMeta.label} - Entrepreneuriat`
    }

    window.addEventListener('afterprint', handleAfterPrint)
    document.title = 'Cours complet - Entrepreneuriat'

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.print())
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [currentMeta.label, printAll])

  const page = {
    accueil: <HomePage onNavigate={navigate} />,
    'chapitre-1': <ChapterOne onNavigate={navigate} />,
    'chapitre-2': <ChapterTwo />,
    'chapitre-3': <ChapterThree onNavigate={navigate} />,
    'chapitre-4': <ChapterFour onNavigate={navigate} />,
    certificat: <CertificatePage />,
  }[route.pageId]

  return (
    <CourseLayout
      currentPageId={route.pageId}
      query={query}
      results={results}
      setQuery={setQuery}
      onDownloadPdf={downloadPdf}
      onNavigate={navigate}
    >
      {printAll ? <FullCourse onNavigate={navigate} /> : page}
    </CourseLayout>
  )
}

export default App
