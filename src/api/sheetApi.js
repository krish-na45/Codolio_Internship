import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export async function fetchSheetData() {
  try {
    console.log('Attempting to load sample data...');
    return await loadSampleData();
  } catch (error) {
    console.error('Failed to load sample data:', error.message);
    const mockData = getMockData();
    console.log('Using mock data, topics:', mockData.length);
    return mockData;
  }
}

async function loadSampleData() {
  const response = await axios.get('/sheet.json');
  console.log('Sample data loaded:', response.data);
  const transformed = transformSampleDataToInternalFormat(response.data);
  console.log('Transformed sample data:', transformed);
  return transformed;
}

function transformSampleDataToInternalFormat(data) {
  const questions = data?.data?.questions || [];
  console.log('Questions count:', questions.length);

  // Group questions by topic -> title (which is the subtopic)
  const topicsMap = {};

  questions.forEach((question) => {
    const topicName = question.topic || 'Uncategorized';
    const subTopicName = question.title || 'Untitled Sub-Topic';
    const questionName = question.questionId?.name || 'Untitled Question';

    if (!topicsMap[topicName]) {
      topicsMap[topicName] = {
        id: uuidv4(),
        title: topicName,
        subtopics: {},
      };
    }

    if (!topicsMap[topicName].subtopics[subTopicName]) {
      topicsMap[topicName].subtopics[subTopicName] = {
        id: uuidv4(),
        title: subTopicName,
        questions: [],
      };
    }

    topicsMap[topicName].subtopics[subTopicName].questions.push({
      id: question._id || uuidv4(),
      title: questionName,
      completed: false,
    });
  });

  const result = Object.values(topicsMap).map((topic) => ({
    id: topic.id,
    title: topic.title,
    subtopics: Object.values(topic.subtopics),
  }));
  
  console.log('Final result - Topics:', result.length, 'Sample:', result[0]);
  return result;
}

function transformAPIResponseToInternalFormat(data) {
  const apiTopics = data?.data?.topics || [];

  return apiTopics.map((topic) => ({
    id: topic.id || uuidv4(),
    title: topic.title || 'Untitled Topic',
    subtopics: (topic.subtopics || []).map((subtopic) => ({
      id: subtopic.id || uuidv4(),
      title: subtopic.title || 'Untitled Sub-Topic',
      questions: (subtopic.problems || []).map((problem) => ({
        id: problem.id || uuidv4(),
        title: problem.title || 'Untitled Question',
        completed: false,
      })),
    })),
  }));
}

export function getMockData() {
  return [
    {
      id: uuidv4(),
      title: 'Arrays & Hashing',
      subtopics: [
        {
          id: uuidv4(),
          title: 'Basic Array Operations',
          questions: [
            {
              id: uuidv4(),
              title: 'Two Sum',
              completed: false,
            },
            {
              id: uuidv4(),
              title: 'Best Time to Buy and Sell Stock',
              completed: false,
            },
          ],
        },
        {
          id: uuidv4(),
          title: 'Sliding Window',
          questions: [
            {
              id: uuidv4(),
              title: 'Longest Substring Without Repeating Characters',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      title: 'Trees & Graphs',
      subtopics: [
        {
          id: uuidv4(),
          title: 'Binary Trees',
          questions: [
            {
              id: uuidv4(),
              title: 'Inorder Traversal',
              completed: false,
            },
          ],
        },
      ],
    },
  ];
}
