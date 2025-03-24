// src/services/projectService.ts
import { store } from '../store';
import { 
  addProject,
  updateProject,
  Project
} from '../store/slices/projectSlice';

export const projectService = {
  createProject(name: string, description?: string): Project {
    const now = new Date().toISOString();
    const project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      description,
    };
    
    // Dispatch action to create project
    store.dispatch(addProject(project));
    
    // Get the newly created project from store
    const state = store.getState();
    return state.project.projects[state.project.projects.length - 1];
  },
  
  async exportProject(projectId: string): Promise<Blob> {
    const state = store.getState();
    const project = state.project.projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Create exportable project data
    const exportData = JSON.stringify(project, null, 2);
    
    // Return as blob for download
    return new Blob([exportData], { type: 'application/json' });
  },
  
  async importProject(fileData: string): Promise<void> {
    try {
      const projectData = JSON.parse(fileData) as Project;
      
      // Validate project data structure
      if (!projectData.id || !projectData.name) {
        throw new Error('Invalid project data');
      }
      
      // Update timestamps
      const now = new Date().toISOString();
      const updatedProject = {
        ...projectData,
        updatedAt: now
      };
      
      // Add to store
      store.dispatch(updateProject(updatedProject));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};