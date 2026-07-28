import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { hasAccount, verifyPassword, setPassword as storePassword } from '@/lib/mockAuthStore';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignInPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email or phone number is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (hasAccount(formData.email) && !verifyPassword(formData.email, formData.password)) {
      newErrors.password = 'Incorrect password. Try again or reset it.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const derivedName = capitalizeFirstLetter(formData.email.split('@')[0]);

      if (!hasAccount(formData.email)) {
        storePassword(formData.email, formData.password);
      }

      login({
        name: derivedName,
        email: formData.email,
        role: 'buyer',
      });

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      setLocation('/');
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
          {/* Mobile logo */}
          <div className="flex justify-center lg:hidden">
            <Link href="/">
              <Logo variant="icon" size="md" />
            </Link>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue shopping.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                  Email or phone
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Email or phone"
                  className={`h-12 px-4 rounded-xl ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5 pt-2">
                <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

                <div className="text-left pt-0.5">
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Sign In
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">or continue with</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-12 rounded-xl text-base font-medium bg-background hover:bg-muted gap-3">
              <GoogleIcon />
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-4">
              New to Market Mirror?{' '}
              <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </form>
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
              Alaba Market,<br />now in your pocket.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Experience the authentic hustle, unmatched variety, and unbeatable prices of Africa's largest electronics market—without leaving your home.
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

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
