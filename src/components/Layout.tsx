
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

      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CauseConnect</h3>
              <p className="text-gray-600">Connecting sponsors with causes that make a difference.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link></li>
                <li><Link to="/causes" className="text-gray-600 hover:text-primary-600">Browse Causes</Link></li>
                <li><Link to="/create-cause" className="text-gray-600 hover:text-primary-600">Create a Cause</Link></li>
                <li><Link to="/sponsor/new" className="text-gray-600 hover:text-primary-600">Become a Sponsor</Link></li>
                <li><Link to="/why-sponsor" className="text-gray-600 hover:text-primary-600">Why Sponsor?</Link></li>
                <li><Link to="/why-claim" className="text-gray-600 hover:text-primary-600">Why Claim?</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-600">support@causeconnect.org</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500">© {new Date().getFullYear()} CauseConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
