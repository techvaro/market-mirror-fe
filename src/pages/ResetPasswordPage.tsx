import { useState } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Zap, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { setPassword as storePassword } from '@/lib/mockAuthStore';

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const email = new URLSearchParams(search).get('email') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
  const [done, setDone] = useState(false);

  const validate = () => {
    const newErrors = { password: '', confirmPassword: '' };
    let isValid = true;

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (validate()) {
      storePassword(email, formData.password);
      setDone(true);
      toast({
        title: 'Password updated',
        description: 'Your password has been reset. You can now sign in with your new password.',
      });
      setTimeout(() => setLocation('/sign-in'), 1500);
    }
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

          {!email ? (
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-bold text-foreground">Invalid reset link</h1>
              <p className="text-muted-foreground">This reset link is missing an email address. Please request a new one.</p>
              <Link href="/forgot-password">
                <Button className="h-11 rounded-xl font-semibold">Request a new link</Button>
              </Link>
            </div>
          ) : done ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                Password reset!
              </h1>
              <p className="text-muted-foreground">Redirecting you to sign in...</p>
            </motion.div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                  Set a new password
                </h1>
                <p className="text-muted-foreground">
                  Choose a new password for <span className="font-semibold text-foreground">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a new password"
                      className={`h-12 px-4 rounded-xl pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
                    Confirm new password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    className={`h-12 px-4 rounded-xl ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  Reset password
                </Button>
              </form>
            </>
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
              Almost there.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Set a strong new password to keep your Market Mirror account secure.
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
