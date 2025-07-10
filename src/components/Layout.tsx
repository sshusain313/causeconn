
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600 hover:text-primary-600';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-800 flex items-center">
            <span className="mr-2">🤲</span>
            <span>CauseConnect</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`${isActive('/')} px-2 py-4`}>Home</Link>
            <Link to="/causes" className={`${isActive('/causes')} px-2 py-4`}>Causes</Link>
            <Link to="/create-cause" className={`${isActive('/create-cause')} px-2 py-4`}>Create a Cause</Link>
            {/* <Link to="/sponsor/new" className={`${isActive('/sponsor/new')} px-2 py-4`}>Sponsor</Link> */}
            <Link to="/why-sponsor" className={`${isActive('/why-sponsor')} px-2 py-4 text-green-500 text-underline`}>Why Sponsor?</Link>
            <Link to="/why-claim" className={`${isActive('/why-claim')} px-2 py-4  text-green-500 text-underline`}>Why Claim?</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-100 text-primary-800">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/dashboard/${user.role}`)}>
                    Dashboard
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline" className="font-medium">
                Log In / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🤲</span>
                <span className="text-xl font-bold text-primary-800">CauseConnect</span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Empowering brands to drive real change through thoughtful partnerships and sustainable impact.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link></li>
                <li><Link to="/causes" className="text-gray-600 hover:text-primary-600 transition-colors">Browse Causes</Link></li>
                <li><Link to="/create-cause" className="text-gray-600 hover:text-primary-600 transition-colors">Create a Cause</Link></li>
                <li><Link to="/sponsor/new" className="text-gray-600 hover:text-primary-600 transition-colors">Become a Sponsor</Link></li>
                <li><Link to="/why-sponsor" className="text-gray-600 hover:text-primary-600 transition-colors">Why Sponsor?</Link></li>
                <li><Link to="/why-claim" className="text-gray-600 hover:text-primary-600 transition-colors">Why Claim?</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Accessibility</a></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact & Support</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-600">support@causeconnect.org</p>
                    <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-600">Mon-Fri: 9AM-6PM EST</p>
                    <p className="text-sm text-gray-500">Weekend support available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          {/* <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Stay Updated</h3>
              <p className="text-gray-600 mb-4">Get the latest updates on new causes and impact stories.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </div> */}

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} CauseConnect. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>Made with ❤️ for positive change</span>
                <span>•</span>
                <span>100% Carbon Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
