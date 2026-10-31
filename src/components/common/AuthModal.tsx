import React, { useState } from 'react';
import { X, Phone, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { sendPhoneOtp, verifyPhoneOtp, signInWithGoogle, continueAsGuest, isGuest, profile } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setLoading(true);
    const res = await sendPhoneOtp(cleaned);
    setLoading(false);

    if (res.success) {
      setStep('otp');
    } else {
      setErrorMessage(res.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (otpToken.length !== 6) {
      setErrorMessage('Enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    const res = await verifyPhoneOtp(phoneNumber, otpToken);
    setLoading(false);

    if (res.success) {
      setStep('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setStep('input');
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Invalid OTP code. Please retry.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    const res = await signInWithGoogle();
    setLoading(false);
    if (res.success) {
      setStep('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.error || 'Google login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
        {/* Header decoration */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Powered • 100% Free</span>
          </div>

          <h2 className="text-2xl font-bold font-serif tracking-tight">
            {step === 'success' ? 'Welcome to Vriksha!' : 'Join the Vriksha Community'}
          </h2>
          <p className="text-xs text-forest-100 mt-1">
            Map useful plants, verify trees for daily puja, and earn green contributor badges.
          </p>
        </div>

        {/* Content body */}
        <div className="p-6">
          {step === 'input' && (
            <div>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number (Fast OTP)
                  </label>
                  <div className="flex rounded-xl border border-gray-300 focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/20 overflow-hidden shadow-sm">
                    <span className="inline-flex items-center px-3.5 bg-gray-100 text-gray-700 text-sm font-medium border-r border-gray-300">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="flex-1 px-3 py-2.5 text-gray-900 text-base outline-none font-sans"
                      autoFocus
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-forest-800 hover:bg-forest-900 text-white font-medium rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Phone className="w-4 h-4" />
                  <span>{loading ? 'Sending OTP...' : 'Send 6-Digit OTP'}</span>
                </button>
              </form>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative px-3 bg-white text-xs text-gray-500 uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              {/* Google OAuth button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Guest continuation note */}
              {isGuest && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">
                    Currently browsing as <strong>{profile?.display_name}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      continueAsGuest();
                      onClose();
                    }}
                    className="text-xs text-forest-700 hover:underline font-medium mt-1 inline-block"
                  >
                    Keep exploring without signing in
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-xs text-forest-700 hover:underline font-medium"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  type="text"
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 border border-gray-300 rounded-xl focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-gray-500 mt-1.5 text-center">
                  OTP sent to +91 {phoneNumber} (Use <strong>123456</strong> in demo mode)
                </p>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otpToken.length !== 6}
                className="w-full py-3 px-4 bg-forest-800 hover:bg-forest-900 text-white font-medium rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-gray-900">Signed In Successfully!</h3>
              <p className="text-sm text-gray-600">
                You can now map plants, verify trees, and earn community points.
              </p>
            </div>
          )}
        </div>

        {/* Footer privacy pledge */}
        <div className="bg-amber-50/60 p-3.5 border-t border-amber-100 text-center">
          <p className="text-[11px] text-amber-900 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Zero personal tracking • No advertising • 100% Non-Profit</span>
          </p>
        </div>
      </div>
    </div>
  );
};
