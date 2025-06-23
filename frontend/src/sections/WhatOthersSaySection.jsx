import { useState, useEffect, useRef } from 'react';
import { getTestimonials } from '../services/api';

const CARD_HEIGHT = 260;
const CARD_GAP = 32;
const ROWS = 2;
const COLS = 3;
const VISIBLE = ROWS * COLS;
const SCROLL_SPEED = 0.25; // px per frame (about 15px/sec at 60fps)

function getGridTestimonials(testimonials, startIdx) {
  // Get enough testimonials for 2x the visible grid for smooth looping
  const arr = [];
  for (let i = 0; i < VISIBLE * 2; i++) {
    arr.push(testimonials[(startIdx + i) % testimonials.length]);
  }
  return arr;
}

const WhatOthersSaySection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIdx, setStartIdx] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const animFrame = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials');
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    let last = performance.now();
    function animate(now) {
      const elapsed = now - last;
      last = now;
      setTranslateY((prev) => {
        let next = prev - SCROLL_SPEED * (elapsed / (1000 / 60));
        const maxScroll = (CARD_HEIGHT + CARD_GAP) * ROWS;
        if (Math.abs(next) >= maxScroll) {
          setStartIdx((prevIdx) => (prevIdx + COLS) % testimonials.length);
          return 0;
        }
        return next;
      });
      animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [testimonials]);

  if (loading) {
    return (
      <section className="w-full bg-[#fafbfc] py-24 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#fafbfc] py-24 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  // Use backend data if available, otherwise fallback to original design
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: 1,
      name: "Alice Johnson",
      title: "Senior Developer, Acme Corp",
      message: "Working with you was a game changer for our team. Your leadership and technical skills are top notch! I especially appreciated your ability to break down complex problems into manageable tasks, and your mentorship helped me grow tremendously. Looking forward to collaborating again in the future!"
    },
    {
      id: 2,
      name: "Bob Smith",
      title: "Product Owner, Beta Innovations",
      message: "Your mentorship helped me grow as a product owner. Always clear, supportive, and inspiring."
    },
    {
      id: 3,
      name: "Carol Lee",
      title: "Mentee, Gamma Solutions",
      message: "I learned so much from your guidance. You made complex topics easy and fun! The workshops you led were always engaging, and your feedback on my projects was invaluable. Thank you for being such a great mentor and always encouraging me to push my limits."
    },
    {
      id: 4,
      name: "David Kim",
      title: "UX Designer, Acme Corp",
      message: "Your product vision and attention to user experience are outstanding."
    },
    {
      id: 5,
      name: "Eva Green",
      title: "Engineer, Beta Innovations",
      message: "A true team player and a fantastic mentor. Highly recommended!"
    },
    {
      id: 6,
      name: "Frank Miller",
      title: "Lead Dev, Gamma Solutions",
      message: "Always delivers on time and exceeds expectations. Your code reviews are thorough and constructive, and your ability to manage multiple projects simultaneously is impressive. Our team has become much more efficient thanks to your leadership."
    },
    {
      id: 7,
      name: "Grace Hopper",
      title: "Mentor, Acme Corp",
      message: "Inspires everyone around with her dedication and knowledge."
    },
    {
      id: 8,
      name: "Henry Ford",
      title: "Team Lead, Beta Innovations",
      message: "Brings out the best in every team member."
    }
  ];

  const pastelColors = [
    "bg-pink-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-teal-100",
    "bg-fuchsia-100"
  ];

  const gridTestimonials = getGridTestimonials(displayTestimonials, startIdx);

  return (
    <section className="w-full bg-[#fafbfc] py-24 flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">
        What Others <span className="text-purple-400">Say</span>
      </h2>
      <div className="w-full max-w-5xl flex flex-col items-center overflow-hidden relative" style={{ height: (CARD_HEIGHT + CARD_GAP) * ROWS - CARD_GAP }}>
        {/* Smoke/fade effect top and bottom */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-16 z-10" style={{background: "linear-gradient(to bottom, #fafbfc 70%, rgba(250,251,252,0) 100%)"}} />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 z-10" style={{background: "linear-gradient(to top, #fafbfc 70%, rgba(250,251,252,0) 100%)"}} />
        
        <div
          ref={containerRef}
          className="transition-transform duration-300 ease-linear w-full"
          style={{
            transform: `translateY(${translateY}px)`
          }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            style={{ gridTemplateRows: `repeat(${ROWS * 2}, minmax(${CARD_HEIGHT}px, 1fr))` }}
          >
            {gridTestimonials.map((t, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-2xl p-6 shadow-lg border border-gray-100 ${pastelColors[idx % pastelColors.length]} transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-h-[${CARD_HEIGHT}px]`}
                style={{ minHeight: CARD_HEIGHT, minWidth: 280 }}
              >
                <div className="text-gray-700 text-base mb-4">
                  {t.message || t.description}
                </div>
                <div className="mt-4">
                  <div className="text-sm font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.title || `${t.position || ''} ${t.company ? `at ${t.company}` : ''}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatOthersSaySection;