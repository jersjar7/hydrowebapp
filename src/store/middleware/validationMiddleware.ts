// src/store/middleware/validationMiddleware.ts
import { Middleware, Action } from 'redux';

interface ValidationAction extends Action {
  type: string;
  payload?: any;
}

// Simple schema validation
interface ValidationSchema {
  [key: string]: {
    validate: (value: any) => boolean;
    errorMessage: string;
  };
}

const schemas: Record<string, ValidationSchema> = {
  'project/addProject': {
    'payload.name': {
      validate: (value) => typeof value === 'string' && value.length > 0,
      errorMessage: 'Project name is required',
    },
  },
  // Add more schemas as needed
};

export const validationMiddleware: Middleware = 
  (_) => 
  (next) => 
  (action: unknown) => {
    const typedAction = action as ValidationAction;
    const schema = schemas[typedAction.type];
    
    if (schema) {
      const validationErrors: string[] = [];
      
      for (const [path, validator] of Object.entries(schema)) {
        const pathParts = path.split('.');
        let value: any = typedAction;
        
        for (const part of pathParts) {
          value = value?.[part];
          if (value === undefined) break;
        }
        
        if (!validator.validate(value)) {
          validationErrors.push(validator.errorMessage);
        }
      }
      
      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        return next({ 
          type: `${typedAction.type}_INVALID`, 
          payload: { validationErrors },
          meta: { originalAction: typedAction } 
        });
      }
    }
    
    return next(action);
  };