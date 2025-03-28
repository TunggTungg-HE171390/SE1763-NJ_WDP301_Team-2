import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, CircularProgress } from '@mui/material';

/**
 * TinyMCE Editor component for rich text editing
 * @param {Object} props
 * @param {string} props.value - The editor content
 * @param {Function} props.onChange - Callback when content changes
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.sx - Additional styles for the container
 */
const TinyEditor = ({ value, onChange, placeholder = 'Start writing...', sx = {}, height = 400 }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = React.useState(true);
  
  // Focus the editor when it's initialized
  const handleInit = (evt, editor) => {
    editorRef.current = editor;
    setLoading(false);
  };

  return (
    <Box sx={{ 
      border: '1px solid rgba(0, 0, 0, 0.23)', 
      borderRadius: '4px', 
      overflow: 'hidden',
      position: 'relative',
      minHeight: loading ? '200px' : 'auto',
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },
      '&:focus-within': {
        borderColor: '#1976d2',
        borderWidth: '2px',
      },
      ...sx 
    }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.7)',
          zIndex: 1
        }}>
          <CircularProgress size={40} />
        </Box>
      )}
      
      <Editor
        apiKey="m85psa57xpu7ieibf07jf63nd749jqwhnkbza603l7yebtvt"
        onInit={handleInit}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image link | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          placeholder: placeholder,
          branding: false,
          resize: false,
          promotion: false,
          statusbar: false,
          // Disable browser native spellcheck to avoid double checking
          browser_spellcheck: false,
          // Prevent auto-indentation of code
          indent: false,
          // Add some custom CSS to improve the editor appearance
          content_css: 'default',
          // Configure image upload
          images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = () => {
              reject('Image upload failed');
            };
            reader.readAsDataURL(blobInfo.blob());
          }),
          setup: (editor) => {
            editor.on('init', () => {
              // Apply custom styles to make it match Material UI
              editor.getContainer().style.transition = 'border-color 0.2s ease';
            });
          }
        }}
      />
    </Box>
  );
};

export default TinyEditor;
