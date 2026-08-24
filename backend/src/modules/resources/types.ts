export interface CreateSubjectNoteInput {
  subjectName: string;
  resourceLink: string;
}

export interface CreatePrevYearQuestionInput {
  subjectName: string;
  year: number;
  semester: number;
  questionPaperLink: string;
}

export interface CreateInterviewNoteInput {
  topicName: string;
  interviewNotesLink: string;
}

export interface CreateCheatSheetInput {
  name: string;
  imageUrl: string;
}
