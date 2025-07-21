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
import { Star } from "lucide-react";


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
  createdAt: string;
}

const HERO_IMAGE = "/images/zero.jpg"; // Placeholder, replace with actual illustration if available

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
    // image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop",
    image: "/images/sponsoracause.png",
    imageAlt: "People browsing causes on laptop"
  },
  {
    id: "step2", 
    step: "2",
    title: "Upload Your Logo",
    description: "Add your brand identity to the cause page.",
    // image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
    image: "/images/upload.png",
    imageAlt: "Brand logo design on computer"
  },
  {
    id: "step3",
    step: "3", 
    title: "Choose Where to Distribute",
    description: "Select from multiple campaign channels.",
    // image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop",
    image: "/images/distribute.png",
    imageAlt: "Distribution channels and social media"
  },
  {
    id: "step4",
    step: "4",
    title: "Track Your Reach & Impact",
    description: "Get detailed analytics on your campaign's success.",
    // image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
    image: "/images/track.png",
    imageAlt: "Analytics dashboard showing impact metrics"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Environmental Activist",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "This initiative has transformed how our community thinks about plastic waste. The tote bags are not just practical but also beautiful conversation starters about sustainability.",
    rating: 5,
    company: "Eco Warriors Collective"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Corporate Sustainability Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "As a corporate partner, we've seen incredible engagement from our employees. The transparency in how funds are used and the regular impact updates make this partnership truly meaningful.",
    rating: 5,
    company: "GreenTech Solutions"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Local Business Owner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "I've been using these tote bags in my store for months now. Customers love them and often ask about the cause behind them. It's a win-win for business and the environment.",
    rating: 5,
    company: "Organic Market"
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Community Leader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "The impact on our local community has been remarkable. We've reduced plastic waste by 40% and created awareness about environmental issues. This is exactly what we needed.",
    rating: 5,
    company: "Neighborhood Association"
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "School Principal",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "Our students are excited about the environmental lessons we've integrated using these tote bags. It's a practical way to teach sustainability and community responsibility.",
    rating: 5,
    company: "Green Valley School"
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    role: "Restaurant Owner",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "We switched to these tote bags for our takeaway orders and our customers appreciate the eco-friendly approach. It's helped us build a stronger connection with our community.",
    rating: 5,
    company: "Spice Garden Restaurant"
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


    // --- MOCK PAGE ROUTES LOGIC ---
  // Define the mock page routes
  // const mockPageRoutes = [
  //   "/mock/Page3",
  //   "/mock/Page5",
  //   "/mock/Page6",
  //   "/mock/Page4",
  //   "/mock/Page2",
  //   "/mock/Page3",
  // ];

  // Sort causes by createdAt descending and get the 6 most recent
  const sortedCauses = [...featuredCauses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // const mostRecentCauses = sortedCauses.slice(0, mockPageRoutes.length);

  // Map cause _id to mock page route
  // const causeIdToMockPage: Record<string, string> = {};
  // mostRecentCauses.forEach((cause, idx) => {
  //   causeIdToMockPage[cause._id] = mockPageRoutes[idx];
  // });
  
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
    // <section className="bg-white border-b border-gray-100 py-16">
    //   <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
    //     {/* Left: Text */}
    //     <div className="flex-1 max-w-xl">
    //       <div className="mb-2 text-sm text-gray-500 font-medium">Sponsor Change – Make an Impact</div>
    //       <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
    //         A New-Age Promotional Platform for <span className="text-green-600">Purpose-Driven Brands</span>
    //           </h1>
    //       <p className="text-lg text-gray-700 mb-8">
    //         At ChangeBag, we offer brands a sustainable, high-visibility marketing medium that creates impact. No more TV ads, billboards, or print ads – this is real-world branding with real engagement.
    //           </p>
    //             <Button 
    //         className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition"
    //               onClick={() => navigate('/causes')} 
    //         aria-label="Sponsor a cause"
    //             >
    //         Sponsor
    //             </Button>
    //           </div>
    //     {/* Right: Illustration */}
    //     <div className="flex-1 flex justify-center items-center relative">
    //       <div className="rounded-full bg-green-50 w-[340px] h-[340px] flex items-center justify-center relative">
    //         <img 
    //           src={HERO_IMAGE}
    //           alt="Hero Illustration"
    //           className="w-full h-56 md:h-96 max-w-xs md:max-w-lg object-contain drop-shadow-xl mx-auto"
    //           aria-hidden="true"
    //         />
    //         {/* Callouts (simulate with positioned badges) */}
    //         <span className="absolute left-2 top-8 bg-white text-xs px-2 py-1 rounded-full shadow border">Just You</span>
    //         <span className="absolute right-2 top-8 bg-white text-xs px-2 py-1 rounded-full shadow border">Your Skill</span>
    //         <span className="absolute left-0 bottom-10 bg-white text-xs px-2 py-1 rounded-full shadow border">No corporate politics.</span>
    //         <span className="absolute right-0 bottom-10 bg-white text-xs px-2 py-1 rounded-full shadow border">No endless job applications.</span>
    //         <span className="absolute left-1/2 -top-4 -translate-x-1/2 bg-white text-xs px-2 py-1 rounded-full shadow border">A role. An income to earn.</span>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section className="px-6 py-16 bg-neutral-50">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-neutral-600 text-lg">Sponsor Change – Make an Impact</p>
            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight">
              A New-Age Promotional Platform for{" "}
              <span className="text-brand-primary">Purpose-Driven Brands</span>
            </h1>
          </div>
          
          <p className="text-lg text-neutral-700 leading-relaxed max-w-lg">
            At CauseBag, we offer brands a sustainable, high-visibility marketing 
            medium that creates impact. No more TV ads, billboards, or print ads – 
            this is real-world branding with real engagement.
          </p>
          
          {/* <Button className="bg-brand-primary hover:bg-brand-accent text-brand-primary-foreground px-8 py-3 text-lg rounded-lg"> */}
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-lg" onClick={()=>navigate('/causes')}>  
            Sponsor
          </Button>
        </div>
        
        <div className="relative">
          <img 
            src={HERO_IMAGE} 
            alt="Woman holding a sustainable no plastic bag"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
  );

  // Why Brands Sponsor Section
  const WhySponsorSection = () => (
    <section className="bg-white border-b border-gray-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Why brands sponsor <span className="text-green-600">changebag.org</span>
        </h2>
        <p className="text-lg text-gray-600 mb-16">
          We provide everything you need to launch, manage, and scale your cause effectively.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 px-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className={`
                flex-1 bg-white rounded-2xl p-8 flex flex-col items-center
                shadow-md transition-all duration-200
                hover:shadow-xl hover:-translate-y-2
              `}
              style={{ minWidth: 220, maxWidth: 320 }}
            >
              <div className={`mb-4 flex items-center justify-center rounded-full ${idx === 1 ? 'bg-green-100' : 'bg-green-50'} w-16 h-16`}>
                {React.cloneElement(benefit.icon, { className: 'h-10 w-10 text-green-600' })}
              </div>
              <h3 className="font-bold text-xl mb-2 text-center text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600 text-base text-center">{benefit.description}</p>
            </div>
          ))}
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
                    onClick={() => {
                      // if (causeIdToMockPage[cause._id]) {
                      //   navigate(causeIdToMockPage[cause._id]);
                      // } else {
                        navigate(`/cause/${cause._id}`);
                      // }
                    }}
                    // onClick={() => navigate(`/cause/${cause._id}`)}
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
                    {/* <div className="mb-4">
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
                    </div> */}
                    {hasApprovedSponsorship ? (
                      <Button 
                        onClick={() => navigate(`/claim/${cause._id}?source=direct&ref=homepage`)} 
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
      <section className="bg-gradient-to-br from-white via-green-50/20 to-white py-12 md:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              From Purpose to Impact: <span className="text-green-600">The ChangeBag Journey</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Follow our simple 4-step process to create meaningful impact while building your brand presence
            </p>
          </div>

          {/* Mobile: Enhanced horizontal stepper */}
          <div className="block md:hidden">
            {/* Progress Bar */}
            

            {/* Current Step Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden mx-4">
              <div className="relative">
                <img
                  src={currentStep.image}
                  alt={currentStep.imageAlt}
                  className="w-full h-48 md:h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/sponsoracause.png";
                  }}
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  {/* <div className="bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm">
                    Step {currentStep.step}
                  </div> */}
                </div>
              </div>
              {/* <div className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{currentStep.title}</h3>
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{currentStep.description}</p>
              </div> */}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-4 md:mt-6 space-x-2 px-4">
              {journeySteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    activeStep === step.id ? 'bg-green-600 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Mobile Step Navigation */}
            <div className="mt-6 px-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    const currentIndex = journeySteps.findIndex(s => s.id === activeStep);
                    if (currentIndex > 0) {
                      setActiveStep(journeySteps[currentIndex - 1].id);
                    }
                  }}
                  disabled={journeySteps.findIndex(s => s.id === activeStep) === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    journeySteps.findIndex(s => s.id === activeStep) === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  {journeySteps.findIndex(s => s.id === activeStep) + 1} of {journeySteps.length}
                </span>
                <button
                  onClick={() => {
                    const currentIndex = journeySteps.findIndex(s => s.id === activeStep);
                    if (currentIndex < journeySteps.length - 1) {
                      setActiveStep(journeySteps[currentIndex + 1].id);
                    }
                  }}
                  disabled={journeySteps.findIndex(s => s.id === activeStep) === journeySteps.length - 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    journeySteps.findIndex(s => s.id === activeStep) === journeySteps.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: Enhanced vertical layout */}
          <div className="hidden md:flex flex-row items-stretch gap-8 lg:gap-12">
            {/* Left: Enhanced Steps */}
            <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  {journeySteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {/* Progress Line */}
                      {index < journeySteps.length - 1 && (
                        <div className={`absolute left-6 top-16 w-0.5 h-12 transition-all duration-500 ${
                          index < journeySteps.findIndex(s => s.id === activeStep) 
                            ? 'bg-green-500' 
                            : 'bg-gray-200'
                        }`}></div>
                      )}
                      
                      <button
                        onClick={() => setActiveStep(step.id)}
                        className={`w-full text-left p-4 lg:p-6 rounded-xl transition-all duration-300 group ${
                          activeStep === step.id 
                            ? 'bg-green-50 border-2 border-green-200 shadow-lg transform scale-105' 
                            : 'bg-gray-50 border-2 border-transparent hover:bg-green-50/50 hover:border-green-100'
                        }`}
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          {/* Step Number */}
                          <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm lg:text-lg font-bold transition-all duration-300 ${
                            activeStep === step.id 
                              ? 'bg-green-600 text-white shadow-lg' 
                              : index < journeySteps.findIndex(s => s.id === activeStep)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 group-hover:bg-green-100'
                          }`}>
                            {step.step}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className={`text-lg lg:text-xl font-bold mb-1 lg:mb-2 transition-colors duration-300 ${
                              activeStep === step.id ? 'text-green-700' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                              {step.description}
                            </p>
                          </div>
                          
                          {/* Active Indicator */}
                          {activeStep === step.id && (
                            <div className="flex-shrink-0">
                              <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-600 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Enhanced Image Display */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                  <div className="relative">
                    <img
                      src={currentStep.image}
                      alt={currentStep.imageAlt}
                      className="w-full max-w-2xl lg:max-w-4xl h-[400px] lg:h-[600px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/sponsoracause.png";
                      }}
                    />
                    <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6">
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 lg:px-4 lg:py-2 rounded-full font-medium text-xs lg:text-sm shadow-lg">
                        {currentStep.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          {/* <div className="text-center mt-12 md:mt-16">
            <Button 
              onClick={() => navigate('/causes')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Your Journey
            </Button>
          </div> */}
        </div>
      </section>
    );
  };

  // How Change Spreads Section (Enhanced for Mobile)
  const SpreadSection = () => (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Change <span className="text-green-600">Spreads</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our multi-channel approach ensures your message reaches the right audience through various touchpoints
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Website & Social Media */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
            <div className="mb-4 flex items-center justify-center rounded-full bg-green-50 w-16 h-16">
              {/* Globe/Share Icon */}
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-green-600">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-center text-gray-900">Website & Social Media</h3>
            <p className="text-gray-600 text-base text-center">Engaging campaigns that go viral through strategic social media presence and compelling web content.</p>
          </div>

          {/* YouTuber Network */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
            <div className="mb-4 flex items-center justify-center rounded-full bg-green-50 w-16 h-16">
              {/* YouTube Play Icon */}
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-green-600">
                <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2"/>
                <polygon points="10,9 16,12 10,15" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-center text-gray-900">YouTuber Network</h3>
            <p className="text-gray-600 text-base text-center">100M+ subscribers, 50M+ views for massive reach through trusted influencer partnerships.</p>
          </div>

          {/* Change Pickup Points */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
            <div className="mb-4 flex items-center justify-center rounded-full bg-green-50 w-16 h-16">
              {/* Map Pin Icon */}
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-green-600">
                <path d="M12 21s6-5.686 6-10A6 6 0 0 0 6 11c0 4.314 6 10 6 10z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-center text-gray-900">Change Pickup Points</h3>
            <p className="text-gray-600 text-base text-center">Malls, cafes, key city junctions - strategically placed pickup points for maximum visibility.</p>
          </div>

          {/* E-commerce Tie-ups */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
            <div className="mb-4 flex items-center justify-center rounded-full bg-green-50 w-16 h-16">
              {/* Shopping Bag Icon */}
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-green-600">
                <path d="M6 7V6a6 6 0 0 1 12 0v1" stroke="currentColor" strokeWidth="2"/>
                <rect x="4" y="7" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 11v2m6-2v2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2 text-center text-gray-900">E-commerce Tie-ups</h3>
            <p className="text-gray-600 text-base text-center">Available on BookMyShow, MakeMyTrip, and more - integrated into popular e-commerce platforms.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">100M+</div>
            <div className="text-gray-600 font-medium">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50M+</div>
            <div className="text-gray-600 font-medium">Views</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Pickup Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10+</div>
            <div className="text-gray-600 font-medium">Platforms</div>
          </div>
        </div>
      </div>
    </section>
  );

  const Testimonials = () => (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">What People Are Saying</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from our community about the impact of this initiative
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-gray-50 px-8 py-4 rounded-full">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.9/5 Average Rating</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{testimonials.length} Verified Reviews</span>
          </div>
        </div> */}
      </div>
    </section>
  );

  // Join the Movement CTA
  const JoinCTASection = () => (
    <section className="w-full min-h-[300px]  bg-gradient-to-br from-green-500 via-green-600 to-black py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-4xl font-bold text-white mb-4">Ready to join the movement?</h2>
        <p className="text-xl text-green-100 mb-8">
          Whether you're a brand looking for authentic reach or someone who loves free, useful things that matter – ChangeBag is for you.
        </p>
            <Button 
          className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-3 rounded-lg font-bold shadow-md transition"
          onClick={() => navigate('/causes')}
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
      {/* <SpreadSection /> */}
      <JoinCTASection />
      <Testimonials />
      
    </Layout>
  );
};

export default Index;
