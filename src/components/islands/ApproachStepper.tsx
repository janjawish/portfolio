import Stepper, { Step } from '@/components/reactbits/Stepper/Stepper';
import './ApproachStepper.css';

export type ApproachPhase = {
  title: string;
  text: string;
  actions: string[];
  example: { label: string; href: string; text: string };
};

/** Parcours interactif de la méthode, avec le « Stepper » de React Bits. */
export default function ApproachStepper({ phases }: { phases: ApproachPhase[] }) {
  return (
    <div className="approach-stepper">
      <Stepper
        initialStep={1}
        indicator="numbers"
        orientation="horizontal"
        transition="slide"
        theme="dark"
        accentColor="#858BB9"
        frame
        radius={24}
        width="100%"
        backButtonText="Précédent"
        nextButtonText="Étape suivante"
        completeButtonText="Terminer"
        completedContent={
          <div className="as-done">
            <p className="as-done__title">Voilà la méthode.</p>
            <p className="as-done__text">Vous avez un besoin à cadrer, concevoir, produire ou faire connaître ?</p>
            <a className="btn btn--solid" href="/contact">
              Parlons-en <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        }
      >
        {phases.map((p, i) => (
          <Step key={p.title} title={p.title} description={`Étape ${i + 1}`}>
            <div className="as-step">
              <p className="as-step__text">{p.text}</p>
              <div className="as-step__cols">
                <div>
                  <p className="as-step__label">Concrètement</p>
                  <ul className="as-step__list">
                    {p.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="as-step__label">Exemple réel</p>
                  <p className="as-step__example">{p.example.text}</p>
                  <a className="as-step__link" href={p.example.href}>
                    {p.example.label} →
                  </a>
                </div>
              </div>
            </div>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
