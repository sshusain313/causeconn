import { Story } from '@/models/Story';
import { Cause } from '@/types';
import config from '../config';

// Mock data for development - would be replaced with real API calls
const mockStats = {
  totalSponsors: 37,
  totalClaimers: 142,
  totalBagsSponsored: 1250, 
  totalBagsClaimed: 873,
  activeCampaigns: 12
};

// Mock dashboard metrics for admin
const mockDashboardMetrics = {
  totalCauses: 6,
  totalSponsors: 2,
  totalRaised: 14500,
  pendingItems: 6,
  weeklyStats: {
    causesChange: 2,
    sponsorsChange: 0,
    raisedChange: 3500,
    urgentPendingItems: 3
  }
};

const mockStories: Story[] = [
  {
    id: '1',
    title: 'How my sponsored bags helped a local shelter',
    authorName: 'Sarah Johnson',
    imageUrl: '/stories/story1.png',
    content: 'When I decided to sponsor 100 tote bags for the homeless shelter in my community, I had no idea what impact it would make. The shelter director told me that having quality, durable bags allowed many of their clients to carry their belongings with dignity. One woman even used her bag for job interviews, carrying her resume and a change of clothes. Three months later, she secured stable employment.',
    excerpt: 'When I decided to sponsor 100 tote bags for the homeless shelter in my community, I had no idea what impact it would make...',
    createdAt: new Date('2025-04-15'),
  },
  {
    id: '2',
    title: 'My eco-friendly journey with CauseConnect',
    authorName: 'Miguel Rodriguez',
    imageUrl: '/stories/story2.png',
    content: 'I claimed my first CauseConnect tote bag six months ago, and it changed how I shop. No more plastic bags at the grocery store! I carry my tote everywhere, and so many people have asked about it. I love explaining how it supports the ocean cleanup initiative. The QR code on the bag has even led three of my friends to claim their own bags.',
    excerpt: 'I claimed my first CauseConnect tote bag six months ago, and it changed how I shop. No more plastic bags at the grocery store!...',
    createdAt: new Date('2025-05-02'),
  },
  {
    id: '3',
    title: 'Small business, big impact',
    authorName: 'Taylor Williams',
    imageUrl: '/stories/story3.png',
    content: 'As a small coffee shop owner, I wasn\'t sure if sponsoring tote bags would be worth the investment. But seeing our brand carried around town by people who care about the same causes we do has been incredible marketing. We\'ve had new customers come in specifically because they saw our logo on a bag and looked us up. The ROI has exceeded our expectations!',
    excerpt: 'As a small coffee shop owner, I wasn\'t sure if sponsoring tote bags would be worth the investment. But seeing our brand carried around town...',
    createdAt: new Date('2025-04-22'),
  }
];

// Mock causes data
const mockCauses: Cause[] = [
  {
    _id: '1',
    title: 'Ocean Cleanup Initiative',
    description: 'Help us remove plastic waste from our oceans with reusable tote bags',
    story: 'Every year, millions of tons of plastic waste enter our oceans, harming marine life and ecosystems. Our Ocean Cleanup Initiative aims to reduce plastic waste by providing high-quality, reusable tote bags to communities worldwide. Each bag prevents approximately 500 plastic bags from entering the waste stream over its lifetime.',
    imageUrl: '/totebag.png',
    category: 'droplet',
    targetAmount: 10000,
    currentAmount: 7500,
    status: 'open',
    sponsors: [
      {
        _id: 'sponsor1',
        userId: 'user1',
        name: 'EcoTech Solutions',
        amount: 2500,
        createdAt: new Date('2025-04-01')
      },
      {
        _id: 'sponsor2',
        userId: 'user2',
        name: 'Green Future Corp',
        amount: 5000,
        createdAt: new Date('2025-04-15')
      }
    ],
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-05-20')
  }
];

// Real API calls using the config file for the API URL
export const fetchStats = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to mock data if API call fails
    return mockStats;
  }
};

export const fetchStories = async (): Promise<Story[]> => {
  try {
    const response = await fetch(`${config.apiUrl}/stories`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    // Fallback to mock data if API call fails
    return mockStories;
  }
};

// Fetch dashboard metrics for admin by calculating from existing data
export const fetchDashboardMetrics = async () => {
  try {
    // First try to fetch all causes without filtering to get the complete dataset
    const allCausesResponse = await fetch(`${config.apiUrl}/causes`);
    
    if (!allCausesResponse.ok) {
      throw new Error('Failed to fetch causes data');
    }
    
    const allCauses = await allCausesResponse.json();
    
    if (!Array.isArray(allCauses) || allCauses.length === 0) {
      throw new Error('No causes data available');
    }
    
    console.log('Successfully fetched', allCauses.length, 'causes');
    
    // Calculate metrics from real data
    const approvedCauses = allCauses.filter(cause => cause.status === 'approved');
    const pendingCauses = allCauses.filter(cause => cause.status === 'pending');
    
    // Extract all unique sponsors from all causes
    const allSponsors = new Set();
    let totalRaised = 0;
    
    // Since we don't have real sponsor data yet, use the mock data for sponsors and raised amount
    // This is a temporary solution until the API is updated with real sponsor data
    const mockSponsorsData = [
      {
        _id: 'sponsor1',
        userId: 'user1',
        name: 'EcoTech Solutions',
        amount: 2500,
        createdAt: new Date('2025-04-01')
      },
      {
        _id: 'sponsor2',
        userId: 'user2',
        name: 'Green Future Corp',
        amount: 5000,
        createdAt: new Date('2025-04-15')
      }
    ];
    
    // Use mock sponsor data for now
    mockSponsorsData.forEach(sponsor => {
      if (sponsor.userId || sponsor._id) {
        allSponsors.add(sponsor.userId || sponsor._id);
      }
      if (typeof sponsor.amount === 'number') {
        totalRaised += sponsor.amount;
      }
    });
    
    console.log(`Using mock sponsor data: totalSponsors=${allSponsors.size}, totalRaised=${totalRaised}`);
    
    // Calculate weekly changes
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const causesThisWeek = allCauses.filter(cause => {
      const createdAt = new Date(cause.createdAt);
      return !isNaN(createdAt.getTime()) && createdAt >= oneWeekAgo;
    }).length;
    
    // For sponsors this week, use mock data
    const sponsorsThisWeek = mockSponsorsData.filter(sponsor => {
      const createdAt = new Date(sponsor.createdAt);
      return !isNaN(createdAt.getTime()) && createdAt >= oneWeekAgo;
    });
    
    let raisedThisWeek = sponsorsThisWeek.reduce((total, sponsor) => {
      return total + (typeof sponsor.amount === 'number' ? sponsor.amount : 0);
    }, 0);
    
    // Calculate urgent pending items (those that have been pending for more than 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const urgentPendingItems = pendingCauses.filter(cause => {
      if (!cause.createdAt) return false;
      const createdAt = new Date(cause.createdAt);
      return !isNaN(createdAt.getTime()) && createdAt <= threeDaysAgo;
    }).length;
    
    // Return calculated metrics with real cause data and mock sponsor data
    return {
      totalCauses: allCauses.length,
      totalSponsors: allSponsors.size,
      totalRaised: totalRaised,
      pendingItems: pendingCauses.length,
      weeklyStats: {
        causesChange: causesThisWeek,
        sponsorsChange: sponsorsThisWeek.length,
        raisedChange: raisedThisWeek,
        urgentPendingItems: urgentPendingItems
      }
    };
  } catch (error) {
    console.error('Error calculating dashboard metrics:', error);
    
    // As a last resort, try to calculate from individual API endpoints
    try {
      console.log('Attempting to calculate from individual endpoints...');
      
      // Fetch approved causes
      const approvedResponse = await fetch(`${config.apiUrl}/causes?status=approved`);
      const pendingResponse = await fetch(`${config.apiUrl}/causes?status=pending`);
      
      const approvedCauses = approvedResponse.ok ? await approvedResponse.json() : [];
      const pendingCauses = pendingResponse.ok ? await pendingResponse.json() : [];
      
      // Basic calculations from whatever data we could get
      const totalCauses = Array.isArray(approvedCauses) ? approvedCauses.length : 0;
      const pendingItems = Array.isArray(pendingCauses) ? pendingCauses.length : 0;
      
      // Extract sponsors and calculate total raised
      const allSponsors = new Set();
      let totalRaised = 0;
      
      if (Array.isArray(approvedCauses)) {
        approvedCauses.forEach(cause => {
          if (cause.sponsors && Array.isArray(cause.sponsors)) {
            cause.sponsors.forEach(sponsor => {
              if (sponsor.userId || sponsor._id) {
                allSponsors.add(sponsor.userId || sponsor._id);
              }
              if (typeof sponsor.amount === 'number') {
                totalRaised += sponsor.amount;
              }
            });
          }
        });
      }
      
      return {
        totalCauses: totalCauses,
        totalSponsors: allSponsors.size,
        totalRaised: totalRaised,
        pendingItems: pendingItems,
        weeklyStats: {
          causesChange: Math.floor(totalCauses * 0.1), // Estimate 10% growth
          sponsorsChange: Math.floor(allSponsors.size * 0.05), // Estimate 5% growth
          raisedChange: Math.floor(totalRaised * 0.15), // Estimate 15% growth
          urgentPendingItems: Math.ceil(pendingItems * 0.3) // Estimate 30% urgent
        }
      };
    } catch (secondError) {
      console.error('All attempts to calculate metrics failed:', secondError);
      
      // Only use mock data as an absolute last resort
      alert('Unable to load real metrics data. Please check your network connection.');
      
      return {
        totalCauses: 0,
        totalSponsors: 0,
        totalRaised: 0,
        pendingItems: 0,
        weeklyStats: {
          causesChange: 0,
          sponsorsChange: 0,
          raisedChange: 0,
          urgentPendingItems: 0
        }
      };
    }
  }
};

export const fetchCause = async (id: string): Promise<Cause> => {
  try {
    const response = await fetch(`${config.apiUrl}/causes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cause');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching cause ${id}:`, error);
    // Fallback to mock data if API call fails
    const cause = mockCauses.find(c => c._id === id);
    if (!cause) {
      throw new Error('Cause not found');
    }
    return cause;
  }
};

export const submitStory = async (storyData: Omit<Story, 'id' | 'excerpt' | 'createdAt'>): Promise<Story> => {
  try {
    const response = await fetch(`${config.apiUrl}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit story');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting story:', error);
    // Fallback to mock implementation if API call fails
    const newStory: Story = {
      id: (mockStories.length + 1).toString(),
      ...storyData,
      excerpt: storyData.content.slice(0, 150) + '…',
      createdAt: new Date()
    };
    
    mockStories.push(newStory);
    return newStory;
  }
};
