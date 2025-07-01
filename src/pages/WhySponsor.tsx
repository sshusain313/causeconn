
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
import { fetchStats, fetchStories } from '@/services/apiServices';
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

const WhySponsor = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats
  });

  const { data: stories, isLoading: storiesLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories
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
                <motion.div variants={fadeIn}>
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
                <motion.div variants={fadeIn}>
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
                <motion.div variants={fadeIn}>
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
        <section className="space-y-8">
          <motion.h2 
            className="text-3xl font-bold text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Benefits of Sponsorship
          </motion.h2>
          
          <Tabs defaultValue="impact" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="recognition">Recognition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="impact">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary-500" />
                        Real Change
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Support vetted causes with tangible outcomes you can track in real-time.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-primary-500" />
                        Measurable ROI
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>See exactly how your sponsorship translates to bags claimed and community impact.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Gift className="mr-2 h-5 w-5 text-primary-500" />
                        Sustainable Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Your brand on eco-friendly tote bags that reduce plastic waste while promoting your values.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="efficiency">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BadgeCheck className="mr-2 h-5 w-5 text-primary-500" />
                        Simple Process
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Our streamlined sponsorship process takes just minutes, with full support at every step.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-primary-500" />
                        Cost Effective
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Get more brand exposure per dollar compared to traditional advertising channels.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CircleDollarSign className="mr-2 h-5 w-5 text-primary-500" />
                        Transparent Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Clear, upfront pricing with no hidden fees and volume discounts available.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="recognition">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary-500" />
                        Brand Visibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Your logo on quality tote bags that travel with users for years, creating ongoing exposure.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BadgeCheck className="mr-2 h-5 w-5 text-primary-500" />
                        Digital Badge
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Display your impact badge on your website and social media to showcase your commitment.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-primary-500" />
                        Social Proof
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Featured in our sponsors directory and PR materials with option for case study highlights.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Growth Chart */}
        <section className="space-y-8">
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
        </section>
        
        {/* Featured Stories Carousel */}
        {!storiesLoading && stories?.length > 0 && (
          <section className="space-y-8">
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
                      <Card className="h-full">
                        {story.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <img 
                              src={story.imageUrl} 
                              alt={story.title} 
                              className="h-full w-full object-cover transition-all hover:scale-105"
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
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
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
