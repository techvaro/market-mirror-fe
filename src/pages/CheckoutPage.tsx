import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Store, CreditCard, Search, LogIn, UserPlus } from 'lucide-react';
import { shops } from '@/data/mockData';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nassarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

const LGA_BY_STATE: Record<string, string[]> = {
  'Abia': ['Aba North', 'Aba South', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'],
  'Adamawa': ['Demsa', 'Fufure', 'Ganye', 'Girei', 'Gombi', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
  'Akwa Ibom': ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mkpat Enin', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue Offong/Oruko', 'Uyo'],
  'Anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
  'Bauchi': ['Alkaleri', 'Bauchi', 'Bogoro', 'Dass', 'Darazo', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', ' Toro', 'Warji', 'Zaki'],
  'Bayelsa': ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
  'Benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
  'Borno': ['Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hubul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
  'Cross River': ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
  'Delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
  'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
  'Edo': ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba-Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
  'Ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Iworoko-Ekiti', 'Moba', 'Oye'],
  'Enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo-Etiti', 'Igbo-Eze North', 'Igbo-Eze South', 'Isi-Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji-River', 'Udenu', 'Udi', 'Uzo-Uwani'],
  'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
  'Gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
  'Imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West', 'Unuimo'],
  'Jigawa': ['Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Kaugama', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
  'Kaduna': ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'],
  'Kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
  'Katsina': ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dan Musa', 'Dandume', 'Danja', 'Daura', 'Dutsi', 'Dutsin-Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
  'Kebbi': ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'],
  'Kogi': ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa-Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
  'Kwara': ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke-Ero', 'Oyun', 'Patigi'],
  'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere', 'Yaba'],
  'Nassarawa': ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa-Eggon', 'Obi', 'Toto', 'Wamba'],
  'Niger': ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Muya', 'Pailoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
  'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Egbado North', 'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko-Afon', 'Ipokia', 'Obafemi-Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu', 'Sagamu'],
  'Ondo': ['Akoko North-East', 'Akoko North-West', 'Akoko South-East', 'Akoko South-West', 'Akure North', 'Akure South', 'Ese-Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile-Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
  'Osun': ['Atakumosa East', 'Atakumosa West', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Egbedore', 'Ejigbo', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo-Otin', 'Ola-Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
  'Oyo': ['Afijio', 'Akinyele', 'Atiba', 'Atigbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogo Oluwa', 'Ogbomosho North', 'Ogbomosho South', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
  'Plateau': ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam', 'Wase'],
  'Rivers': ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Emohua', 'Eleme', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
  'Sokoto': ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
  'Taraba': ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kurmi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
  'Yobe': ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
  'Zamfara': ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Isah', 'Kaura Namoda', 'Kiyawa', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Tsafe', 'Zurmi'],
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;
  
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    state: '',
    city: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (items.length === 0) {
    setLocation('/cart');
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Sign in to checkout</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Please sign in or create an account to complete your purchase. Your cart items will be waiting for you.
        </p>
        <div className="flex gap-3">
          <Link href="/sign-in">
            <Button className="gap-2 font-bold"><LogIn className="w-4 h-4" /> Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="gap-2 font-bold"><UserPlus className="w-4 h-4" /> Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (deliveryMethod === 'delivery') {
      const newErrors: Record<string, string> = {};
      if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!address.street.trim()) newErrors.street = 'Street address is required';
      if (!address.state) newErrors.state = 'State is required';
      if (!address.city) newErrors.city = 'City is required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    const orderItems = items.map(item => {
      const shop = shops.find(s => s.id === item.product.shopId);
      return {
        productId: item.product.id,
        name: item.product.name,
        variant: item.variant,
        price: item.product.price,
        quantity: item.quantity,
        color: item.product.color,
        shopName: shop?.name || 'Unknown Shop',
      };
    });

    addOrder({
      deliveryMethod,
      paymentMethod,
      items: orderItems,
      subtotal,
      deliveryFee: deliveryMethod === 'delivery' ? deliveryFee : 0,
      total: deliveryMethod === 'delivery' ? total : subtotal,
      address: deliveryMethod === 'delivery' ? address : undefined,
    });

    setLocation('/confirmation');
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-3 max-w-6xl">
        
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10">1</div>
            <div className="font-medium text-sm ml-2 hidden sm:block">Delivery</div>
            <div className="w-12 sm:w-24 h-1 bg-primary mx-2 -ml-4 sm:ml-2"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10">2</div>
            <div className="font-medium text-sm ml-2 hidden sm:block">Payment</div>
            <div className="w-12 sm:w-24 h-1 bg-muted mx-2 -ml-4 sm:ml-2"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm z-10">3</div>
            <div className="font-medium text-sm text-muted-foreground ml-2 hidden sm:block">Confirm</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Form Area */}
          <div className="flex-grow space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Delivery Options */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">How would you like to get your order?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-xl border-2 p-4 flex gap-4 transition-all ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      checked={deliveryMethod === 'delivery'} 
                      onChange={() => setDeliveryMethod('delivery')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-2"><Truck className="w-4 h-4"/> Home Delivery</div>
                      <div className="text-sm text-muted-foreground mt-1">Delivered in 1-2 days within your state.</div>
                    </div>
                  </label>
                  
                  <label className={`cursor-pointer rounded-xl border-2 p-4 flex gap-4 transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                    <input 
                      type="radio" 
                      name="delivery" 
                      checked={deliveryMethod === 'pickup'} 
                      onChange={() => setDeliveryMethod('pickup')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-2"><Store className="w-4 h-4"/> Computer Village Pickup</div>
                      <div className="text-sm text-muted-foreground mt-1">Pick up directly from the vendors.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery Details */}
              {deliveryMethod === 'delivery' && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Delivery Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input 
                        type="text" 
                        value={address.firstName}
                        onChange={e => setAddress({...address, firstName: e.target.value})}
                        className={`w-full bg-background border ${errors.firstName ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary`} 
                        placeholder="e.g. Chinedu" 
                      />
                      {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input 
                        type="text" 
                        value={address.lastName}
                        onChange={e => setAddress({...address, lastName: e.target.value})}
                        className={`w-full bg-background border ${errors.lastName ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary`} 
                        placeholder="e.g. Okafor" 
                      />
                      {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <input 
                        type="tel" 
                        value={address.phone}
                        onChange={e => setAddress({...address, phone: e.target.value})}
                        className={`w-full bg-background border ${errors.phone ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary`} 
                        placeholder="0800 000 0000" 
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Street Address</label>
                      <textarea 
                        rows={2} 
                        value={address.street}
                        onChange={e => setAddress({...address, street: e.target.value})}
                        className={`w-full bg-background border ${errors.street ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary resize-none`} 
                        placeholder="House number and street name"
                      ></textarea>
                      {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <select 
                          value={address.state}
                          onChange={e => setAddress({...address, state: e.target.value, city: ''})}
                          className={`w-full bg-background border ${errors.state ? 'border-destructive' : 'border-border'} rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-primary`}
                        >
                          <option value="">Select State</option>
                          {NIGERIAN_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City / LGA</label>
                      <select 
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                        className={`w-full bg-background border ${errors.city ? 'border-destructive' : 'border-border'} rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary`}
                        disabled={!address.state}
                      >
                        <option value="">{address.state ? 'Select LGA' : 'Select state first'}</option>
                        {address.state && LGA_BY_STATE[address.state]?.map(lga => (
                          <option key={lga} value={lga}>{lga}</option>
                        ))}
                      </select>
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all ${paymentMethod === 'paystack' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                      <span className="font-bold">Paystack (Card / USSD / Bank)</span>
                    </div>
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                      <span className="font-bold">Direct Bank Transfer</span>
                    </div>
                    <Store className="w-5 h-5 text-muted-foreground" />
                  </label>
                </div>
                
                <div className="mt-6 flex items-start gap-3 bg-secondary/10 p-4 rounded-lg text-sm text-secondary-foreground">
                  <ShieldCheck className="w-5 h-5 mt-0.5 flex-shrink-0 text-secondary" />
                  <p><strong>Escrow Protection:</strong> Your payment is held securely and only released to the vendor(s) after you confirm receipt of your order.</p>
                </div>
              </div>

            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.variant}`} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-muted flex-shrink-0 border border-border relative">
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </div>
                      <div className="w-full h-full rounded" style={{ backgroundColor: item.product.color }}></div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium line-clamp-1">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">{item.variant}</div>
                    </div>
                    <div className="text-sm font-bold">
                      {formatNaira(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm mb-6 pt-6 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-bold">{deliveryMethod === 'delivery' ? formatNaira(deliveryFee) : 'Free (Pickup)'}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8 pt-4 border-t border-border">
                <span className="text-lg font-bold">Total to Pay</span>
                <span className="text-2xl font-bold text-primary">{formatNaira(deliveryMethod === 'delivery' ? total : subtotal)}</span>
              </div>
              
              <Button 
                type="submit" 
                form="checkout-form"
                size="lg" 
                className="w-full h-14 text-base font-bold"
              >
                Pay {formatNaira(deliveryMethod === 'delivery' ? total : subtotal)}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
