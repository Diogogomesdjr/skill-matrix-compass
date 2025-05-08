
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Collaborator, Skill, Team, Rating } from '@/types';

interface MatrixContextType {
  collaborators: Collaborator[];
  teams: Team[];
  skills: Skill[];
  addCollaborator: (collaborator: Omit<Collaborator, 'id'>) => void;
  updateCollaborator: (id: string, data: Partial<Collaborator>) => void;
  removeCollaborator: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  removeTeam: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  updateSkillRating: (collaboratorId: string, skillId: string, rating: Rating) => void;
  toggleSkillAptitude: (collaboratorId: string, skillId: string) => void;
  toggleFocal: (id: string) => void;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

const defaultSkills: Skill[] = [
  { id: 'skill1', name: 'Liderança', category: 'soft' },
  { id: 'skill2', name: 'Comunicação', category: 'soft' },
  { id: 'skill3', name: 'Trabalho em Equipe', category: 'soft' },
  { id: 'skill4', name: 'Excel', category: 'hard' },
  { id: 'skill5', name: 'PowerPoint', category: 'hard' },
];

const defaultTeams: Team[] = [
  { id: 'team1', name: 'Comercial' },
  { id: 'team2', name: 'CIT' },
  { id: 'team3', name: 'Potencial de Mercado' },
];

export const MatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  
  // Load data from localStorage if available
  useEffect(() => {
    const savedCollaborators = localStorage.getItem('collaborators');
    const savedTeams = localStorage.getItem('teams');
    const savedSkills = localStorage.getItem('skills');
    
    if (savedCollaborators) setCollaborators(JSON.parse(savedCollaborators));
    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('collaborators', JSON.stringify(collaborators));
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [collaborators, teams, skills]);

  const addCollaborator = (collaborator: Omit<Collaborator, 'id'>) => {
    const newCollaborator = {
      ...collaborator,
      id: `collaborator-${Date.now()}`,
    };
    setCollaborators([...collaborators, newCollaborator]);
  };

  const updateCollaborator = (id: string, data: Partial<Collaborator>) => {
    setCollaborators(
      collaborators.map(collaborator => 
        collaborator.id === id ? { ...collaborator, ...data } : collaborator
      )
    );
  };

  const removeCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam = {
      ...team,
      id: `team-${Date.now()}`,
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill = {
      ...skill,
      id: `skill-${Date.now()}`,
    };
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const updateSkillRating = (collaboratorId: string, skillId: string, rating: Rating) => {
    setCollaborators(
      collaborators.map(collaborator => {
        if (collaborator.id === collaboratorId) {
          const existingSkill = collaborator.skills.find(s => s.skillId === skillId);
          const updatedSkills = existingSkill
            ? collaborator.skills.map(s => 
                s.skillId === skillId ? { ...s, rating } : s
              )
            : [...collaborator.skills, { skillId, rating, isApt: false }];
          
          return { ...collaborator, skills: updatedSkills };
        }
        return collaborator;
      })
    );
  };

  const toggleSkillAptitude = (collaboratorId: string, skillId: string) => {
    setCollaborators(
      collaborators.map(collaborator => {
        if (collaborator.id === collaboratorId) {
          const existingSkill = collaborator.skills.find(s => s.skillId === skillId);
          if (existingSkill) {
            return {
              ...collaborator,
              skills: collaborator.skills.map(s => 
                s.skillId === skillId ? { ...s, isApt: !s.isApt } : s
              ),
            };
          }
        }
        return collaborator;
      })
    );
  };

  const toggleFocal = (id: string) => {
    setCollaborators(
      collaborators.map(collaborator => 
        collaborator.id === id ? { ...collaborator, isFocal: !collaborator.isFocal } : collaborator
      )
    );
  };

  return (
    <MatrixContext.Provider
      value={{
        collaborators,
        teams,
        skills,
        addCollaborator,
        updateCollaborator,
        removeCollaborator,
        addTeam,
        removeTeam,
        addSkill,
        removeSkill,
        updateSkillRating,
        toggleSkillAptitude,
        toggleFocal,
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
};

export const useMatrix = (): MatrixContextType => {
  const context = useContext(MatrixContext);
  if (context === undefined) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
};
