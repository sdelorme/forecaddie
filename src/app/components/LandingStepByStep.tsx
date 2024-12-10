import React from 'react'

const Steps: React.FC = () => {
  const steps = [
    { text: 'Full access to DataGolf stats & predictive analysis' },
    { text: 'Map out and track OAD picks' },
    { text: 'Player history' },
  ]

  return (
    <section className="bg-black text-white py-16">
      {/* Login/Sign Up Button */}
      <div className="flex justify-center items-center mb-12">
        <button className="bg-yellow-300 hover:bg-yellow-600 text-green-900 font-bold py-4 px-12 text-3xl rounded-xl shadow-lg">
          Login or Sign up
        </button>
      </div>

      {/* Steps */}
      <div className="container mx-auto flex items-center justify-center space-x-8">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            {/* Step Circle and Text */}
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-white text-black rounded-full flex items-center justify-center font-bold shadow-lg">
                <p className="text-sm px-4 text-center">{step.text}</p>
              </div>
            </div>
            {/* Arrow (skip for the last step) */}
            {idx < steps.length - 1 && (
              <div className="text-yellow-500 text-4xl font-bold">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default Steps
