import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

import { Upload, X, Image as ImageIcon, ArrowLeft, Link, CheckCircle } from 'lucide-react';
import config from '@/config';

const CauseImageUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [causeTitle, setCauseTitle] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Mock fetch cause details
    setCauseTitle('Clean Water Initiative');
  }, [id]);

  // Redraw canvas when preview changes
  useEffect(() => {
    if (preview) {
      drawPreviewCanvas();
    }
  }, [preview]);

  const validateImageFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PNG or JPEG image",
          variant: "destructive"
        });
        resolve(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image must be smaller than 5MB",
          variant: "destructive"
        });
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width < 1000 || img.height < 1000) {
          toast({
            title: "Image Too Small",
            description: "Image must be at least 1000x1000 pixels",
            variant: "destructive"
          });
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      if (!url.match(/^https?:\/\/.+/)) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid HTTP/HTTPS URL",
          variant: "destructive"
        });
        return false;
      }

      const response = await fetch(url, { method: 'HEAD' });
      
      if (!response.ok) {
        toast({
          title: "URL Not Accessible",
          description: "Could not access the image at this URL",
          variant: "destructive"
        });
        return false;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.match(/^image\/(png|jpeg|jpg)/)) {
        toast({
          title: "Invalid Image Type",
          description: "URL must point to a PNG or JPEG image",
          variant: "destructive"
        });
        return false;
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
        toast({
          title: "Image Too Large",
          description: "Image must be smaller than 5MB",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Could not validate the image URL",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateImageFile(file);
    if (isValid) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      previewImageRef.current = new Image();
      previewImageRef.current.src = objectUrl;
      previewImageRef.current.onload = () => {
        drawPreviewCanvas();
      };
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) return;

    const isValid = await validateImageUrl(imageUrl);
    if (isValid) {
      setPreview(imageUrl);
      previewImageRef.current = new Image();
      previewImageRef.current.src = imageUrl;
      previewImageRef.current.onload = () => {
        drawPreviewCanvas();
      };
    }
  };

  const handleUpload = async () => {

      if (!preview) {
        toast({
          title: "Preview Error",
          description: "Failed to load image preview",
          variant: "destructive"
        });
        return;
      }

    setUploading(true);
    try {
      const formData = new FormData();

      // Handle file upload
      if (preview.startsWith('data:') || preview.startsWith('blob:')) {
        const response = await fetch(preview);
        const blob = await response.blob();
        formData.append('image', blob, 'cause-image.jpg');
      } else {
        formData.append('imageUrl', preview);
      }

      // Add cause ID
      formData.append('causeId', id || '');

      // Update endpoint to match backend structure
      const uploadEndpoint = `${config.apiUrl}/causes/${id}/upload-image`;
      console.log('Uploading to:', uploadEndpoint);

      const response = await axios.post(
        uploadEndpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
        navigate('/admin/causes');
      }
    } catch (error: any) {
      console.error('Upload error:', {
        message: error.message,
        status: error.response?.status,
        endpoint: error.config?.url
      });

      toast({
        title: "Upload Failed",
        description: error.response?.status === 404
          ? "Upload service not available. Please contact support."
          : "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Update the drawPreviewCanvas function
  const drawPreviewCanvas = () => {
    const canvas = previewCanvasRef.current;
    const img = previewImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Draw tote bag image first
    const toteBag = new Image();
    toteBag.src = '/totebag.png';
    
    toteBag.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw tote bag centered
      const bagScale = Math.min(canvas.width / toteBag.width, canvas.height / toteBag.height) * 0.9;
      const bagX = (canvas.width - toteBag.width * bagScale) / 2;
      const bagY = (canvas.height - toteBag.height * bagScale) / 2;
      
      // Draw the totebag
      ctx.drawImage(toteBag, bagX, bagY, toteBag.width * bagScale, toteBag.height * bagScale);

      // Calculate printable area (60% of totebag size)
      const printableWidth = toteBag.width * bagScale * 0.6;
      const printableHeight = toteBag.height * bagScale * 0.6;

      // Scale the uploaded image to fit printable area
      const imageScale = Math.min(
        printableWidth / img.width,
        printableHeight / img.height
      ) * 0.8; // 80% of printable area

      const scaledWidth = img.width * imageScale;
      const scaledHeight = img.height * imageScale;

      // Center the image on the totebag
      const imageX = bagX + (toteBag.width * bagScale - scaledWidth) / 2;
      const imageY = bagY + (toteBag.height * bagScale - scaledHeight) / 2;

      // Draw the uploaded image
      ctx.drawImage(img, imageX, imageY, scaledWidth, scaledHeight);

      // Debug rectangles to show printable area (uncomment to debug)
      // ctx.strokeStyle = 'red';
      // ctx.strokeRect(
      //   bagX + (toteBag.width * bagScale - printableWidth) / 2,
      //   bagY + (toteBag.height * bagScale - printableHeight) / 2,
      //   printableWidth,
      //   printableHeight
      // );
    };

    toteBag.onerror = (error) => {
      console.error('Error loading totebag image:', error);
      toast({
        title: "Error",
        description: "Failed to load preview template",
        variant: "destructive"
      });
    };
  };

  // Add previewImageRef onError handler
  useEffect(() => {
    if (previewImageRef.current) {
      previewImageRef.current.onerror = () => {
        console.error('Error loading preview image');
        toast({
          title: "Error",
          description: "Failed to load image preview",
          variant: "destructive"
        });
        setPreview(null);
      };
    }
  }, [preview]);

  return (
    <AdminLayout title="Upload Cause Image" loading={false}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/causes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Causes
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Image for: {causeTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                className="h-12"
              >
                <Link className="h-4 w-4 mr-2" />
                Upload from URL
              </Button>
              <Button
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="h-12"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            {uploadMethod === 'url' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
                      Load
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {uploadMethod === 'file' && (
              <div>
                <Label htmlFor="fileUpload">Choose Image File</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
            )}

            <Alert>
              <AlertDescription>
                Images must be PNG or JPEG format, minimum 1000×1000 pixels.
                High-resolution images work best for tote bag printing.
              </AlertDescription>
            </Alert>

            {preview && (
              <div className="space-y-4">
                <div>
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <canvas
                      ref={previewCanvasRef}
                      className="w-full h-auto max-h-64 mx-auto"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full"
                  size="lg"
                >
                  {uploading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CauseImageUpload;