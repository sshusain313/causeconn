import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';
import config from '@/config';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';

interface LogoUploadStepProps {
  formData: {
    logoUrl: string;
    message: string;
    logoPosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
    causePlaceholder?: {
      x: number;
      y: number;
      width: number;
      height: number;
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
    causePlaceholder?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>) => void;
}

const LogoUploadStep = ({ formData, updateFormData }: LogoUploadStepProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(formData.logoUrl);
  const [uploading, setUploading] = useState(false);
  const logoCanvasRef = useRef<HTMLCanvasElement>(null);
  const causeCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaceholderDragging, setIsPlaceholderDragging] = useState(false);
  const [position, setPosition] = useState(formData.logoPosition || { x: 200, y: 200, scale: 0.25, angle: 0 });
  const [causePlaceholder, setCausePlaceholder] = useState(formData.causePlaceholder || { x: 200, y: 200, width: 150, height: 100 });
  const [error, setError] = useState<string | null>(null);

  // Initialize logo canvas and draw tote bag with logo
  useEffect(() => {
    const canvas = logoCanvasRef.current;
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
    console.log('Loading totebag image for logo canvas from:', toteBag.src);
    
    toteBag.onload = () => {
      console.log('Totebag image loaded successfully for logo canvas');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tote bag centered
      const scale = Math.min(canvas.width / toteBag.width, canvas.height / toteBag.height) * 0.9;
      const x = (canvas.width - toteBag.width * scale) / 2;
      const y = (canvas.height - toteBag.height * scale) / 2;
      ctx.drawImage(toteBag, x, y, toteBag.width * scale, toteBag.height * scale);
      
      // Draw logo if available
      if (previewUrl && logoRef.current) {
        console.log('Drawing logo on canvas');
        drawLogo(ctx, logoRef.current, position);
      } else {
        console.log('Logo not available for drawing', { previewUrl, logoLoaded: !!logoRef.current });
      }
    };
    
    toteBag.onerror = (error) => {
      console.error('Error loading totebag image for logo canvas:', error);
      console.error('Failed URL:', toteBag.src);
    };
  }, [previewUrl, position]);
  
  // Initialize cause placeholder canvas and draw tote bag with placeholder
  useEffect(() => {
    const canvas = causeCanvasRef.current;
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
    console.log('Loading totebag image for cause canvas from:', toteBag.src);
    
    toteBag.onload = () => {
      console.log('Totebag image loaded successfully for cause canvas');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tote bag centered
      const scale = Math.min(canvas.width / toteBag.width, canvas.height / toteBag.height) * 0.9;
      const x = (canvas.width - toteBag.width * scale) / 2;
      const y = (canvas.height - toteBag.height * scale) / 2;
      ctx.drawImage(toteBag, x, y, toteBag.width * scale, toteBag.height * scale);
      
      // Draw cause placeholder
      drawCausePlaceholder(ctx, causePlaceholder);
    };
    
    toteBag.onerror = (error) => {
      console.error('Error loading totebag image for cause canvas:', error);
      console.error('Failed URL:', toteBag.src);
    };
  }, [causePlaceholder]);
  
  // Load logo image when URL changes
  useEffect(() => {
    if (!previewUrl) return;
    
    const logoImg = new Image();
    // Handle server-side URLs
    if (previewUrl.startsWith('/uploads/')) {
      // Use the uploadsUrl from config directly
      logoImg.src = `${config.uploadsUrl}${previewUrl.replace('/uploads', '')}`;
      console.log('Loading server image from:', logoImg.src);
    } else {
      logoImg.src = previewUrl;
      console.log('Loading image from:', previewUrl);
    }
    
    logoImg.onload = () => {
      console.log('Logo image loaded successfully');
      logoRef.current = logoImg;
      // Trigger redraw
      setPosition(prev => ({ ...prev }));
    };
    
    logoImg.onerror = (error) => {
      console.error('Error loading logo image:', error);
      console.error('Failed URL:', logoImg.src);
    };
  }, [previewUrl]);
  
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
  
  // Function to draw cause placeholder on canvas
  const drawCausePlaceholder = (ctx: CanvasRenderingContext2D, placeholder: { x: number, y: number, width: number, height: number }) => {
    ctx.save();
    
    // Set dashed line style
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#0070f3';
    ctx.lineWidth = 2;
    
    // Draw rectangle centered at x,y
    ctx.strokeRect(
      placeholder.x - placeholder.width / 2,
      placeholder.y - placeholder.height / 2,
      placeholder.width,
      placeholder.height
    );
    
    // Add label
    ctx.font = '12px Arial';
    ctx.fillStyle = '#0070f3';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Cause Image Area',
      placeholder.x,
      placeholder.y
    );
    
    ctx.restore();
  };
  
  // Mouse event handlers for logo dragging
  const handleLogoMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!previewUrl) return;
    
    const canvas = logoCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within logo bounds
    const logoX = position.x;
    const logoY = position.y;
    const logoWidth = (logoRef.current?.width || 0) * position.scale;
    const logoHeight = (logoRef.current?.height || 0) * position.scale;
    
    if (
      x >= logoX - logoWidth / 2 &&
      x <= logoX + logoWidth / 2 &&
      y >= logoY - logoHeight / 2 &&
      y <= logoY + logoHeight / 2
    ) {
      setIsDragging(true);
    }
  };
  
  const handleLogoMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !logoCanvasRef.current) return;
    
    const canvas = logoCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition(prev => ({
      ...prev,
      x,
      y
    }));
  };
  
  const handleLogoMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to form data
      updateFormData({ logoPosition: position });
    }
  };
  
  // Mouse event handlers for cause placeholder dragging
  const handlePlaceholderMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = causeCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within placeholder bounds
    const placeholderX = causePlaceholder.x;
    const placeholderY = causePlaceholder.y;
    const placeholderWidth = causePlaceholder.width;
    const placeholderHeight = causePlaceholder.height;
    
    if (
      x >= placeholderX - placeholderWidth / 2 &&
      x <= placeholderX + placeholderWidth / 2 &&
      y >= placeholderY - placeholderHeight / 2 &&
      y <= placeholderY + placeholderHeight / 2
    ) {
      setIsPlaceholderDragging(true);
    }
  };
  
  const handlePlaceholderMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaceholderDragging || !causeCanvasRef.current) return;
    
    const canvas = causeCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCausePlaceholder(prev => ({
      ...prev,
      x,
      y
    }));
  };
  
  const handlePlaceholderMouseUp = () => {
    if (isPlaceholderDragging) {
      setIsPlaceholderDragging(false);
      // Save placeholder to form data
      updateFormData({ causePlaceholder });
    }
  };
  
  // Handle logo upload
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
            setPreviewUrl(compressedDataUrl);
            
            // But save the server URL to the form data
            updateFormData({ logoUrl });
            
            // Reset position for new logo
            const newPosition = { x: 200, y: 280, scale: 0.25, angle: 0 };
            setPosition(newPosition);
            updateFormData({ logoPosition: newPosition });
          } else {
            throw new Error('Invalid server response');
          }
        } catch (uploadError) {
          console.error('Error uploading logo to server:', uploadError);
          
          // Fall back to client-side approach if server upload fails
          console.log('Falling back to client-side approach');
          setPreviewUrl(dataUrl);
          updateFormData({ logoUrl: dataUrl });
          
          // Reset position for new logo
          const newPosition = { x: 200, y: 280, scale: 0.25, angle: 0 };
          setPosition(newPosition);
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
  
  // Handle cause placeholder dimension changes
  const handlePlaceholderWidthChange = (value: number[]) => {
    setCausePlaceholder(prev => {
      const newPlaceholder = { ...prev, width: value[0] };
      updateFormData({ causePlaceholder: newPlaceholder });
      return newPlaceholder;
    });
  };
  
  const handlePlaceholderHeightChange = (value: number[]) => {
    setCausePlaceholder(prev => {
      const newPlaceholder = { ...prev, height: value[0] };
      updateFormData({ causePlaceholder: newPlaceholder });
      return newPlaceholder;
    });
  };
  
  const handlePlaceholderInputChange = (dimension: 'width' | 'height', value: number) => {
    const clampedValue = Math.min(300, Math.max(50, value));
    setCausePlaceholder(prev => {
      const newPlaceholder = { ...prev, [dimension]: clampedValue };
      updateFormData({ causePlaceholder: newPlaceholder });
      return newPlaceholder;
    });
  };
  
  // Logo manipulation functions
  const handleZoomIn = () => {
    setPosition(prev => {
      const newPosition = { ...prev, scale: prev.scale * 1.1 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleZoomOut = () => {
    setPosition(prev => {
      const newPosition = { ...prev, scale: prev.scale * 0.9 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleRotateClockwise = () => {
    setPosition(prev => {
      const newPosition = { ...prev, angle: prev.angle + 15 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleRotateCounterClockwise = () => {
    setPosition(prev => {
      const newPosition = { ...prev, angle: prev.angle - 15 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleResetLogo = () => {
    const newPosition = { x: 200, y: 200, scale: 0.25, angle: 0 };
    setPosition(newPosition);
    updateFormData({ logoPosition: newPosition });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <h2 className="text-xl font-bold mb-4">Tote Bag Design</h2>
      <p className="text-gray-600 mb-6">
        Upload your organization's logo and define the area where cause images will appear on the tote bags.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Logo Upload and Message */}
        <div>
          <div className="space-y-4">
            <Label htmlFor="logoUpload">Upload Logo</Label>
            <div className="flex items-center gap-4">
              <Input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full h-32 border-dashed"
                onClick={() => document.getElementById('logoUpload')?.click()}
                disabled={uploading}
              >
                <div className="flex flex-col items-center text-gray-500">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>{uploading ? 'Uploading...' : 'Click to upload logo'}</span>
                  <span className="text-xs mt-1">PNG, JPG, SVG (max 5MB)</span>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Logo Preview */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Your Logo</h3>
            <Card className="border-2 border-gray-200">
              <CardContent className="p-4">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative bg-gray-50 rounded-lg flex flex-col items-center">
                      {/* HTML5 Canvas for Logo */}
                      <canvas 
                        ref={logoCanvasRef} 
                        className="border rounded-lg cursor-move" 
                        onMouseDown={handleLogoMouseDown}
                        onMouseMove={handleLogoMouseMove}
                        onMouseUp={handleLogoMouseUp}
                        onMouseLeave={handleLogoMouseUp}
                      />
                      
                      {/* Logo Controls */}
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleZoomIn}
                          title="Zoom In"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleZoomOut}
                          title="Zoom Out"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleRotateClockwise}
                          title="Rotate Clockwise"
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleRotateCounterClockwise}
                          title="Rotate Counter-Clockwise"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleResetLogo}
                          title="Reset Position"
                        >
                          Reset
                        </Button>
                      </div>
                      
                      <p className="mt-2 text-xs text-muted-foreground text-center">
                        Drag to position, use controls to resize or rotate your logo.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-gray-400 text-center">
                      Your logo preview will appear here after upload
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right Column - Cause Image Placeholder */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Cause Image Area</h3>
          <Card className="border-2 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Define the area where cause images will appear on the tote bags. Drag the placeholder or adjust dimensions below.
                </p>
                <div className="relative bg-gray-50 rounded-lg flex flex-col items-center">
                  {/* HTML5 Canvas for Cause Placeholder */}
                  <canvas 
                    ref={causeCanvasRef} 
                    className="border rounded-lg cursor-move" 
                    onMouseDown={handlePlaceholderMouseDown}
                    onMouseMove={handlePlaceholderMouseMove}
                    onMouseUp={handlePlaceholderMouseUp}
                    onMouseLeave={handlePlaceholderMouseUp}
                  />
                </div>
                
                {/* Placeholder Dimension Controls */}
                <div className="space-y-4 mt-4">
                  <div>
                    {/* <div className="flex justify-between mb-1">
                      <Label htmlFor="placeholderWidth">Width</Label>
                      <span>{causePlaceholder.width}px</span>
                    </div> */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          id="placeholderWidth"
                          value={[causePlaceholder.width]}
                          min={50}
                          max={300}
                          step={5}
                          onValueChange={handlePlaceholderWidthChange}
                        />
                      </div>
                      <div className="w-16">
                        <Input
                          type="number"
                          min={50}
                          max={300}
                          value={causePlaceholder.width}
                          onChange={(e) => handlePlaceholderInputChange('width', parseInt(e.target.value) || 50)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {/* <div className="flex justify-between mb-1">
                      <Label htmlFor="placeholderHeight">Height</Label>
                      <span>{causePlaceholder.height}px</span>
                    </div> */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          id="placeholderHeight"
                          value={[causePlaceholder.height]}
                          min={50}
                          max={300}
                          step={5}
                          onValueChange={handlePlaceholderHeightChange}
                        />
                      </div>
                      <div className="w-16">
                        <Input
                          type="number"
                          min={50}
                          max={300}
                          value={causePlaceholder.height}
                          onChange={(e) => handlePlaceholderInputChange('height', parseInt(e.target.value) || 50)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-2">
                  <p>This area will be used by admins to place cause-related images on the tote bags.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Message Textarea - Below Both Previews */}
      <div className="space-y-4 mt-6">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Any special requests or details about your sponsorship?"
          value={formData.message}
          onChange={handleMessageChange}
          rows={4}
        />
      </div>
    </div>
  );
};

export default LogoUploadStep;
