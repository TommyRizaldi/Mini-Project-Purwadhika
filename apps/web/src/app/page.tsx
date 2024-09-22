// src/pages/page.tsx or src/pages/index.tsx

import React from 'react';
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
