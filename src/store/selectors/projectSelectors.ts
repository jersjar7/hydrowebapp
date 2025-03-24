// src/store/selectors/projectSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectProjects = (state: RootState) => state.project.projects;
export const selectActiveProjectId = (state: RootState) => state.project.activeProjectId;

export const selectActiveProject = createSelector(
  [selectProjects, selectActiveProjectId],
  (projects, activeProjectId) => 
    activeProjectId ? projects.find(p => p.id === activeProjectId) || null : null
);

export const selectProjectById = (id: string) => 
  createSelector(
    selectProjects,
    (projects) => projects.find(p => p.id === id) || null
  );

export const selectProjectSections = createSelector(
  [selectActiveProject],
  (project) => project?.sections || []
);

export const selectProjectFlowConditions = createSelector(
  [selectActiveProject],
  (project) => project?.flowConditions || []
);

export const selectProjectResults = createSelector(
  [selectActiveProject],
  (project) => project?.results || []
);