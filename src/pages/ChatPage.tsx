import { useParams, Link, useLocation } from 'wouter';
import { useState, useRef, useEffect, useCallback } from 'react';
import { shops } from '@/data/mockData';
import { 
  ArrowLeft, Send, Phone, Video, MoreVertical, 
  Image, Paperclip, Smile, Check, CheckCheck, Store,
  MapPin, Star, ShieldCheck, X, Mic, MicOff, 
  Volume2, VolumeX, PhoneOff, VideoOff, User,
  Trash2, BellOff, Bell, Flag, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'vendor';
  timestamp: string;
  read: boolean;
  image?: string;
};

const initialMessages: Message[] = [
  { id: 1, text: 'Hello! Welcome to our shop. How can I help you today?', sender: 'vendor', timestamp: '10:30 AM', read: true },
  { id: 2, text: 'Hi! I\'m interested in the LG 65-inch TV. Is it available?', sender: 'user', timestamp: '10:32 AM', read: true },
  { id: 3, text: 'Yes, we have it in stock! It comes with a 2-year warranty. Would you like to place an order?', sender: 'vendor', timestamp: '10:33 AM', read: true },
  { id: 4, text: 'What\'s the best price you can offer?', sender: 'user', timestamp: '10:35 AM', read: true },
  { id: 5, text: 'For this model, we can do ₦430,000 with free delivery within Lagos. That\'s our best price.', sender: 'vendor', timestamp: '10:36 AM', read: false },
];

const vendorReplies = [
  "Thanks for your message! Let me check on that for you.",
  "Great choice! That's one of our most popular items.",
  "I can offer you a discount if you buy more than one.",
  "We have that in stock. Would you like me to reserve it?",
  "The delivery will take 1-2 business days within Lagos.",
  "Let me send you some more pictures of the product.",
  "That's our best price. I can't go lower than that.",
  "We also have similar products at different price points.",
];

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👏', '🎉', '❤️', '🔥', '💯', '✅', '🙏', '😊', '🤝', '💪', '📦'];

export default function ChatPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const shopId = parseInt(id || '1');
  const shop = shops.find(s => s.id === shopId) || shops[0];
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [muted, setMuted] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active' | 'ended'>('idle');
  const [callType, setCallType] = useState<'phone' | 'video'>('phone');
  const [callDuration, setCallDuration] = useState(0);
  const [callMuted, setCallMuted] = useState(false);
  const [callSpeakerOff, setCallSpeakerOff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  // Back button logic — detect if we came from /chat or /shop
  const handleBack = () => {
    const referrer = sessionStorage.getItem('chatReferrer');
    if (referrer === 'chat') {
      navigate('/chat');
    } else {
      navigate(`/shop/${shop.id}`);
    }
  };

  // Send message
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const userMsg: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setShowEmojiPicker(false);
    
    // Simulate vendor typing
    setIsTyping(true);
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setIsTyping(false);
      const vendorMsg: Message = {
        id: Date.now() + 1,
        text: vendorReplies[Math.floor(Math.random() * vendorReplies.length)],
        sender: 'vendor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, vendorMsg]);
    }, delay);
  };

  // Send image (simulated)
  const handleImageSend = () => {
    const imgMsg: Message = {
      id: Date.now(),
      text: '📸 Shared a photo',
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setMessages(prev => [...prev, imgMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const vendorMsg: Message = {
        id: Date.now() + 1,
        text: 'Nice photo! Thanks for sharing. Let me know if you need anything else.',
        sender: 'vendor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, vendorMsg]);
    }, 1500);
  };

  // Send file (simulated)
  const handleFileSend = () => {
    const fileMsg: Message = {
      id: Date.now(),
      text: '📎 Shared a document',
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setMessages(prev => [...prev, fileMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const vendorMsg: Message = {
        id: Date.now() + 1,
        text: 'Got the file! I\'ll review it and get back to you.',
        sender: 'vendor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, vendorMsg]);
    }, 1500);
  };

  // Delete message
  const handleDeleteMessage = (msgId: number) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    toast({ title: "Message deleted" });
  };

  // Call logic
  const startCall = (type: 'phone' | 'video') => {
    setCallType(type);
    setCallState('ringing');
    setCallDuration(0);
    setCallMuted(false);
    setCallSpeakerOff(false);
    
    // Ring for 3 seconds then connect
    setTimeout(() => {
      setCallState('active');
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Auto end after 30-60 seconds
      setTimeout(() => {
        endCall();
      }, 30000 + Math.random() * 30000);
    }, 3000);
  };

  const endCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallState('ended');
    setTimeout(() => setCallState('idle'), 1500);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => setMuted(!muted);

  const handleClearChat = () => {
    setMessages([]);
    toast({ title: "Chat cleared" });
  };

  const handleToggleMute = () => {
    setMuted(!muted);
    toast({ 
      title: muted ? "Notifications unmuted" : "Notifications muted",
      description: muted ? "You'll receive message notifications" : "You won't receive message notifications"
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Chat Header */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-3 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link href={`/shop/${shop.id}`} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {shop.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-sm text-foreground">{shop.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3 h-3 text-secondary" /> Verified Vendor
                  <span className="text-border mx-1">|</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9" 
              onClick={() => startCall('phone')}
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9" 
              onClick={() => startCall('video')}
            >
              <Video className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate(`/shop/${shop.id}`)}>
                  <Store className="w-4 h-4 mr-2" /> View Shop
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => startCall('phone')}>
                  <Phone className="w-4 h-4 mr-2" /> Voice Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => startCall('video')}>
                  <Video className="w-4 h-4 mr-2" /> Video Call
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggleMute}>
                  {muted ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                  {muted ? 'Unmute Notifications' : 'Mute Notifications'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearChat}>
                  <Trash2 className="w-4 h-4 mr-2" /> Clear Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    toast({ title: "Vendor reported", description: "Thank you for helping keep Market Mirror safe." });
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" /> Report Vendor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Shop Info Banner */}
      <div className="bg-primary/5 border-b border-border px-3 py-3">
        <div className="container mx-auto flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {shop.location.split(',')[0]}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {shop.rating}
          </div>
          <div className="flex items-center gap-1">
            <Store className="w-3 h-3" /> {shop.category}
          </div>
          {muted && (
            <div className="flex items-center gap-1 text-orange-500">
              <BellOff className="w-3 h-3" /> Muted
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto px-3 py-6">
        <div className="container mx-auto max-w-2xl space-y-4">
          {/* Date separator */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground font-medium">Today</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`group flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="relative max-w-[80%] md:max-w-[70%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    <span className={`text-[10px] ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.timestamp}
                    </span>
                    {msg.sender === 'user' && (
                      msg.read ? (
                        <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                      ) : (
                        <Check className="w-3 h-3 text-primary-foreground/70" />
                      )
                    )}
                  </div>
                </div>
                {/* Delete button on hover (user messages only) */}
                {msg.sender === 'user' && (
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-full"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border sticky bottom-0 z-40">
        <div className="container mx-auto max-w-2xl px-3 py-3">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-3 p-3 bg-card border border-border rounded-xl shadow-lg">
              <div className="grid grid-cols-8 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setNewMessage(prev => prev + emoji);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input 
              ref={fileInputRef} 
              type="file" 
              className="hidden" 
              onChange={handleFileSend}
              accept=".pdf,.doc,.docx,.txt"
            />
            <input 
              ref={imageInputRef} 
              type="file" 
              className="hidden" 
              onChange={handleImageSend}
              accept="image/*"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 shrink-0"
              onClick={() => imageInputRef.current?.click()}
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-grow relative">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-muted border border-border rounded-full px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className={`w-4 h-4 ${showEmojiPicker ? 'text-primary' : ''}`} />
              </Button>
            </div>
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full shrink-0"
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PHONE CALL OVERLAY
          ═══════════════════════════════════════════════════════════════════ */}
      {callState !== 'idle' && callType === 'phone' && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-b from-secondary via-secondary to-background">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            {/* Shop avatar */}
            <div className="relative mb-6">
              <Avatar className="h-28 w-28 border-4 border-white/20">
                <AvatarFallback className="bg-white/10 text-white text-4xl font-bold">
                  {shop.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {callState === 'active' && (
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-secondary animate-pulse"></span>
              )}
            </div>
            
            {/* Shop name */}
            <h2 className="text-2xl font-display font-bold text-white mb-1">{shop.name}</h2>
            <p className="text-white/60 text-sm mb-2">{shop.category}</p>
            
            {/* Call status */}
            <div className="flex items-center gap-2 mb-1">
              {callState === 'ringing' && (
                <>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  <p className="text-white/80 text-base font-medium">Ringing...</p>
                </>
              )}
              {callState === 'active' && (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <p className="text-white/80 text-base font-medium">{formatDuration(callDuration)}</p>
                </>
              )}
              {callState === 'ended' && (
                <>
                  <PhoneOff className="w-4 h-4 text-red-400" />
                  <p className="text-white/80 text-base font-medium">Call ended</p>
                </>
              )}
            </div>
          </div>
          
          {/* Call controls */}
          <div className="pb-12 md:pb-16 relative z-10">
            <div className="flex items-center justify-center gap-6">
              {/* Mute */}
              <button
                onClick={() => setCallMuted(!callMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  callMuted ? 'bg-white text-secondary' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {callMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              {/* Speaker */}
              <button
                onClick={() => setCallSpeakerOff(!callSpeakerOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  callSpeakerOff ? 'bg-white text-secondary' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {callSpeakerOff ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              
              {/* End call */}
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIDEO CALL OVERLAY
          ═══════════════════════════════════════════════════════════════════ */}
      {callState !== 'idle' && callType === 'video' && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          {/* "Video feed" background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Video className="w-48 h-48 text-white" />
            </div>
          </div>
          
          {/* Top bar */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white/30">
                <AvatarFallback className="bg-white/10 text-white font-bold">
                  {shop.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-white text-sm">{shop.name}</h3>
                <p className="text-white/60 text-xs">
                  {callState === 'ringing' ? 'Connecting...' : callState === 'active' ? formatDuration(callDuration) : 'Call ended'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Center content */}
          <div className="flex-1 relative z-10 flex items-center justify-center">
            {callState === 'ringing' && (
              <div className="text-center">
                <Avatar className="h-32 w-32 border-4 border-white/20 mx-auto mb-4">
                  <AvatarFallback className="bg-white/10 text-white text-5xl font-bold">
                    {shop.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-white/80 text-lg font-medium animate-pulse">Video calling...</p>
              </div>
            )}
            {callState === 'active' && (
              <div className="text-center">
                <Avatar className="h-32 w-32 border-4 border-white/20 mx-auto mb-4">
                  <AvatarFallback className="bg-white/10 text-white text-5xl font-bold">
                    {shop.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-white/80 text-lg">{formatDuration(callDuration)}</p>
              </div>
            )}
            {callState === 'ended' && (
              <div className="text-center">
                <p className="text-white/80 text-lg">Call ended</p>
              </div>
            )}
            
            {/* Self view (small) */}
            {callState === 'active' && (
              <div className="absolute bottom-24 right-4 w-32 h-44 bg-gray-700 rounded-2xl border-2 border-white/20 flex items-center justify-center shadow-xl overflow-hidden">
                <User className="w-10 h-10 text-white/40" />
              </div>
            )}
          </div>
          
          {/* Video call controls */}
          <div className="relative z-10 pb-12 md:pb-16">
            <div className="flex items-center justify-center gap-5">
              {/* Mute */}
              <button
                onClick={() => setCallMuted(!callMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  callMuted ? 'bg-white text-black' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {callMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              {/* Camera off */}
              <button
                onClick={() => setCallSpeakerOff(!callSpeakerOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  callSpeakerOff ? 'bg-white text-black' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {callSpeakerOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
              
              {/* End call */}
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
