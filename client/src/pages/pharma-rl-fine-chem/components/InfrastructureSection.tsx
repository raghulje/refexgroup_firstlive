
// All images must come from CMS - no static imports

export default function InfrastructureSection() {
  // All facilities must come from CMS - no hardcoded data
  const facilities: any[] = [];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          World-Class Infrastructure
        </h2>
        <p
          className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          Our facilities are designed to support innovation and maintain the highest standards of pharmaceutical manufacturing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="1000"
              className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer hover:scale-110 hover:-translate-y-2 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#50b848] to-[#8bc34a] rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  <i className={`${facility.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{facility.title}</h3>
                <p className="text-gray-600 leading-relaxed">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
