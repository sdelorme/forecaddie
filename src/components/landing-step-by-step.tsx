'use server'

import React from 'react'

const Steps: React.FC = () => {
  const steps = [
    { text: 'Full access to DataGolf stats & predictive analysis' },
    { text: 'Map out and track OAD picks' },
    { text: 'Player history' },
  ]

  return (
    <section className="bg-black text-white py-8">
      
      <div className="flex justify-center items-center mb-8">
        <button className="bg-secondary hover:bg-primary text-primary hover:text-secondary font-bold py-3 px-8 text-lg md:text-3xl rounded-xl shadow-lg">
          Learn More
        </button>
      </div>

      {/* Steps */}
      <div className="container mx-auto flex flex-col items-center md:flex-row md:justify-center md:space-x-12">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            {/* Step Circle and Text */}
            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 md:w-40 md:h-40 bg-white text-black rounded-full flex items-center justify-center font-bold shadow-lg">
                <p className="text-s md:text-md lg:text-base px-4 leading-tight">
                  {step.text}
                </p>
              </div>
              {/* Mobile Arrow */}
              {idx < steps.length - 1 && (
                <div className="block md:hidden text-yellow-500 text-3xl font-bold mt-4 mb-4">
                  ↓
                </div>
              )}
            </div>
            {/* Desktop Arrow */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block text-yellow-500 text-4xl font-bold">
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default Steps
