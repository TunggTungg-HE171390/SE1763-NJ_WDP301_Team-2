import React, { useRef, useEffect, useState, useCallback } from 'react';
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
import { Box, Typography, CircularProgress } from '@mui/material';

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
  const [isLoading, setIsLoading] = useState(true);

  // Parse JSON data with proper validation to avoid "Block paragraph skipped" error
  const parseData = useCallback(() => {
    // Default valid data structure
    const defaultData = {
      time: new Date().getTime(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: ""
          }
        }
      ],
      version: "2.26.5"
    };

    // If no data provided, return default structure
    if (!data) {
      return defaultData;
    }
    
    try {
      // Parse string data or use object directly
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Validate the structure
      if (!parsed || typeof parsed !== 'object') {
        return defaultData;
      }
      
      // Make sure blocks exist and are valid
      if (!Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
        return defaultData;
      }
      
      // Validate each block has required properties
      const validBlocks = parsed.blocks.filter(block => 
        block && 
        typeof block === 'object' && 
        typeof block.type === 'string' && 
        block.data && 
        typeof block.data === 'object'
      );
      
      // If no valid blocks found, use default
      if (validBlocks.length === 0) {
        return defaultData;
      }
      
      // Return valid data structure
      return {
        time: parsed.time || defaultData.time,
        blocks: validBlocks,
        version: parsed.version || defaultData.version
      };
    } catch (e) {
      console.log('Error parsing editor data, using default:', e);
      return defaultData;
    }
  }, [data]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;
    
    setIsLoading(true);

    // Clean up existing instance if any
    if (editorInstance.current && editorInstance.current.destroy) {
      editorInstance.current.destroy();
      editorInstance.current = null;
    }

    // Image upload function
    const imageUploadCallback = async (file) => {
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

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      try {
        // Get properly formatted data
        const parsedData = parseData();
        
        // Initialize Editor.js
        editorInstance.current = new EditorJS({
          holder: editorRef.current,
          tools: {
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
              config: {
                preserveBlank: true
              }
            },
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                levels: [1, 2, 3],
                defaultLevel: 2
              }
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
          data: parsedData,
          placeholder: placeholder,
          onReady: () => {
            setIsReady(true);
            setIsLoading(false);
          },
          onChange: async () => {
            if (onChange) {
              try {
                const savedData = await editorInstance.current.save();
                onChange(JSON.stringify(savedData));
              } catch (e) {
                console.error('Error saving editor data:', e);
              }
            }
          },
          autofocus: false,
          logLevel: 'ERROR' // Only log errors, not warnings
        });

        // Handle initialization errors
        editorInstance.current.isReady
          .catch((error) => {
            console.error('Editor.js initialization failed:', error);
            setIsLoading(false);
          });
          
      } catch (error) {
        console.error('Error initializing Editor.js:', error);
        setIsLoading(false);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [parseData, placeholder]);

  // Custom styling to avoid high-contrast warnings
  const customStyles = {
    border: '1px solid rgba(0, 0, 0, 0.23)', 
    borderRadius: '4px',
    padding: '10px', 
    backgroundColor: '#fff',
    minHeight: '250px',
    position: 'relative',
    
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
    
    '&:focus-within': {
      borderColor: '#1976d2',
      borderWidth: '2px',
      padding: '9px',
    },
    
    // Modern approach for high-contrast mode
    '@media (forced-colors: active)': {
      borderColor: 'CanvasText',
    },
    
    // Override Editor.js specific styles
    '& .ce-block': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    
    '& .ce-toolbar__content': {
      maxWidth: 'calc(100% - 80px)', // Fix toolbar width issues
    },
    
    '& .ce-paragraph': {
      lineHeight: '1.6em',
      outline: 'none',
    },
    
    ...sx
  };

  return (
    <Box sx={customStyles}>
      <div ref={editorRef} style={{ minHeight: '200px' }} />
      
      {isLoading && (
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
          zIndex: 2
        }}>
          <CircularProgress size={40} />
        </Box>
      )}
      
      {!isReady && !isLoading && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 10 }}>
          Không thể tải trình soạn thảo. Vui lòng thử lại.
        </Typography>
      )}
    </Box>
  );
};

export default EditorWrapper;
