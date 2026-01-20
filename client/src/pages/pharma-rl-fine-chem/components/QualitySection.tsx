
export default function QualitySection() {
  const qualityPillars = [
    {
      icon: 'ri-shield-check-line',
      title: 'Quality Assurance',
      description: 'Rigorous testing and validation at every stage of production',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'ri-microscope-line',
      title: 'Advanced Analytics',
      description: 'State-of-the-art analytical instruments and methodologies',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: 'ri-file-list-3-line',
      title: 'Regulatory Compliance',
      description: 'Full adherence to global pharmaceutical standards',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'ri-team-line',
      title: 'Expert Team',
      description: 'Highly trained quality professionals ensuring excellence',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Quality Excellence
        </h2>
        <p 
          className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          Our commitment to quality is unwavering, ensuring every product meets the highest international standards
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualityPillars.map((pillar, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="1000"
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer hover:scale-110 hover:-translate-y-2 group"
            >
              <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br ${pillar.color} rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <i className={`${pillar.icon} text-3xl text-white`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{pillar.title}</h3>
              <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
