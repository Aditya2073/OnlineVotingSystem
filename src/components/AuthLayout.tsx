
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  footer,
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indian-blue to-indian-green flex items-center justify-center">
                <span className="text-white font-bold text-sm">ECI</span>
              </div>
              <span className="font-display font-semibold text-xl text-indian-blue">
                E-<span className="text-indian-orange">Vote</span>
              </span>
            </Link>
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900 font-display">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>

      {/* Right side - image and content */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indian-blue to-indian-green">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center px-12 text-white">
            <div className="glass-card p-8 max-w-md text-center mb-8 bg-white/10">
              <h3 className="text-2xl font-bold mb-4">Secure. Transparent. Democratic.</h3>
              <p className="text-white/90">
                Our cutting-edge voting platform ensures your voice is heard securely and accurately.
                Built with modern technology to uphold the democratic principles of India.
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="glass-card p-6 max-w-xs text-center bg-white/10">
              <p className="italic text-white/90">
                "The ballot is stronger than the bullet."
              </p>
              <p className="mt-2 text-white/70 text-sm">— Abraham Lincoln</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
