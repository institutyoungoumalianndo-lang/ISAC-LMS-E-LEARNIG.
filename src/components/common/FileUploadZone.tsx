import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, File, Film, Image as ImageIcon, CheckCircle, X, Link, AlertCircle } from 'lucide-react';

export type FileUploadResult = {
  url: string;
  name: string;
  size?: string;
  type: 'video' | 'photo' | 'document' | 'exam';
};

type FileUploadZoneProps = {
  acceptType?: 'video' | 'photo' | 'document' | 'exam' | 'all';
  onFileSelected: (result: FileUploadResult) => void;
  currentUrl?: string | null;
  label?: string;
};

export function FileUploadZone({ acceptType = 'all', onFileSelected, currentUrl, label }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileResult, setFileResult] = useState<FileUploadResult | null>(
    currentUrl ? { url: currentUrl, name: 'Fichier existant', type: acceptType === 'all' ? 'document' : acceptType } : null
  );
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptMime = () => {
    switch (acceptType) {
      case 'video': return 'video/*';
      case 'photo': return 'image/*';
      case 'document': case 'exam': return '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.mp3,.wav,.mp4';
      default: return '*/*';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processFile = (file: File) => {
    setError(null);
    let detectedType: 'video' | 'photo' | 'document' | 'exam' = 'document';
    if (file.type.startsWith('image/')) detectedType = 'photo';
    else if (file.type.startsWith('video/')) detectedType = 'video';
    else if (acceptType === 'exam') detectedType = 'exam';

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const res: FileUploadResult = {
        url,
        name: file.name,
        size: formatFileSize(file.size),
        type: acceptType !== 'all' ? (acceptType as any) : detectedType,
      };
      setFileResult(res);
      onFileSelected(res);
    };
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    let detectedType: 'video' | 'photo' | 'document' | 'exam' = 'document';
    if (urlInput.includes('youtube') || urlInput.includes('vimeo') || urlInput.endsWith('.mp4')) {
      detectedType = 'video';
    } else if (acceptType !== 'all') {
      detectedType = acceptType as any;
    }

    const res: FileUploadResult = {
      url: urlInput.trim(),
      name: urlInput.trim().split('/').pop() || 'Lien / Fichier Externe',
      type: detectedType,
    };
    setFileResult(res);
    onFileSelected(res);
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    setFileResult(null);
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}

      {fileResult ? (
        <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-200 rounded-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              {fileResult.type === 'video' ? <Film className="w-5 h-5" /> : fileResult.type === 'photo' ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{fileResult.name}</p>
              {fileResult.size && <p className="text-xs text-gray-500">{fileResult.size}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging ? 'border-teal-500 bg-teal-50/50 scale-[0.99]' : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptMime()}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-800">
              Glissez-déposez TOUT TYPE DE FICHIER ici, ou <span className="text-teal-600 underline">Parcourir</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports autorisés : PDF, Word (.docx), Excel, PowerPoint, MP4, MP3, ZIP/RAR, Images...
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1.5 text-xs text-teal-600 font-semibold hover:text-teal-700"
            >
              <Link className="w-3.5 h-3.5" />
              {showUrlInput ? 'Fermer la saisie d\'URL' : 'Ou coller une URL externe (YouTube, Google Drive, Dropbox...)'}
            </button>
          </div>

          {showUrlInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700"
              >
                Ajouter
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
