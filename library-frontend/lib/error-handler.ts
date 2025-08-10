import { toast } from "sonner";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export interface ErrorInfo {
  title: string;
  description: string;
  type: 'validation' | 'not-found' | 'server-error' | 'bad-request' | 'network';
  validationErrors?: ValidationError[];
}

export function parseApiError(error: unknown): ErrorInfo {
  // Network or fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Network Error',
      description: 'Unable to connect to the server. Please check your internet connection.',
      type: 'network',
    };
  }

  // API error responses
  if (error instanceof Error) {
    let errorData: ApiErrorResponse | null = null;
    
    // Try to parse error message as JSON (from our http client)
    try {
      // The error message contains status and response body
      // Format: "HTTP 500 Internal Server Error {json}"
      const httpMatch = error.message.match(/HTTP (\d+)/);
      const jsonMatch = error.message.match(/(\{.*\})/);
      
      if (httpMatch && jsonMatch) {
        const status = parseInt(httpMatch[1]);
        const jsonBody = jsonMatch[1];
        
        // Parse the JSON error response
        try {
          errorData = JSON.parse(jsonBody) as ApiErrorResponse;
        } catch {
          // Silently fail JSON parsing
        }

        switch (status) {
          case 422: // Validation errors
            return {
              title: 'Validation Failed',
              description: errorData?.message || 'Please check the form for errors.',
              type: 'validation',
              validationErrors: errorData?.errors || [],
            };

          case 400: // Bad request
            return {
              title: 'Invalid Request',
              description: errorData?.message || 'The request contains invalid data.',
              type: 'bad-request',
            };

          case 404: // Not found
            return {
              title: 'Not Found',
              description: errorData?.message || 'The requested resource was not found.',
              type: 'not-found',
            };

          case 500: // Internal server error
            return {
              title: 'Server Error',
              description: 'An internal server error occurred. Please try again later.',
              type: 'server-error',
            };

          default:
            return {
              title: 'Request Failed',
              description: errorData?.message || `Request failed with status ${status}`,
              type: 'bad-request',
            };
        }
      }
    } catch {
      // Silently fail error parsing
    }

    // Generic error handling for unparseable errors
    return {
      title: 'Error',
      description: error.message || 'An unexpected error occurred.',
      type: 'server-error',
    };
  }

  // Unknown error type
  return {
    title: 'Unknown Error',
    description: 'An unexpected error occurred. Please try again.',
    type: 'server-error',
  };
}

export function showErrorToast(error: unknown, action?: string): ErrorInfo {
  const errorInfo = parseApiError(error);
  console.log('Error info:', errorInfo); // Temporary debug
  
  let title = errorInfo.title;
  if (action) {
    title = `Failed to ${action}`;
  }

  if (errorInfo.type === 'validation' && errorInfo.validationErrors?.length) {
    // Show validation errors in a more detailed format
    const fieldErrors = errorInfo.validationErrors
      .map(err => `${err.field}: ${err.message}`)
      .join(', ');
    
    toast.error(title, {
      description: `${errorInfo.description}\n\nErrors: ${fieldErrors}`,
    });
  } else {
    toast.error(title, {
      description: errorInfo.description,
    });
  }

  return errorInfo;
}

export function getFieldError(validationErrors: ValidationError[], fieldName: string): string | null {
  const error = validationErrors.find(err => err.field === fieldName);
  return error?.message || null;
}