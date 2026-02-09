import React from 'react';
import useSheetStore from '../../store/sheetStore.js';

export const ConfirmModal = () => {
  const { deleteModalOpen, deleteTarget, closeDeleteModal, confirmDelete } =
    useSheetStore();

  if (!deleteModalOpen || !deleteTarget) return null;

  const getTitle = () => {
    const { type } = deleteTarget;
    if (type === 'topic') return 'Delete Topic?';
    if (type === 'subtopic') return 'Delete Sub-Topic?';
    return 'Delete Question?';
  };

  const getMessage = () => {
    const { type } = deleteTarget;
    if (type === 'topic')
      return 'This will delete the topic and all its sub-topics and questions.';
    if (type === 'subtopic')
      return 'This will delete the sub-topic and all its questions.';
    return 'This action cannot be undone.';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
        <p className="text-gray-600 mb-6">{getMessage()}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
