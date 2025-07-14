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
    console.log('Fetching stats from:', `${config.apiUrl}/stats`);
    const response = await fetch(`${config.apiUrl}/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Stats received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to mock data if API call fails
    console.log('Falling back to mock stats data');
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
    console.log('Fetching dashboard metrics from backend...');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required for dashboard metrics');
    }
    
    const response = await fetch(`${config.apiUrl}/sponsorships/dashboard-metrics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard metrics: ${response.status} ${response.statusText}`);
    }
    
    const metrics = await response.json();
    console.log('Dashboard metrics received:', metrics);
    
    return metrics;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    
    // Fallback to mock data if API call fails
    return {
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
  }
};

export const fetchCause = async (id: string): Promise<Cause> => {
  try {
    const url = `${config.apiUrl}/causes/${id}`;
    console.log(`Fetching cause ${id} from: ${url}`);
    console.log('Config API URL:', config.apiUrl);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch cause: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Cause ${id} data received:`, data);
    return data;
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
