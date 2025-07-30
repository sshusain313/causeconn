
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Users, Award, BadgeCheck, HandHeart, Leaf, ShieldCheck } from 'lucide-react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { fetchStats, fetchClaimStories } from '@/services/apiServices';
import { Story } from '@/models/Story';

// Sample data for the impact chart (fallback if API data is not available)
const fallbackImpactData = [
  { cause: 'Environmental', bags: 480 },
  { cause: 'Social Justice', bags: 320 },
  { cause: 'Education', bags: 260 },
  { cause: 'Animal Welfare', bags: 190 },
  { cause: 'Hunger Relief', bags: 350 },
];

const WhyClaim = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats
  });

  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ['claim-stories'],
    queryFn: fetchClaimStories
  });

  // Use real impact data from API or fallback to sample data
  const impactData = stats?.impactData || fallbackImpactData;

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
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)' }}
        ></div>
        <div className="container relative z-20 text-center max-w-4xl mx-auto px-4 text-white">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Why Claim a Tote Bag?
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Support causes you care about, get free eco-friendly bags, and join a community of changemakers.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button size="lg" variant="secondary" asChild className="text-lg">
              <Link to="/causes">
                <Heart className="mr-2" /> Browse Causes
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
            Community in Numbers
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
                      <CardTitle className="text-lg font-medium">Total Claimers</CardTitle>
                      <Users className="h-5 w-5 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats?.totalClaimers || 0}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        People making a difference
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Bags Claimed</CardTitle>
                      <Heart className="h-5 w-5 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats?.totalBagsClaimed || 0}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Totes circulating worldwide
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Active Campaigns</CardTitle>
                      <Award className="h-5 w-5 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{stats?.activeCampaigns || 0}</div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Causes ready for your support
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
                  <Leaf className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Give individuals free, eco-friendly tote bags while raising awareness for social causes.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Community Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Enable 10,000 claimers to join the movement in Year 1 and grow our impact network.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Maintain a 95% on-time shipment rate with transparent tracking for all claimers.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary-500 mb-2" />
                  <CardTitle>Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Reward claimers with digital badges and community recognition for their participation.</p>
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
            Benefits of Claiming
          </motion.h2>
          
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="personal">Personal Benefits</TabsTrigger>
              <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
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
                        <Heart className="mr-2 h-5 w-5 text-primary-500" />
                        Free Quality Bags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Receive high-quality, durable tote bags at absolutely no cost to you.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary-500" />
                        Digital Badges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Earn shareable digital badges that showcase your commitment to causes.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShieldCheck className="mr-2 h-5 w-5 text-primary-500" />
                        Exclusive Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Get early notification for new campaigns and special cause-related events.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="environmental">
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
                        <Leaf className="mr-2 h-5 w-5 text-primary-500" />
                        Reduce Plastic Waste
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Each tote bag used can prevent hundreds of single-use plastic bags from entering landfills.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HandHeart className="mr-2 h-5 w-5 text-primary-500" />
                        Sustainable Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Our tote bags are made from sustainable, ethically-sourced cotton and recycled materials.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BadgeCheck className="mr-2 h-5 w-5 text-primary-500" />
                        Carbon Footprint
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Each campaign tracks and offsets the carbon footprint of production and shipping.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="community">
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
                        <Users className="mr-2 h-5 w-5 text-primary-500" />
                        Join a Movement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Become part of a global community committed to social and environmental change.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary-500" />
                        Social Amplification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Each bag carries a message that sparks conversations and raises awareness wherever you go.</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HandHeart className="mr-2 h-5 w-5 text-primary-500" />
                        Tangible Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Track how your participation contributes to measurable change for your chosen causes.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Impact Chart */}
        <section className="space-y-8">
          <motion.h2 
            className="text-3xl font-bold text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Impact by Cause
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
                bags: {
                  label: "Bags Claimed",
                  theme: {
                    light: "#4CAF50",
                    dark: "#81C784",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={impactData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cause" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bags" name="Bags Claimed" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>
          <p className="text-center text-muted-foreground">
            Distribution of claimed bags across different cause categories
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
              Claimer Stories
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
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Join the Movement?</h2>
            <p className="text-lg text-muted-foreground">
              Claim your free tote bag today and become part of a growing community 
              of people making a difference with every shopping trip.
            </p>
            <Button variant="secondary" size="lg" className="text-lg" asChild>
              <Link to="/causes">
                <Heart className="mr-2" /> Browse Available Causes
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>
    </Layout>
  );
};

export default WhyClaim;
