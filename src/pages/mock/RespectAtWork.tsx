import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Users, TrendingUp, Scale, Gift, Megaphone, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";

const RespectAtWork = () => {
  const impactStats = [
    { icon: AlertTriangle, value: "75%", label: "Working women face workplace harassment or bias" },
    { icon: Users, value: "23%", label: "Indian women participate in the workforce" },
    { icon: TrendingUp, value: "35%", label: "Outperformance by inclusive companies" },
    { icon: Scale, value: "70%", label: "Harassment cases go unreported" }
  ];

  const faqs = [
    {
      question: "Are there different designs for genders or roles?",
      answer: "Yes, sponsors can choose messaging tailored to workplace environments."
    },
    {
      question: "Can this be used internally in our company?",
      answer: "Absolutely. Use it for awareness drives or employee onboarding."
    },
    {
      question: "Is the design legally reviewed?",
      answer: "All messaging is vetted by legal and DEI consultants."
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
                <Shield className="h-4 w-4" />
                Workplace Equality
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                👩‍💼 Respect at
                <span className="block text-green-600">Work</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Over 75% of working women in India have faced some form of workplace harassment or bias, yet most cases go unreported. 
                This campaign puts workplace dignity at the center of public discussion using high-visibility tote bags.
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional women in workplace"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">75%</div>
                <div className="text-sm text-gray-600">Face harassment</div>
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
              Promoting workplace dignity and equality through visible advocacy
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
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Creates Change</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Shield className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Women's Safety</h4>
                  <p className="text-gray-700">Supports NGOs working on women's safety and workplace equality</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Scale className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Aid</h4>
                  <p className="text-gray-700">Provides legal aid and support for workplace harassment cases</p>
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
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Workplace Equality Statistics</h2>
            <p className="text-xl text-gray-600">The current state of workplace respect and equality in India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-4">70%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Unreported Cases</div>
              <p className="text-gray-600">70% of harassment cases in India go unreported</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-4">23%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Workforce Participation</div>
              <p className="text-gray-600">Only 23% of Indian women participate in the workforce</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">35%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Performance Advantage</div>
              <p className="text-gray-600">Companies with inclusive culture outperform peers by 35%</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">ESG</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Priority Focus</div>
              <p className="text-gray-600">Workplace ethics is now a key boardroom priority for ESG</p>
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
          <h2 className="text-4xl font-bold mb-6">Stand for Dignity at Work</h2>
          <p className="text-xl mb-8 opacity-90">Help create safe and respectful workplaces for everyone</p>
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

export default RespectAtWork;
