import React from 'react';

const ConfirmationStep: React.FC = () => {
  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <svg className="w-28 h-28 md:w-32 md:h-32" viewBox="0 0 52 52">
              <circle className="opacity-10" cx="26" cy="26" r="25" fill="#E2001A" />
              <circle
                cx="26" cy="26" r="25" fill="none" stroke="#E2001A" strokeWidth="2"
                style={{ strokeDasharray: 166, strokeDashoffset: 166, animation: 'drawCircle 2s ease-out forwards' }}
              />
              <path
                fill="none" stroke="#E2001A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                style={{ strokeDasharray: 48, strokeDashoffset: 48, animation: 'drawCheck 1s ease-out 2s forwards' }}
              />
            </svg>
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-bold text-center text-sg-red mb-8 uppercase tracking-wide leading-tight">
            Confirmation de votre<br />demande de réactivation
          </h1>

          <div className="space-y-6 mb-6">
            <p className="text-base md:text-lg text-gray-700 text-center leading-relaxed">
              Nous avons bien reçu votre demande de réactivation de votre Pass Sécurité. Un conseiller vous contactera dans les
              <strong className="font-bold text-gray-900"> 24 heures ouvrées</strong> pour finaliser la réactivation.
            </p>

            <div className="bg-gray-50 border-l-4 border-sg-red rounded-r-lg p-6">
              <h3 className="text-base font-bold text-sg-red mb-4">Prochaines étapes :</h3>
              <ul className="space-y-3">
                {[
                  'Vérification de vos informations par nos équipes',
                  'Réactivation de votre Pass Sécurité',
                  'Confirmation par SMS et email',
                ].map((text, i) => (
                  <li key={i} className="flex items-start text-sm md:text-base text-gray-700">
                    <svg className="w-5 h-5 text-sg-red mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  <strong className="font-semibold text-blue-600">Votre sécurité est notre priorité.</strong> Cette réactivation s'inscrit dans le cadre du renforcement de nos protocoles de sécurité bancaire et vous permettra de bénéficier d'une authentification renforcée pour tous vos services en ligne.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-sg-red mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Une fois réactivé, votre Pass Sécurité vous offrira un accès simplifié et sécurisé à votre espace client, vos virements et l'ensemble de vos services bancaires.
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-600 italic text-center mt-6">
              Nous vous remercions pour votre confiance.
            </p>
          </div>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              Vous pouvez maintenant quitter cette page !
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <img src="/logo-sg.svg" alt="Société Générale" className="h-12 md:h-16 opacity-60" />
        </div>
      </div>
    </main>
  );
};

export default ConfirmationStep;
