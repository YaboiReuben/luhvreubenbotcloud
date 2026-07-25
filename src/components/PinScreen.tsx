import React, { useState, useEffect } from 'react';
import { Shield, Key, AlertCircle, Eye, EyeOff, Lock, Unlock, RefreshCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PinScreenProps {
  correctPin: string;
  onSuccess: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({ correctPin, onSuccess }) => {
  const [inputPin, setInputPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Cooldown timer count down
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  // Handle keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cooldownTime > 0) return;

      if (e.key >= '0' && e.key <= '9') {
        if (inputPin.length < 4) {
          handleDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (inputPin.length === 4) {
          verifyPin(inputPin);
        }
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputPin, cooldownTime]);

  const handleDigitPress = (digit: string) => {
    if (cooldownTime > 0 || isVerifying) return;
    setErrorMsg('');
    const newPin = inputPin + digit;
    setInputPin(newPin);

    // Auto verify if reached 4 digits
    if (newPin.length === 4) {
      verifyPin(newPin);
    }
  };

  const handleBackspace = () => {
    if (cooldownTime > 0 || isVerifying) return;
    setErrorMsg('');
    setInputPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (cooldownTime > 0 || isVerifying) return;
    setErrorMsg('');
    setInputPin('');
  };

  const verifyPin = (pinToTest: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      if (pinToTest === correctPin) {
        setIsVerifying(false);
        onSuccess();
      } else {
        setIsVerifying(false);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setShake(true);
        setTimeout(() => setShake(false), 500);

        if (newAttempts >= 3) {
          setCooldownTime(15);
          setErrorMsg('Too many incorrect attempts. Cooldown active (15s).');
          setAttempts(0);
        } else {
          setErrorMsg(`Incorrect PIN code. (${3 - newAttempts} attempts remaining)`);
        }
        setInputPin('');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/95 backdrop-blur-xl p-4">
      {/* Subtle Bento ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5865f2]/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className={`relative w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#fafafa] overflow-hidden ${
          shake ? 'animate-shake border-rose-500/50' : ''
        }`}
      >
        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5865f2] shadow-lg shadow-[#5865f2]/20">
            <Shield className="w-8 h-8 text-white" />
            <div className="absolute -bottom-1 -right-1 p-1 bg-[#09090b] rounded-full border border-[#27272a]">
              <Lock className="w-3.5 h-3.5 text-[#5865f2]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#fafafa]">
            NexusBot Control Panel
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1 font-medium">
            RESTRICTED SYSTEM ACCESS • ENTER PIN CODE
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex gap-4 mb-2">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = inputPin.length > index;
              return (
                <div
                  key={index}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                    isFilled
                      ? 'border-[#5865f2] bg-[#5865f2]/15 text-[#fafafa] scale-105 shadow-md shadow-[#5865f2]/20'
                      : 'border-[#27272a] bg-[#09090b] text-[#71717a]'
                  }`}
                >
                  {isFilled ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-[#5865f2] shadow-sm shadow-[#5865f2]"
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#27272a]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error / Cooldown Message */}
          <AnimatePresence mode="wait">
            {errorMsg ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-1 bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 rounded-lg"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            ) : cooldownTime > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-amber-400 font-medium mt-1 flex items-center gap-1 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/40"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Wait {cooldownTime} seconds before retrying
              </motion.div>
            ) : (
              <div className="h-6" />
            )}
          </AnimatePresence>
        </div>

        {/* Keypad Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              disabled={cooldownTime > 0 || isVerifying}
              onClick={() => handleDigitPress(num)}
              className="h-14 rounded-xl bg-[#09090b] hover:bg-[#27272a] active:bg-[#5865f2] active:scale-95 text-[#fafafa] font-semibold text-xl transition-all duration-150 border border-[#27272a] shadow-sm flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            disabled={cooldownTime > 0 || inputPin.length === 0 || isVerifying}
            onClick={handleClear}
            className="h-14 rounded-xl bg-[#09090b]/60 hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] active:scale-95 text-xs font-semibold tracking-wider uppercase transition-all duration-150 border border-[#27272a] flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
          >
            Clear
          </button>

          {/* Zero Button */}
          <button
            disabled={cooldownTime > 0 || isVerifying}
            onClick={() => handleDigitPress('0')}
            className="h-14 rounded-xl bg-[#09090b] hover:bg-[#27272a] active:bg-[#5865f2] active:scale-95 text-[#fafafa] font-semibold text-xl transition-all duration-150 border border-[#27272a] shadow-sm flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            disabled={cooldownTime > 0 || inputPin.length === 0 || isVerifying}
            onClick={handleBackspace}
            className="h-14 rounded-xl bg-[#09090b]/60 hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] active:scale-95 text-sm transition-all duration-150 border border-[#27272a] flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            title="Backspace"
          >
            ⌫
          </button>
        </div>

        {/* PIN Hint & Footer Info */}
        <div className="pt-4 border-t border-[#27272a] flex items-center justify-between text-xs text-[#a1a1aa]">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 hover:text-[#fafafa] transition-colors py-1"
          >
            {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showHint ? `Default PIN: ${correctPin}` : 'Forgot PIN?'}</span>
          </button>

          <div className="flex items-center gap-1 text-[#71717a]">
            <Key className="w-3 h-3" />
            <span>PIN Required</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
