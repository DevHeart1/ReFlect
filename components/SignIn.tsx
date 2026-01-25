import React, { useState } from 'react';
import { authService } from '../services/authService';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface SignInProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (isSignUp) {
        await authService.signup(name, email, password);
        onSignUp();
      } else {
        await authService.login(email, password);
        onSignIn();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-background-dark text-[#131516] dark:text-[#f1f3f3]">
      {/* Left Panel - Image & Branding */}
      <section className="hidden lg:flex relative w-1/2 h-full overflow-hidden animate-fade-in-up">
        <img
          alt="Calm forest at dawn"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl230TimKklHR74wkO2xPt8Amkip3Y8xwAARqN614A0lI_SKBMwjkdkoZOPIbLkAi0R6h6u3ryMRKEAZJzZtpJ29t0IrDBSk8c1BMgFh5pUc9P3bmVkGih4rVOM4W0yHihmVf-VRfpGQjuuHZ18xl3u7iy8UZSDQBNVrX8bDLamMevO3Nq5UTMN_i4RHDFQ3rN1wPCpq5yHcnUCqQVUd6afR7wmddQECXXt0eoEmTWS61voViJ8lZpvt69kke1uTfPN_K9MGd9vKMk"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white shadow-xl">
              <span className="material-symbols-outlined text-4xl">spa</span>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">Re-Flect</h1>
          <p className="text-xl text-white/90 font-medium tracking-wide drop-shadow-md">Find your inner peace</p>
        </div>
        <div className="absolute bottom-12 left-0 right-0 text-center px-12">
          <p className="text-white/70 italic text-sm">"The quieter you become, the more you are able to hear."</p>
        </div>
      </section>

      {/* Right Panel - Auth Form */}
      <section className="w-full lg:w-1/2 h-full overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-12 md:p-20">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up delay-100">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="bg-primary p-2 rounded-lg text-white mb-2">
                <span className="material-symbols-outlined text-3xl">spa</span>
              </div>
              <h2 className="text-2xl font-bold text-primary">Re-Flect</h2>
            </div>

            <div className="text-left">
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {isSignUp ? "Start your journey of self-discovery." : "Continue your journey of self-discovery."}
              </p>
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg font-medium animate-shake">
                  {error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse: CredentialResponse) => {
                    if (credentialResponse.credential) {
                      try {
                        await authService.loginWithGoogle(credentialResponse.credential);
                        onSignIn();
                      } catch (e) {
                        setError('Google login failed');
                      }
                    }
                  }}
                  onError={() => {
                    setError('Google login failed');
                  }}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  text="signin_with"
                />
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background-light dark:bg-background-dark px-2 text-gray-400 font-medium">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    required
                    className="block w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary transition-all duration-200 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  required
                  className="block w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary transition-all duration-200 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="block w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-primary focus:border-primary transition-all duration-200 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-500 dark:text-gray-400" htmlFor="remember-me">Remember me</label>
                </div>
                {!isSignUp && (
                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {isSignUp ? (
                <>
                  Already have an account? <button onClick={() => setIsSignUp(false)} className="font-bold text-primary hover:text-primary/80 transition-colors">Sign In</button>
                </>
              ) : (
                <>
                  New to Re-Flect? <button onClick={() => setIsSignUp(true)} className="font-bold text-primary hover:text-primary/80 transition-colors">Create an account</button>
                </>
              )}
            </p>

            <div className="pt-8 text-center">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-loose">
                By signing in, you agree to our <br />
                <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};