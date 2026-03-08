import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Camera, Hand, Video, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import { motion } from 'framer-motion';

const HomePage = () => {
  const features = [
    {
      icon: <Hand className="w-12 h-12 text-purple-600" />,
      title: 'MediaPipe Hand Detection',
      description: 'Visualize hand landmarks and poses in real-time. Track 21 hand points with precise 3D coordinates and gesture classification.',
      link: '/hand-pose',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Video className="w-12 h-12 text-teal-600" />,
      title: 'Custom Sign Recorder',
      description: 'Create and save your own custom signs. Record video frames, add descriptions, and build your personal sign language library.',
      link: '/custom-recorder',
      color: 'from-teal-500 to-emerald-500'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Manan's Project - Hand Pose & Custom Signs</title>
        <meta name="description" content="Real-time hand pose visualization and custom sign recording using MediaPipe." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1587400520167-0a46c3c98582)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Hand Pose
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                  Visualization
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                Visualize and understand hand landmarks in real-time using MediaPipe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/hand-pose">
                  <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all">
                    Open Hand Pose
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/70 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful tools for real-time hand tracking and your own custom sign library.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100">
                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <Link to={feature.link}>
                      <Button className="w-full group-hover:bg-gray-900 transition-colors">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Jump in to explore hand pose visualization or record custom signs.
            </p>
            <Link to="/login">
              <Button size="lg" className="text-lg px-10 py-6 bg-white text-gray-900 hover:bg-gray-100 shadow-2xl">
                Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default HomePage;