import { useState } from 'react';
import { Link } from 'wouter';
import { useVendor } from '@/context/VendorContext';
import { markets } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatNaira } from '@/lib/utils';
import {
  Store, CheckCircle2, TrendingUp, Package, Star, Wallet,
  ShieldCheck, AlertTriangle, Ban, Percent, Truck
} from 'lucide-react';

const CATEGORIES = ['Electronics', 'Phones & Accessories', 'Fabrics & Fashion', 'Home Appliances', 'Auto Parts', 'Beauty'];

const PageLayout = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="min-h-[70vh] bg-background py-16">
    <div className="container mx-auto px-3 max-w-3xl">
      <h1 className="text-4xl font-display font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
      {!subtitle && <div className="mb-8" />}
      {children}
    </div>
  </div>
);

// ---------------- Open a Shop ----------------

export const OpenShopPage = () => {
  const { addApplication } = useVendor();
  const { toast } = useToast();

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [market, setMarket] = useState(markets[0]);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !ownerName || !phone || !description) return;

    addApplication({ shopName, ownerName, phone, category, market, description });
    toast({
      title: 'Application Submitted',
      description: "We'll review your shop application and reach out within 3 business days.",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageLayout title="Application Received">
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-display font-bold">Thanks, {ownerName.split(' ')[0]}!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your application for <strong className="text-foreground">{shopName}</strong> has been submitted and is now <strong className="text-foreground">Pending Review</strong>.
            Our team will verify your details and contact you at {phone} within 3 business days.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/vendors/dashboard"><Button variant="outline">View Vendor Dashboard</Button></Link>
            <Link href="/"><Button>Back to Home</Button></Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Open a Shop" subtitle="Join hundreds of verified vendors selling on Market Mirror. Tell us about your shop to get started.">
      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input id="shopName" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="e.g. TechCity Electronics" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Full Name</Label>
            <Input id="ownerName" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="e.g. Chinedu Okafor" required />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="080X XXX XXXX" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Product Category</Label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full h-9 bg-transparent border border-input rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="market">Market Location</Label>
          <select
            id="market"
            value={market}
            onChange={e => setMarket(e.target.value)}
            className="w-full h-9 bg-transparent border border-input rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {markets.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Tell us about your shop</Label>
          <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What do you sell? How long have you been trading?" rows={4} required />
        </div>

        <Button type="submit" size="lg" className="w-full">Submit Application</Button>
        <p className="text-xs text-muted-foreground text-center">
          By applying, you agree to our <Link href="/vendors/policies" className="underline hover:text-primary">Seller Policies</Link>.
        </p>
      </form>
    </PageLayout>
  );
};

// ---------------- Vendor Dashboard ----------------

const STAT_CARDS = [
  { label: 'Total Sales (30d)', value: formatNaira(2450000), icon: Wallet, change: '+12.4%' },
  { label: 'Orders', value: '184', icon: Package, change: '+8 today' },
  { label: 'Store Rating', value: '4.8', icon: Star, change: '512 reviews' },
  { label: 'Conversion', value: '6.2%', icon: TrendingUp, change: '+0.4%' },
];

const RECENT_ORDERS = [
  { id: 'MM-38291', item: 'Samsung 55" Smart TV', buyer: 'Chinedu O.', amount: 385000, status: 'Delivered' },
  { id: 'MM-38287', item: 'Sony Home Theatre System', buyer: 'Amina B.', amount: 145000, status: 'Shipped' },
  { id: 'MM-38279', item: 'LG Split AC 1.5HP', buyer: 'Tunde B.', amount: 320000, status: 'Processing' },
  { id: 'MM-38265', item: 'Panasonic Rice Cooker', buyer: 'Ngozi E.', amount: 28000, status: 'Delivered' },
];

const statusStyle: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
};

export const VendorDashboardPage = () => {
  const { applications, latestApplication } = useVendor();

  if (applications.length === 0) {
    return (
      <div className="min-h-[70vh] bg-background py-16">
        <div className="container mx-auto px-3 max-w-2xl text-center space-y-4">
          <Store className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-3xl font-display font-bold">No Shop Yet</h1>
          <p className="text-muted-foreground">
            You don't have a vendor application on file. Open a shop to unlock your dashboard with sales, orders, and performance insights.
          </p>
          <Link href="/vendors/open-shop"><Button size="lg" className="mt-2">Open a Shop</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-3 max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">{latestApplication?.shopName}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Vendor Dashboard · {latestApplication?.market}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5" /> {latestApplication?.status}
          </span>
        </div>

        {latestApplication?.status === 'Pending Review' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3 mb-8">
            Your shop application is being reviewed by our team. The figures below are a preview of what your dashboard will look like once approved.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <stat.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-2xl font-display font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-primary mt-2 font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border font-display font-semibold">Recent Orders</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Item</th>
                  <th className="px-5 py-3 font-medium">Buyer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map(o => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium">{o.id}</td>
                    <td className="px-5 py-3">{o.item}</td>
                    <td className="px-5 py-3 text-muted-foreground">{o.buyer}</td>
                    <td className="px-5 py-3">{formatNaira(o.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[o.status]}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- Seller Policies ----------------

const POLICY_SECTIONS = [
  {
    icon: ShieldCheck,
    title: 'Verification & Onboarding',
    body: 'Every shop is physically inspected before going live. Vendors must provide a valid ID, proof of shop location within a registered market, and at least one contactable phone number.',
  },
  {
    icon: Percent,
    title: 'Fees & Payouts',
    body: 'Market Mirror charges an 8% commission on completed orders. Payouts are processed weekly to your registered bank account, minus any refunds or disputes deducted that cycle.',
  },
  {
    icon: Package,
    title: 'Listing Standards',
    body: 'Product photos must be accurate and show the real item for sale. Prices listed online must match your in-shop price. Stock levels should be kept up to date to avoid order cancellations.',
  },
  {
    icon: Truck,
    title: 'Fulfilment & Delivery',
    body: 'Orders must be confirmed within 24 hours and handed to a rider within 48 hours. Repeated late fulfilment may result in reduced search visibility.',
  },
  {
    icon: Ban,
    title: 'Prohibited Items',
    body: 'Counterfeit goods, stolen electronics, weapons, and any item without valid import documentation are strictly prohibited and will result in immediate shop suspension.',
  },
  {
    icon: AlertTriangle,
    title: 'Disputes & Suspension',
    body: 'Vendors with an unresolved dispute rate above 5% may be temporarily suspended pending investigation. Sellers can respond to disputes directly from their dashboard.',
  },
];

export const SellerPoliciesPage = () => (
  <div className="min-h-[70vh] bg-background py-16">
    <div className="container mx-auto px-3 max-w-3xl">
      <h1 className="text-4xl font-display font-bold mb-2">Seller Policies</h1>
      <p className="text-muted-foreground mb-10">The rules and standards every Market Mirror vendor agrees to follow.</p>

      <div className="space-y-6">
        {POLICY_SECTIONS.map(section => (
          <div key={section.title} className="flex gap-4 bg-card border border-border rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <section.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/vendors/open-shop"><Button size="lg">Apply to Sell on Market Mirror</Button></Link>
      </div>
    </div>
  </div>
);
