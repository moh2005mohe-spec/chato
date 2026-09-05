import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { User, Globe, LogIn } from 'lucide-react';

const CLERK_PUBLISHABLE_KEY = 'pk_test_bGl2aW5nLW9jdG9wdXMtMTU3Ny5jbGVyay5hY2NvdW50cy5kZXYk';

interface AuthStateProps {
  onUserSet: (name: string, avatar: string) => void;
  userName: string;
  userAvatar: string;
}

export const AuthHeaderControls: React.FC<AuthStateProps> = ({ onUserSet, userName, userAvatar }) => {
  const { user, isLoaded } = useUser();

  React.useEffect(() => {
    if (isLoaded && user) {
      const fullName = user.fullName || user.firstName || 'Language Learner';
      const imageUrl = user.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      onUserSet(fullName, imageUrl);
    }
  }, [user, isLoaded, onUserSet]);

  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-slate-200">
          <img
            src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="max-w-[100px] truncate">{userName || 'Member'}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-full text-xs font-medium shadow-xs transition-colors cursor-pointer">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};

export const ClerkAppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};
