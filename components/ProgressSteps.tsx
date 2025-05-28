'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface ProgressStepsProps {
  currentStep: number
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { id: 1, name: 'Analyzing Video', description: 'Extracting video content' },
    { id: 2, name: 'Generating Content', description: 'Creating SEO-optimized blog post' },
    { id: 3, name: 'Finalizing', description: 'Applying finishing touches' }
  ]

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: step.id * 0.2 }}
                  className="relative z-10"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      step.id < currentStep
                        ? 'border-green-500 bg-green-50'
                        : step.id === currentStep
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : step.id === currentStep ? (
                      <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                    ) : (
                      <span className="text-gray-500">{step.id}</span>
                    )}
                  </div>
                </motion.div>
                <div className="mt-2 space-y-1 text-center">
                  <p className={`text-sm font-semibold ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {currentStep > 0 && currentStep <= steps.length && (
        <div className="text-center mt-8">
          <p className="text-lg font-semibold">{steps[currentStep - 1].name}</p>
          <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
        </div>
      )}
    </div>
  )
}

