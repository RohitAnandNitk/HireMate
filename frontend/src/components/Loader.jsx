// import React, { useEffect, useState } from "react";

// const Loader = () => {
//   const [visibleCount, setVisibleCount] = useState(0);

//   const lettersWithColors = [
//     { char: "H", color: "text-lime-400" },
//     { char: "i", color: "text-lime-400" },
//     { char: "R", color: "text-amber-500" },
//     { char: "e", color: "text-red-400" },
//     { char: "k", color: "text-amber-500" },
//     { char: "r", color: "text-red-400" },
//     { char: "u", color: "text-red-400" },
//     { char: "i", color: "text-red-400" },
//     { char: "t", color: "text-red-400" },
//   ];

//   useEffect(() => {
//     let currentIndex = 0;
//     const interval = setInterval(() => {
//       if (currentIndex < lettersWithColors.length) {
//         setVisibleCount(currentIndex + 1);
//         currentIndex++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 300);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="text-5xl font-bold">
//         {lettersWithColors.slice(0, visibleCount).map((item, index) => (
//           <span key={index} className={item.color}>
//             {item.char}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Loader;

// import React, { useEffect, useState } from "react";

// const Loader = () => {
//   const lettersWithColors = [
//     { char: "H", color: "text-lime-400" },
//     { char: "i", color: "text-lime-400" },
//     { char: "R", color: "text-amber-500" },
//     { char: "e", color: "text-red-500" },
//     { char: "k", color: "text-amber-500" },
//     { char: "r", color: "text-red-500" },
//     { char: "u", color: "text-red-500" },
//     { char: "i", color: "text-red-500" },
//     { char: "t", color: "text-red-500" },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % lettersWithColors.length);
//     }, 300);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="text-5xl font-bold flex space-x-1">
//         {lettersWithColors.map((item, index) => (
//           <span
//             key={index}
//             className={`${item.color} transition-transform duration-300 ${
//               index <= currentIndex ? "scale-125 animate-bounce" : "opacity-40"
//             }`}
//             style={{ transitionDelay: `${index * 100}ms` }}
//           >
//             {item.char}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Loader;

// this is good
import React, { useEffect, useState } from "react";

const Loader = () => {
  const lettersWithColors = [
    { char: "H", color: "text-lime-400" },
    { char: "i", color: "text-lime-400" },
    { char: "R", color: "text-amber-500" },
    { char: "e", color: "text-red-500" },
    { char: "k", color: "text-amber-500" },
    { char: "r", color: "text-red-500" },
    { char: "u", color: "text-red-500" },
    { char: "i", color: "text-red-500" },
    { char: "t", color: "text-red-500" },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) =>
        prev < lettersWithColors.length ? prev + 1 : 0
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-5xl font-bold flex space-x-1">
        {lettersWithColors.map((item, index) => (
          <span
            key={index}
            className={`${item.color} transition-opacity duration-500 ${
              index < visibleCount ? "opacity-100" : "opacity-20"
            } stroke-letter`}
          >
            {item.char}
          </span>
        ))}
      </div>

      {/* Custom CSS for letter stroke */}
      <style>
        {`
          .stroke-letter {
            -webkit-text-stroke: 1px #001; /* darker gray stroke */
            text-stroke: 1.5px #000;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
