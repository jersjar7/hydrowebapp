import { Middleware, Action } from 'redux';

interface LoggerAction extends Action {
  type: string;
  [key: string]: any;
}

export const loggerMiddleware: Middleware = 
  (store) => 
  (next) => 
  (action: unknown) => {
    // Type assertion to work with the action
    const typedAction = action as LoggerAction;
    
    if (process.env.NODE_ENV !== 'production') {
      console.group(typedAction.type);
      console.info('dispatching', typedAction);
      const result = next(action);
      console.log('next state', store.getState());
      console.groupEnd();
      return result;
    }
    return next(action);
  };