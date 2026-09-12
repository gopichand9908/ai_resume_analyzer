import React from 'react';
import FinalReport from '../components/FinalReport';

export default function Results({ report, onRestart }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <FinalReport report={report} onRestart={onRestart} />
    </div>
  );
}
