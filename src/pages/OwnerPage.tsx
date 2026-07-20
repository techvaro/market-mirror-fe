import { useSearch } from 'wouter';
import { Link } from 'wouter';
import { ArrowLeft, Phone, MapPin, ShieldCheck, Store, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';

export default function OwnerPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);

  const id       = params.get('id') || '';
  const name     = params.get('name') || 'Unknown Shop';
  const owner    = params.get('owner') || 'Unknown Owner';
  const stall    = params.get('stall') || '—';
  const phone    = params.get('phone') || '—';
  const category = params.get('category') || '—';
  const image    = params.get('image') || '';
  const desc     = params.get('desc') || '';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-secondary overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e3a8a,#3b82f6)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/map">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/30">
              <ArrowLeft className="w-4 h-4" /> Back to Market Map
            </button>
          </Link>
        </div>

        {/* Shop name over hero */}
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              {category}
            </span>
            <span className="bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" /> Verified Merchant
            </span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-display font-bold drop-shadow-lg">
            {name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left: Owner Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-1"
          >
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {owner.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground leading-tight">{owner}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Shop Owner</p>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
                </div>
              </div>

              <hr className="border-border" />

              {/* Contact Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Stall Number</p>
                    <p className="font-semibold text-foreground">{stall}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Store className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Category</p>
                    <p className="font-semibold text-foreground">{category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Phone</p>
                    <a href={`tel:${phone.replace(/\s/g,'')}`} className="font-semibold text-primary hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>
              </div>

              <a href={`tel:${phone.replace(/\s/g,'')}`}>
                <Button className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Phone className="w-4 h-4 mr-2" /> Call Now
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right: Shop Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-bold text-xl text-foreground mb-3">About this Shop</h3>
              <p className="text-muted-foreground leading-relaxed">
                {desc || `${name} is a verified merchant at Alaba International Market, specialising in ${category}. All transactions are protected by Market Mirror's buyer guarantee.`}
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, label: 'Verified Merchant', sub: 'Identity confirmed' },
                { icon: BadgeCheck, label: 'Licensed Stall', sub: 'Officially registered' },
                { icon: Store, label: 'Market Mirror', sub: 'Protected purchase' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Shop ID:</span> {id || 'N/A'} &nbsp;·&nbsp;
              <span className="font-semibold text-foreground">Stall:</span> {stall}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
