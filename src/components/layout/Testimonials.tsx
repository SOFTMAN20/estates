import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  role: 'renter' | 'host';
}

const Testimonials = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Amina Juma',
      location: 'Dar es Salaam',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: t('testimonials.reviews.review1'),
      role: 'renter',
    },
    {
      id: 2,
      name: 'John Mwangi',
      location: 'Arusha',
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: t('testimonials.reviews.review2'),
      role: 'host',
    },
    {
      id: 3,
      name: 'Fatima Hassan',
      location: 'Mwanza',
      avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=face',
      rating: 4,
      review: t('testimonials.reviews.review3'),
      role: 'renter',
    },
    {
      id: 4,
      name: 'David Kimaro',
      location: 'Dodoma',
      avatar: 'https://images.unsplash.com/photo-1507152927003-f7312a0a313c?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: t('testimonials.reviews.review4'),
      role: 'host',
    },
    {
      id: 5,
      name: 'Grace Mushi',
      location: 'Zanzibar',
      avatar: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      review: t('testimonials.reviews.review5'),
      role: 'renter',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  // Get visible testimonials (3 on desktop, 1 on mobile)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], position: i });
    }
    return visible;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-serengeti-50 via-white to-kilimanjaro-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-serengeti-100/40 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent mb-3">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
            {getVisibleTestimonials().map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                className={cn(
                  "bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500",
                  idx === 1 ? "md:scale-105 md:shadow-xl" : "md:opacity-90",
                  idx !== 1 && "hidden md:block"
                )}
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
                  "{testimonial.review}"
                </p>

                {/* Rating */}
                <div className="flex gap-0.5 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location} • {testimonial.role === 'renter' ? t('testimonials.renter') : t('testimonials.host')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "bg-primary w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
