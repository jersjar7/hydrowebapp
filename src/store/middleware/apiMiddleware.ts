import { Middleware, Action } from 'redux';

interface ApiAction extends Action {
  meta?: {
    api?: {
      endpoint: string;
      method?: string;
      body?: any;
      headers?: Record<string, string>;
      onSuccess?: (data: any) => any;
      onError?: (error: any) => any;
    }
  }
}

export const apiMiddleware: Middleware = 
  ({ dispatch }) => 
  (next) => 
  (action: unknown) => {
    // Type assertion to work with the action
    const typedAction = action as ApiAction;
    
    if (!typedAction.meta?.api) {
      return next(action);
    }

    const { endpoint, method, body, headers, onSuccess, onError } = typedAction.meta.api;
    
    dispatch({ type: `${typedAction.type}_PENDING` });
    
    try {
      const response = fetch(endpoint, {
        method: method || 'GET',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: body ? JSON.stringify(body) : undefined,
      }).then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      }).then(data => {
        const result = next({ ...typedAction, payload: data, type: `${typedAction.type}_FULFILLED` });
        if (onSuccess) dispatch(onSuccess(data));
        return result;
      }).catch(error => {
        const result = next({ ...typedAction, error, type: `${typedAction.type}_REJECTED` });
        if (onError) dispatch(onError(error));
        return result;
      });
      
      return response;
    } catch (error) {
      const result = next({ ...typedAction, error, type: `${typedAction.type}_REJECTED` });
      if (onError) dispatch(onError(error));
      return result;
    }
  };