import { useId, useRef, useState, type SyntheticEvent } from 'react';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import './ContactForm.css';
import { useEffectsLevel } from '@/lib/effects';

/**
 * Formulaire de contact.
 * - Si PUBLIC_CONTACT_ENDPOINT est configuré : envoi réel (POST JSON) ; le succès n'est affiché
 *   qu'après une réponse HTTP 2xx du service.
 * - Sinon : aucun envoi simulé. Le message est préparé et le visiteur l'ouvre dans sa messagerie.
 */

const ENDPOINT = (import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined)?.trim() || '';
const ACCESS_KEY = (import.meta.env.PUBLIC_CONTACT_ACCESS_KEY as string | undefined)?.trim() || '';

const SUBJECTS = ['Opportunité professionnelle', 'Projet web', 'Design ou identité visuelle', 'Vidéo ou photo', 'Communication ou SEO', 'Autre'];

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string } | { kind: 'manual' };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function ContactForm({ email }: { email: string }) {
  const level = useEffectsLevel();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [copied, setCopied] = useState(false);

  const validate = (data: typeof draft): Errors => {
    const e: Errors = {};
    if (data.name.trim().length < 2) e.name = 'Indiquez votre nom (2 caractères minimum).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = 'Indiquez une adresse e-mail valide.';
    if (data.message.trim().length < 10) e.message = 'Décrivez votre besoin en quelques mots (10 caractères minimum).';
    return e;
  };

  const mailto = () =>
    `mailto:${email}?subject=${encodeURIComponent(`[Portfolio] ${draft.subject} - ${draft.name}`)}&body=${encodeURIComponent(
      `${draft.message}\n\n${draft.name}\n${draft.email}`,
    )}`;

  const onSubmit = async (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value;
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    if (honeypot) return; // robot : on ignore silencieusement, sans afficher de faux succès.

    if (!ENDPOINT) {
      setStatus({ kind: 'manual' });
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
          name: draft.name.trim(),
          email: draft.email.trim(),
          subject: `[Portfolio] ${draft.subject}`,
          message: draft.message.trim(),
          from_name: 'Portfolio janjawish.fr',
        }),
      });
      let ok = res.ok;
      try {
        const json = await res.clone().json();
        if (json && typeof json.success === 'boolean') ok = ok && json.success;
      } catch {
        /* réponse non JSON : on se fie au code HTTP */
      }
      if (!ok) throw new Error(`Le service d’envoi a répondu ${res.status}.`);
      setStatus({ kind: 'sent' });
      setDraft({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Erreur réseau.' });
    }
  };

  const field = (name: keyof Errors) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-err` : undefined,
  });

  if (status.kind === 'sent') {
    return (
      <div className="cf-result" role="status">
        <p className="cf-result__title">Message envoyé.</p>
        <p className="cf-result__text">Merci ! Je vous réponds dès que possible à l’adresse indiquée.</p>
        <button type="button" className="btn" onClick={() => setStatus({ kind: 'idle' })}>
          Écrire un autre message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="cf" noValidate onSubmit={onSubmit} aria-describedby={`${id}-privacy`}>
      <div className="cf__row">
        <div className="cf__field">
          <label htmlFor={`${id}-name`}>Nom</label>
          <input {...field('name')} type="text" autoComplete="name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          {errors.name && <p id={`${id}-name-err`} className="cf__error">{errors.name}</p>}
        </div>
        <div className="cf__field">
          <label htmlFor={`${id}-email`}>Adresse e-mail</label>
          <input {...field('email')} type="email" autoComplete="email" inputMode="email" required value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          {errors.email && <p id={`${id}-email-err`} className="cf__error">{errors.email}</p>}
        </div>
      </div>

      <fieldset className="cf__subjects">
        <legend>Votre demande concerne</legend>
        <div className="cf__chips">
          {SUBJECTS.map((s) => (
            <label key={s} className="cf__chip">
              <input type="radio" name="subject" value={s} checked={draft.subject === s} onChange={() => setDraft({ ...draft, subject: s })} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="cf__field">
        <label htmlFor={`${id}-message`}>Votre besoin, votre projet ou votre équipe</label>
        <textarea {...field('message')} rows={6} required value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} />
        {errors.message && <p id={`${id}-message-err`} className="cf__error">{errors.message}</p>}
      </div>

      <div className="cf__hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Ne pas remplir</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="cf__footer">
        <p id={`${id}-privacy`} className="cf__privacy">
          Vos informations servent uniquement à vous répondre. Elles ne sont ni stockées sur ce site ni transmises à des tiers à des fins commerciales.
        </p>
        {level !== 'full' ? (
          <button type="submit" className="btn btn--glass btn--lg" disabled={status.kind === 'sending'}>
            {status.kind === 'sending' ? 'Envoi en cours…' : ENDPOINT ? 'Envoyer le message' : 'Préparer le message'}
          </button>
        ) : (
        <SpecularButton
          type="submit"
          size="md"
          radius={26}
          tint="#858BB9"
          tintOpacity={0.14}
          textColor="#F5F3EE"
          lineColor="#F5F3EE"
          baseColor="#3a3d55"
          idleIntensity={0.4}
          disabled={status.kind === 'sending'}
        >
          {status.kind === 'sending' ? 'Envoi en cours…' : ENDPOINT ? 'Envoyer le message' : 'Préparer le message'}
        </SpecularButton>
        )}
      </div>

      <div aria-live="polite" className="cf__live">
        {status.kind === 'error' && (
          <div className="cf__notice cf__notice--error">
            <p>
              <strong>Le message n’a pas pu être envoyé.</strong> {status.message}
            </p>
            <p>
              Vous pouvez réessayer ou <a href={mailto()}>l’envoyer depuis votre messagerie</a>.
            </p>
          </div>
        )}
        {status.kind === 'manual' && (
          <div className="cf__notice">
            <p>
              <strong>L’envoi direct n’est pas encore activé sur ce site.</strong> Votre message est prêt : ouvrez-le dans votre messagerie pour l’envoyer
              à {email}.
            </p>
            <div className="cf__manual-actions">
              <a className="btn btn--solid" href={mailto()}>
                Ouvrir ma messagerie
              </a>
              <button
                type="button"
                className="btn"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${draft.message}\n\n${draft.name}\n${draft.email}`);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? 'Message copié ✓' : 'Copier le message'}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
