import LeadershipPhotoBg from '../../../wp-content/uploads/2023/02/Leadership-Photo-BG.png';

type ProfileCardProps = {
  name: string;
  title: string;
  image: string;
  onReadMore: () => void;
};

const ProfileCard = ({
  name,
  title,
  image,
  onReadMore,
}: ProfileCardProps) => {
  const arcBg = LeadershipPhotoBg;

  return (
    <>
      <style>{`
        .profile-arc-bg-mobile {
          background-image: url(${arcBg});
          background-position: center right;
          background-repeat: no-repeat;
          background-size: auto;
        }
      `}</style>
      <div
        className="
          group
          w-full
          max-w-[280px]
          p-4
          sm:p-6
          rounded-md
          border
          border-[#7cb342]/40
          text-center
          transition-all
          duration-300
          hover:border-[#7cb342]
          mx-auto
        "
      >
        {/* OUTER CIRCLE (mask only) - same size on all devices for consistent look */}
        <div className="mx-auto w-40 h-40 rounded-full overflow-hidden flex items-center justify-center">
          {/* Outer circle container with arc background */}
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            {/* Arc background container - matching modal styling exactly */}
            <div
              className="w-full h-full flex items-center justify-center profile-arc-bg-mobile"
              style={{ padding: "8px" }}
            >
            {/* ACTUAL IMAGE */}
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="
                w-full
                h-full
                rounded-full
                object-cover
                grayscale
                transition-all
                duration-500
                ease-out
                group-hover:grayscale-0
                group-hover:scale-[1.35]
              "
              onError={(e) => {
                e.currentTarget.src = '/assets/placeholders/placeholder-300x300.png';
              }}
            />
          </div>
        </div>
      </div>

      {/* Name */}
      <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-semibold text-gray-900">
        {name}
      </h3>

      {/* Title */}
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 whitespace-pre-line">
        {title}
      </p>

      {/* Read More */}
      <button
        onClick={onReadMore}
        className="
          mt-3
          sm:mt-4
          text-xs
          tracking-widest
          text-gray-700
          transition-colors
          duration-300
          hover:text-[#7cb342]
        "
      >
        READ MORE
      </button>
      </div>
    </>
  );
};

export default ProfileCard;
