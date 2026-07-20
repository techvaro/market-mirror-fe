import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Eye, EyeOff, ShieldCheck, Zap, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { setPassword as storePassword } from '@/lib/mockAuthStore';

export default function SignUpPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'buyer' | 'vendor'>('buyer');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      storePassword(formData.email, formData.password);

      login({
        name: formData.name,
        email: formData.email,
        role: accountType,
      });

      toast({
        title: "Account created!",
        description: accountType === 'vendor'
          ? "Welcome to Market Mirror. Your vendor account is ready."
          : "Welcome to Market Mirror. Your account is ready.",
      });
      setLocation('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)]">
      {/* Brand Side - Alternating to the left for Sign Up */}
      <div className="hidden lg:flex flex-1 bg-secondary relative overflow-hidden items-center justify-center p-12 order-2 lg:order-1">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-lg text-secondary-foreground space-y-12">
          <Link href="/" className="inline-block">
            <Logo variant="light" size="lg" />
          </Link>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold leading-tight">
              Join the biggest <br /> digital market.
            </h2>
            <p className="text-secondary-foreground/80 text-lg leading-relaxed">
              Create an account to track your orders, save your favorite shops, and get exclusive deals from verified Alaba vendors.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-secondary-foreground/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Verified Vendors Only</h4>
                <p className="text-secondary-foreground/70 text-sm">Every seller is physically verified</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Buyer Protection</h4>
                <p className="text-secondary-foreground/70 text-sm">Full refund if items don't match description</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background order-1 lg:order-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Join Market Mirror to start shopping securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Which best describes you?</Label>
                <RadioGroup
                  value={accountType}
                  onValueChange={(value) => setAccountType(value as 'buyer' | 'vendor')}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="role-buyer"
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      accountType === 'buyer'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value="buyer" id="role-buyer" />
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Buyer</p>
                      <p className="text-xs text-muted-foreground">I want to shop</p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="role-vendor"
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      accountType === 'vendor'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value="vendor" id="role-vendor" />
                    <Store className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Vendor</p>
                      <p className="text-xs text-muted-foreground">I want to sell</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Chukwudi Okafor"
                  className={`h-12 px-4 rounded-xl ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`h-12 px-4 rounded-xl ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 0801 234 5678"
                  className="h-12 px-4 rounded-xl"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 chars)"
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
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 mt-2">
              Create Account
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">or continue with</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-12 rounded-xl text-base font-medium bg-background hover:bg-muted">
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
