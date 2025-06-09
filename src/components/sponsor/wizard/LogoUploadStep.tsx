import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ZoomIn, ZoomOut, RotateCw, RotateCcw, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import config from '@/config';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LogoUploadStepProps {
  formData: {
    logoUrl: string;
    message: string;
    selectedCause?: string;
    causeImageUrl?: string;
    logoPosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
    causeImagePosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
  };
  updateFormData: (data: Partial<{
    logoUrl: string;
    message: string;
    logoPosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
    causeImagePosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
  }>) => void;
}

const LogoUploadStep = ({ formData, updateFormData }: LogoUploadStepProps) => {
  // Fetch selected cause if available
  const { data: selectedCauseData, isLoading, error: queryError } = useQuery({
    queryKey: ['cause', formData.selectedCause],
    queryFn: async () => {
      if (!formData.selectedCause) return null;
      const response = await fetch(`${config.apiUrl}/causes/${formData.selectedCause}`);
      if (!response.ok) throw new Error('Failed to fetch cause');
      const data = await response.json();
      console.log('Fetched cause data:', data);
      console.log('Tote preview image URL:', data.totePreviewImageUrl);
      return data;
    },
    enabled: !!formData.selectedCause,
  });

  // State for user logo upload section
  const [userLogoPreview, setUserLogoPreview] = useState<string>(formData.logoUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Canvas refs for dual preview system
  const userLogoCanvasRef = useRef<HTMLCanvasElement>(null);
  const adminLogoCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Image refs
  const userLogoRef = useRef<HTMLImageElement>(null);
  const adminLogoRef = useRef<HTMLImageElement>(null);
  
  // User logo manipulation state
  const [isDragging, setIsDragging] = useState(false);
  const [logoPosition, setLogoPosition] = useState(formData.logoPosition || { x: 200, y: 200, scale: 0.25, angle: 0 });
  
  // Admin logo state
  const [adminLogoLoaded, setAdminLogoLoaded] = useState(false);

  // Debug logging for admin image
  useEffect(() => {
    console.log('=== Admin Logo Debug ===');
    console.log('Selected Cause ID:', formData.selectedCause);
    console.log('Selected Cause Data:', selectedCauseData);
    console.log('Admin Image URL:', selectedCauseData?.adminImageUrl);
    console.log('========================');
  }, [formData.selectedCause, selectedCauseData]);

  // Get the effective admin image URL
  const effectiveAdminImageUrl = selectedCauseData?.adminImageUrl;

  // Draw user logo canvas
  useEffect(() => {
    const canvas = userLogoCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tote bag image
    const toteBag = new Image();
    toteBag.src = '/totebag.png';

    toteBag.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw tote bag centered
      const scale = Math.min(canvas.width / toteBag.width, canvas.height / toteBag.height) * 0.9;
      const x = (canvas.width - toteBag.width * scale) / 2;
      const y = (canvas.height - toteBag.height * scale) / 2;
      ctx.drawImage(toteBag, x, y, toteBag.width * scale, toteBag.height * scale);

      // Draw user logo if available
      if (userLogoPreview && userLogoRef.current) {
        drawLogo(ctx, userLogoRef.current, logoPosition);
      }
    };

    toteBag.onerror = (error) => {
      console.error('Error loading totebag image for user logo canvas:', error);
    };
  }, [userLogoPreview, logoPosition]);

  // Draw admin logo canvas
  useEffect(() => {
    const canvas = adminLogoCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;
    
    if (isLoading) {
      showErrorState(ctx, 'Loading cause preview...');
      return;
    }

    if (queryError) {
      showErrorState(ctx, 'Failed to load cause preview');
      console.error('Query error:', queryError);
      return;
    }

    // Get preview URL from cause data
    const previewUrl = selectedCauseData?.totePreviewImageUrl;
    console.log('Preview URL from server:', previewUrl);

    if (!previewUrl) {
      showErrorState(ctx, formData.selectedCause 
        ? 'No preview image available for this cause'
        : 'Select a cause to see preview'
      );
      return;
    }

    // Load and draw the preview with proper URL handling
    const causePreview = new Image();
    causePreview.crossOrigin = 'anonymous';
    
    // IMPROVED URL HANDLING LOGIC
    let fullUrl = previewUrl;
    
    // Extract filename from absolute path (Windows or Unix style)
    if (previewUrl.includes('/uploads/') || 
        previewUrl.includes('\\uploads\\') || 
        previewUrl.includes('C:/') || 
        previewUrl.includes('C:\\')
    ) {
      // Get just the filename from the path
      const filename = previewUrl.split('/').pop() || previewUrl.split('\\').pop();
      if (filename) {
        fullUrl = `${config.uploadsUrl}/${filename}`;
        console.log('Converted absolute path to URL:', fullUrl);
      }
    } 
    // Handle relative upload paths
    else if (previewUrl.startsWith('/uploads/')) {
      fullUrl = `${config.uploadsUrl}${previewUrl.replace('/uploads/', '/')}`;
    }
    // Handle paths without protocol
    else if (!previewUrl.startsWith('http') && !previewUrl.startsWith('data:')) {
      fullUrl = `${config.apiUrl}${previewUrl.startsWith('/') ? '' : '/'}${previewUrl}`;
    }
    
    causePreview.src = fullUrl;
    console.log('Loading preview from:', causePreview.src);

    causePreview.onload = () => {
      console.log('Cause preview loaded successfully');
      const toteBag = new Image();
      toteBag.src = '/totebag.png';
      toteBag.onload = () => {
        drawCausePreview(ctx, toteBag, causePreview);
      };
      toteBag.onerror = (err) => {
        console.error('Failed to load totebag template:', err);
        showErrorState(ctx, 'Failed to load preview template');
      };
    };

    causePreview.onerror = (err) => {
      console.error('Failed to load cause preview:', err);
      console.error('Failed URL:', causePreview.src);
      showErrorState(ctx, 'Failed to load cause preview');
    };

  }, [selectedCauseData, isLoading, queryError, formData.selectedCause]);

  // Helper function to show error states
  const showErrorState = (ctx: CanvasRenderingContext2D, message: string) => {
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2);
  };

  // Load user logo image when URL changes
  useEffect(() => {
    if (!userLogoPreview) return;

    const logoImg = new Image();
    // Handle server-side URLs
    if (userLogoPreview.startsWith('/uploads/')) {
      logoImg.src = `${config.uploadsUrl}${userLogoPreview.replace('/uploads', '')}`;
    } else {
      logoImg.src = userLogoPreview;
    }

    logoImg.onload = () => {
      userLogoRef.current = logoImg;
      // Trigger redraw
      setLogoPosition(prev => ({ ...prev }));
    };

    logoImg.onerror = (error) => {
      console.error('Error loading user logo image:', error);
    };
  }, [userLogoPreview]);

  // Load admin logo image when available
  // Load admin logo image when available
  useEffect(() => {
    console.log('=== Admin Logo Loading Effect ===');
    console.log('Effective Admin Image URL:', effectiveAdminImageUrl);
    
    // Reset loaded state when URL changes
    setAdminLogoLoaded(false);
    
    if (!effectiveAdminImageUrl) {
      console.log('No admin image URL available');
      return;
    }

    const adminImg = new Image();
    adminImg.crossOrigin = 'anonymous';
    
    // IMPROVED URL HANDLING LOGIC
    let imgSrc = effectiveAdminImageUrl;
    
    // Extract filename from absolute path (Windows or Unix style)
    if (effectiveAdminImageUrl.includes('/uploads/') || 
        effectiveAdminImageUrl.includes('\\uploads\\') || 
        effectiveAdminImageUrl.includes('C:/') || 
        effectiveAdminImageUrl.includes('C:\\')
    ) {
      // Get just the filename from the path
      const filename = effectiveAdminImageUrl.split('/').pop() || effectiveAdminImageUrl.split('\\').pop();
      if (filename) {
        imgSrc = `${config.uploadsUrl}/${filename}`;
        console.log('Converted absolute path to URL:', imgSrc);
      }
    }
    // Handle relative upload paths
    else if (effectiveAdminImageUrl.startsWith('/uploads/')) {
      imgSrc = `${config.uploadsUrl}${effectiveAdminImageUrl.replace('/uploads/', '/')}`;
    } 
    // Handle HTTP URLs
    else if (effectiveAdminImageUrl.startsWith('http')) {
      imgSrc = effectiveAdminImageUrl;
    } 
    // Handle other relative paths
    else {
      imgSrc = effectiveAdminImageUrl.startsWith('/') 
        ? `${config.apiUrl}${effectiveAdminImageUrl}` 
        : `${config.apiUrl}/${effectiveAdminImageUrl}`;
    }

    console.log('Loading admin image from:', imgSrc);
    adminImg.src = imgSrc;

    adminImg.onload = () => {
      console.log('Admin logo image loaded successfully');
      adminLogoRef.current = adminImg;
      setAdminLogoLoaded(true);
    };

    adminImg.onerror = (error) => {
      console.error('Error loading admin logo image:', error);
      console.error('Failed URL:', adminImg.src);
    };
  }, [effectiveAdminImageUrl]);

  // Function to draw logo on canvas
  const drawLogo = (ctx: CanvasRenderingContext2D, logo: HTMLImageElement, pos: { x: number, y: number, scale: number, angle: number }) => {
    ctx.save();

    // Move to position and apply transformations
    ctx.translate(pos.x, pos.y);
    ctx.rotate(pos.angle * Math.PI / 180);
    ctx.scale(pos.scale, pos.scale);

    // Draw logo centered
    const width = logo.width;
    const height = logo.height;
    ctx.drawImage(logo, -width / 2, -height / 2, width, height);

    ctx.restore();
  };

  // Mouse event handlers for user logo dragging
  const handleUserLogoMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!userLogoPreview) return;

    const canvas = userLogoCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is within logo bounds
    const logoX = logoPosition.x;
    const logoY = logoPosition.y;
    const logoWidth = (userLogoRef.current?.width || 0) * logoPosition.scale;
    const logoHeight = (userLogoRef.current?.height || 0) * logoPosition.scale;

    if (
      x >= logoX - logoWidth / 2 &&
      x <= logoX + logoWidth / 2 &&
      y >= logoY - logoHeight / 2 &&
      y <= logoY + logoHeight / 2
    ) {
      setIsDragging(true);
    }
  };

  const handleUserLogoMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !userLogoCanvasRef.current) return;

    const canvas = userLogoCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setLogoPosition(prev => ({
      ...prev,
      x,
      y
    }));
  };

  const handleUserLogoMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to form data
      updateFormData({ logoPosition });
    }
  };

  // Handle user logo upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // First, show a preview of the selected image
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }

        // Use the data URL as the preview temporarily
        const dataUrl = event.target.result as string;
        console.log('Logo loaded as data URL for preview');

        try {
          // Compress the image before uploading to server
          const compressedDataUrl = await compressImage(dataUrl, file.type, 400, 0.5);
          console.log('Original size:', Math.round(dataUrl.length / 1024), 'KB');
          console.log('Compressed size:', Math.round(compressedDataUrl.length / 1024), 'KB');

          // Create a FormData object to send the file to the server
          const formData = new FormData();

          // Convert the compressed data URL back to a Blob
          const byteString = atob(compressedDataUrl.split(',')[1]);
          const mimeType = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const blob = new Blob([ab], { type: mimeType });
          formData.append('logo', blob, file.name);

          // Upload to server
          console.log('Uploading logo to server...');
          const response = await axios.post(`${config.apiUrl}/upload/logo`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('Server response:', response.data);

          if (response.data && response.data.url) {
            // Use the server-provided URL
            const logoUrl = response.data.url;
            console.log('Logo uploaded successfully, server URL:', logoUrl);

            // Set the preview to the compressed data URL for immediate display
            setUserLogoPreview(compressedDataUrl);

            // But save the server URL to the form data
            updateFormData({ logoUrl });

            // Reset position for new logo
            const newPosition = { x: 200, y: 280, scale: 0.25, angle: 0 };
            setLogoPosition(newPosition);
            updateFormData({ logoPosition: newPosition });
          } else {
            throw new Error('Invalid server response');
          }
        } catch (uploadError) {
          console.error('Error uploading logo to server:', uploadError);

          // Fall back to client-side approach if server upload fails
          console.log('Falling back to client-side approach');
          setUserLogoPreview(dataUrl);
          updateFormData({ logoUrl: dataUrl });

          // Reset position for new logo
          const newPosition = { x: 200, y: 280, scale: 0.25, angle: 0 };
          setLogoPosition(newPosition);
          updateFormData({ logoPosition: newPosition });

          setError('Could not upload to server. Using local preview instead.');
        }

        setUploading(false);
      };

      reader.onerror = () => {
        console.error('Error reading file');
        setError('Failed to read logo file. Please try again.');
        setUploading(false);
      };

      // Start reading the file
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling logo:', error);
      setError('Failed to process logo. Please try again.');
      setUploading(false);
    }
  };

  // Image compression function with enhanced compression
  const compressImage = (dataUrl: string, fileType: string, maxWidth: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed data URL
        const compressedDataUrl = canvas.toDataURL(fileType, quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };

      img.src = dataUrl;
    });
  };

  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ message: e.target.value });
  };

  // User logo manipulation functions
  const handleZoomIn = () => {
    setLogoPosition(prev => {
      const newPosition = { ...prev, scale: prev.scale * 1.1 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };

  const handleZoomOut = () => {
    setLogoPosition(prev => {
      const newPosition = { ...prev, scale: prev.scale * 0.9 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };

  const handleRotateClockwise = () => {
    setLogoPosition(prev => {
      const newPosition = { ...prev, angle: prev.angle + 15 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };

  const handleRotateCounterClockwise = () => {
    setLogoPosition(prev => {
      const newPosition = { ...prev, angle: prev.angle - 15 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };

  const handleResetLogo = () => {
    const newPosition = { x: 200, y: 200, scale: 0.25, angle: 0 };
    setLogoPosition(newPosition);
    updateFormData({ logoPosition: newPosition });
  };

  // Add helper function for drawing cause preview
  const drawCausePreview = (
    ctx: CanvasRenderingContext2D, 
    toteBag: HTMLImageElement, 
    preview: HTMLImageElement
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw tote bag
    const bagScale = Math.min(
      ctx.canvas.width / toteBag.width,
      ctx.canvas.height / toteBag.height
    ) * 0.9;
    
    const bagX = (ctx.canvas.width - toteBag.width * bagScale) / 2;
    const bagY = (ctx.canvas.height - toteBag.height * bagScale) / 2;
    
    ctx.drawImage(toteBag, bagX, bagY, 
      toteBag.width * bagScale, 
      toteBag.height * bagScale
    );

    // Calculate printable area
    const printableWidth = toteBag.width * bagScale * 0.6;
    const printableHeight = toteBag.height * bagScale * 0.6;

    // Scale preview to fit
    const previewScale = Math.min(
      printableWidth / preview.width,
      printableHeight / preview.height
    ) * 0.8;

    const previewWidth = preview.width * previewScale;
    const previewHeight = preview.height * previewScale;

    // Center preview on bag
    const previewX = bagX + (toteBag.width * bagScale - previewWidth) / 2;
    const previewY = bagY + (toteBag.height * bagScale - previewHeight) / 2;

    // Draw preview
    ctx.drawImage(preview, previewX, previewY, previewWidth, previewHeight);
  };

  // Inside the LogoUploadStep component, add this debugging function
  // Update the debugImageLoading function
  const debugImageLoading = (imageUrl: string | undefined, source: string) => {
    console.log(`[DEBUG] ${source} - Image URL:`, imageUrl);
    if (!imageUrl) {
      console.log(`[DEBUG] ${source} - No image URL provided`);
      return;
    }
  
    // Test image loading
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous'; // Add this line
    testImg.onload = () => {
      console.log(`[DEBUG] ${source} - Successfully loaded image from:`, imageUrl);
    };
    testImg.onerror = (err) => {
      console.error(`[DEBUG] ${source} - Failed to load image from:`, imageUrl, err);
    };
  
    // Determine the correct URL to use - Fix the URL construction
    let fullUrl = imageUrl;
    
    // Handle absolute file paths by converting them to HTTP URLs
    if (imageUrl.includes('C:/Users/hp/Desktop/causebags/server/uploads/') || 
        imageUrl.includes('C:\\Users\\hp\\Desktop\\causebags\\server\\uploads\\')) {
      // Extract just the filename
      const filename = imageUrl.split('/').pop() || imageUrl.split('\\').pop();
      fullUrl = `${config.uploadsUrl}/${filename}`;
    } 
    // Handle relative upload paths
    else if (imageUrl.startsWith('/uploads/')) {
      fullUrl = `${config.uploadsUrl}${imageUrl.replace('/uploads/', '/')}`;
    } 
    // Handle paths without protocol
    else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      fullUrl = `${config.apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    console.log(`[DEBUG] ${source} - Attempting to load from:`, fullUrl);
    testImg.src = fullUrl;
  };

  // Call this function in your useEffect for admin image loading
  useEffect(() => {
    debugImageLoading(effectiveAdminImageUrl, 'Admin Image');
    
    // Rest of your existing code...
  }, [effectiveAdminImageUrl]);

  // Add this to your render function to show a fallback message when admin image fails to load
  const renderAdminPreview = () => {
    if (!formData.selectedCause) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No cause selected</p>
        </div>
      );
    }
    
    if (!effectiveAdminImageUrl) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No admin image available for this cause</p>
        </div>
      );
    }
    
    return (
      <div className="relative border rounded-lg overflow-hidden">
        <canvas 
          ref={adminLogoCanvasRef} 
          className="w-full h-auto" 
        />
        {!adminLogoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
            <p className="text-gray-600">Loading admin image...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> your logo
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, SVG, WEBP (MAX. 5MB)</p>
                  </div>
                  <Input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.svg,.webp"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {uploading && (
                <div className="text-center text-sm text-gray-500">
                  Uploading logo...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dual Preview System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Logo Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Your Logo Preview
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Drag your logo to reposition it on the tote bag</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Logo Controls */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={!userLogoPreview}
                  >
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Zoom In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={!userLogoPreview}
                  >
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Zoom Out
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateClockwise}
                    disabled={!userLogoPreview}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateCounterClockwise}
                    disabled={!userLogoPreview}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetLogo}
                    disabled={!userLogoPreview}
                  >
                    Reset
                  </Button>
                </div>

                {/* User Logo Canvas */}
                <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                  <canvas 
                    ref={userLogoCanvasRef} 
                    className="w-full h-auto cursor-move" 
                    onMouseDown={handleUserLogoMouseDown}
                    onMouseMove={handleUserLogoMouseMove}
                    onMouseUp={handleUserLogoMouseUp}
                    onMouseLeave={handleUserLogoMouseUp}
                  />
                  {!userLogoPreview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                      <p className="text-gray-500 text-sm text-center">
                        Upload a logo to see preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Logo Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Cause Preview
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This shows how your selected cause will appear on the tote bag</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Admin Logo Canvas */}
                <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                  <canvas 
                    ref={adminLogoCanvasRef} 
                    className="w-full h-auto" 
                  />
                  {!effectiveAdminImageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                      <p className="text-gray-500 text-sm text-center">
                        {formData.selectedCause 
                          ? "No admin logo available for this cause" 
                          : "Select a cause to see admin logo"
                        }
                      </p>
                    </div>
                  )}
                </div>
                
                {effectiveAdminImageUrl && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      Admin logo for "{selectedCauseData?.title}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sponsorship Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="message">Your message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to accompany your sponsorship..."
                value={formData.message}
                onChange={handleMessageChange}
                rows={3}
              />
              <p className="text-sm text-gray-500">
                This message will be displayed with your logo on the tote bag.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default LogoUploadStep;
