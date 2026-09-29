export interface VocabularyItem {
  word: string;
  phonetic: string;
  pos: string;
  definition: string;
  example: string;
}

export interface StoryParagraph {
  id: number;
  type: 'title' | 'narration' | 'dialogue';
  speaker: 'Narrator' | 'Ali' | 'Teacher' | 'Old Man' | 'Mother';
  speakerTone: string;
  text: string;
  stylePrompt: string;
  vocabulary?: VocabularyItem[];
  sceneId: number;
}

export interface StoryScene {
  id: number;
  title: string;
  image: string;
  caption: string;
  paragraphRange: [number, number];
}

export const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    title: 'Morning in the Village',
    image: '/src/assets/images/village_river_1790672035193.jpg',
    caption: 'Ali walked along the quiet river every morning before his teacher called.',
    paragraphRange: [0, 7],
  },
  {
    id: 2,
    title: 'The Garden and the Dog',
    image: '/src/assets/images/garden_scene_1790672055401.jpg',
    caption: 'Ali helped water the dry plants and learned to overcome his fear of the friendly dog.',
    paragraphRange: [8, 26],
  },
  {
    id: 3,
    title: 'Apples and a Good Day',
    image: '/src/assets/images/apples_home_1790672070033.jpg',
    caption: 'With sweet apples from the old man, Ali returned home feeling peaceful and proud.',
    paragraphRange: [27, 33],
  },
];

export const STORY_PARAGRAPHS: StoryParagraph[] = [
  {
    id: 0,
    type: 'title',
    speaker: 'Narrator',
    speakerTone: 'Warm and gentle teacher announcing the story title',
    text: 'A Good Day in the Village',
    stylePrompt:
      'Warm, friendly English teacher narrating for language learners (A2 level). Read the title as a clear heading, slowly and clearly, then pause for two seconds. Do not say the word Title.',
    sceneId: 1,
    vocabulary: [
      {
        word: 'village',
        phonetic: '/ˈvɪl.ɪdʒ/',
        pos: 'noun',
        definition: 'A small town in the countryside.',
        example: 'Ali lives in a quiet village with green trees.',
      },
    ],
  },
  {
    id: 1,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Calm, gentle, peaceful storytelling',
    text: 'Ali lived with his family in a small village. He liked his village because it was quiet and beautiful. Every morning, he went for a stroll near the river.',
    stylePrompt:
      'Warm, friendly English teacher. Speak clearly and slowly at 85-90% speed. Calm, gentle storytelling tone. Distinct pronunciation. Pause briefly at commas and full stops.',
    sceneId: 1,
    vocabulary: [
      {
        word: 'stroll',
        phonetic: '/stroʊl/',
        pos: 'noun',
        definition: 'A slow, relaxed walk for pleasure.',
        example: 'He went for a morning stroll near the peaceful river.',
      },
      {
        word: 'quiet',
        phonetic: '/ˈkwaɪ.ət/',
        pos: 'adjective',
        definition: 'Making very little or no noise.',
        example: 'The village was peaceful and quiet in the morning.',
      },
    ],
  },
  {
    id: 2,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Reflective and patient tone',
    text: 'Ali was usually a calm and patient boy. However, he had one bad habit. He got angry very frequently when someone did something wrong.',
    stylePrompt:
      'Warm English teacher. Emphasize vocabulary words like patient and frequently clearly. Paced at 85% speed with a calm storytelling voice.',
    sceneId: 1,
    vocabulary: [
      {
        word: 'patient',
        phonetic: '/ˈpeɪ.ʃənt/',
        pos: 'adjective',
        definition: 'Able to stay calm and not get angry when waiting or facing difficulty.',
        example: 'A good teacher is patient with young students.',
      },
      {
        word: 'habit',
        phonetic: '/ˈhæb.ɪt/',
        pos: 'noun',
        definition: 'Something you do often and almost without thinking.',
        example: 'Waking up early is a healthy habit.',
      },
      {
        word: 'frequently',
        phonetic: '/ˈfriː.kwənt.li/',
        pos: 'adverb',
        definition: 'Often; happening many times.',
        example: 'He visited the library frequently during summer.',
      },
    ],
  },
  {
    id: 3,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Clear narrative setting the scene',
    text: "One morning, Ali's teacher called him.",
    stylePrompt: 'Warm English teacher. Clear storytelling tone, gentle and slow pace.',
    sceneId: 1,
  },
  {
    id: 4,
    type: 'dialogue',
    speaker: 'Teacher',
    speakerTone: 'Calm and encouraging teacher',
    text: '"Ali, I have an important issue," the teacher said. "An old man in our village needs help. Can you help him today?"',
    stylePrompt:
      'Teacher dialogue: calm and encouraging tone. Paced slowly for language learners. Clear pronunciation of the word issue.',
    sceneId: 1,
    vocabulary: [
      {
        word: 'issue',
        phonetic: '/ˈɪʃ.uː/',
        pos: 'noun',
        definition: 'An important topic, problem, or matter to solve.',
        example: 'The teacher discussed an important community issue.',
      },
    ],
  },
  {
    id: 5,
    type: 'dialogue',
    speaker: 'Ali',
    speakerTone: 'Polite and young-sounding',
    text: '"Yes, of course," Ali said.',
    stylePrompt: 'Ali speaking: polite, willing, and young-sounding tone. Clear and friendly.',
    sceneId: 1,
  },
  {
    id: 6,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Warm and clear narration',
    text: 'The teacher gave him some simple instructions.',
    stylePrompt: 'Clear English teacher narration. Emphasize the word instructions distinctly.',
    sceneId: 1,
    vocabulary: [
      {
        word: 'instructions',
        phonetic: '/ɪnˈstrʌk.ʃənz/',
        pos: 'noun (plural)',
        definition: 'Clear steps or directions that explain how to do something.',
        example: 'Follow the instructions carefully to finish the work.',
      },
    ],
  },
  {
    id: 7,
    type: 'dialogue',
    speaker: 'Teacher',
    speakerTone: 'Calm, gentle, and encouraging advice',
    text: '"First, go to his house. Then, help him in his garden. Please behave well and be patient with him. He is an old man, so you should be kind."',
    stylePrompt:
      'Teacher speaking: calm, encouraging, warm and wise. Clear pause between sentences. Pronounce behave and patient clearly.',
    sceneId: 1,
    vocabulary: [
      {
        word: 'behave',
        phonetic: '/bɪˈheɪv/',
        pos: 'verb',
        definition: 'To act in a polite and acceptable way.',
        example: 'The children behaved nicely when guests visited.',
      },
    ],
  },
  {
    id: 8,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Warm arrival in the garden',
    text: "Ali went to the old man's house. The old man was happy to see him.",
    stylePrompt: 'Warm storytelling tone. Slow, clear pronunciation for A2 language learners.',
    sceneId: 2,
  },
  {
    id: 9,
    type: 'dialogue',
    speaker: 'Old Man',
    speakerTone: 'Kind, warm, and slightly slow',
    text: '"Hello, Ali. I expect you can help me today," he said.',
    stylePrompt:
      'Old man speaking: kind, warm, grandfatherly, and slightly slow. Distinct pronunciation of expect.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'expect',
        phonetic: '/ɪkˈspekt/',
        pos: 'verb',
        definition: 'To think or hope that something will happen.',
        example: 'We expect sunny weather this afternoon.',
      },
    ],
  },
  {
    id: 10,
    type: 'dialogue',
    speaker: 'Ali',
    speakerTone: 'Polite and respectful young voice',
    text: '"Yes, I can," Ali replied.',
    stylePrompt: 'Ali speaking: polite, young, confident and helpful.',
    sceneId: 2,
  },
  {
    id: 11,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Observant, gentle narration',
    text: 'The old man showed Ali his garden. The flowers and vegetables looked very dry.',
    stylePrompt: 'Gentle English teacher narrating. Clear and slow storytelling pace.',
    sceneId: 2,
  },
  {
    id: 12,
    type: 'dialogue',
    speaker: 'Old Man',
    speakerTone: 'Kind and gentle request',
    text: '"The plants need water," the old man said. "Can you help me?"',
    stylePrompt: 'Old man speaking: kind, gentle, slightly slow and friendly.',
    sceneId: 2,
  },
  {
    id: 13,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Careful and gentle rhythm',
    text: 'Ali took a bucket and started to water the plants. He carefully spread the water over the flowers.',
    stylePrompt:
      'English teacher narration. Pronounce carefully and spread distinctly. Paced at 85-90% speed.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'spread',
        phonetic: '/spred/',
        pos: 'verb',
        definition: 'To distribute or scatter something evenly over an area.',
        example: 'He spread water across the dry soil.',
      },
    ],
  },
  {
    id: 14,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Curious with a gentle suspense',
    text: 'After a few minutes, Ali heard a strange sound. He looked behind him and saw a large dog.',
    stylePrompt: 'Storyteller tone, slightly cautious, clear pronunciation.',
    sceneId: 2,
  },
  {
    id: 15,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'A little nervous, reflecting Ali’s fear',
    text: 'Ali was afraid. His hands began to shake.',
    stylePrompt:
      'When Ali is afraid in the dog scene, sound a little nervous and tense, while keeping pronunciation clear for learners.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'afraid',
        phonetic: '/əˈfreɪd/',
        pos: 'adjective',
        definition: 'Feeling fear or worry; frightened.',
        example: 'The little boy was afraid of the dark.',
      },
      {
        word: 'shake',
        phonetic: '/ʃeɪk/',
        pos: 'verb',
        definition: 'To tremble or make small quick movements because of fear or cold.',
        example: 'His hands shook because he was nervous.',
      },
    ],
  },
  {
    id: 16,
    type: 'dialogue',
    speaker: 'Old Man',
    speakerTone: 'Kind, reassuring, and warm',
    text: '"Don\'t worry," the old man said. "The dog is friendly."',
    stylePrompt: 'Old man speaking: kind, calming, slow and reassuring.',
    sceneId: 2,
  },
  {
    id: 17,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Cautious and slow',
    text: 'Ali tried to avoid the dog and moved slowly away.',
    stylePrompt: 'Narrator: gentle and cautious. Emphasize avoid distinctly.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'avoid',
        phonetic: '/əˈvɔɪd/',
        pos: 'verb',
        definition: 'To stay away from someone or something.',
        example: 'Ali tried to avoid the big dog by stepping aside.',
      },
    ],
  },
  {
    id: 18,
    type: 'dialogue',
    speaker: 'Old Man',
    speakerTone: 'Warm, peaceful grandfatherly smile',
    text: 'The old man smiled and said, "Stay calm. There is nothing to worry about."',
    stylePrompt: 'Old man: warm, smiling, comforting, gentle pace.',
    sceneId: 2,
  },
  {
    id: 19,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Calm breathing and relief',
    text: 'Ali took a deep breath and became calm again. His concern slowly disappeared.',
    stylePrompt:
      'Calm, gentle English teacher narration. Pronounce concern distinctly. Tone returns to peacefulness.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'concern',
        phonetic: '/kənˈsɜːrn/',
        pos: 'noun',
        definition: 'A feeling of worry or anxiety about a situation.',
        example: 'His concern disappeared when he heard the kind words.',
      },
      {
        word: 'disappear',
        phonetic: '/ˌdɪs.əˈpɪər/',
        pos: 'verb',
        definition: 'To go away completely so that it cannot be seen or felt.',
        example: 'The clouds disappeared and the sun came out.',
      },
    ],
  },
  {
    id: 20,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Satisfied and peaceful tone',
    text: 'After an hour, the garden looked much better. Ali was very content because he had helped the old man.',
    stylePrompt: 'Warm English teacher. Emphasize content clearly at 85% speed.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'content',
        phonetic: '/kənˈtent/',
        pos: 'adjective',
        definition: 'Pleased, satisfied, and happy with what you have or did.',
        example: 'Ali felt content after a productive morning.',
      },
    ],
  },
  {
    id: 21,
    type: 'dialogue',
    speaker: 'Old Man',
    speakerTone: 'Proud and kind elder praising youth',
    text: '"You are a good boy," the old man said. "You represent the young people of our village very well."',
    stylePrompt:
      'Old man speaking: warm, proud, kind and slow. Distinctly pronounce represent.',
    sceneId: 2,
    vocabulary: [
      {
        word: 'represent',
        phonetic: '/ˌrep.rɪˈzent/',
        pos: 'verb',
        definition: 'To act as a good example or symbol of a group.',
        example: 'Athletes represent their country at the Olympic Games.',
      },
    ],
  },
  {
    id: 22,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Sweet and cheerful narration',
    text: 'Ali smiled.',
    stylePrompt: 'Narrator: gentle, cheerful pause.',
    sceneId: 2,
  },
  {
    id: 23,
    type: 'dialogue',
    speaker: 'Ali',
    speakerTone: 'Polite, grateful young voice',
    text: '"Thank you," he said.',
    stylePrompt: 'Ali speaking: polite, grateful, young and modest.',
    sceneId: 2,
  },
  {
    id: 24,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Warm and generous storytelling',
    text: 'Before Ali left, the old man gave him some fresh apples.',
    stylePrompt: 'English teacher: warm, friendly, clear storytelling tone.',
    sceneId: 2,
  },
  {
    id: 25,
    type: 'dialogue',
    speaker: 'Old Man',
    speakerTone: 'Playful, smiling, grandfatherly joke',
    text: '"There are none of my best apples left in the house," he joked, "because I want to give them all to you!"',
    stylePrompt:
      'Old man speaking: playful, warm chuckle, kind and generous tone. Distinct pronunciation.',
    sceneId: 2,
  },
  {
    id: 26,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Happy and lighthearted',
    text: 'Ali laughed.',
    stylePrompt: 'Narrator: cheerful and lighthearted tone.',
    sceneId: 2,
  },
  {
    id: 27,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Reflective, wise, thoughtful storytelling',
    text: 'On his way home, Ali thought about his day. He understood that his bad habit of getting angry was not good. He decided to become more patient and positive.',
    stylePrompt:
      'Warm English teacher. Thoughtful and reflective tone. Clear pronunciation of patient and positive.',
    sceneId: 3,
    vocabulary: [
      {
        word: 'positive',
        phonetic: '/ˈpɑː.zə.tɪv/',
        pos: 'adjective',
        definition: 'Hopeful, confident, and thinking about the good qualities.',
        example: 'Having a positive attitude helps in difficult situations.',
      },
    ],
  },
  {
    id: 28,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Inspiring, gentle moral',
    text: 'He also learned that helping other people could spread happiness.',
    stylePrompt: 'Warm English teacher. Gentle, heartwarming storytelling tone. Slow and clear.',
    sceneId: 3,
  },
  {
    id: 29,
    type: 'dialogue',
    speaker: 'Mother',
    speakerTone: 'Soft and loving mother',
    text: 'When he arrived home, his mother asked, "Did you have a good day?"',
    stylePrompt: 'Ali\'s mother speaking: soft, warm, loving and attentive motherly tone.',
    sceneId: 3,
  },
  {
    id: 30,
    type: 'dialogue',
    speaker: 'Ali',
    speakerTone: 'Cheerful, proud, and enthusiastic',
    text: '"Yes," Ali said. "It was a very good day. I helped someone, learned something new, and stayed calm."',
    stylePrompt:
      'Ali speaking: cheerful, proud, happy and polite young boy tone. Clear and upbeat.',
    sceneId: 3,
  },
  {
    id: 31,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Loving and tender narration',
    text: 'His mother smiled.',
    stylePrompt: 'English teacher: tender, gentle pause.',
    sceneId: 3,
  },
  {
    id: 32,
    type: 'dialogue',
    speaker: 'Mother',
    speakerTone: 'Soft, loving, and encouraging',
    text: '"That is the most appropriate way to spend your day," she said.',
    stylePrompt:
      'Ali\'s mother speaking: soft and loving tone. Distinct, clear pronunciation of appropriate for language learners.',
    sceneId: 3,
    vocabulary: [
      {
        word: 'appropriate',
        phonetic: '/əˈproʊ.pri.ət/',
        pos: 'adjective',
        definition: 'Suitable, right, or acceptable for a particular situation.',
        example: 'Wearing a warm coat is appropriate in cold winter weather.',
      },
    ],
  },
  {
    id: 33,
    type: 'narration',
    speaker: 'Narrator',
    speakerTone: 'Peaceful, inspiring, bedtime conclusion',
    text: 'Ali went to bed that night feeling happy. He knew that tomorrow he would try to be an even better person.',
    stylePrompt:
      'Warm English teacher delivering the final sentence. Gentle, peaceful, hopeful tone. Slow 85% pace.',
    sceneId: 3,
  },
];

export const FULL_STORY_TEXT = STORY_PARAGRAPHS.map((p) => p.text).join('\n\n');

export const COMPREHENSION_QUESTIONS = [
  {
    id: 1,
    question: "What bad habit did Ali have at the beginning of the story?",
    options: [
      "He was often late for school",
      "He got angry very frequently when someone did wrong",
      "He didn't like walking near the river",
      "He refused to help his family"
    ],
    correctAnswer: 1,
    explanation: "The story states: 'Ali was usually a calm and patient boy. However, he had one bad habit. He got angry very frequently when someone did something wrong.'"
  },
  {
    id: 2,
    question: "Why was Ali afraid in the garden?",
    options: [
      "The plants were too dry to save",
      "A thunderstorm was approaching",
      "He heard a strange sound and saw a large dog",
      "The old man was angry with him"
    ],
    correctAnswer: 2,
    explanation: "Ali heard a strange sound, looked behind him, and saw a large dog. His hands even began to shake before the old man comforted him."
  },
  {
    id: 3,
    question: "What gift did the kind old man give Ali before he left?",
    options: [
      "A bucket of fresh vegetables",
      "A silver coin for his work",
      "Some fresh apples",
      "A bouquet of garden flowers"
    ],
    correctAnswer: 2,
    explanation: "The old man gave Ali fresh apples and joked that none of his best apples were left in the house because he gave them all to Ali."
  },
  {
    id: 4,
    question: "What important lesson did Ali reflect on while walking home?",
    options: [
      "Gardening is hard physical work",
      "Getting angry was not good, and helping others spreads happiness",
      "He should avoid visiting other villages",
      "Dogs are always dangerous in gardens"
    ],
    correctAnswer: 1,
    explanation: "Ali understood that his habit of getting angry was not good. He decided to become more patient and positive, and realized helping people spreads happiness."
  }
];
