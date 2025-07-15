import React from 'react';
import { HackingInfo } from '../types';
import { Icon } from './Icon';

interface IncidentCardProps {
  incident: HackingInfo;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // トランザクションハッシュまたはアドレスからblockscanのURLを生成（簡易版）
  const getTxUrl = (network: string, txHash: string) => {
    // txHashの長さに応じてURLを切り替え
    if (txHash.length == 42) {
      return `https://blockscan.com/address/${txHash}`;
    } else {
      return `https://blockscan.com/tx/${txHash}`;
    }
  };

  return (
    <article className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg hover:border-cyan-500/50 transition-all duration-300">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h3 className="text-xl font-bold text-cyan-400">{incident.Protocol}</h3>
        <time dateTime={incident.ReportTime} className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
          {formatDate(incident.ReportTime)}
        </time>
      </header>
      
      {/* 詳細情報 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Network</p>
          <p className="text-gray-200 font-medium">{incident.Network}</p>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <p className="text-gray-500">Amount</p>
          <p className="text-gray-200 font-medium">{incident.Amount}</p>
        </div>
      </div>
      
      {/* タグとトランザクションリンク */}
      <footer className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-2">
          {(incident.Tags && incident.Tags.length > 0) ? incident.Tags.map(tag => (
            <span key={tag.ID} className="bg-gray-700 text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag.Name}</span>
          )) : <span className="text-xs text-gray-600 italic">No tags</span>}
        </div>
        <a 
          href={getTxUrl(incident.Network, incident.TxHash)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-300 text-sm ml-auto flex items-center gap-1 hover:underline"
        >
          Details
          <Icon path="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" className="w-4 h-4" />
        </a>
      </footer>
    </article>
  );
};