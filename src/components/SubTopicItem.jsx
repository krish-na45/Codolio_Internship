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
import { QuestionItem } from './QuestionItem.jsx';
import { reorderArray } from '../utils/reorder.js';

export const SubTopicItem = ({
  subtopic,
  topicId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtopic.title);

  const { setNodeRef } = useDroppable({
    id: `subtopic-${subtopic.id}`,
  });

  const {
    editSubTopic,
    addQuestion,
    reorderQuestions,
    openDeleteModal,
    duplicateSubTopic,
  } = useSheetStore();

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleSave = () => {
    if (editTitle.trim()) {
      editSubTopic(topicId, subtopic.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = subtopic.questions.findIndex(
      (q) => q.id === active.id
    );
    const overIndex = subtopic.questions.findIndex((q) => q.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newQuestions = reorderArray(
        subtopic.questions,
        activeIndex,
        overIndex
      );
      reorderQuestions(topicId, subtopic.id, newQuestions);
    }
  };

  const completedCount = subtopic.questions.filter(
    (q) => q.completed
  ).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition group">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 transition"
          >
            <ChevronDown
              size={18}
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
              className="flex-1 px-2 py-1 border border-indigo-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          ) : (
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{editTitle}</h3>
              <p className="text-xs text-gray-500">
                {completedCount} of {subtopic.questions.length} completed
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => addQuestion(topicId, subtopic.id)}
            className="p-1 text-gray-500 hover:text-blue-600 transition"
            title="Add question"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => duplicateSubTopic(topicId, subtopic.id)}
            className="p-1 text-gray-500 hover:text-purple-600 transition"
            title="Duplicate sub-topic"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-blue-600 transition"
            title="Edit sub-topic"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => openDeleteModal('subtopic', subtopic.id, topicId)}
            className="p-1 text-gray-500 hover:text-red-600 transition"
            title="Delete sub-topic"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Questions */}
      {isExpanded && subtopic.questions.length > 0 && (
        <div ref={setNodeRef} className="px-4 pb-4 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={subtopic.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {subtopic.questions.map((question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  topicId={topicId}
                  subtopicId={subtopic.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Empty state */}
      {isExpanded && subtopic.questions.length === 0 && (
        <div className="px-4 pb-4">
          <button
            onClick={() => addQuestion(topicId, subtopic.id)}
            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition text-sm"
          >
            + Add Question
          </button>
        </div>
      )}
    </div>
  );
};
