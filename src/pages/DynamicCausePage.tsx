import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TreePine, Thermometer, MapPin, TrendingDown, Gift, Megaphone, Globe, Leaf, Users, Heart, ShoppingBag } from "lucide-react";
import { fetchCause } from '@/services/apiServices';
import { getFullUrl } from '@/utils/apiUtils';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const DynamicCausePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  // Fetch cause data from the API
  const { data: cause, isLoading, error } = useQuery({
    queryKey: ['cause', id],
    queryFn: () => fetchCause(id!),
    enabled: !!id,
  });

  // Action handlers
  const handleClaim = () => {
    navigate(`/claim/${id}`);
  };
  
  const handleSponsor = () => {
    navigate(`/sponsor/new?causeId=${id}`);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: cause?.title || 'Check out this cause',
          text: cause?.description || 'Help support this important cause',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Share this cause with your friends and family.",
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: "Sharing failed",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
    setTimeout(() => setIsSharing(false), 2000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading cause details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !cause) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            {error ? 'Error loading cause details' : 'Cause not found'}
          </h1>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            onClick={() => navigate('/causes')}
          >
            Back to Causes
          </button>
        </div>
      </div>
    );
  }

  // Generate impact stats based on cause data
  const impactStats = [
    { 
      icon: Users, 
      value: cause.availableTotes?.toString() || "0", 
      label: "Bags Available" 
    },
    { 
      icon: ShoppingBag, 
      value: cause.totalTotes?.toString() || "0", 
      label: "Total Bags Sponsored" 
    },
    { 
      icon: Heart, 
      value: cause.sponsorships?.length?.toString() || "0", 
      label: "Active Sponsors" 
    },
    { 
      icon: TrendingDown, 
      value: `${Math.round((cause.currentAmount / cause.targetAmount) * 100)}%`, 
      label: "Funding Progress" 
    }
  ];

  // Generate FAQs based on cause data
  const faqs = [
    {
      question: "How can I get involved?",
      answer: "You can sponsor this cause or claim a tote bag to show your support."
    },
    {
      question: "Where does my money go?",
      answer: "Your contribution directly supports the production and distribution of tote bags for this cause."
    },
    {
      question: "How many people will this help?",
      answer: `This cause aims to help ${cause.totalTotes || 0} people by providing sustainable alternatives to single-use plastics.`
    },
    {
      question: "Can I track the impact of my contribution?",
      answer: "Yes, sponsors receive regular updates on the impact of their contributions."
    }
  ];

  // Get category-specific icon and color
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'environment':
      case 'reforestation':
        return { icon: TreePine, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-800', buttonColor: 'bg-green-600', hoverColor: 'hover:bg-green-700', borderColor: 'border-green-600', bgLight: 'bg-green-100', bgMedium: 'bg-green-200' };
      case 'health':
      case 'mental health':
        return { icon: Heart, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-800', buttonColor: 'bg-red-600', hoverColor: 'hover:bg-red-700', borderColor: 'border-red-600', bgLight: 'bg-red-100', bgMedium: 'bg-red-200' };
      case 'water':
      case 'conservation':
        return { icon: Globe, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-800', buttonColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700', borderColor: 'border-blue-600', bgLight: 'bg-blue-100', bgMedium: 'bg-blue-200' };
      case 'workplace':
      case 'respect':
        return { icon: Users, color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-800', buttonColor: 'bg-purple-600', hoverColor: 'hover:bg-purple-700', borderColor: 'border-purple-600', bgLight: 'bg-purple-100', bgMedium: 'bg-purple-200' };
      case 'plastic':
      case 'waste':
        return { icon: Leaf, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-800', buttonColor: 'bg-green-600', hoverColor: 'hover:bg-green-700', borderColor: 'border-green-600', bgLight: 'bg-green-100', bgMedium: 'bg-green-200' };
      default:
        return { icon: Heart, color: 'primary', bgColor: 'bg-primary-50', textColor: 'text-primary-800', buttonColor: 'bg-primary-600', hoverColor: 'hover:bg-primary-700', borderColor: 'border-primary-600', bgLight: 'bg-primary-100', bgMedium: 'bg-primary-200' };
    }
  };

  const categoryInfo = getCategoryIcon(cause.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative ${categoryInfo.bgColor} py-20`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 ${categoryInfo.bgLight} ${categoryInfo.textColor} px-6 py-3 rounded-full text-sm font-medium mb-6`}>
                <categoryInfo.icon className="h-4 w-4" />
                {cause.category}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                {cause.title}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {cause.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className={`${categoryInfo.buttonColor} ${categoryInfo.hoverColor} px-8 py-4 text-lg font-semibold`}
                  onClick={handleClaim}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  🎁 Claim Your Free Bag
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`${categoryInfo.borderColor} ${categoryInfo.textColor} hover:${categoryInfo.bgColor} px-8 py-4 text-lg font-semibold`}
                  onClick={handleSponsor}
                >
                  <Megaphone className="mr-2 h-5 w-5" />
                  📢 Sponsor This Cause
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={getFullUrl(cause.imageUrl) || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                alt={cause.title}
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className={`text-3xl font-bold ${categoryInfo.textColor}`}>
                  ₹{cause.currentAmount?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Supporting {cause.category.toLowerCase()} efforts by tying every sponsored bag to positive change
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 ${categoryInfo.bgLight} rounded-full`}>
                      <stat.icon className={`h-8 w-8 ${categoryInfo.textColor}`} />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${categoryInfo.textColor} mb-2`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`${categoryInfo.bgColor} rounded-3xl p-12`}>
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Makes a Difference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${categoryInfo.bgMedium} rounded-full`}>
                  <Gift className={`h-6 w-6 ${categoryInfo.textColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Bags</h4>
                  <p className="text-gray-700">Funds high-quality, durable tote bags that replace single-use plastics</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`p-3 ${categoryInfo.bgMedium} rounded-full`}>
                  <categoryInfo.icon className={`h-6 w-6 ${categoryInfo.textColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cause Support</h4>
                  <p className="text-gray-700">Supports {cause.category.toLowerCase()} initiatives and awareness campaigns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Campaign Progress</h2>
            <p className="text-xl text-gray-600">Track our progress towards making a difference</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className={`text-4xl font-bold ${categoryInfo.textColor} mb-4`}>
                ₹{cause.currentAmount?.toLocaleString() || 0}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Amount Raised</div>
              <p className="text-gray-600">Out of ₹{cause.targetAmount?.toLocaleString() || 0} target</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className={`text-4xl font-bold ${categoryInfo.textColor} mb-4`}>
                {cause.totalTotes || 0}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Bags Sponsored</div>
              <p className="text-gray-600">High-quality tote bags ready for distribution</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className={`text-4xl font-bold ${categoryInfo.textColor} mb-4`}>
                {cause.sponsorships?.length || 0}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Active Sponsors</div>
              <p className="text-gray-600">Organizations supporting this cause</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className={`text-4xl font-bold ${categoryInfo.textColor} mb-4`}>
                {cause.availableTotes || 0}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Bags Available</div>
              <p className="text-gray-600">Ready for claiming by supporters</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                  <AccordionTrigger className="text-left py-6 text-lg font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 ${categoryInfo.buttonColor} text-white`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl mb-8 opacity-90">Be part of the solution and make a difference today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={handleClaim}
            >
              <Gift className="mr-2 h-5 w-5" />
              🎁 Claim Your Free Bag
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
              onClick={handleSponsor}
            >
              <Megaphone className="mr-2 h-5 w-5" />
              📢 Sponsor This Cause
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicCausePage; 