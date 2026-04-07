declare module '@/hooks/use-supabase-upload' {
  export type UploadError = { name: string; message: string };

  export type UploadFile = {
    name: string;
    errors: UploadError[];
    preview?: string;
    type: string;
    size: number;
  };

  export type UseSupabaseUploadReturn = {
    // Dropzone root/input props helpers
    getRootProps: (props?: any) => any;
    getInputProps: (props?: any) => any;

    // Files and state
    files: UploadFile[];
    setFiles: (files: UploadFile[]) => void;
    inputRef: { current: HTMLInputElement | null };

    // Upload control
    onUpload: () => void;
    loading: boolean;
    successes: string[]; // array of file names
    errors: UploadError[];

    // Validation
    maxFileSize: number;
    maxFiles: number;

    // Drag/drop state
    isSuccess: boolean;
    isDragActive: boolean;
    isDragReject: boolean;
  };

  export {};
}
