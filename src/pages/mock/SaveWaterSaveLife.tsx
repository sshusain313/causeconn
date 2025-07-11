import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplets, AlertTriangle, Home, Gift, Megaphone, Users, MapPin } from "lucide-react";
import Layout from "@/components/Layout";

const SaveWaterSaveLife = () => {
  const impactStats = [
    { icon: Users, value: "600M", label: "People in high water stress areas" },
    { icon: MapPin, value: "21", label: "Major cities could run out of groundwater by 2030" },
    { icon: AlertTriangle, value: "70%", label: "Of India's water is contaminated" },
    { icon: Home, value: "8%", label: "Rural households have piped water connections" }
  ];

  const faqs = [
    {
      question: "What messages are printed on the bag?",
      answer: "Tips on saving water, stats on scarcity, and local water helplines."
    },
    {
      question: "Can we localize by city or state?",
      answer: "Yes, sponsors can choose target regions."
    },
    {
      question: "Is this eligible for CSR?",
      answer: "Yes, this campaign qualifies under Schedule VII of CSR rules."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Droplets className="h-4 w-4" />
                Water Conservation
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                💧 Save Water,
                <span className="block text-green-600">Save Life</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                India is facing a severe water crisis—600 million people live in areas of high to extreme water stress. 
                21 major cities, including Delhi and Bengaluru, could run out of groundwater by 2030.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-semibold">
                  <Gift className="mr-2 h-5 w-5" />
                  🎁 Claim Your Free Bag
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold">
                  <Megaphone className="mr-2 h-5 w-5" />
                  📢 Sponsor This Cause
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://deekshaindia.org/wp-content/uploads/2024/11/Water-Conservation-A-Lifeline-for-Our-Future-DEEKSHA-BLOG-870x457.jpg"
                alt="Water conservation and scarcity"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">600M</div>
                <div className="text-sm text-gray-600">People at risk</div>
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
              Promoting water conservation habits through daily education and awareness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-100 rounded-full">
                      <stat.icon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-green-50 rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Conserves Water</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Droplets className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Clean Water Access</h4>
                  <p className="text-gray-700">Supports clean water access and infrastructure projects</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Home className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rainwater Harvesting</h4>
                  <p className="text-gray-700">Funds rainwater harvesting systems and water conservation education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Water Crisis Statistics</h2>
            <p className="text-xl text-gray-600">The urgent reality of India's water emergency</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-4">70%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Water Contamination</div>
              <p className="text-gray-600">70% of India's water is contaminated</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-4">200,000</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Annual Deaths</div>
              <p className="text-gray-600">Water-borne diseases kill over 200,000 people in India annually</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-500 mb-4">8%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Rural Access</div>
              <p className="text-gray-600">Only 8% of rural households have piped water connections</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">$5B</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Market Opportunity</div>
              <p className="text-gray-600">$5B market for water conservation tech and infrastructure</p>
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
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Every Drop Counts</h2>
          <p className="text-xl mb-8 opacity-90">Join the movement to conserve India's most precious resource</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Gift className="mr-2 h-5 w-5" />
              🎁 Claim Your Free Bag
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700 px-8 py-4 text-lg font-semibold">
              <Megaphone className="mr-2 h-5 w-5" />
              📢 Sponsor This Cause
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SaveWaterSaveLife;
