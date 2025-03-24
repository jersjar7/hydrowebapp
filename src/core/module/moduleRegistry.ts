// Define the Module interface
export interface Module {
    id: string;
    name: string;
    version: string;
    dependencies: string[];
    
    initialize: () => Promise<void>;
    getComponents: () => Record<string, React.ComponentType<any>>;
    getServices: () => Record<string, any>;
  }
  
  // Implement the module registry
  class ModuleRegistry {
    private modules = new Map<string, Module>();
    private loadedModules = new Set<string>();
    
    registerModule(module: Module) {
      this.modules.set(module.id, module);
    }
    
    async loadModule(moduleId: string) {
      const module = this.modules.get(moduleId);
      if (!module) throw new Error(`Module ${moduleId} not found`);
      
      // Initialize module
      await module.initialize();
      this.loadedModules.add(moduleId);
    }
    
    getComponent(moduleId: string, componentName: string) {
      const module = this.modules.get(moduleId);
      if (!module) throw new Error(`Module ${moduleId} not found`);
      
      const components = module.getComponents();
      return components[componentName];
    }
  }
  
  export const moduleRegistry = new ModuleRegistry();