// All images must come from CMS - no static imports

interface PlantCapabilitySectionProps {
  sectionData?: any;
  getImagePath?: (imageData: any) => string;
  getSectionContent?: (section: any, contentKey: string) => any;
}

export default function PlantCapabilitySection({ sectionData, getImagePath, getSectionContent }: PlantCapabilitySectionProps) {
  // Helper to safely parse array data
  const parseArrayData = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Get facilities from CMS
  const formulationsFacilitiesData = getSectionContent?.(sectionData, 'formulationsFacilities');
  const formulationsFacilities: any[] = parseArrayData(formulationsFacilitiesData);

  const rlfcCapabilitiesData = getSectionContent?.(sectionData, 'rlfcCapabilities');
  const rlfcCapabilities: any[] = parseArrayData(rlfcCapabilitiesData);

  const oncologyFacilitiesData = getSectionContent?.(sectionData, 'oncologyFacilities');
  const oncologyFacilities: any[] = parseArrayData(oncologyFacilitiesData);

  // Helper to resolve image path
  const resolveImagePath = (imageData: any): string => {
    if (!imageData) return '';
    
    // If it's already a string path
    if (typeof imageData === 'string') {
      return getImagePath ? getImagePath(imageData) : imageData;
    }
    
    // If it's a number (media ID)
    if (typeof imageData === 'number') {
      return getImagePath ? getImagePath(imageData) : '';
    }
    
    // If it's an object with path/filePath/url
    if (typeof imageData === 'object') {
      if (imageData.path) {
        return getImagePath ? getImagePath(imageData.path) : imageData.path;
      }
      if (imageData.filePath) {
        return getImagePath ? getImagePath(imageData.filePath) : imageData.filePath;
      }
      if (imageData.url) {
        return imageData.url;
      }
      // Try getImagePath on the whole object
      return getImagePath ? getImagePath(imageData) : '';
    }
    
    return '';
  };

  const approvals = [
    { name: 'US FDA', icon: 'ri-government-line', color: '#7DC244' },
    { name: 'EU GMP', icon: 'ri-shield-check-line', color: '#EE6A31' },
    { name: 'EDQM', icon: 'ri-file-shield-line', color: '#7DC244' },
    { name: 'Health Canada', icon: 'ri-hospital-line', color: '#EE6A31' },
    { name: 'ANVISA', icon: 'ri-shield-star-line', color: '#7DC244' },
    { name: 'PMDA', icon: 'ri-medal-line', color: '#EE6A31' },
    { name: 'WHO-GMP', icon: 'ri-global-line', color: '#7DC244' },
  ];

  return (
    <div className="bg-white py-10 ">
      <div className="container mx-auto px-6 max-w-[1156.67px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Manufacturing Excellence</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our global manufacturing footprint spans APIs, intermediates, and finished formulations, supported by stringent regulatory approvals and world-class infrastructure. Together, these facilities enable us to deliver quality, scale, and reliability to partners across 80+ countries.
          </p>
        </div>

        {/* Formulations & Complex Generics Section */}
        <section className="py-8 bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Formulations & Complex Generics with Extrovis Capabilities
            </h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {formulationsFacilities.map((facility, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-72"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative h-full w-full overflow-hidden">
                  {resolveImagePath(facility.image) ? (
                  <img
                      src={resolveImagePath(facility.image)}
                    alt={facility.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                  />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="text-base md:text-lg font-bold mb-2">{facility.title}</h4>
                    <p className="text-gray-200 text-xs md:text-sm">{facility.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RLFC Capabilities Plants */}
        <div className="bg-white rounded-3xl mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Refex Life Sciences Capabilities</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {rlfcCapabilities.map((facility, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-80"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative h-full w-full overflow-hidden">
                  {resolveImagePath(facility.image) ? (
                  <img
                    alt={facility.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      src={resolveImagePath(facility.image)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                  />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h4 className="text-base md:text-lg font-bold text-white mb-2">{facility.title}</h4>
                    <div className="flex items-center text-white/90">
                      <i className="ri-map-pin-line mr-2"></i>
                      <span className="text-xs md:text-sm">{facility.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 text-center border border-teal-100"
            data-aos="zoom-in"
          >
            <p className="text-sm md:text-base text-gray-800 font-medium">
              <span className="font-bold text-teal-600">Expansion:</span>{' '}
              <span className="text-blue-600 font-bold">Hyderabad</span> plant set for a new manufacturing block in 2025, reflecting our growing scale.
            </p>
          </div>
        </div>

        {/* Modepro Capabilities */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Oncology & Speciality Intermediates with Modepro Capabilities
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {oncologyFacilities.map((facility, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-80"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative h-full w-full overflow-hidden">
                  {resolveImagePath(facility.image) ? (
                  <img
                    alt={facility.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      src={resolveImagePath(facility.image)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                  />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h4 className="text-base md:text-lg font-bold text-white mb-2">{facility.title}</h4>
                    <div className="flex items-center text-white/90">
                      <i className="ri-map-pin-line mr-2"></i>
                      <span className="text-xs md:text-sm">{facility.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Approvals Section */}
        <div className="py-10 px-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Regulatory Approvals</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Refex Life Sciences operates a worldwide network of state-of-the-art manufacturing facilities seamlessly integrated into the group. These facilities comply with the highest international quality standards with accreditations from:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {approvals.map((approval, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center text-center group hover:scale-105 w-[200px]"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-4 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                  <i className={`${approval.icon} text-3xl transition-transform duration-300 group-hover:scale-110`} style={{ color: approval.color }}></i>
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-900">{approval.name}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
