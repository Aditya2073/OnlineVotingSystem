
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle,
  ShieldCheck,
  Award,
  BarChart3,
  Vote,
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Vote className="h-6 w-6 text-indian-blue" />,
      title: 'Secure Voting',
      description:
        'Cast your vote securely with our state-of-the-art encryption and authentication system.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indian-blue" />,
      title: 'Data Protection',
      description:
        'Your personal information and voting data are protected with enterprise-grade security.'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indian-blue" />,
      title: 'Real-time Results',
      description:
        'View election results in real-time with detailed analytics and visualizations.'
    },
    {
      icon: <Award className="h-6 w-6 text-indian-blue" />,
      title: 'Candidate Profiles',
      description:
        'Explore detailed profiles of candidates to make informed decisions before voting.'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-gray-900 mb-6">
              Secure Digital <span className="text-indian-blue">Democracy</span> for India
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A modern, secure, and transparent online voting platform designed to uphold the democratic values of India's electoral system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to={user?.isAdmin ? "/admin" : "/voting-booth"}>
                  <Button className="bg-indian-blue hover:bg-indian-blue/90 text-white font-medium px-8 py-3 rounded-lg shadow-sm">
                    {user?.isAdmin ? 'Go to Admin Dashboard' : 'Cast Your Vote Now'}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="bg-indian-blue hover:bg-indian-blue/90 text-white font-medium px-8 py-3 rounded-lg shadow-sm">
                      Register to Vote
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="px-8 py-3 rounded-lg">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-12 flex justify-center">
              <div className="glass-card px-6 py-4 inline-flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-indian-green" />
                <span>Endorsed by security experts for safe and transparent voting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute top-1/3 left-5 w-16 h-16 rounded-full bg-indian-orange/10 backdrop-blur-sm"></div>
        <div className="hidden md:block absolute bottom-1/4 right-10 w-24 h-24 rounded-full bg-indian-blue/10 backdrop-blur-sm"></div>
        <div className="hidden md:block absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-indian-green/10 backdrop-blur-sm"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              Advanced Voting Features
            </h2>
            <p className="text-lg text-gray-600">
              Our platform combines cutting-edge technology with user-friendly design to deliver a secure and seamless voting experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-subtle border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Our streamlined process makes online voting secure, accessible, and easy to use for all citizens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indian-blue/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indian-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-600">
                Create an account using your voter ID and personal information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indian-blue/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indian-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify</h3>
              <p className="text-gray-600">
                Complete the verification process to ensure your identity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indian-blue/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indian-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vote</h3>
              <p className="text-gray-600">
                Cast your vote securely during the scheduled election period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-indian-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Ready to participate in the democratic process?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of citizens already using our platform to make their voices heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-white text-indian-blue hover:bg-gray-100 font-medium px-8 py-3 rounded-lg shadow-sm">
                  Register Now
                </Button>
              </Link>
              <Link to="/candidates">
                <Button variant="outline" className="text-white border-white hover:bg-blue-800 px-8 py-3 rounded-lg">
                  View Candidates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
