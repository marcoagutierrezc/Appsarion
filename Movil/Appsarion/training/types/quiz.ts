export interface Question {
    id: string;
    category: string;
    text: string;
    image?: string;
    answers: Answer[];
  }
  
  export interface Answer {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface Category {
    id: string;
    name: string;
  }