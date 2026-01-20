export default function CertificationsSection() {
  const certifications = [
    { 
      icon: 'ri-government-line', 
      title: 'US FDA', 
      description: 'Approved by the United States Food and Drug Administration',
      color: '#7DC244'
    },
    { 
      icon: 'ri-shield-check-line', 
      title: 'EU GMP', 
      description: 'European Union Good Manufacturing Practice certified',
      color: '#EE6A31'
    },
    { 
      icon: 'ri-award-line', 
      title: 'EDQM', 
      description: 'European Directorate for the Quality of Medicines',
      color: '#2879B6'
    },
    { 
      icon: 'ri-hospital-line', 
      title: 'Health Canada', 
      description: 'Approved by Health Canada regulatory authority',
      color: '#7DC244'
    },
    { 
      icon: 'ri-global-line', 
      title: 'WHO-GMP', 
      description: 'World Health Organization Good Manufacturing Practice',
      color: '#EE6A31'
    },
    { 
      icon: 'ri-medicine-bottle-line', 
      title: 'ANVISA', 
      description: 'Brazilian Health Regulatory Agency approved',
      color: '#2879B6'
    },
    { 
      icon: 'ri-building-line', 
      title: 'PMDA', 
      description: 'Pharmaceuticals and Medical Devices Agency, Japan',
      color: '#7DC244'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Regulatory Approvals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our commitment to quality is validated by prestigious international certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${cert.color}, ${cert.color}dd)`
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-3 transition-all duration-500"
                  style={{
                    backgroundColor: `${cert.color}15`
                  }}
                >
                  <i 
                    className={`${cert.icon} text-2xl transition-colors duration-500`}
                    style={{
                      color: cert.color
                    }}
                  ></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-500">
                  {cert.title}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500">
                  {cert.description}
                </p>
              </div>

              {/* White icon overlay on hover */}
              <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <i className={`${cert.icon} text-2xl text-white`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
