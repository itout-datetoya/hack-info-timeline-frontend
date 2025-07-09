import React from 'react';
import { Incident } from '../types';
import { Icon } from './Icon';

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <article className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg hover:border-cyan-500/50 transition-all duration-300">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
        <h3 className="text-xl font-bold text-cyan-400">{incident.title}</h3>
        <time dateTime={incident.reported_at} className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
          {formatDate(incident.reported_at)}
        </time>
      </header>
      <div className="prose prose-invert prose-sm max-w-none text-gray-300 mb-4">
        <p>{incident.summary}</p>
      </div>
      <footer className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-2">
          {(incident.tags && incident.tags.length > 0) ? incident.tags.map(tag => (
            <span key={tag.id} className="bg-gray-700 text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag.name}</span>
          )) : <span className="text-xs text-gray-600 italic">No tags</span>}
        </div>
        <a 
          href={incident.source_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300 text-sm ml-auto flex items-center gap-1 hover:underline"
        >
          ソース元
          <Icon path="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" className="w-4 h-4" />
        </a>
      </footer>
    </article>
  );
};