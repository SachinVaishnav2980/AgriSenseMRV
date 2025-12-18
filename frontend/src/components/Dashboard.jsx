import { motion } from 'framer-motion'
import { Leaf, Droplets, Activity, TrendingUp, Zap, Shield } from 'lucide-react'

export default function Dashboard() {
  const features = [
    {
      icon: Leaf,
      title: 'Crop Disease Detection',
      description: 'Upload leaf images to detect diseases using advanced AI',
      color: 'from-green-500 to-green-600',
      link: '#crop'
    },
    {
      icon: Droplets,
      title: 'Soil Health Analysis',
      description: 'Analyze soil parameters and get health scores',
      color: 'from-blue-500 to-blue-600',
      link: '#soil'
    },
    {
      icon: Activity,
      title: 'Integrated Analysis',
      description: 'Combined crop and soil analysis for comprehensive insights',
      color: 'from-purple-500 to-purple-600',
      link: '#integrated'
    },
  ]

  const stats = [
    { label: 'Disease Classes', value: '38+', icon: Shield },
    { label: 'Accuracy', value: '95%+', icon: TrendingUp },
    { label: 'Response Time', value: '<2s', icon: Zap },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <motion.h1
          className="text-5xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to AgriSense MRV
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          AI-Powered Agricultural Monitoring, Reporting, and Verification Platform
        </motion.p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="card text-center"
            >
              <Icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.button
              key={feature.title}
              onClick={() => window.location.hash = feature.link.slice(1)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer text-left"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.button>
          )
        })}
      </div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="card bg-gradient-to-r from-green-500 to-green-600 text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Get Started</h3>
        <p className="mb-6">Choose a feature above to begin analyzing your agricultural data</p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => window.location.hash = 'crop'}
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Upload Image
          </button>
          <button 
            onClick={() => window.location.hash = 'soil'}
            className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Analyze Soil
          </button>
        </div>
      </motion.div>
    </div>
  )
}

