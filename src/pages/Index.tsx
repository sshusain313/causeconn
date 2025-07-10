import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, Target, Sparkles, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import config from '@/config';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';

interface Cause {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  currentAmount: number;
  targetAmount: number;
  sponsorships?: Array<{ status: string }>;
  imageUrl?: string; // Added for featured causes
}

const HERO_IMAGE = "/images/admin-placeholder.avif"; // Placeholder, replace with actual illustration if available

const benefits = [
  {
    icon: <Heart className="h-8 w-8 text-red-400" />,
    title: "Own Your Space",
    description: "Create authentic connections with causes that align with your brand values."
  },
  {
    icon: <Target className="h-8 w-8 text-red-400" />,
    title: "Targeted Impact",
    description: "Reach engaged audiences who care about the same issues you do."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-red-400" />,
    title: "Sustainable Success",
    description: "Build long-term relationships that create lasting positive change."
  },
  {
    icon: <Users className="h-8 w-8 text-red-400" />,
    title: "Trackable Results",
    description: "Measure your impact with detailed analytics and success stories."
  }
];

const journeySteps = [
  {
    id: "step1",
    step: "1",
    title: "Sponsor a Cause",
    description: "Browse dozens of local causes that need your help.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop",
    imageAlt: "People browsing causes on laptop"
  },
  {
    id: "step2", 
    step: "2",
    title: "Upload Your Logo",
    description: "Add your brand identity to the cause page.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
    imageAlt: "Brand logo design on computer"
  },
  {
    id: "step3",
    step: "3", 
    title: "Choose Where to Distribute",
    description: "Select from multiple campaign channels.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop",
    imageAlt: "Distribution channels and social media"
  },
  {
    id: "step4",
    step: "4",
    title: "Track Your Reach & Impact",
    description: "Get detailed analytics on your campaign's success.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    imageAlt: "Analytics dashboard showing impact metrics"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [featuredCauses, setFeaturedCauses] = useState<Cause[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState('');
  
  useEffect(() => {
    const fetchFeaturedCauses = async () => {
      try {
        setFeaturedLoading(true);
        const response = await axios.get(`${config.apiUrl}/causes`, {
          params: { 
            status: 'approved',
            include: 'sponsorships',
            limit: 3,
            featured: true,
            isOnline: true
          }
        });
        setFeaturedCauses(response.data.slice(0, 3));
      } catch (err) {
        setFeaturedError('Failed to load featured causes.');
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchFeaturedCauses();
  }, []);
  
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.apiUrl}/causes`, {
          params: { status: 'approved', include: 'sponsorships', limit: 12 }
        });
        // Only show causes that are unsponsored (no sponsorships or all sponsorships not approved)
        const unsponsored = response.data.filter((cause: Cause) =>
          !cause.sponsorships || !cause.sponsorships.some(s => s.status === 'approved')
        ).slice(0, 3);
        setCauses(unsponsored);
      } catch (err) {
        setError('Failed to load causes.');
      } finally {
        setLoading(false);
      }
    };
    fetchCauses();
  }, []);
  
  // --- Section Components ---

  // Hero Section
  const HeroSection = () => (
    <section className="bg-white border-b border-gray-100 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Left: Text */}
        <div className="flex-1 max-w-xl">
          <div className="mb-2 text-sm text-gray-500 font-medium">Sponsor Change – Make an Impact</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            A New-Age Promotional Platform for <span className="text-green-600">Purpose-Driven Brands</span>
              </h1>
          <p className="text-lg text-gray-700 mb-8">
            At ChangeBag, we offer brands a sustainable, high-visibility marketing medium that creates impact. No more TV ads, billboards, or print ads – this is real-world branding with real engagement.
              </p>
                <Button 
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition"
                  onClick={() => navigate('/causes')} 
            aria-label="Sponsor a cause"
                >
            Sponsor
                </Button>
              </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center items-center relative">
          {/* <div className="rounded-full bg-green-50 w-[340px] h-[340px] flex items-center justify-center relative"> */}
            <img 
              src={HERO_IMAGE}
              alt="Hero Illustration"
              className="w-full h-56 md:h-96 max-w-xs md:max-w-lg object-contain drop-shadow-xl mx-auto"
              aria-hidden="true"
            />
            {/* Callouts (simulate with positioned badges) */}
            {/* <span className="absolute left-2 top-8 bg-white text-xs px-2 py-1 rounded-full shadow border">Just You</span>
            <span className="absolute right-2 top-8 bg-white text-xs px-2 py-1 rounded-full shadow border">Your Skill</span>
            <span className="absolute left-0 bottom-10 bg-white text-xs px-2 py-1 rounded-full shadow border">No corporate politics.</span>
            <span className="absolute right-0 bottom-10 bg-white text-xs px-2 py-1 rounded-full shadow border">No endless job applications.</span>
            <span className="absolute left-1/2 -top-4 -translate-x-1/2 bg-white text-xs px-2 py-1 rounded-full shadow border">A role. An income to earn.</span> */}
          {/* </div> */}
        </div>
      </div>
    </section>
  );

  // Why Brands Sponsor Section
  const WhySponsorSection = () => (
    <section className="bg-white border-b border-gray-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
          Why brands sponsor <span className="text-green-600">changebag.org</span>
        </h2>
        <div className="flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-6 space-y-8 md:space-y-0">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-green-50 rounded-xl p-8 flex flex-col items-center shadow hover:shadow-md transition w-full md:w-auto">
              <div className="mb-4">{React.cloneElement(benefit.icon, { className: 'h-10 w-10 text-green-600' })}</div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 text-center">{benefit.title}</h3>
              <p className="text-gray-600 text-base text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition w-full sm:w-auto"
            onClick={() => navigate('/sponsor/new')}
            aria-label="Sponsor a cause"
          >
            Sponsor
          </Button>
        </div>
      </div>
    </section>
  );

  // Featured Causes Section
  const FeaturedCausesSection = () => (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Causes that need you <span className="text-green-600">right now</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These high-impact causes are looking for brand partners who are ready to make a meaningful difference in the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredLoading ? (
            [1,2,3].map((i) => (
              <Card key={i} className="h-96 animate-pulse bg-gray-100"></Card>
            ))
          ) : featuredError && featuredCauses.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error</h3>
              <p className="text-gray-500 mb-6">{featuredError}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : (
            featuredCauses.map((cause) => {
              const isFullyFunded = (cause.currentAmount || 0) >= cause.targetAmount;
              const hasApprovedSponsorship = cause.sponsorships?.some(s => s.status === 'approved');
              return (
                <Card key={cause._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => navigate(`/cause/${cause._id}`)}
                    title={`View details for ${cause.title}`}
                  >
                    <img 
                      src={getImageUrl(cause.imageUrl)} 
                      alt={cause.title} 
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity" 
                      onError={handleImageError}
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{cause.title}</h3>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {cause.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 flex-1">
                      {cause.description.length > 120 
                        ? `${cause.description.substring(0, 120)}...` 
                        : cause.description}
                    </p>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(((cause.currentAmount || 0) / cause.targetAmount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          ₹{(cause.currentAmount || 0).toLocaleString()} raised
                        </span>
                        <span className="text-sm text-gray-500">
                          ₹{cause.targetAmount.toLocaleString()} goal
                        </span>
                      </div>
                    </div>
                    {hasApprovedSponsorship ? (
                      <Button 
                        onClick={() => navigate(`/claim/${cause._id}`)} 
                        className="w-full bg-black text-white mb-2"
                      >
                        Claim a Tote
                      </Button>
                    ) : null}
                    {!isFullyFunded && (
                      <Button 
                        onClick={() => navigate(`/sponsor/new?causeId=${cause._id}`)} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white mb-2"
                      >
                        Sponsor This Cause
                      </Button>
                    )}
                    {!hasApprovedSponsorship && !isFullyFunded && (
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/waitlist/${cause._id}`)} 
                        className="w-full bg-white text-black border border-green-600"
                      >
                        Join Waitlist
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
            )}
          </div>
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/causes')} 
              variant="outline" 
              size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50"
            >
              View All Causes
            </Button>
          </div>
        </div>
      </section>
  );

  // Journey/How It Works Section (Enhanced for Mobile)
  const JourneySection = () => {
    const [activeStep, setActiveStep] = React.useState(journeySteps[0].id);
    const currentStep = journeySteps.find(s => s.id === activeStep) || journeySteps[0];

    return (
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto bg-white px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-20 text-center">
            From Purpose to Impact: <span className="text-green-600">The ChangeBag Journey</span>
          </h2>
          {/* Mobile: Horizontal stepper above image, description for selected step only */}
          <div className="block md:hidden">
            <div className="flex flex-row justify-between items-center gap-2 mb-6 overflow-x-auto">
              {journeySteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all border-2 ${activeStep === step.id ? 'border-green-600 bg-green-50 text-green-700 font-bold' : 'border-gray-200 bg-white text-gray-700'} min-w-[80px]`}
                  style={{ minWidth: 80 }}
                >
                  <span className="font-bold text-green-600 text-lg mb-1">{step.step}</span>
                  <span className="text-xs text-center whitespace-normal break-words">{step.title}</span>
                </button>
              ))}
            </div>
            <div className="mb-8">
              <img
                src={currentStep.image}
                alt={currentStep.imageAlt}
                className="w-full max-w-xs h-48 object-cover rounded-2xl shadow-2xl border border-green-100 transition-all duration-300 mx-auto"
              />
            </div>
            {/* Show only the description for the selected step */}
            <div className="w-full px-4 py-3 border-l-2 border-r-2 border-b-2 border-green-100 bg-green-50 rounded-b-lg text-gray-700 animate-fade-in mb-2">
              <span className="block whitespace-normal break-words text-sm">{currentStep.description}</span>
            </div>
          </div>
          {/* Desktop: Vertical tabs as before */}
          <div className="hidden md:flex flex-row items-stretch gap-10">
            {/* Vertical Tabs for Steps */}
            <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col justify-center">
              <Tabs value={activeStep} onValueChange={setActiveStep} orientation="vertical">
                <TabsList className="flex flex-col w-full bg-white rounded-xl p-4 min-h-[420px] gap-4">
                  {journeySteps.map((step) => (
                    <div key={step.id} className="w-full">
                      <TabsTrigger
                        value={step.id}
                        className={
                          `flex items-center text-2xl py-6 px-6 text-left w-full rounded-lg mb-2 last:mb-0 transition-all whitespace-normal break-words max-w-full
                          data-[state=active]:bg-green-50 data-[state=active]:font-bold data-[state=active]:text-green-600 data-[state=active]:shadow-md
                          data-[state=active]:border-l-4 data-[state=active]:border-green-600`
                        }
                        style={{ wordBreak: 'break-word', maxWidth: '100%' }}
                      >
                        <span className="font-bold text-green-600 mr-4 text-3xl flex-shrink-0">{step.step}</span>
                        <span className="flex-1 flex items-center max-w-[260px]">{step.title}</span>
                      </TabsTrigger>
                      {/* Show description only for active step */}
                      {activeStep === step.id && (
                        <div className="pl-16 pr-2 pb-4 pt-2 text-lg text-gray-700 animate-fade-in border-l-4 border-green-100 bg-green-50 rounded-bl-xl rounded-br-xl max-w-full break-words">
                          <span className="block max-w-[340px] whitespace-normal break-words">{step.description}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            {/* Image for current step */}
            <div className="flex flex-col items-center justify-center flex-1 mt-0">
              <img
                src={currentStep.image}
                alt={currentStep.imageAlt}
                className="w-full max-w-2xl h-[420px] object-cover rounded-2xl shadow-2xl border border-green-100 transition-all duration-300 mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  // How Change Spreads Section (Enhanced for Mobile)
  const SpreadSection = () => (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-left inline-block">
            How Change Spreads
          </h2>
          <div className="h-1 w-24 bg-green-600 rounded mt-2 mb-2 md:ml-0" />
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 space-y-4 md:space-y-0">
          {/* Website & Social Media */}
          <div className="flex items-center gap-6 bg-green-50 rounded-xl p-6 shadow md:shadow-none">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              {/* Globe/Share Icon */}
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#16a34a" strokeWidth="2"/></svg>
            </div>
            <div>
              <h3 className="font-semibold text-xl md:text-2xl text-gray-900">Website & Social Media</h3>
              <p className="text-gray-600 text-base md:text-lg">Engaging campaigns that go viral.</p>
            </div>
          </div>
          {/* YouTuber Network */}
          <div className="flex items-center gap-6 justify-end bg-green-50 rounded-xl p-6 shadow md:shadow-none">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              {/* YouTube Play Icon */}
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3" stroke="#16a34a" strokeWidth="2"/><polygon points="10,9 16,12 10,15" fill="#16a34a"/></svg>
            </div>
            <div>
              <h3 className="font-semibold text-xl md:text-2xl text-gray-900">YouTuber Network</h3>
              <p className="text-gray-600 text-base md:text-lg">100M+ subscribers, 50M+ views for massive reach.</p>
            </div>
          </div>
          {/* Change Pickup Points */}
          <div className="flex items-center gap-6 bg-green-50 rounded-xl p-6 shadow md:shadow-none">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              {/* Map Pin Icon */}
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M12 21s6-5.686 6-10A6 6 0 0 0 6 11c0 4.314 6 10 6 10z" stroke="#16a34a" strokeWidth="2"/><circle cx="12" cy="11" r="2" stroke="#16a34a" strokeWidth="2"/></svg>
            </div>
            <div>
              <h3 className="font-semibold text-xl md:text-2xl text-gray-900">Change Pickup Points</h3>
              <p className="text-gray-600 text-base md:text-lg">Malls, cafes, key city junctions.</p>
            </div>
          </div>
          {/* E-commerce Tie-ups */}
          <div className="flex items-center gap-6 justify-end bg-green-50 rounded-xl p-6 shadow md:shadow-none">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              {/* Shopping Bag Icon */}
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M6 7V6a6 6 0 0 1 12 0v1" stroke="#16a34a" strokeWidth="2"/><rect x="4" y="7" width="16" height="13" rx="2" stroke="#16a34a" strokeWidth="2"/><path d="M9 11v2m6-2v2" stroke="#16a34a" strokeWidth="2"/></svg>
            </div>
            <div>
              <h3 className="font-semibold text-xl md:text-2xl text-gray-900">E-commerce Tie-ups</h3>
              <p className="text-gray-600 text-base md:text-lg">Available on BookMyShow, MakeMyTrip, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Join the Movement CTA
  const JoinCTASection = () => (
    <section className="w-full bg-gradient-to-br from-green-500 via-green-600 to-black py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to join the movement?</h2>
        <p className="text-lg text-green-100 mb-8">
          Whether you're a brand looking for authentic reach or someone who loves free, useful things that matter – ChangeBag is for you.
        </p>
            <Button 
          className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-3 rounded-lg font-bold shadow-md transition"
          onClick={() => navigate('/signup')}
          aria-label="Join Now"
        >
          Join Now
            </Button>
        </div>
      </section>
  );

  // --- Render ---
  return (
    <Layout>
      <HeroSection />
      <WhySponsorSection />
      <FeaturedCausesSection />
      <JourneySection />
      <SpreadSection />
      <JoinCTASection />
    </Layout>
  );
};

export default Index;
