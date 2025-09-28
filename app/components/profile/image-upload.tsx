import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { browserClient } from '@/supa-client';
import { Camera, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageChange: (imageUrl: string | null) => void;
  username?: string;
  disabled?: boolean;
}

export function ImageUpload({
  currentImageUrl,
  onImageChange,
  username,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error } = await browserClient.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = browserClient.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Clean up preview URL
      URL.revokeObjectURL(objectUrl);

      // Update with actual URL
      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');

      // Reset preview on error
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='space-y-4'>
          <Label>프로필 이미지</Label>

          <div className='flex flex-col items-center space-y-4'>
            {/* Avatar Preview */}
            <div className='relative'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={previewUrl || undefined} />
                <AvatarFallback className='text-lg'>
                  {username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {!disabled && (
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='absolute right-0 bottom-0 h-8 w-8 rounded-full p-0'
                  onClick={triggerFileSelect}
                  disabled={uploading}
                >
                  <Camera className='h-4 w-4' />
                </Button>
              )}
            </div>

            {/* Upload Controls */}
            {!disabled && (
              <div className='flex flex-col space-y-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={triggerFileSelect}
                  disabled={uploading}
                  className='flex items-center gap-2'
                >
                  <Upload className='h-4 w-4' />
                  {uploading ? '업로드 중...' : '이미지 업로드'}
                </Button>

                {previewUrl && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    이미지 제거
                  </Button>
                )}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
              disabled={disabled || uploading}
            />

            {/* Help Text */}
            <p className='text-muted-foreground text-center text-sm'>
              JPG, PNG, GIF 파일을 업로드하세요 (최대 5MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
