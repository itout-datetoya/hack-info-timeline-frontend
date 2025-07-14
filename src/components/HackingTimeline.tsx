import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { Tag, HackingInfo } from '../types';
import { Icon } from './Icon';
import { IncidentCard } from './IncidentCard';

const ITEMS_PER_PAGE = 20;

export const HackingTimeline: React.FC = () => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [incidents, setIncidents] = useState<HackingInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  
  const [prevInfoID, setPrevInfoID] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const [tagSearchTerm, setTagSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiClient.get<Tag[]>('/v1/hacking/tags');
        setAllTags(response.data || []);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        setError('タグの読み込みに失敗しました。');
      }
    };
    fetchTags();
  }, []);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tagName)) newTags.delete(tagName);
      else newTags.add(tagName);
      return newTags;
    });
  };

  const handleClearSelection = () => {
    setSelectedTags(new Set());
  };

  const handleFetchLatest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsInitialLoad(false);
    try {
      const params = new URLSearchParams();
      if (selectedTags.size > 0) {
        params.append('tags', Array.from(selectedTags).join(','));
      }
      params.append('infoNumber', ITEMS_PER_PAGE.toString());

      const response = await apiClient.get<HackingInfo[]>('/v1/hacking/latest-infos', { params });
      const data = response.data || [];
      data.sort((a, b) => new Date(b.ReportTime).getTime() - new Date(a.ReportTime).getTime());
      setIncidents(data);

      if (data.length > 0) {
        const minId = Math.min(...data.map(inc => parseInt(inc.ID, 10))).toString();
        setPrevInfoID(minId);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } else {
        setPrevInfoID(null);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch latest incidents:", err);
      setError('情報の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTags]);

  const handleLoadMore = useCallback(async () => {
    if (!prevInfoID || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);
    try {
        const params = new URLSearchParams();
        if (selectedTags.size > 0) {
            params.append('tags', Array.from(selectedTags).join(','));
        }
        params.append('prevInfoID', prevInfoID);
        params.append('infoNumber', ITEMS_PER_PAGE.toString());

        const response = await apiClient.get<HackingInfo[]>('/v1/hacking/prev-infos', { params });
        const newData = response.data || [];

        setIncidents(prevIncidents => [...prevIncidents, ...newData]);

        if (newData.length > 0) {
            const minId = Math.min(...newData.map(inc => parseInt(inc.ID, 10))).toString();
            setPrevInfoID(minId);
            setHasMore(newData.length === ITEMS_PER_PAGE);
        } else {
            setHasMore(false);
        }
    } catch (err) {
      console.error("Failed to fetch previous incidents:", err);
      setError('追加情報の取得に失敗しました。');
    } finally {
      setIsLoadingMore(false);
    }
  }, [prevInfoID, isLoadingMore, selectedTags]);

  const filteredTags = allTags.filter(tag =>
    tag.Name.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );
  const displayedTags = showAllTags ? filteredTags : filteredTags.slice(0, 8);

  return (
    <div className="space-y-8">
      <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-300 flex items-center">
          <Icon path="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" className="w-5 h-5 mr-2 text-cyan-400" />
          タグで絞り込み
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="search"
              placeholder="タグを検索..."
              value={tagSearchTerm}
              onChange={(e) => setTagSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            {selectedTags.size > 0 && (
              <button onClick={handleClearSelection} className="text-sm text-red-400 hover:text-red-300 whitespace-nowrap py-2 px-2">
                選択を解除
              </button>
            )}
            {filteredTags.length > 8 && (
              <button onClick={() => setShowAllTags(!showAllTags)} className="text-sm text-cyan-400 hover:text-cyan-300 whitespace-nowrap py-2 px-2">
                {showAllTags ? '一部を非表示' : `全てのタグを表示 (${filteredTags.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {displayedTags.map(tag => (
            <button
              key={tag.ID}
              onClick={() => handleTagToggle(tag.Name)}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 transform hover:scale-105 ${
                selectedTags.has(tag.Name)
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tag.Name}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleFetchLatest}
          disabled={isLoading}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg shadow-indigo-500/20"
        >
          {isLoading ? (
            '読込中...'
          ) : selectedTags.size > 0 ? (
            <><Icon path="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" className="w-5 h-5 mr-2" />適用</>
          ) : (
            '全ての情報を表示'
          )}
        </button>
      </section>

      <section>
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center"><p>{error}</p></div>}
        <div className="space-y-6">
          {incidents.map(incident => (
            <IncidentCard key={incident.ID} incident={incident} />
          ))}
        </div>
        {hasMore && !isLoading && (
          <div className="text-center mt-8">
            <button onClick={handleLoadMore} disabled={isLoadingMore} className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-300 font-bold py-2 px-6 rounded-lg transition-colors duration-200">
              {isLoadingMore ? '読込中...' : 'さらに表示'}
            </button>
          </div>
        )}
        {!isLoading && incidents.length === 0 && !isInitialLoad && !error && (
          <div className="text-center py-10 bg-gray-800/30 rounded-lg">
            <p className="text-gray-500">該当する情報はありません。</p>
          </div>
        )}
        {isInitialLoad && (
          <div className="text-center py-10 bg-gray-800/30 rounded-lg">
            <p className="text-gray-500">タグを選択して「適用」ボタンを押してください。</p>
          </div>
        )}
      </section>
    </div>
  );
};

