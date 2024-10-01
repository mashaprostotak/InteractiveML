// Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-800 py-4 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">
          <span className="font-bold">Data sources:</span>{' '}
          <a
            href="https://worldhappiness.report/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            World Happiness Report
          </a>
          {'\u00A0\u00A0'}
          <a
            href="https://www.gapminder.org/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gapminder
          </a>
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
