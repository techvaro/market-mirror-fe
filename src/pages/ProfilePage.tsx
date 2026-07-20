import { useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Package, ShoppingCart, MapPin, Phone, Mail, Store, CheckCircle2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'Lagos, Nigeria',
    profileImageUrl: user?.profileImageUrl || '',
  });

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Sign in to view your profile</h2>
        <p className="text-muted-foreground mb-8">You need an account to manage your details.</p>
        <Link href="/sign-in" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8">
          Sign In
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, profileImageUrl: result }));
        // Save immediately for better UX
        updateProfile({ profileImageUrl: result });
        toast({
          title: "Profile Image Updated",
          description: "Your new profile picture has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your account details have been saved successfully.",
    });
  };

  const handleSignOut = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-3">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">My Profile</h1>
            <p className="text-muted-foreground text-lg">
              Manage your account details and preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* Sidebar Area */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* User Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl p-6 text-center shadow-sm"
            >
              <div className="flex justify-center mb-4 relative w-24 h-24 mx-auto group">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <h2 className="text-2xl font-bold font-display">{user.name}</h2>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold border-transparent bg-primary/10 text-primary">
                {user.role === 'vendor' ? 'Vendor Account' : 'Buyer Account'}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-bold px-2 mb-2 text-sm text-muted-foreground uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-1">
                <Link href="/orders" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-foreground font-medium transition-colors">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  My Orders
                </Link>
                <Link href="/cart" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-foreground font-medium transition-colors">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  Shopping Cart
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow space-y-8">
            
            {/* Account Details Form */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Details
                </h2>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" /> Full Name
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary"
                        required
                      />
                    ) : (
                      <div className="w-full bg-muted/50 border border-transparent rounded-lg px-4 py-2.5 text-foreground font-medium">
                        {user.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                    </label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary"
                        required
                      />
                    ) : (
                      <div className="w-full bg-muted/50 border border-transparent rounded-lg px-4 py-2.5 text-foreground font-medium">
                        {user.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                    </label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary"
                        placeholder="e.g. 0801 234 5678"
                      />
                    ) : (
                      <div className="w-full bg-muted/50 border border-transparent rounded-lg px-4 py-2.5 text-foreground font-medium">
                        {user.phone || <span className="text-muted-foreground italic">Not provided</span>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" /> Location
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary"
                        placeholder="e.g. Lagos, Nigeria"
                      />
                    ) : (
                      <div className="w-full bg-muted/50 border border-transparent rounded-lg px-4 py-2.5 text-foreground font-medium">
                        {user.location || <span className="text-muted-foreground italic">Not provided</span>}
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" className="px-6">
                      Save Changes
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || '',
                          location: user.location || 'Lagos, Nigeria',
                          profileImageUrl: user.profileImageUrl || '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </motion.div>

            {/* Account Type Details */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4">Account Type</h2>
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {user.role === 'vendor' ? <Store className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.role === 'vendor' ? 'Vendor Account' : 'Buyer Account'}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {user.role === 'vendor' 
                      ? 'You can list products, manage your shop, and process orders on Market Mirror.' 
                      : 'You can shop securely, track your orders, and save your favorite shops on Market Mirror.'}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-foreground/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Set during signup
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="pt-6"
            >
              <Button variant="destructive" className="w-full sm:w-auto" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
