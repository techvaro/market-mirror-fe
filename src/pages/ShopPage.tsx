import { useParams, Link } from 'wouter';
import { shops, products } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { Star, MapPin, Clock, ShieldCheck, Mail, Phone, MessageCircle, Video, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReviews } from '@/context/ReviewsContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ShopPage() {
  const { id } = useParams();
  const { getReviewsByShopId, addReview } = useReviews();
  const { toast } = useToast();
  
  const shopId = parseInt(id || '1');
  const shop = shops.find(s => s.id === shopId) || shops[0];
  
  const shopProducts = products.filter(p => p.shopId === shopId);
  const shopReviews = getReviewsByShopId(shopId);
  
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');

  const averageRating = shopReviews.length > 0 
    ? (shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length).toFixed(1)
    : shop.rating.toFixed(1);
  const reviewCount = shopReviews.length;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactModalOpen(false);
    setContactSubject('');
    setContactMessage('');
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${shop.name}. They will reply shortly.`,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    
    addReview({
      shopId,
      reviewerName: reviewName,
      rating: reviewRating,
      text: reviewText
    });
    
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Shop Hero */}
      <div className="relative">
        <div 
          className="h-48 md:h-64 w-full"
          style={{ background: shop.bannerGradient }}
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container mx-auto px-3">
          <div className="relative -mt-16 md:-mt-20 mb-6 bg-card rounded-2xl p-4 md:p-6 shadow-lg border border-border">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shops" className="hover:text-primary">Shops</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{shop.name}</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              {/* Shop Avatar + Info */}
              <div className="flex gap-4 items-start flex-grow">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted border-4 border-card flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="font-display font-bold text-2xl md:text-3xl text-muted-foreground">
                    {shop.name.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">
                      {shop.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">{shop.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-foreground">{averageRating}</span>
                      <span>({reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {shop.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {shop.hours}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
                <Link href={`/chat/${shop.id}`} onClick={() => sessionStorage.setItem('chatReferrer', 'shop')}>
                  <Button size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" /> Chat
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="gap-2 text-green-600 border-green-600/30 hover:bg-green-50" onClick={() => window.open(`https://wa.me/${shop.phone.replace(/[\s+]/g, '')}`, '_blank')}>
                  <FaWhatsapp className="w-4 h-4" /> WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setContactModalOpen(true)}>
                  <Mail className="w-4 h-4" /> Email
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => window.open(`tel:${shop.phone.replace(/\s/g, '')}`)}>
                  <Phone className="w-4 h-4" /> Call
                </Button>
              </div>
            </div>

            {/* Shop Images Row */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-border overflow-x-auto">
              {shop.images.map((img, i) => (
                <div key={i} className="w-20 h-16 md:w-28 md:h-20 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                  <img src={img} alt={`${shop.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Products ({shopProducts.length})
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            About
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Reviews ({reviewCount})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4"
          >
            {shopProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">About {shop.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {shop.description}
                  <br/><br/>
                  We pride ourselves on providing the best customer service and authentic products. All our products come with a standard manufacturer's warranty and we offer reliable after-sales support.
                </p>
              </div>

              {/* Contact Info Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="font-medium hover:text-primary transition-colors">{shop.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Email</p>
                      <p className="font-medium">info@{shop.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Address</p>
                      <p className="font-medium">{shop.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/chat/${shop.id}`} onClick={() => sessionStorage.setItem('chatReferrer', 'shop')}>
                    <Button size="sm" className="gap-2"><MessageCircle className="w-4 h-4" /> Chat with Vendor</Button>
                  </Link>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => window.open(`tel:${shop.phone.replace(/\s/g, '')}`)}>
                    <Phone className="w-4 h-4" /> Call Now
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </h4>
                <p className="text-sm text-muted-foreground">{shop.location}</p>
                <Link href="/map" className="inline-flex items-center text-xs text-primary mt-2 hover:underline underline-offset-4">
                  View on Market Map
                </Link>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" /> Business Hours
                </h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Mon - Fri:</span> <span>8:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday:</span> <span>8:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday:</span> <span className="text-destructive">Closed</span></div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <h4 className="font-bold mb-2 text-sm text-primary">Quick Actions</h4>
                <div className="flex flex-col gap-2">
                  <Link href={`/chat/${shop.id}`} onClick={() => sessionStorage.setItem('chatReferrer', 'shop')}>
                    <Button size="sm" className="w-full justify-start gap-2"><MessageCircle className="w-4 h-4" /> Start Chat</Button>
                  </Link>
                  <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={() => window.open(`tel:${shop.phone.replace(/\s/g, '')}`)}>
                    <Phone className="w-4 h-4" /> Call Vendor
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={() => window.open(`tel:${shop.phone.replace(/\s/g, '')}`)}>
                    <Video className="w-4 h-4" /> Video Call
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-6 mb-6 bg-card border border-border p-5 rounded-xl">
              <div className="text-center min-w-[100px]">
                <div className="text-4xl font-display font-bold text-foreground">{averageRating}</div>
                <div className="flex gap-1 justify-center my-2">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.floor(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Based on {reviewCount}</div>
              </div>
              
              <div className="flex-grow border-l border-border pl-6 hidden sm:block">
                <div className="space-y-1.5">
                  {[5,4,3,2,1].map(star => {
                    const count = shopReviews.filter(r => Math.floor(r.rating) === star).length;
                    const percent = shopReviews.length > 0 ? (count / shopReviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <div className="w-10 text-right text-muted-foreground">{star} Stars</div>
                        <div className="flex-grow h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-5 mb-8 shadow-sm">
              <h3 className="font-bold mb-3">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className="focus:outline-none">
                        <Star className={`w-7 h-7 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted stroke-muted-foreground'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Your Name</label>
                  <input 
                    type="text" required value={reviewName} onChange={e => setReviewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Review</label>
                  <Textarea 
                    required value={reviewText} onChange={e => setReviewText(e.target.value)}
                    placeholder="What did you like or dislike about this shop?"
                    className="min-h-[80px]"
                  />
                </div>
                <Button type="submit" size="sm">Post Review</Button>
              </form>
            </div>
            
            <h3 className="font-bold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {shopReviews.map(review => (
                <div key={review.id} className="bg-card border border-border p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                        {review.reviewerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{review.reviewerName}</div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2 weeks ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact {shop.name}</DialogTitle>
            <DialogDescription>
              Send a direct message to the vendor. They usually reply within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{shop.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {shop.location.split(',')[0]}</p>
            </div>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input 
                type="text" required value={contactSubject} onChange={e => setContactSubject(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                placeholder="What is this regarding?" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                required value={contactMessage} onChange={e => setContactMessage(e.target.value)}
                placeholder="Type your message here..." 
                className="min-h-[100px]" 
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)}>Cancel</Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
