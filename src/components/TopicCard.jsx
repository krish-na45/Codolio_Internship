import React, { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useDroppable,
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Trash2, Edit2, Plus, Copy, ChevronDown } from 'lucide-react';
import useSheetStore from '../store/sheetStore.js';
import { SubTopicItem } from './SubTopicItem.jsx';
import { reorderArray } from '../utils/reorder.js';

export const TopicCard = ({ topic }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);

  const { setNodeRef } = useDroppable({
    id: `topic-${topic.id}`,
  });

  const {
    editTopic,
    addSubTopic,
    reorderSubTopics,
    openDeleteModal,
    duplicateTopic,
  } = useSheetStore();

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleSave = () => {
    if (editTitle.trim()) {
      editTopic(topic.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = topic.subtopics.findIndex(
      (st) => st.id === active.id
    );
    const overIndex = topic.subtopics.findIndex((st) => st.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newSubTopics = reorderArray(
        topic.subtopics,
        activeIndex,
        overIndex
      );
      reorderSubTopics(topic.id, newSubTopics);
    }
  };

  const totalQuestions = topic.subtopics.reduce(
    (sum, st) => sum + st.questions.length,
    0
  );
  const completedQuestions = topic.subtopics.reduce(
    (sum, st) => sum + st.questions.filter((q) => q.completed).length,
    0
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 hover:bg-gray-50 transition group">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              autoFocus
              className="flex-1 px-3 py-1 border border-indigo-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600 font-bold text-lg"
            />
          ) : (
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-900">{editTitle}</h2>
              <p className="text-sm text-gray-500">
                {completedQuestions} of {totalQuestions} questions completed
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-24 h-2 bg-gray-200 rounded-full mr-4">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
            style={{
              width:
                totalQuestions > 0
                  ? `${(completedQuestions / totalQuestions) * 100}%`
                  : '0%',
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => addSubTopic(topic.id)}
            className="p-1 text-gray-500 hover:text-blue-600 transition"
            title="Add sub-topic"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => duplicateTopic(topic.id)}
            className="p-1 text-gray-500 hover:text-purple-600 transition"
            title="Duplicate topic"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-blue-600 transition"
            title="Edit topic"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => openDeleteModal('topic', topic.id)}
            className="p-1 text-gray-500 hover:text-red-600 transition"
            title="Delete topic"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* SubTopics */}
      {isExpanded && topic.subtopics.length > 0 && (
        <div ref={setNodeRef} className="p-5 space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={topic.subtopics.map((st) => st.id)}
              strategy={verticalListSortingStrategy}
            >
              {topic.subtopics.map((subtopic) => (
                <SubTopicItem
                  key={subtopic.id}
                  subtopic={subtopic}
                  topicId={topic.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Empty state */}
      {isExpanded && topic.subtopics.length === 0 && (
        <div className="p-5">
          <button
            onClick={() => addSubTopic(topic.id)}
            className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition font-medium"
          >
            + Add Sub-Topic
          </button>
        </div>
      )}
    </div>
  );
};
