import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Recycle, Leaf, ArrowRight, Gift, Megaphone, TrendingUp, Users, Globe, Target } from "lucide-react";
import { Link } from "react-router-dom";

const SayNoToPlastic = () => {
  const impactStats = [
    { icon: Recycle, value: "300+", label: "Plastic bags replaced per ChangeBag" },
    { icon: Users, value: "26,000+", label: "Tons of plastic waste daily in India" },
    { icon: Globe, value: "8M", label: "Tons of plastic enter oceans yearly" },
    { icon: Target, value: "$12B", label: "Circular economy opportunity by 2030" }
  ];

  const faqs = [
    {
      question: "How does this help reduce plastic waste?",
      answer: "Each ChangeBag replaces hundreds of plastic bags, reducing demand and pollution."
    },
    {
      question: "Where are bags distributed?",
      answer: "Malls, transit hubs, colleges, and local retail points."
    },
    {
      question: "Can I co-brand a bag as a sponsor?",
      answer: "Yes! Your logo and message appear alongside the campaign cause."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {/* <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            ChangeBag
          </Link>
          <Button asChild variant="outline">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Recycle className="h-4 w-4" />
                Environmental Impact
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                🌱 Say No to
                <span className="block text-green-600">Plastic</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                India is the fifth-largest generator of plastic waste in the world, producing over 9.3 million metric tons annually. 
                Shockingly, only 60% of this is effectively recycled, while the rest ends up in landfills, rivers, or the ocean.
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
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Ocean plastic pollution"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">60%</div>
                <div className="text-sm text-gray-600">Recycling Rate</div>
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
              Every ChangeBag creates a ripple effect of positive environmental change
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
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Makes a Difference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Recycle className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Plastic Recovery</h4>
                  <p className="text-gray-700">Supports plastic waste collection and recycling efforts</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Users className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Clean-up Drives</h4>
                  <p className="text-gray-700">Organizes community clean-up and awareness events</p>
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
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Market Statistics</h2>
            <p className="text-xl text-gray-600">The scale of India's plastic waste challenge</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-4">26,000+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Tons Daily</div>
              <p className="text-gray-600">India generates 26,000+ tons of plastic waste daily</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-4">8M</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Ocean Pollution</div>
              <p className="text-gray-600">Over 8 million tons of plastic enter the ocean globally each year</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-4">90%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Urban Concentration</div>
              <p className="text-gray-600">90% of India's plastic waste comes from 60 cities</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">$12B</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Economic Opportunity</div>
              <p className="text-gray-600">Estimated $12B opportunity in India's circular economy by 2030</p>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of others in reducing plastic waste</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Gift className="mr-2 h-5 w-5" />
              🎁 Claim Your Free Bag
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold">
              <Megaphone className="mr-2 h-5 w-5" />
              📢 Sponsor This Cause
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SayNoToPlastic;
