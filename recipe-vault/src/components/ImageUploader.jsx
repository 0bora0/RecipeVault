import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="image-preview" />
      ) : (
        <p>{isDragActive ? 'Пуснете снимката тук' : 'Провлачете снимка или кликнете'}</p>
      )}
    </div>
  );
}