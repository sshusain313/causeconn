import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TreePine, Thermometer, MapPin, TrendingDown, Gift, Megaphone, Globe, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const PlantMoreTrees = () => {
  const impactStats = [
    { icon: TrendingDown, value: "1.2M", label: "Hectares of forest lost (2001-2020)" },
    { icon: Thermometer, value: "2-5°C", label: "Temperature reduction from tree cover" },
    { icon: Globe, value: "11%", label: "CO₂ emissions offset by Indian forests" },
    { icon: MapPin, value: "#3", label: "India's global ranking in tree loss" }
  ];

  const faqs = [
    {
      question: "Do you show where trees are planted?",
      answer: "Yes, we provide geo-tagged proof for sponsors."
    },
    {
      question: "Can we co-brand with a green pledge?",
      answer: "Yes, you can include a sustainability message or logo."
    },
    {
      question: "What kind of trees are planted?",
      answer: "Native, non-invasive species chosen based on climate and soil data."
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
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <TreePine className="h-4 w-4" />
                Reforestation
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                🌳 Plant More
                <span className="block text-green-600">Trees</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                India lost over 1.2 million hectares of forest cover from 2001–2020 due to deforestation and urban expansion. 
                With air pollution and heat islands worsening in major cities, tree-planting is critical for environmental health.
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
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Forest and trees for environmental conservation"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">1.2M</div>
                <div className="text-sm text-gray-600">Hectares lost</div>
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
              Supporting afforestation efforts by tying every sponsored bag to a tree planted
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
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Plants Trees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <TreePine className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Saplings & Planting</h4>
                  <p className="text-gray-700">Funds saplings, planting drives, and maintenance of new trees</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Leaf className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Green Education</h4>
                  <p className="text-gray-700">Supports green education and awareness about environmental conservation</p>
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
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Reforestation Statistics</h2>
            <p className="text-xl text-gray-600">The urgent need for tree planting and forest conservation in India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-4">#3</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Global Tree Loss</div>
              <p className="text-gray-600">India ranked 3rd globally in tree loss due to development</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-4">11%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">CO₂ Offset</div>
              <p className="text-gray-600">Forests offset 11% of India's CO₂ emissions</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-4">2-5°C</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Temperature Reduction</div>
              <p className="text-gray-600">Tree cover helps reduce city temperatures by 2–5°C</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">$500M+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Market Size</div>
              <p className="text-gray-600">Corporate tree planting is a $500M+ market in India alone</p>
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
          <h2 className="text-4xl font-bold mb-6">Plant Today, Breathe Tomorrow</h2>
          <p className="text-xl mb-8 opacity-90">Join us in creating a greener, healthier future for India</p>
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

export default PlantMoreTrees;
