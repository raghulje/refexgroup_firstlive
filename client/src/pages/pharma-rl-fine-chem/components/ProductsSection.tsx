
export default function ProductsSection() {
  const productCategories = [
    {
      icon: 'ri-capsule-line',
      title: 'Active Pharmaceutical Ingredients',
      description: 'High-purity APIs for various therapeutic areas',
      items: ['Oncology', 'Cardiovascular', 'CNS', 'Anti-infectives']
    },
    {
      icon: 'ri-test-tube-line',
      title: 'Pharmaceutical Intermediates',
      description: 'Complex intermediates for API synthesis',
      items: ['Chiral intermediates', 'Heterocyclic compounds', 'Specialty chemicals']
    },
    {
      icon: 'ri-flask-line',
      title: 'Custom Synthesis',
      description: 'Tailored solutions for unique requirements',
      items: ['Process development', 'Scale-up services', 'Technology transfer']
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Our Product Portfolio
        </h2>
        <p 
          className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          Comprehensive range of pharmaceutical products and services tailored to meet global healthcare needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {productCategories.map((category, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="1000"
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer hover:scale-110 hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#50b848] to-[#8bc34a] rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <i className={`${category.icon} text-3xl text-white`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{category.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
              <ul className="space-y-2">
                {category.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <i className="ri-arrow-right-s-line text-[#50b848]"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
