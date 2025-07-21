export interface FileUploadProps {
    onFileSelect: (file: File) => void;
    label?: string;
}