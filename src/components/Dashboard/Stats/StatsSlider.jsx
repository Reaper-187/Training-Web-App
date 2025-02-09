import React from 'react';
import './StatsSlider.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { BarChart } from './BarChart'
import { PieChart } from './PieChart'

export const StatsSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={1}
      slidesPerView={1}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      <SwiperSlide>

        <BarChart />

      </SwiperSlide>

      <SwiperSlide>

        <PieChart />

      </SwiperSlide>

    </Swiper >
  );
};

