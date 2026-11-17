import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  ShowcasePointer,
  type CursorConfig,
  type CursorPress,
  type ShowcasePointerHandle,
} from '@/components/reactdrops/showcase-pointer';
import './ShowcaseStory.css';
import { useEffectsLevel } from '@/lib/effects';

/**
 * Récit « Une idée. Plusieurs expertises. Un seul interlocuteur. »
 * Tableau de bord FICTIF animé par les vrais curseurs ReactDrops « Showcase Pointer ».
 * Les comportements select / drag / together sont internes au scénario : aucun bouton ne les expose.
 */

type Column = 'todo' | 'doing' | 'done';
type Task = { id: string; title: string; owner: 'Design' | 'Dev' | 'Com'; column: Column };

const INITIAL_TASKS: Task[] = [
  { id: 'maquette', title: 'Maquette de l’accueil', owner: 'Design', column: 'doing' },
  { id: 'integration', title: 'Intégration responsive', owner: 'Dev', column: 'todo' },
  { id: 'textes', title: 'Textes & SEO', owner: 'Com', column: 'doing' },
  { id: 'formulaire', title: 'Formulaire de réservation', owner: 'Dev', column: 'todo' },
];
const INITIAL_HEADLINE = 'Bienvenue sur notre nouveau site';
const FINAL_HEADLINE = 'Des soirées qui marquent.';

const COLUMNS: { id: Column; label: string }[] = [
  { id: 'todo', label: 'À faire' },
  { id: 'doing', label: 'En cours' },
  { id: 'done', label: 'Livré' },
];

const CHAPTERS = [
  { id: 'design', who: 'Design', text: 'repère un titre trop vague, ajuste la couleur d’accent et livre la maquette.' },
  { id: 'dev', who: 'Développement', text: 'prend l’intégration et le formulaire, puis les livre dès la maquette validée.' },
  { id: 'com', who: 'Communication', text: 'réécrit le message pour qu’il parle à la cible et finalise les textes.' },
  { id: 'together', who: 'Ensemble', text: 'les trois expertises se retrouvent : le projet est mis en ligne.' },
] as const;
type ChapterId = (typeof CHAPTERS)[number]['id'];

/** Petites « portes » pour synchroniser les scripts parallèles des curseurs. */
function createGates() {
  const map = new Map<string, { promise: Promise<void>; open: () => void }>();
  const get = (name: string) => {
    let g = map.get(name);
    if (!g) {
      let open = () => {};
      const promise = new Promise<void>((resolve) => (open = resolve));
      g = { promise, open };
      map.set(name, g);
    }
    return g;
  };
  return { wait: (n: string) => get(n).promise, open: (n: string) => get(n).open() };
}

export default function ShowcaseStory() {
  const pointer = useRef<ShowcasePointerHandle>(null);
  const columnsRef = useRef<Record<Column, HTMLDivElement | null>>({ todo: null, doing: null, done: null });
  const gates = useRef(createGates());
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [headline, setHeadline] = useState(INITIAL_HEADLINE);
  const [copy, setCopy] = useState('');
  const [accent, setAccent] = useState<'mist' | 'iris'>('mist');
  const [launched, setLaunched] = useState(false);
  const [chapter, setChapter] = useState<ChapterId | null>(null);
  const [done, setDone] = useState(false);
  const [reducedMotion, setReduced] = useState(false);
  // Mode allégé (appareil modeste) : même traitement que « réduire les animations », le tableau s'affiche terminé.
  const level = useEffectsLevel();
  const reduced = reducedMotion || level === 'lite';
  const [run, setRun] = useState(0);
  // Petits écrans : curseurs plus petits et positions finales ramenées à l'intérieur du tableau.
  const [compact, setCompact] = useState(false);
  // Les curseurs ne démarrent qu'une fois le format d'écran connu (pas de redémarrage du scénario).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const c = window.matchMedia('(max-width: 760px)');
    const on = () => setCompact(c.matches);
    on();
    setMounted(true);
    c.addEventListener('change', on);
    return () => c.removeEventListener('change', on);
  }, []);

  const moveTask = useCallback((id: string, column: Column) => {
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, column } : t)));
  }, []);

  const reset = useCallback(() => {
    gates.current = createGates();
    setTasks(INITIAL_TASKS);
    setHeadline(INITIAL_HEADLINE);
    setCopy('');
    setAccent('mist');
    setLaunched(false);
    setChapter(null);
    setDone(false);
  }, []);

  // État final direct si l'utilisateur préfère réduire les animations.
  useEffect(() => {
    if (!reduced) return;
    setTasks(INITIAL_TASKS.map((t) => ({ ...t, column: 'done' })));
    setHeadline(FINAL_HEADLINE);
    setCopy(FINAL_HEADLINE);
    setAccent('iris');
    setLaunched(true);
    setDone(true);
  }, [reduced]);

  const clearCopy = useCallback(() => {
    const input = document.getElementById('sp-copy') as HTMLInputElement | null;
    if (input) input.value = '';
    setCopy('');
  }, []);

  const replay = useCallback(() => {
    reset();
    setRun((r) => r + 1);
    pointer.current?.restart();
  }, [reset]);

  // Pas de bouton : une fois le scénario terminé, il se rejoue quand la section revient à l'écran.
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  doneRef.current = done;
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    let left = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        if (doneRef.current) left = true;
      } else if (left) {
        left = false;
        replay();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, replay]);

  const onPress = useCallback(({ target }: CursorPress) => {
    if (target.closest('#sp-swatch-iris')) setAccent('iris');
    if (target.closest('#sp-launch')) setLaunched(true);
  }, []);

  // --- Glisser-déposer piloté uniquement par les événements simulés des curseurs (isTrusted = false).
  // L’état est stocké par carte : plusieurs curseurs peuvent glisser des cartes en même temps.
  const onCardDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isTrusted) return;
    const el = e.currentTarget;
    el.dataset.sx = String(e.clientX);
    el.dataset.sy = String(e.clientY);
    el.dataset.dragging = '';
  };
  const onCardMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (e.nativeEvent.isTrusted || el.dataset.sx === undefined) return;
    el.style.transform = `translate(${e.clientX - Number(el.dataset.sx)}px, ${e.clientY - Number(el.dataset.sy)}px) rotate(-2deg)`;
  };
  const onCardUp = (id: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (e.nativeEvent.isTrusted || el.dataset.sx === undefined) return;
    delete el.dataset.sx;
    delete el.dataset.sy;
    delete el.dataset.dragging;
    el.style.transform = '';
    const target = (Object.keys(columnsRef.current) as Column[]).find((col) => {
      const r = columnsRef.current[col]?.getBoundingClientRect();
      return r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (target) moveTask(id, target);
  };

  const cursors = useMemo<CursorConfig[]>(() => {
    const g = () => gates.current;
    return [
      {
        id: 'design',
        name: 'Jan · Design',
        color: '#A9AED6',
        textColor: '#0B0B0C',
        start: { x: '46%', y: '8%' },
        script: [
          // Départ toujours propre, même si le composant relance le scénario de lui-même.
          {
            action: 'call',
            run: () => {
              setTasks(INITIAL_TASKS);
              setHeadline(INITIAL_HEADLINE);
              setAccent('mist');
              setLaunched(false);
              setDone(false);
              setChapter('design');
            },
          },
          { action: 'enter', at: { x: '52%', y: '10%' } },
          { action: 'select', target: '#sp-headline' },
          { action: 'say', text: 'Ce titre ne dit rien', duration: 1700 },
          { action: 'wait', duration: 900 },
          { action: 'clear' },
          { action: 'call', run: () => g().open('headline') },
          { action: 'click', target: '#sp-swatch-iris' },
          { action: 'say', text: 'Accent iris, plus lisible', duration: 1500 },
          { action: 'wait', duration: 700 },
          { action: 'drag', from: '#card-maquette', to: { target: '#col-done', x: 0.5, y: 0.3 } },
          { action: 'say', text: 'Maquette livrée', duration: 1300 },
          { action: 'call', run: () => g().open('design-done') },
          { action: 'call', run: () => g().wait('final') },
          { action: 'move', to: compact ? { target: '#sp-launch', x: 0.15, y: -1.6 } : { target: '#sp-launch', x: -0.25, y: -0.9 } },
        ],
      },
      {
        id: 'dev',
        name: 'Jan · Dev',
        color: '#F5F3EE',
        textColor: '#0B0B0C',
        start: { x: '10%', y: '92%' },
        script: [
          { action: 'wait', duration: 1200 },
          { action: 'enter', at: { x: '14%', y: '88%' } },
          { action: 'drag', from: '#card-integration', to: { target: '#col-doing', x: 0.5, y: 0.62 } },
          { action: 'call', run: () => setChapter((c) => (c === 'design' ? 'dev' : c)) },
          { action: 'say', text: 'J’intègre', duration: 1200 },
          { action: 'drag', from: '#card-formulaire', to: { target: '#col-doing', x: 0.5, y: 0.85 } },
          { action: 'call', run: () => g().wait('design-done') },
          { action: 'call', run: () => setChapter('dev') },
          { action: 'drag', from: '#card-integration', to: { target: '#col-done', x: 0.5, y: 0.55 } },
          { action: 'drag', from: '#card-formulaire', to: { target: '#col-done', x: 0.5, y: 0.8 } },
          // Com attend que Dev ait déplacé ses cartes : deux glisser simultanés dans la même colonne
          // déplaçaient les cartes sous le curseur (visible sur petit écran).
          { action: 'call', run: () => g().open('dev-done') },
          { action: 'say', text: 'Responsive et formulaire OK', duration: 1500 },
          { action: 'call', run: () => g().wait('com-done') },
          { action: 'call', run: () => setChapter('together') },
          { action: 'call', run: () => g().open('final') },
          { action: 'wait', duration: 900 },
          { action: 'click', target: '#sp-launch' },
          { action: 'say', text: 'En ligne !', duration: 2600 },
          { action: 'wait', duration: 1200 },
          { action: 'call', run: () => setDone(true) },
        ],
      },
      {
        id: 'com',
        name: 'Jan · Com',
        color: '#D9B98C',
        textColor: '#0B0B0C',
        start: compact ? { x: '72%', y: '92%' } : { x: '90%', y: '92%' },
        script: [
          { action: 'call', run: () => g().wait('headline') },
          { action: 'enter', at: compact ? { x: '70%', y: '90%' } : { x: '88%', y: '90%' } },
          { action: 'call', run: () => setChapter('com') },
          { action: 'click', target: '#sp-copy' },
          // Champ vidé juste avant la saisie : le texte n'est jamais ajouté à une saisie précédente.
          { action: 'call', run: () => clearCopy() },
          { action: 'type', target: '#sp-copy', text: FINAL_HEADLINE, delay: 60 },
          { action: 'say', text: 'Un message qui parle à la cible', duration: 1700 },
          { action: 'wait', duration: 600 },
          { action: 'call', run: () => g().wait('design-done') },
          { action: 'call', run: () => g().wait('dev-done') },
          { action: 'drag', from: '#card-textes', to: { target: '#col-done', x: 0.5, y: 0.42 } },
          { action: 'call', run: () => g().open('com-done') },
          { action: 'call', run: () => g().wait('final') },
          { action: 'move', to: compact ? { target: '#sp-launch', x: 0.55, y: 2.2 } : { target: '#sp-launch', x: 1.25, y: -0.7 } },
        ],
      },
    ];
    // `run` force une nouvelle configuration à chaque nouvelle lecture.
  }, [run, compact]);

  const progress = Math.round((tasks.filter((t) => t.column === 'done').length / tasks.length) * 100);

  const board = (
    <div className={`sp-board${accent === 'iris' ? ' is-iris' : ''}${launched ? ' is-launched' : ''}`} aria-hidden="true">
      <header className="sp-top">
        <div className="sp-top__title">
          <span className="sp-top__dot" />
          <strong>Lancement | Atelier Lumen</strong>
          <span className="sp-top__fake">Projet fictif</span>
        </div>
        <div className="sp-top__right">
          <div className="sp-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="sp-progress__value">{progress} %</span>
          <span className={`sp-status${launched ? ' is-live' : ''}`}>{launched ? 'En ligne' : 'En cours'}</span>
        </div>
      </header>

      <div className="sp-grid">
        <section className="sp-kanban">
          {COLUMNS.map((col) => (
            <div key={col.id} id={`col-${col.id}`} className="sp-col" ref={(el) => {
                columnsRef.current[col.id] = el;
              }}>
              <p className="sp-col__label">
                {col.label}
                <span>{tasks.filter((t) => t.column === col.id).length}</span>
              </p>
              {tasks
                .filter((t) => t.column === col.id)
                .map((t) => (
                  <div
                    key={t.id}
                    id={`card-${t.id}`}
                    className={`sp-card sp-card--${t.owner.toLowerCase()}`}
                    onPointerDown={onCardDown}
                    onPointerMove={onCardMove}
                    onPointerUp={onCardUp(t.id)}
                  >
                    <span className="sp-card__owner">{t.owner}</span>
                    <span className="sp-card__title">{t.title}</span>
                    {col.id === 'done' && <span className="sp-card__check">✓</span>}
                  </div>
                ))}
            </div>
          ))}
        </section>

        <section className="sp-side">
          <div className="sp-preview">
            <div className="sp-preview__bar">
              <i />
              <i />
              <i />
              <span>atelier-lumen.fr</span>
            </div>
            <div className="sp-preview__body">
              <p className="sp-preview__kicker">Atelier Lumen</p>
              <p id="sp-headline" className="sp-preview__headline">
                {copy || headline}
              </p>
              <p className="sp-preview__text">Ateliers créatifs en soirée, en petit groupe.</p>
              <span className="sp-preview__cta">Réserver</span>
              {launched && <span className="sp-preview__live">● En ligne</span>}
            </div>
          </div>

          <div className="sp-tools">
            <div className="sp-swatches">
              <span className="sp-tools__label">Accent</span>
              <span id="sp-swatch-mist" className={`sp-swatch sp-swatch--mist${accent === 'mist' ? ' is-on' : ''}`} />
              <span id="sp-swatch-iris" className={`sp-swatch sp-swatch--iris${accent === 'iris' ? ' is-on' : ''}`} />
            </div>
            <label className="sp-copy">
              <span className="sp-tools__label">Titre</span>
              <input
                id="sp-copy"
                value={copy}
                placeholder="Proposer un titre…"
                readOnly
                tabIndex={-1}
                onInput={(e) => setCopy((e.target as HTMLInputElement).value)}
                onChange={() => {}}
              />
            </label>
            <span id="sp-launch" className={`sp-launch${launched ? ' is-done' : ''}`}>
              {launched ? 'Publié ✓' : 'Mettre en ligne'}
            </span>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="showcase-story">
      <ol className="sp-chapters" aria-label="Le scénario en quatre temps">
        {CHAPTERS.map((c, i) => {
          const order = CHAPTERS.findIndex((x) => x.id === chapter);
          const state = done || (order > i) ? 'past' : chapter === c.id ? 'active' : 'future';
          return (
            <li key={c.id} className={`sp-chapter is-${state}`}>
              <span className="sp-chapter__n">0{i + 1}</span>
              <span>
                <strong>{c.who}</strong> {c.text}
              </span>
            </li>
          );
        })}
      </ol>

      <div ref={stageRef} className="sp-stage">
        {reduced || !mounted || level !== 'full' ? (
          board
        ) : (
          <ShowcasePointer
            ref={pointer}
            cursors={cursors}
            loop={false}
            speed={1}
            labelAnimation="masked-lift"
            idleDrift={1.2}
            clickEffect
            cursorSize={compact ? 0.82 : 1.05}
            onCursorPress={onPress}
            className="sp-pointer"
          >
            {board}
          </ShowcasePointer>
        )}
      </div>
    </div>
  );
}
