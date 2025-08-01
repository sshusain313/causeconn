
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Gift, Award, BadgeCheck, TrendingUp, CircleDollarSign } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchStats, fetchSponsorStories } from '@/services/apiServices';
import { Story } from '@/models/Story';

// Sample data for the growth chart (fallback if API data is not available)
const fallbackGrowthData = [
  { month: 'Jan', sponsors: 10, impact: 100 },
  { month: 'Feb', sponsors: 15, impact: 200 },
  { month: 'Mar', sponsors: 25, impact: 320 },
  { month: 'Apr', sponsors: 30, impact: 450 },
  { month: 'May', sponsors: 37, impact: 650 },
  { month: 'Jun', sponsors: 45, impact: 840 },
];

const marketingMethods = [
  {
    method: "Billboard (1 Month)",
    impressions: "4-8 lakh",
    duration: "30 Days",
    cpm: "₹15-₹125",
    engagement: "Passive Viewing",
    sustainability: "❌ None",
    icon: "📺"
  },
  {
    method: "Digital Ads (Google, FB, IG)",
    impressions: "20-30 lakh",
    duration: "2-3 Weeks",
    cpm: "₹33",
    engagement: "Click-Based, Temporary",
    sustainability: "❌ None",
    icon: "💻"
  },
  {
    method: "TV/Print Ads (Single Run)",
    impressions: "5-20 lakh",
    duration: "1 Day/One-Time",
    cpm: "₹50-₹75",
    engagement: "Short-Term Visibility",
    sustainability: "❌ None",
    icon: "📺"
  },
  {
    method: "Event Sponsorships",
    impressions: "3-10 lakh",
    duration: "1-2 Days",
    cpm: "₹15-₹125",
    engagement: "Temporary Engagement",
    sustainability: "❌ None",
    icon: "🎪"
  },
  {
    method: "Change Bag Tote Sponsorship",
    impressions: "1 Crore+ (10K Bags x 1K uses)",
    duration: "Years (Long-Term)",
    cpm: "₹8-₹15 (Lowest)",
    engagement: "Direct, High Retention",
    sustainability: "✅ High (Plastic-Free, Reusable)",
    icon: "🛍️",
    highlighted: true
  }
];

const WhySponsor = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats
  });

  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ['sponsor-stories'],
    queryFn: fetchSponsorStories
  });

  // Use real growth data from API or fallback to sample data
  const growthData = stats?.growthData || fallbackGrowthData;

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}
        ></div>
        <div className="container relative z-20 text-center max-w-4xl mx-auto px-4 text-white">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Why Sponsor a Cause?
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Empower communities, gain brand recognition, and track real impact in real time.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button size="lg" asChild className="text-lg">
              <Link to="/sponsor/new">
                <Gift className="mr-2" /> Start Sponsoring
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto py-16 px-4 space-y-20">
        {/* Stats Cards Section */}
        <section className="space-y-6">
          <motion.h2 
            className="text-3xl font-bold text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Impact in Numbers
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {statsLoading ? (
              <>
                <Card className="h-36 animate-pulse bg-gray-100"></Card>
                <Card className="h-36 animate-pulse bg-gray-100"></Card>
                <Card className="h-36 animate-pulse bg-gray-100"></Card>
              </>
            ) : (
              <>
                <motion.div>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Total Sponsors</CardTitle>
                      <CircleDollarSign className="h-5 w-5 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats?.totalSponsors || 0}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Partnering for positive change
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Active Campaigns</CardTitle>
                      <TrendingUp className="h-5 w-5 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats?.activeCampaigns || 0}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Currently making an impact
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Bags Sponsored</CardTitle>
                      <Gift className="h-5 w-5 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats?.totalBagsSponsored || 0}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Eco-friendly totes with purpose
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </motion.div>
        </section>

        {/* Aims & Objectives Section */}
        <section className="space-y-8">
          <motion.h2 
            className="text-3xl font-bold text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Our Aims & Objectives
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Empower brands to drive real change through branded tote‐bag sponsorships.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Growth Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Increase active sponsors by 20% each quarter and reach 10,000 claimed bags in the first year.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BadgeCheck className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Ensure 95%+ of claims are fulfilled within 14 days with full tracking.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CircleDollarSign className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Deliver clear, real-time impact analytics and digital badges for all sponsors.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Benefits Showcase with Tabs */}
        <section className="space-y-8 bg-[#f7f6f4] py-16 px-8 rounded-lg">
          <motion.div 
            className="text-center space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Benefits of Sponsorship</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how sponsoring causes through ChangeBag.org delivers exceptional value across impact, efficiency, and brand recognition
            </p>
          </motion.div>
          
          <Tabs defaultValue="impact" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-[#f7f6f4]">
              <TabsTrigger value="impact" className="text-sm font-medium">Impact & ROI</TabsTrigger>
              <TabsTrigger value="efficiency" className="text-sm font-medium">Efficiency & Cost</TabsTrigger>
              <TabsTrigger value="recognition" className="text-sm font-medium">Brand Recognition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="impact" className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <Award className="mr-3 h-6 w-6 text-green-600" />
                          Real Change
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">95%</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Support vetted causes with tangible outcomes you can track in real-time.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Cause Verification</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact Tracking</span>
                          <span className="font-medium">Real-time</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transparency</span>
                          <span className="font-medium">Full</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
                          Measurable ROI
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">3.2x</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">See exactly how your sponsorship translates to bags claimed and community impact.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>ROI vs Traditional Ads</span>
                          <span className="font-medium">3.2x Higher</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brand Exposure</span>
                          <span className="font-medium">Years vs Days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost per Impression</span>
                          <span className="font-medium">₹8-₹15</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <Gift className="mr-3 h-6 w-6 text-green-600" />
                          Sustainable Products
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">100%</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Your brand on eco-friendly tote bags that reduce plastic waste while promoting your values.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Eco-friendly Material</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Plastic Reduction</span>
                          <span className="font-medium">500+ bags/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lifespan</span>
                          <span className="font-medium">3-5 years</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              {/* <motion.div 
                className="bg-white p-6 rounded-lg border border-green-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Proven Impact Metrics</h3>
                    <p className="text-muted-foreground">Our sponsors see an average of 3.2x higher ROI compared to traditional advertising, with 95% of causes achieving their funding goals within 30 days.</p>
                  </div>
                </div>
              </motion.div> */}
            </TabsContent>
            
            <TabsContent value="efficiency" className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <BadgeCheck className="mr-3 h-6 w-6 text-green-600" />
                          Simple Process
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">5min</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Our streamlined sponsorship process takes just minutes, with full support at every step.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Setup Time</span>
                          <span className="font-medium">5 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Available</span>
                          <span className="font-medium">24/7</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Documentation</span>
                          <span className="font-medium">Auto-generated</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
                          Cost Effective
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">60%</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Get more brand exposure per dollar compared to traditional advertising channels.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Cost Savings</span>
                          <span className="font-medium">60% Less</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPM Rate</span>
                          <span className="font-medium">₹8-₹15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume Discounts</span>
                          <span className="font-medium">Up to 25%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <CircleDollarSign className="mr-3 h-6 w-6 text-green-600" />
                          Transparent Pricing
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">0%</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Clear, upfront pricing with no hidden fees and volume discounts available.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Hidden Fees</span>
                          <span className="font-medium">0%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Setup Costs</span>
                          <span className="font-medium">Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Terms</span>
                          <span className="font-medium">Flexible</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              {/* <motion.div 
                className="bg-white p-6 rounded-lg border border-green-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Streamlined Experience</h3>
                    <p className="text-muted-foreground">From initial setup to campaign completion, our platform reduces administrative overhead by 80% while providing comprehensive tracking and analytics.</p>
                  </div>
                </div>
              </motion.div> */}
            </TabsContent>
            
            <TabsContent value="recognition" className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <Award className="mr-3 h-6 w-6 text-green-600" />
                          Brand Visibility
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">1M+</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Your logo on quality tote bags that travel with users for years, creating ongoing exposure.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily Impressions</span>
                          <span className="font-medium">1M+</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brand Lifespan</span>
                          <span className="font-medium">3-5 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Geographic Reach</span>
                          <span className="font-medium">Pan-India</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <BadgeCheck className="mr-3 h-6 w-6 text-green-600" />
                          Digital Badge
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">100%</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Display your impact badge on your website and social media to showcase your commitment.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Badge Availability</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Social Sharing</span>
                          <span className="font-medium">Auto-generated</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SEO Benefits</span>
                          <span className="font-medium">Included</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
                          Social Proof
                        </CardTitle>
                        <div className="text-2xl font-bold text-green-600">500+</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">Featured in our sponsors directory and PR materials with option for case study highlights.</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Featured Sponsors</span>
                          <span className="font-medium">500+</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PR Coverage</span>
                          <span className="font-medium">Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Case Studies</span>
                          <span className="font-medium">Available</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              
              {/* <motion.div 
                className="bg-white p-6 rounded-lg border border-green-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Enhanced Brand Recognition</h3>
                    <p className="text-muted-foreground">Join 500+ recognized brands that have increased their social impact visibility by an average of 300% through our platform's comprehensive recognition program.</p>
                  </div>
                </div>
              </motion.div> */}
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Growth Chart */}
        {/* <section className="space-y-8">
          <motion.h2 
            className="text-3xl font-bold text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Sponsor Growth & Impact
          </motion.h2>
          
          <motion.div
            className="h-80 w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ChartContainer
              className="h-full"
              config={{
                sponsors: {
                  label: "Sponsors",
                  theme: {
                    light: "#4CAF50",
                    dark: "#81C784",
                  },
                },
                impact: {
                  label: "Impact (bags)",
                  theme: {
                    light: "#FF5722",
                    dark: "#FF8A65",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={growthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSponsors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5722" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="sponsors"
                    stroke="#4CAF50"
                    fillOpacity={1}
                    fill="url(#colorSponsors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="impact"
                    stroke="#FF5722"
                    fillOpacity={1}
                    fill="url(#colorImpact)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>
          <p className="text-center text-muted-foreground">
            Monthly growth of sponsors and total bags in circulation
          </p>
        </ Mareketing Section> */}
        <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl font-bold text-green-600 mb-4">
          The Most Budget-Friendly CSR & Brand Awareness Strategy
        </h2>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          With ChangeBag.org's tote sponsorship, brands achieve enduring visibility, enhanced consumer 
          engagement, and cost-effective marketing while promoting sustainability. Unlike temporary ads, 
          tote bags serve as daily-use items, providing years of continuous brand promotion and generating 
          millions of impressions from a single investment.
        </p>
      </div>

      <div className="overflow-x-auto mb-12">
        <div className="border-2 border-black-200 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <th className="px-6 py-4 text-left font-semibold border-r border-green-500">Marketing Method</th>
                <th className="px-6 py-4 text-left font-semibold border-r border-green-500">Impressions</th>
                <th className="px-6 py-4 text-left font-semibold border-r border-green-500">Duration</th>
                <th className="px-6 py-4 text-left font-semibold border-r border-green-500">CPM</th>
                <th className="px-6 py-4 text-left font-semibold border-r border-green-500">Engagement</th>
                <th className="px-6 py-4 text-left font-semibold">Sustainability Impact</th>
              </tr>
            </thead>
            <tbody>
              {marketingMethods.map((method, index) => (
                <tr 
                  key={index}
                  className={`border-b border-black-200 ${
                    method.highlighted 
                      ? 'bg-black-50/80 border-black-200' 
                      : 'bg-white hover:bg-black-50/30'
                  } transition-all duration-300`}
                >
                  <td className="px-6 py-4 border-r border-black-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <span className='font-medium text-gray-900'>
                        {method.method}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-black-100">{method.impressions}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-black-100">{method.duration}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-black-100">{method.cpm}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-black-100">{method.engagement}</td>
                  <td className="px-6 py-4 text-gray-600">{method.sustainability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="text-center">
        <Button size="lg" className="bg-primary hover:bg-accent text-lg px-8 py-3">
          Partner with Us for Sustainable Impact
        </Button>
      </div> */}
    </div>
        </section>

        {/* Featured Stories Carousel */}
        {!storiesLoading && stories?.length > 0 && (
          <section className="space-y-8 bg-[#f7f6f4] py-16 px-8 rounded-lg">
            <motion.h2 
              className="text-3xl font-bold text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              Success Stories
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Carousel
                opts={{ loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {stories.map((story: Story) => (
                    <CarouselItem key={story.id} className="md:basis-1/3">
                      <Card className="h-full bg-[#f7f6f4] border-[#f7f6f4]">
                        {story.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <img 
                              src={story.imageUrl} 
                              alt={story.title} 
                              className="h-full w-full object-cover object-top transition-all hover:scale-105"
                              onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                console.error(`Failed to load image: ${target.src}`);
                                target.src = 'https://placehold.co/600x400?text=Story+Image';
                              }}
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                          <CardDescription>By {story.authorName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-3 text-muted-foreground">{story.excerpt}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" /> */}
              </Carousel>
            </motion.div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="py-16">
          <motion.div 
            className="max-w-3xl mx-auto text-center space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
            <p className="text-lg text-muted-foreground">
              Join our community of sponsors and start making a measurable impact today. 
              Your brand can be part of positive change.
            </p>
            <Button size="lg" className="text-lg" asChild>
              <Link to="/sponsor/new">
                <Gift className="mr-2" /> Start Sponsoring Now
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>
    </Layout>
  );
};

export default WhySponsor;
