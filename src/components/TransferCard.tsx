import React from 'react';
import { TransferInfo } from '../types';
import { Icon } from './Icon';

interface TransferCardProps {
  transfer: TransferInfo;
}

export const TransferCard: React.FC<TransferCardProps> = ({ transfer }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

const AddressDisplay: React.FC<{ address: string }> = ({ address }) => {
  const isAddress = address.startsWith('0x');
  const getAddressUrl = (addr: string) => `https://etherscan.io/address/${addr}`;

  if (isAddress) {
    return (
      <a href={getAddressUrl(address)} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-400 hover:underline truncate">
        {address}
      </a>
    );
  }

  return <span className="font-medium text-gray-200">{address}</span>;
};

  return (
    <article className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg hover:border-teal-500/50 transition-all duration-300">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-teal-400">{transfer.Token}</span>
            <span className="text-lg text-gray-300">{transfer.Amount}</span>
        </div>
        <time dateTime={transfer.ReportTime} className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
          {formatDate(transfer.ReportTime)}
        </time>
      </header>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
            <span className="text-gray-500 w-12">From:</span>
            <AddressDisplay address={transfer.From} />
        </div>
        <div className="flex items-center gap-3">
            <span className="text-gray-500 w-12">To:</span>
            <AddressDisplay address={transfer.To} />
        </div>
      </div>
      
      <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
        <div className="flex flex-wrap gap-2">
          {(transfer.Tags && transfer.Tags.length > 0) ? transfer.Tags.map(tag => (
            <span key={tag.ID} className="bg-gray-700 text-teal-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag.Name}</span>
          )) : <span className="text-xs text-gray-600 italic">No tags</span>}
        </div>
      </footer>
    </article>
  );
};
