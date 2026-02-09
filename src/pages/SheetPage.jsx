import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Plus,
  Search,
  Download,
  Loader,
} from 'lucide-react';
import useSheetStore from '../store/sheetStore.js';
import { TopicCard } from '../components/TopicCard.jsx';
import { ConfirmModal } from '../components/modals/ConfirmModal.jsx';
import { fetchSheetData } from '../api/sheetApi.js';
import { reorderArray } from '../utils/reorder.js';

export const SheetPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showExportNotification, setShowExportNotification] = useState(false);

  const {
    topics,
    searchQuery,
    setSearchQuery,
    loadData,
    reorderTopics,
    addTopic,
    getFilteredTopics,
    exportAsJSON,
  } = useSheetStore();

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('SheetPage: Starting to load data...');
      setIsLoading(true);
      try {
        const data = await fetchSheetData();
        console.log('SheetPage: Received data with', data?.length || 0, 'topics');
        loadData(data);
      } catch (error) {
        console.error('SheetPage: Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [loadData]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = topics.findIndex((t) => t.id === active.id);
    const overIndex = topics.findIndex((t) => t.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newTopics = reorderArray(topics, activeIndex, overIndex);
      reorderTopics(newTopics);
    }
  };

  const handleExportJSON = () => {
    const json = exportAsJSON();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(json)
    );
    element.setAttribute('download', 'question-sheet.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setShowExportNotification(true);
    setTimeout(() => setShowExportNotification(false), 2000);
  };

  const displayedTopics = searchQuery ? getFilteredTopics() : topics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Question Tracker
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage and track your interview preparation
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addTopic}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <Plus size={20} />
                  Topic
                </button>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  title="Export sheet as JSON"
                >
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={32} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your question sheet...</p>
          </div>
        ) : displayedTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'No questions found matching your search.'
                : 'No topics yet. Create one to get started!'}
            </p>
            {!searchQuery && (
              <button
                onClick={addTopic}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                <Plus size={20} />
                Create First Topic
              </button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayedTopics.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {displayedTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal */}
      <ConfirmModal />

      {/* Export notification */}
      {showExportNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full" />
          Sheet exported as JSON
        </div>
      )}
    </div>
  );
};
