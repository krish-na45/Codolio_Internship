import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useSheetStore = create((set, get) => ({
  topics: [],
  searchQuery: '',
  deleteModalOpen: false,
  deleteTarget: null,

  // Topic actions
  addTopic: () =>
    set((state) => ({
      topics: [
        {
          id: uuidv4(),
          title: 'New Topic',
          subtopics: [],
        },
        ...state.topics,
      ],
    })),

  editTopic: (id, newTitle) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === id ? { ...topic, title: newTitle } : topic
      ),
    })),

  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter((topic) => topic.id !== id),
    })),

  reorderTopics: (topics) =>
    set(() => ({
      topics,
    })),

  // SubTopic actions
  addSubTopic: (topicId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: [
                {
                  id: uuidv4(),
                  title: 'New Sub-Topic',
                  questions: [],
                },
                ...topic.subtopics,
              ],
            }
          : topic
      ),
    })),

  editSubTopic: (topicId, subtopicId, newTitle) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId
                  ? { ...subtopic, title: newTitle }
                  : subtopic
              ),
            }
          : topic
      ),
    })),

  deleteSubTopic: (topicId, subtopicId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.filter(
                (subtopic) => subtopic.id !== subtopicId
              ),
            }
          : topic
      ),
    })),

  reorderSubTopics: (topicId, subtopics) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId ? { ...topic, subtopics } : topic
      ),
    })),

  // Question actions
  addQuestion: (topicId, subtopicId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId
                  ? {
                      ...subtopic,
                      questions: [
                        {
                          id: uuidv4(),
                          title: 'New Question',
                          completed: false,
                        },
                        ...subtopic.questions,
                      ],
                    }
                  : subtopic
              ),
            }
          : topic
      ),
    })),

  editQuestion: (topicId, subtopicId, questionId, newTitle) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId
                  ? {
                      ...subtopic,
                      questions: subtopic.questions.map((question) =>
                        question.id === questionId
                          ? { ...question, title: newTitle }
                          : question
                      ),
                    }
                  : subtopic
              ),
            }
          : topic
      ),
    })),

  deleteQuestion: (topicId, subtopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId
                  ? {
                      ...subtopic,
                      questions: subtopic.questions.filter(
                        (question) => question.id !== questionId
                      ),
                    }
                  : subtopic
              ),
            }
          : topic
      ),
    })),

  toggleQuestion: (topicId, subtopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId
                  ? {
                      ...subtopic,
                      questions: subtopic.questions.map((question) =>
                        question.id === questionId
                          ? { ...question, completed: !question.completed }
                          : question
                      ),
                    }
                  : subtopic
              ),
            }
          : topic
      ),
    })),

  reorderQuestions: (topicId, subtopicId, questions) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) =>
                subtopic.id === subtopicId
                  ? { ...subtopic, questions }
                  : subtopic
              ),
            }
          : topic
      ),
    })),

  // Search and modal actions
  setSearchQuery: (query) =>
    set(() => ({
      searchQuery: query,
    })),

  openDeleteModal: (type, id, parentId, grandparentId) =>
    set(() => ({
      deleteModalOpen: true,
      deleteTarget: { type, id, parentId, grandparentId },
    })),

  closeDeleteModal: () =>
    set(() => ({
      deleteModalOpen: false,
      deleteTarget: null,
    })),

  confirmDelete: () => {
    const state = get();
    if (!state.deleteTarget) return;

    const { type, id, parentId, grandparentId } = state.deleteTarget;

    if (type === 'topic') {
      state.deleteTopic(id);
    } else if (type === 'subtopic' && parentId) {
      state.deleteSubTopic(parentId, id);
    } else if (type === 'question' && parentId && grandparentId) {
      state.deleteQuestion(grandparentId, parentId, id);
    }

    set(() => ({
      deleteModalOpen: false,
      deleteTarget: null,
    }));
  },

  // Data management
  loadData: (topics) => {
    console.log('loadData called with topics:', topics);
    console.log('Number of topics:', topics ? topics.length : 0);
    if (topics && topics[0]) {
      console.log('First topic:', topics[0]);
    }
    set(() => ({
      topics,
    }));
  },

  getFilteredTopics: () => {
    const state = get();
    if (!state.searchQuery) return state.topics;

    const query = state.searchQuery.toLowerCase();
    return state.topics
      .map((topic) => ({
        ...topic,
        subtopics: topic.subtopics
          .map((subtopic) => ({
            ...subtopic,
            questions: subtopic.questions.filter((question) =>
              question.title.toLowerCase().includes(query)
            ),
          }))
          .filter((subtopic) => subtopic.questions.length > 0),
      }))
      .filter((topic) => topic.subtopics.length > 0);
  },

  exportAsJSON: () => {
    const state = get();
    return JSON.stringify(state.topics, null, 2);
  },

  duplicateTopic: (topicId) => {
    const state = get();
    const topic = state.topics.find((t) => t.id === topicId);
    if (!topic) return;

    const newTopic = {
      id: uuidv4(),
      title: `${topic.title} (Copy)`,
      subtopics: topic.subtopics.map((st) => ({
        id: uuidv4(),
        title: st.title,
        questions: st.questions.map((q) => ({
          id: uuidv4(),
          title: q.title,
          completed: false,
        })),
      })),
    };

    set((state) => ({
      topics: [...state.topics, newTopic],
    }));
  },

  duplicateSubTopic: (topicId, subtopicId) => {
    const state = get();
    const topic = state.topics.find((t) => t.id === topicId);
    if (!topic) return;

    const subtopic = topic.subtopics.find((st) => st.id === subtopicId);
    if (!subtopic) return;

    const newSubTopic = {
      id: uuidv4(),
      title: `${subtopic.title} (Copy)`,
      questions: subtopic.questions.map((q) => ({
        id: uuidv4(),
        title: q.title,
        completed: false,
      })),
    };

    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, subtopics: [...t.subtopics, newSubTopic] }
          : t
      ),
    }));
  },
}));

export default useSheetStore;
