import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
}

const initialState: ProjectState = {
  projects: [],
  activeProjectId: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
  },
});

export const { setProjects, addProject, setActiveProject } = projectSlice.actions;
export default projectSlice.reducer;
