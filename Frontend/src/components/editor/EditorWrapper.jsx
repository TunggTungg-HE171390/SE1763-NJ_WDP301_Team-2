import React, { useRef, useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Paragraph from '@editorjs/paragraph';
import { Box, Typography } from '@mui/material';

/**
 * Wrapper component for Editor.js
 * @param {Object} props - Component props
 * @param {string} props.data - Editor data in JSON string format
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.sx - Additional styles
 */
const EditorWrapper = ({ data, onChange, placeholder = 'Bắt đầu nhập nội dung...', sx = {} }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Parse JSON data if it's a string
  const parseData = () => {
    if (!data) return undefined;
    
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.warn('Không thể parse dữ liệu editor:', e);
      return undefined;
    }
  };

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Avoid re-initialization
    if (editorInstance.current) return;

    // Image upload function (replace with your actual implementation)
    const imageUploadCallback = async (file) => {
      // Mock implementation - in a real app, upload to your server/cloud storage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            success: 1,
            file: {
              url: reader.result
            }
          });
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      // Initialize Editor.js
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile: imageUploadCallback,
              },
            },
          },
          embed: Embed,
          table: {
            class: Table,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          code: Code,
          linkTool: LinkTool,
        },
        data: parseData(),
        placeholder: placeholder,
        onChange: async () => {
          if (onChange) {
            try {
              const savedData = await editorInstance.current.save();
              onChange(JSON.stringify(savedData));
            } catch (e) {
              console.error('Lỗi khi lưu dữ liệu editor:', e);
            }
          }
        }
      });

      editorInstance.current.isReady
        .then(() => {
          setIsReady(true);
          console.log('Editor.js đã sẵn sàng');
        })
        .catch((error) => {
          console.error('Editor.js khởi tạo thất bại:', error);
        });
    } catch (error) {
      console.error('Lỗi khởi tạo Editor.js:', error);
    }

    // Cleanup
    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  // Update editor content if data changes externally
  useEffect(() => {
    if (isReady && editorInstance.current) {
      const parsed = parseData();
      if (parsed && Object.keys(parsed).length > 0) {
        editorInstance.current.render(parsed);
      }
    }
  }, [data, isReady]);

  return (
    <Box sx={{ 
      border: '1px solid rgba(0, 0, 0, 0.23)', 
      borderRadius: '4px',
      padding: '10px', 
      backgroundColor: '#fff',
      minHeight: '250px',
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },
      '&:focus-within': {
        borderColor: '#1976d2',
        borderWidth: '2px',
        padding: '9px',
      },
      ...sx
    }}>
      <div ref={editorRef} />
      {!isReady && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 10 }}>
          Đang tải trình soạn thảo...
        </Typography>
      )}
    </Box>
  );
};

export default EditorWrapper;
