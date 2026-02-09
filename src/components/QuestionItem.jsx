import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit2, Grip, Check } from 'lucide-react';
import useSheetStore from '../store/sheetStore.js';

export const QuestionItem = ({
  question,
  topicId,
  subtopicId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(question.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const { editQuestion, toggleQuestion, openDeleteModal } = useSheetStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      editQuestion(topicId, subtopicId, question.id, editTitle);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group ${
        isDragging ? 'ring-2 ring-indigo-600' : ''
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <Grip size={16} />
      </div>

      {/* Checkbox */}
      <button
        onClick={() => toggleQuestion(topicId, subtopicId, question.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
          question.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-indigo-600'
        }`}
      >
        {question.completed && <Check size={16} className="text-white" />}
      </button>

      {/* Title */}
      {isEditing ? (
        <div className="flex-1 flex gap-2">
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
            className="flex-1 px-2 py-1 border border-indigo-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      ) : (
        <span
          className={`flex-1 text-sm ${
            question.completed
              ? 'line-through text-gray-500'
              : 'text-gray-700'
          }`}
        >
          {question.title}
        </span>
      )}

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-500 hover:text-blue-600 transition"
          title="Edit question"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() =>
            openDeleteModal('question', question.id, subtopicId, topicId)
          }
          className="p-1 text-gray-500 hover:text-red-600 transition"
          title="Delete question"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
