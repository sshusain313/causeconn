
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Smartphone, Eye, Users, TrendingUp, Gift, Megaphone, Clock, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";

const LookUpNotDown = () => {
  const impactStats = [
    { icon: Clock, value: "7.3 hrs", label: "Average daily screen time in India" },
    { icon: AlertCircle, value: "65%", label: "Gen Z report screen-related anxiety" },
    { icon: Smartphone, value: "1.2B", label: "Mobile users in India" },
    { icon: Users, value: "80%", label: "Parents want screen-time guidance" }
  ];

  const faqs = [
    {
      question: "What type of users benefit most from this bag?",
      answer: "Students, parents, professionals, and educators."
    },
    {
      question: "Can we link a QR code to a mindfulness app?",
      answer: "Yes, sponsors can customize QR code links."
    },
    {
      question: "Is there a digital campaign add-on?",
      answer: "Yes, we offer optional influencer and content bundles."
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
                <Eye className="h-4 w-4" />
                Digital Wellness
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                📵 Look Up,
                <span className="block text-green-600">Not Down</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Indians spend an average of 7.3 hours per day on mobile devices—one of the highest in the world. 
                Excessive screen time is linked to poor sleep, reduced attention spans, and rising rates of anxiety and burnout.
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
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="People looking at phones instead of connecting"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">7.3</div>
                <div className="text-sm text-gray-600">Hours daily</div>
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
              Encouraging digital mindfulness and balanced technology use through visual reminders
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
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">How Each ₹10 Promotes Balance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Users className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">School Workshops</h4>
                  <p className="text-gray-700">Funds school workshops and digital wellness education programs</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-full">
                  <Eye className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Digital Detox</h4>
                  <p className="text-gray-700">Supports parenting sessions and digital detox initiatives</p>
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
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Digital Wellness Statistics</h2>
            <p className="text-xl text-gray-600">The impact of excessive screen time on India's population</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-red-600 mb-4">65%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Gen Z Anxiety</div>
              <p className="text-gray-600">65% of Gen Z in India report screen-related anxiety</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-4">1.2B</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Mobile Users</div>
              <p className="text-gray-600">India has 1.2B mobile users and 470M smartphone users</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">$1.1B</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Market Growth</div>
              <p className="text-gray-600">Digital wellness market expected to cross $1.1B by 2027</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-4">80%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Parental Concern</div>
              <p className="text-gray-600">80% of parents want more guidance on screen-time limits</p>
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
          <h2 className="text-4xl font-bold mb-6">Reconnect with the Real World</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of others in promoting digital wellness and balanced technology use</p>
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

export default LookUpNotDown;
