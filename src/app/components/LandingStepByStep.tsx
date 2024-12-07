import React from 'react'

// components/Steps.tsx
const Steps: React.FC = () => {
  const steps = [
    { text: 'Full access to DataGolf stats & predictive analysis' },
    { text: 'Map out and track OAD picks' },
    { text: 'Player history' },
  ]

  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-white text-black rounded-full flex items-center justify-center font-bold shadow-md">
                {step.text}
              </div>
              <p className="mt-4">{step.text}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="text-yellow-500 text-4xl">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default Steps
