// src/store/slices/projectSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface ChannelSection {
  id: string;
  type: 'rectangular' | 'trapezoidal' | 'circular' | 'irregular';
  parameters: Record<string, number>;
}

export interface FlowCondition {
  id: string;
  flowRate: number;
  upstreamElevation?: number;
  downstreamElevation?: number;
  manningsN: number;
}

export interface ProjectResult {
  id: string;
  timestamp: string;
  type: string;
  data: any;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  sections?: ChannelSection[];
  flowConditions?: FlowCondition[];
  results?: ProjectResult[];
}

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  activeProjectId: null,
  isLoading: false,
  error: null,
};

// Async thunk for loading projects (simulated)
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      // In real app, this would be an API call
      // For now, simulate with local storage
      const projects = localStorage.getItem('projects');
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      return rejectWithValue('Failed to load projects');
    }
  }
);

export const saveProject = createAsyncThunk(
  'project/saveProject',
  async (project: Project, { rejectWithValue }) => {
    try {
      // In real app, this would be an API call
      return project;
    } catch (error) {
      return rejectWithValue('Failed to save project');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newProject: Project = {
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        ...action.payload,
      };
      state.projects.push(newProject);
      state.activeProjectId = newProject.id;
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { 
          ...state.projects[index], 
          ...action.payload,
          updatedAt: new Date().toISOString() 
        };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = state.projects.length > 0 ? state.projects[0].id : null;
      }
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
    addProjectSection: (state, action: PayloadAction<{ projectId: string, section: Omit<ChannelSection, 'id'> }>) => {
      const { projectId, section } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        if (!project.sections) project.sections = [];
        project.sections.push({ 
          ...section, 
          id: uuidv4() 
        });
        project.updatedAt = new Date().toISOString();
      }
    },
    addFlowCondition: (state, action: PayloadAction<{ projectId: string, condition: Omit<FlowCondition, 'id'> }>) => {
      const { projectId, condition } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        if (!project.flowConditions) project.flowConditions = [];
        project.flowConditions.push({ 
          ...condition, 
          id: uuidv4() 
        });
        project.updatedAt = new Date().toISOString();
      }
    },
    addResult: (state, action: PayloadAction<{ projectId: string, result: Omit<ProjectResult, 'id' | 'timestamp'> }>) => {
      const { projectId, result } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        if (!project.results) project.results = [];
        project.results.push({ 
          ...result, 
          id: uuidv4(),
          timestamp: new Date().toISOString()
        });
        project.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });
  },
});

export const { 
  addProject, 
  updateProject, 
  deleteProject, 
  setActiveProject,
  addProjectSection,
  addFlowCondition,
  addResult
} = projectSlice.actions;

export default projectSlice.reducer;