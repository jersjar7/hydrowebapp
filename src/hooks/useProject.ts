// src/hooks/useProject.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addProject, 
  updateProject, 
  deleteProject,
  setActiveProject,
  addProjectSection,
  addFlowCondition,
  addResult,
  Project,
  ChannelSection,
  FlowCondition,
  ProjectResult
} from '../store/slices/projectSlice';
import {
  selectProjects,
  selectActiveProject,
} from '../store/selectors/projectSelectors';

export const useProject = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const activeProject = useSelector(selectActiveProject);
  
  const createProject = useCallback((name: string, description?: string) => {
    dispatch(addProject({ name, description }));
  }, [dispatch]);
  
  const updateCurrentProject = useCallback((data: Partial<Project>) => {
    if (activeProject) {
      dispatch(updateProject({ id: activeProject.id, ...data }));
    }
  }, [dispatch, activeProject]);
  
  const deleteCurrentProject = useCallback(() => {
    if (activeProject) {
      dispatch(deleteProject(activeProject.id));
    }
  }, [dispatch, activeProject]);
  
  const selectProject = useCallback((id: string | null) => {
    dispatch(setActiveProject(id));
  }, [dispatch]);
  
  const addSection = useCallback((section: Omit<ChannelSection, 'id'>) => {
    if (activeProject) {
      dispatch(addProjectSection({ projectId: activeProject.id, section }));
    }
  }, [dispatch, activeProject]);
  
  const addCondition = useCallback((condition: Omit<FlowCondition, 'id'>) => {
    if (activeProject) {
      dispatch(addFlowCondition({ projectId: activeProject.id, condition }));
    }
  }, [dispatch, activeProject]);
  
  const saveResult = useCallback((result: Omit<ProjectResult, 'id' | 'timestamp'>) => {
    if (activeProject) {
      dispatch(addResult({ projectId: activeProject.id, result }));
    }
  }, [dispatch, activeProject]);
  
  return {
    projects,
    activeProject,
    createProject,
    updateCurrentProject,
    deleteCurrentProject,
    selectProject,
    addSection,
    addCondition,
    saveResult,
  };
};