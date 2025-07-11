import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brain, Heart, Users, Phone, Gift, Megaphone, TrendingUp, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";

const MentalHealthMatters = () => {
  const impactStats = [
    { icon: Users, value: "200M+", label: "Indians suffer from mental health disorders" },
    { icon: AlertCircle, value: "70%", label: "Receive no treatment due to stigma" },
    { icon: TrendingUp, value: "4x", label: "Return on corporate mental health investments" },
    { icon: Phone, value: "24/7", label: "Helplines promoted on every bag" }
  ];

  const faqs = [
    {
      question: "Will these bags provide crisis contacts?",
      answer: "Yes. They include helplines and mental health resources."
    },
    {
      question: "Is the messaging age-specific?",
      answer: "Yes, tailored designs are available for youth, professionals, and families."
    },
    {
      question: "How can I sponsor a mental health campaign?",
      answer: "Choose a package and submit your brand assets. We'll do the rest."
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
                <Brain className="h-4 w-4" />
                Mental Wellness
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                🧠 Mental Health
                <span className="block text-green-600">Matters</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                India has one of the largest mental health burdens globally—more than 200 million people suffer from depression, 
                anxiety, or stress-related disorders. Yet nearly 70% receive no treatment due to stigma, poor access, and lack of awareness.
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
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Mental health support group"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">1 in 5</div>
                <div className="text-sm text-gray-600">Indians affected</div>
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
              Breaking stigma and promoting mental wellness through visible advocacy
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
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Helps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Phone className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Free Counseling</h4>
                  <p className="text-gray-700">Funds free mental health counseling and awareness sessions</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Heart className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Awareness Campaigns</h4>
                  <p className="text-gray-700">Promotes positive mental health culture in workplaces and communities</p>
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
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Mental Health Crisis in Numbers</h2>
            <p className="text-xl text-gray-600">Understanding the scale of mental health challenges in India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-4">1 in 5</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Population Affected</div>
              <p className="text-gray-600">1 in 5 Indians suffers from a mental illness</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-4">14%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Mental Health Disorders</div>
              <p className="text-gray-600">14% of India's population has some form of mental health disorder</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-500 mb-4">#1</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Youth Suicide Rate</div>
              <p className="text-gray-600">India's suicide rate among youth is the highest globally</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">4x</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">ROI on Investment</div>
              <p className="text-gray-600">Corporate mental health investments show 4x return on productivity</p>
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
          <h2 className="text-4xl font-bold mb-6">Break the Silence, Break the Stigma</h2>
          <p className="text-xl mb-8 opacity-90">Join us in normalizing mental health conversations</p>
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

export default MentalHealthMatters;
