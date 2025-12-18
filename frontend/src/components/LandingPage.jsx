import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Droplets, Brain, TrendingUp, Shield, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning models for accurate crop disease detection'
    },
    {
      icon: Droplets,
      title: 'Soil Analysis',
      description: 'Comprehensive soil health monitoring and recommendations'
    },
    {
      icon: TrendingUp,
      title: 'Smart Insights',
      description: 'Data-driven recommendations for sustainable farming'
    }
  ]

  const stats = [
    { label: 'Disease Classes', value: '38+' },
    { label: 'Accuracy Rate', value: '95%+' },
    { label: 'Response Time', value: '<2s' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AgriSense MRV</h1>
                <p className="text-sm text-gray-500">Agricultural Intelligence Platform</p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Ready</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center">
        <div className="container mx-auto px-4 py-10 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                AgriSense MRV
              </motion.h1>
              
              <motion.p
                className="text-base sm:text-xl text-gray-600 mb-3 sm:mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Empower Your Farming with AI Intelligence
              </motion.p>

              <motion.p
                className="text-sm sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Our AI-powered agricultural platform combines advanced machine learning with real-time monitoring to help farmers detect crop diseases early, analyze soil health, and make data-driven decisions for sustainable and profitable farming.
              </motion.p>

              <motion.button
                onClick={() => window.location.hash = 'dashboard'}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg transition-shadow text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.button>
            </motion.div>

            {/* Right Images Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="rounded-lg shadow-lg w-full h-40 sm:h-64 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-center">
                  <Leaf className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold">Farm Fields</p>
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg shadow-lg w-full h-40 sm:h-64 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-center">
                  <TrendingUp className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold">Farmer Working</p>
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg shadow-lg w-full h-40 sm:h-64 bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-center">
                  <Droplets className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold">Irrigation</p>
                </div>
              </motion.div>
              <motion.div
                className="rounded-lg shadow-lg w-full h-40 sm:h-64 bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-center">
                  <Shield className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold">Healthy Crops</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Trusted by Farmers
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base lg:text-lg text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Why Choose AgriSense?
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="bg-white p-4 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* About AI Section */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Powered by Advanced AI & Machine Learning
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 leading-relaxed">
                AgriSense MRV leverages state-of-the-art machine learning algorithms to analyze crop health and soil conditions with unprecedented accuracy. Our models are trained on millions of agricultural data points to provide real-time insights.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">
                Whether you're a small family farmer or managing large agricultural operations, our platform adapts to your needs, providing actionable recommendations that improve yields while maintaining sustainability.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time crop disease detection',
                  'Comprehensive soil health analysis',
                  'Weather-adaptive recommendations',
                  'Sustainable farming insights'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-lg shadow-lg w-full h-96 bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center">
                <Brain className="w-24 h-24 text-white mx-auto mb-4" />
                <p className="text-white text-xl font-semibold">Smart Farming Technology</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your Farming?
          </motion.h2>
          
          <motion.p
            className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands of farmers using AgriSense MRV to improve crop yields and soil health
          </motion.p>

          <motion.button
            onClick={() => window.location.hash = 'dashboard'}
            className="bg-white text-green-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto hover:bg-gray-100 transition-colors text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  )
}
