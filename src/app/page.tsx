'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Lock,
  Heart,
  Sparkles,
  Calendar,
  Copy,
  Download,
  Upload,
  Upload as UploadIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Gift,
  Star,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';

// ============================================================
// EDIT HERE - Customize these values
// ============================================================
const PARTNER_NAME = 'Wifey'; // EDIT HERE: Your partner's name
const SECRET_WORD = 'forever'; // EDIT HERE: The secret password
const ANNIVERSARY_DATE = { year: 2023, month: 6, day: 14 }; // EDIT HERE: Anniversary date
// ============================================================

type TimelineEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  photoId?: string;
  photoUrl?: string;
};

type Envelope = {
  id: string;
  title: string;
  message: string;
  extraMessage?: string;
};

type Photo = {
  id: string;
  filename: string;
  url: string;
};

export default function LovePage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedEnvelope, setSelectedEnvelope] = useState<Envelope | null>(null);
  const [showExtraMessage, setShowExtraMessage] = useState(false);

  // Form states
  const [timelineForm, setTimelineForm] = useState({
    title: '',
    content: '',
    date: '',
    photoId: '',
  });
  const [envelopeForm, setEnvelopeForm] = useState({
    title: '',
    message: '',
    extraMessage: '',
  });

  // Edit states
  const [editingTimeline, setEditingTimeline] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default envelopes
  const defaultEnvelopes: Envelope[] = [
    {
      id: 'default-1',
      title: 'Open when you miss me',
      message: 'Remember that I\'m always thinking of you, no matter how far apart we are. Every moment away from you makes me appreciate our time together even more. You are my sunshine on cloudy days.',
      extraMessage: 'I love you more than words can say 💕',
    },
    {
      id: 'default-2',
      title: 'Open when you can\'t sleep',
      message: 'Close your eyes and imagine the day we met. That smile, that laugh - they still give me butterflies. You\'re my lullaby, my peace, my everything. Sweet dreams, my love.',
      extraMessage: 'You make my world brighter just by being in it ✨',
    },
    {
      id: 'default-3',
      title: 'Open when you need motivation',
      message: 'You are stronger than you know, braver than you believe, and more loved than you can imagine. Every challenge you face only makes you more amazing. I believe in you, always.',
      extraMessage: 'You\'re my inspiration every single day 💪',
    },
    {
      id: 'default-4',
      title: 'Open when you\'re having a bad day',
      message: 'I\'m here for you, always. Let me hold you, listen to you, and remind you how wonderful you are. Tomorrow is a new day, and we\'ll face it together.',
      extraMessage: 'You\'re never alone, I\'m always with you 🤗',
    },
    {
      id: 'default-5',
      title: 'Open when you need a laugh',
      message: 'Remember when we [insert funny memory here]? That look on your face was priceless! You have the most beautiful laugh, and it\'s the sound I love most in the world.',
      extraMessage: 'You\'re my favorite comedian 😂',
    },
    {
      id: 'default-6',
      title: 'Open when you feel unloved',
      message: 'You are the most precious gift in my life. Every day with you is a blessing, and I fall more in love with you with each passing moment. You are cherished, adored, and deeply loved.',
      extraMessage: 'My heart beats only for you 💖',
    },
    {
      id: 'default-7',
      title: 'Open when we\'re apart',
      message: 'Distance means nothing when someone means everything. Every message from you makes my day, every call is the highlight of my week. I\'m counting down the moments until I see you again.',
      extraMessage: 'You\'re my home, wherever you are 🏠💕',
    },
    {
      id: 'default-8',
      title: 'Open when you want to feel loved',
      message: 'From the moment I met you, my life changed for the better. You\'ve shown me what true love means - it\'s patient, kind, and everlasting. Thank you for being my everything.',
      extraMessage: 'You are my forever and always 💑',
    },
  ];

  // Initialize envelopes
  useEffect(() => {
    const savedEnvelopes = localStorage.getItem('envelopes');
    if (savedEnvelopes) {
      setEnvelopes(JSON.parse(savedEnvelopes));
    } else {
      setEnvelopes(defaultEnvelopes);
      localStorage.setItem('envelopes', JSON.stringify(defaultEnvelopes));
    }
  }, []);

  // Load photos from localStorage
  useEffect(() => {
    const savedPhotos = localStorage.getItem('photos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Load timeline entries from localStorage
  useEffect(() => {
    const savedTimeline = localStorage.getItem('timeline');
    if (savedTimeline) {
      setTimelineEntries(JSON.parse(savedTimeline));
    }
  }, []);

  // Calculate days together
  const calculateDaysTogether = () => {
    const startDate = new Date(ANNIVERSARY_DATE.year, ANNIVERSARY_DATE.month - 1, ANNIVERSARY_DATE.day);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Vows for generator
  const vows = [
    `I promise to love ${PARTNER_NAME} more each day, to cherish every moment we share, and to be your partner in everything life brings us.`,
    `I vow to support ${PARTNER_NAME} in all your dreams, to laugh with you in joy, and to comfort you in sorrow.`,
    `I promise to ${PARTNER_NAME} that I'll always be your safe haven, your biggest cheerleader, and your forever love.`,
    `I pledge my heart to ${PARTNER_NAME} today and always, to grow old with you, and to love you through all of life's adventures.`,
    `I promise to ${PARTNER_NAME} that our love will be my greatest adventure, my sweetest journey, and my favorite story to tell.`,
  ];

  const [currentVow, setCurrentVow] = useState(0);

  // Password handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === SECRET_WORD.toLowerCase()) {
      setIsUnlocked(true);
      toast({
        title: 'Welcome, my love! 💕',
        description: `I'm so glad you're here, ${PARTNER_NAME}!`,
      });
    } else {
      setShowPasswordError(true);
      setPassword('');
      setTimeout(() => setShowPasswordError(false), 2000);
    }
  };

  // Heart click handler
  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = {
      id: Date.now(),
      x,
      y,
    };

    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 3000);
  };

  // Surprise confetti
  const triggerSurprise = () => {
    const emojis = ['❤️', '💕', '💖', '💗', '💝', '✨', '🌟', '💫', '🎉', '🎊'];
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * (window.innerWidth - 50),
      y: window.innerHeight,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setConfetti(newConfetti);

    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('photos', file);
    });

    try {
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadedPhotos = await response.json();
        setPhotos((prev) => [...prev, ...uploadedPhotos]);
        localStorage.setItem('photos', JSON.stringify([...photos, ...uploadedPhotos]));
        toast({
          title: 'Photos uploaded! 📸',
          description: 'Your beautiful memories have been saved.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  // Photo delete handler
  const handleDeletePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        const updatedPhotos = photos.filter((p) => p.id !== photoId);
        localStorage.setItem('photos', JSON.stringify(updatedPhotos));
        toast({
          title: 'Photo deleted',
          description: 'The photo has been removed from your gallery.',
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Timeline CRUD operations
  const handleAddTimelineEntry = async () => {
    if (!timelineForm.title || !timelineForm.content || !timelineForm.date) {
      toast({
        title: 'Please fill in all fields',
        description: 'Title, content, and date are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timelineForm),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setTimelineEntries((prev) => [...prev, newEntry].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
        localStorage.setItem('timeline', JSON.stringify([...timelineEntries, newEntry]));
        setTimelineForm({ title: '', content: '', date: '', photoId: '' });
        toast({
          title: 'Memory added! 📝',
          description: 'Your special moment has been saved.',
        });
      }
    } catch (error) {
      console.error('Error adding timeline entry:', error);
    }
  };

  const handleEditTimelineEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/timeline/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timelineForm),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        setTimelineEntries((prev) =>
          prev.map((e) => (e.id === id ? updatedEntry : e)).sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
        setEditingTimeline(null);
        toast({
          title: 'Memory updated! ✏️',
          description: 'Your memory has been edited.',
        });
      }
    } catch (error) {
      console.error('Error editing timeline entry:', error);
    }
  };

  const handleDeleteTimelineEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/timeline/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTimelineEntries((prev) => prev.filter((e) => e.id !== id));
        toast({
          title: 'Memory deleted',
          description: 'The memory has been removed.',
        });
      }
    } catch (error) {
      console.error('Error deleting timeline entry:', error);
    }
  };

  // Envelope CRUD operations
  const handleAddEnvelope = async () => {
    if (!envelopeForm.title || !envelopeForm.message) {
      toast({
        title: 'Please fill in title and message',
        description: 'These fields are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/envelopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envelopeForm),
      });

      if (response.ok) {
        const newEnvelope = await response.json();
        setEnvelopes((prev) => [...prev, newEnvelope]);
        localStorage.setItem('envelopes', JSON.stringify([...envelopes, newEnvelope]));
        setEnvelopeForm({ title: '', message: '', extraMessage: '' });
        toast({
          title: 'Envelope added! ✉️',
          description: 'Your message has been saved.',
        });
      }
    } catch (error) {
      console.error('Error adding envelope:', error);
    }
  };

  const handleDeleteEnvelope = async (id: string) => {
    try {
      const response = await fetch(`/api/envelopes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEnvelopes((prev) => prev.filter((e) => e.id !== id));
        localStorage.setItem('envelopes', JSON.stringify(envelopes.filter((e) => e.id !== id)));
        toast({
          title: 'Envelope deleted',
          description: 'The envelope has been removed.',
        });
      }
    } catch (error) {
      console.error('Error deleting envelope:', error);
    }
  };

  // Share features
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied! 📋',
      description: 'Share this with your loved one!',
    });
  };

  const handleExportMemories = async () => {
    try {
      const response = await fetch('/api/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `our-memories-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast({
        title: 'Memories exported! 💾',
        description: 'Your memories have been downloaded.',
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleImportMemories = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Memories imported! 📥',
          description: 'Your memories have been restored.',
        });
      }
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  // Generate vow
  const handleGenerateVow = () => {
    setCurrentVow((prev) => (prev + 1) % vows.length);
  };

  // Lightbox navigation
  const handleNextPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  // If not unlocked, show lock screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 relative overflow-hidden">
        {/* Animated starfield background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-teal-500/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Lock Screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="flex justify-center"
              >
                <Heart className="w-20 h-20 text-pink-400 fill-pink-400" />
              </motion.div>

              <div className="text-center space-y-2">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white"
                >
                  For You, {PARTNER_NAME}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-pink-200"
                >
                  Enter our secret word to continue
                </motion.p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Secret word..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-pink-200/50 text-lg text-center"
                  />
                  {showPasswordError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-300 text-sm text-center"
                    >
                      That's not right, my love. Try again 💕
                    </motion.p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-6"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Open My Heart
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main content
  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative"
    >
      {/* Animated starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Hearts on click */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: heart.y, scale: 0 }}
            animate={{
              y: heart.y - 300,
              opacity: 0,
              scale: 1,
              rotate: [0, 360],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="fixed pointer-events-none z-50"
            style={{ left: heart.x, top: heart.y }}
          >
            <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {confetti.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: window.innerHeight, opacity: 1, rotate: 0 }}
            animate={{
              y: -100,
              opacity: 0,
              rotate: 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4 + Math.random() * 2 }}
            className="fixed pointer-events-none z-50 text-3xl"
            style={{ left: item.x }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
          {/* Animated gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-teal-500/10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="max-w-4xl mx-auto text-center space-y-8 relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Heart className="w-32 h-32 text-pink-400 fill-pink-400 drop-shadow-[0_0_30px_rgba(244,114,182,0.8)]" />
                </motion.div>
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-teal-400 bg-clip-text text-transparent"
            >
              {PARTNER_NAME}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-pink-200"
            >
              You are my everything, forever and always 💕
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Calendar className="w-6 h-6 text-pink-400" />
                    <p className="text-3xl font-bold text-white">
                      {calculateDaysTogether()}
                    </p>
                  </div>
                  <p className="text-pink-200">Days of Love</p>
                  <p className="text-sm text-pink-300/70">
                    Since {ANNIVERSARY_DATE.month}/{ANNIVERSARY_DATE.day}/{ANNIVERSARY_DATE.year}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex justify-center gap-4"
            >
              <Button
                onClick={handleGenerateVow}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate a Vow
              </Button>
              <Button
                onClick={triggerSurprise}
                variant="outline"
                className="border-pink-400 text-pink-400 hover:bg-pink-400/10"
                size="lg"
              >
                <Gift className="w-4 h-4 mr-2" />
                Surprise!
              </Button>
            </motion.div>

            {currentVow > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-pink-200 italic max-w-2xl mx-auto"
              >
                "{vows[currentVow - 1]}"
              </motion.p>
            )}
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Our Memories</h2>
              <p className="text-pink-200">Every picture tells our love story 📸</p>
            </motion.div>

            <div className="flex justify-center mb-8">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedPhoto(index)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-white/10 group-hover:border-pink-400/50 transition-all">
                      <img
                        src={photo.url}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-pink-200/50 py-12">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No photos yet. Upload your first memory!</p>
              </div>
            )}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-pink-200">Every moment with you is precious ✨</p>
            </motion.div>

            {/* Add Entry Form */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex justify-center mb-8">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add a Memory
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-gray-900/95 border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Add a New Memory</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      value={timelineForm.title}
                      onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                      placeholder="Our first date..."
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Date</Label>
                    <Input
                      type="date"
                      value={timelineForm.date}
                      onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Memory</Label>
                    <Textarea
                      value={timelineForm.content}
                      onChange={(e) => setTimelineForm({ ...timelineForm, content: e.target.value })}
                      placeholder="Tell me about this moment..."
                      rows={4}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button onClick={handleAddTimelineEntry} className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
                    Save Memory
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Timeline */}
            {timelineEntries.length > 0 ? (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-teal-500" />

                <div className="space-y-8">
                  {timelineEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      {/* Glowing node */}
                      <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full shadow-[0_0_20px_rgba(244,114,182,0.8)]" />

                      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} pl-12 md:pl-0`}>
                        <Card className="backdrop-blur-xl bg-white/5 border-white/20 hover:border-pink-400/50 transition-all">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-white">{entry.title}</h3>
                                <p className="text-sm text-pink-200">{new Date(entry.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingTimeline(entry.id);
                                    setTimelineForm({
                                      title: entry.title,
                                      content: entry.content,
                                      date: entry.date.split('T')[0],
                                      photoId: entry.photoId || '',
                                    });
                                  }}
                                  className="text-pink-400 hover:text-pink-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTimelineEntry(entry.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-pink-100">{entry.content}</p>
                            {entry.photoUrl && (
                              <div className="mt-4">
                                <img
                                  src={entry.photoUrl}
                                  alt={entry.title}
                                  className="rounded-lg max-h-48 w-full object-cover"
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-pink-200/50 py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No memories yet. Add your first one!</p>
              </div>
            )}
          </div>
        </section>

        {/* Envelopes Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Open When...</h2>
              <p className="text-pink-200">Messages for every moment 💌</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {envelopes.map((envelope, index) => (
                <motion.div
                  key={envelope.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card
                    onClick={() => {
                      setSelectedEnvelope(envelope);
                      setShowExtraMessage(false);
                    }}
                    className="backdrop-blur-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-white/20 hover:border-pink-400/50 transition-all cursor-pointer h-full min-h-[200px] flex flex-col justify-between"
                  >
                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                            <MessageSquare className="w-8 h-8 text-pink-400" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-white text-center">{envelope.title}</h3>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-pink-400 text-pink-400 hover:bg-pink-400/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnvelope(envelope);
                          setShowExtraMessage(false);
                        }}
                      >
                        Open
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add New Envelope Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: envelopes.length * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="backdrop-blur-xl bg-white/5 border-dashed border-2 border-white/20 hover:border-pink-400/50 transition-all cursor-pointer h-full min-h-[200px] flex items-center justify-center">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="flex justify-center">
                          <Plus className="w-16 h-16 text-pink-400/50" />
                        </div>
                        <p className="text-pink-200">Add a new envelope</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/95 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Envelope</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label className="text-white">Title</Label>
                      <Input
                        value={envelopeForm.title}
                        onChange={(e) => setEnvelopeForm({ ...envelopeForm, title: e.target.value })}
                        placeholder="Open when..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Message</Label>
                      <Textarea
                        value={envelopeForm.message}
                        onChange={(e) => setEnvelopeForm({ ...envelopeForm, message: e.target.value })}
                        placeholder="Write your sweet message..."
                        rows={4}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Hidden Message (optional)</Label>
                      <Textarea
                        value={envelopeForm.extraMessage}
                        onChange={(e) => setEnvelopeForm({ ...envelopeForm, extraMessage: e.target.value })}
                        placeholder="A secret message revealed after 3 seconds..."
                        rows={2}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <Button onClick={handleAddEnvelope} className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
                      Save Envelope
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Share Our Love</h2>
              <p className="text-pink-200">Save and share your precious memories 💝</p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="border-pink-400 text-pink-400 hover:bg-pink-400/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={handleExportMemories}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Memories
              </Button>
              <Button
                onClick={() => document.getElementById('import-input')?.click()}
                variant="outline"
                className="border-teal-400 text-teal-400 hover:bg-teal-400/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Memories
              </Button>
              <input
                id="import-input"
                type="file"
                accept=".json"
                onChange={handleImportMemories}
                className="hidden"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex justify-center mb-4"
            >
              <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
            </motion.div>
            <p className="text-pink-200">
              Made with 💕 for {PARTNER_NAME}
            </p>
            <p className="text-sm text-pink-300/50 mt-2">
              Forever and always
            </p>
          </div>
        </footer>
      </div>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="bg-transparent border-none p-0 max-w-4xl w-full">
              <div className="relative">
                <img
                  src={photos[selectedPhoto].url}
                  alt={`Photo ${selectedPhoto + 1}`}
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevPhoto}
                  disabled={selectedPhoto === 0}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPhoto}
                  disabled={selectedPhoto === photos.length - 1}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Envelope Modal */}
      <AnimatePresence>
        {selectedEnvelope && (
          <Dialog open={!!selectedEnvelope} onOpenChange={() => setSelectedEnvelope(null)}>
            <DialogContent className="bg-gray-900/95 border-white/20 max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">{selectedEnvelope.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-100 text-lg leading-relaxed"
                >
                  {selectedEnvelope.message}
                </motion.div>

                {selectedEnvelope.extraMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: showExtraMessage ? 1 : 0,
                      y: showExtraMessage ? 0 : 20,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-400/30 ${!showExtraMessage ? 'blur-sm' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <p className="text-sm font-semibold text-pink-400">Secret message</p>
                    </div>
                    <p className="text-white italic">{selectedEnvelope.extraMessage}</p>
                  </motion.div>
                )}

                {selectedEnvelope.extraMessage && !showExtraMessage && (
                  <div className="text-center">
                    <p className="text-pink-300 text-sm">Wait for 3 seconds to reveal the secret... ✨</p>
                  </div>
                )}

                {!showExtraMessage && selectedEnvelope.extraMessage && (
                  <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, onComplete: () => setShowExtraMessage(true) }}
                      className="h-full bg-pink-400"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedEnvelope(null)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
                  >
                    Close with Love
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400/10"
                    onClick={() => handleDeleteEnvelope(selectedEnvelope.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Timeline Dialog */}
      <AnimatePresence>
        {editingTimeline && (
          <Dialog open={!!editingTimeline} onOpenChange={() => setEditingTimeline(null)}>
            <DialogContent className="bg-gray-900/95 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Memory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-white">Title</Label>
                  <Input
                    value={timelineForm.title}
                    onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Date</Label>
                  <Input
                    type="date"
                    value={timelineForm.date}
                    onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Memory</Label>
                  <Textarea
                    value={timelineForm.content}
                    onChange={(e) => setTimelineForm({ ...timelineForm, content: e.target.value })}
                    rows={4}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Button
                  onClick={() => handleEditTimelineEntry(editingTimeline)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  Update Memory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
