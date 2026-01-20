
export default function StatsSection() {
  const stats = [
    {
      icon: 'ri-flask-line',
      number: '500+',
      label: 'Products Developed',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'ri-team-line',
      number: '200+',
      label: 'Expert Scientists',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: 'ri-global-line',
      number: '50+',
      label: 'Countries Served',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'ri-award-line',
      number: '25+',
      label: 'Years of Excellence',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#50b848] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8bc34a] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Our Impact in Numbers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="1000"
              className="text-center group cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-115 hover:-translate-y-2"
            >
              <div className={`w-20 h-20 flex items-center justify-center bg-gradient-to-br ${stat.color} rounded-2xl mx-auto mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]`}>
                <i className={`${stat.icon} text-4xl text-white`}></i>
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-[#50b848] to-[#8bc34a] bg-clip-text text-transparent">
                {stat.number}
              </div>
              <p className="text-xl text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
