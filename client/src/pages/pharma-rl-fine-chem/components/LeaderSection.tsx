// All images must come from CMS - no static imports

export default function LeaderSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Leadership Message
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            className="relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] group"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            {/* Image should come from CMS */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          </div>

          {/* Content */}
          <div data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#50b848] to-[#8bc34a] rounded-2xl">
                  <i className="ri-user-star-line text-3xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-gray-600">Leading the Future</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "At Pharma RL Fine Chem, we are committed to advancing pharmaceutical innovation through excellence in manufacturing and research. Our dedication to quality, sustainability, and customer satisfaction drives everything we do."
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                "We believe in building long-term partnerships with our clients, delivering reliable solutions that meet the evolving needs of the global pharmaceutical industry."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
