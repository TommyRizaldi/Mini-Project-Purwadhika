// src/pages/page.tsx or src/pages/index.tsx

import React from 'react';
import Header from '../components/Header'; // Adjust the path if necessary
import Hero from '@/components/Hero';

const Page: React.FC = () => {
  return (
    <div>
      <main>
        <Hero />
      </main>
    </div>
  );
};

export default Page;
