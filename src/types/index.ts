
export type Rating = 'N/A' | 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: 'hard' | 'soft' | 'knowledge';
}

export interface SkillRating {
  skillId: string;
  rating: Rating;
  isApt: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  photo: string;
  skills: SkillRating[];
  isFocal: boolean;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
}
