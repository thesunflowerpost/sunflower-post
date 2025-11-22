"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  onClose: () => void;
}

export default function ImageUpload({ onUpload, onClose }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleUpload() {
    if (!preview) return;

    setUploading(true);
    // In a real app, you'd upload to a service here
    // For now, we'll just use the base64 data URL
    setTimeout(() => {
      onUpload(preview);
      setUploading(false);
    }, 500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-yellow-900">
              Upload an Image
            </h3>
            <button
              onClick={onClose}
              className="text-[#7A674C] hover:text-yellow-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {preview ? (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border-2 border-yellow-200">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-yellow-200 bg-white hover:bg-yellow-50 text-[#5C4A33] text-sm font-semibold transition-all"
                >
                  Choose different image
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-yellow-200 disabled:to-yellow-300 text-[#3A2E1F] text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Use this image"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full p-8 border-2 border-dashed border-yellow-300 rounded-xl hover:border-yellow-400 hover:bg-yellow-50/30 cursor-pointer transition-all"
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">📷</div>
                  <p className="text-sm font-semibold text-yellow-900">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-[#A08960]">
                    JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30">
          <p className="text-[10px] text-[#A08960] text-center">
            Keep images appropriate and kind
          </p>
        </div>
      </div>
    </div>
  );
}
