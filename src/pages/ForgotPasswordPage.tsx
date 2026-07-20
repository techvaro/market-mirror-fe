import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { hasAccount } from '@/lib/mockAuthStore';

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSending(true);
    // Simulate a network request to send the reset link.
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)]">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <Link href="/sign-in" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>

          {!sent ? (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                  Forgot your password?
                </h1>
                <p className="text-muted-foreground">
                  Enter the email linked to your account and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className={error ? "text-destructive" : ""}>
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`h-12 px-4 rounded-xl ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-70"
                >
                  {sending ? 'Sending link...' : 'Send reset link'}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                  Check your email
                </h1>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                  {!hasAccount(email) && ' If this is your first time, no account was found yet — you can still set a password below.'}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  This is a prototype, so there's no real inbox to check. Use the button below to simulate opening the reset link from your email.
                </p>
                <Button
                  type="button"
                  onClick={() => setLocation(`/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full h-11 rounded-xl font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Open reset link
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Use a different email
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Brand Side */}
      <div className="hidden lg:flex flex-1 bg-secondary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 max-w-lg text-secondary-foreground space-y-12">
          <Link href="/" className="inline-block">
            <Logo variant="light" size="lg" />
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold leading-tight text-white">
              Locked out?<br />We've got you.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Reset your password in a few taps and get right back to shopping the biggest digital market.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">100% Secure Payments</h4>
                <p className="text-white/70 text-sm">Escrow protection on all orders</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Same Day Delivery</h4>
                <p className="text-white/70 text-sm">Fast logistics within Lagos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
