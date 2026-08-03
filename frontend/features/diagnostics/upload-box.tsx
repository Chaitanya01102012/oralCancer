"use client";

import { useCallback, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export function UploadBox({ file, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped && dropped.type.startsWith("image/")) {
        onChange(dropped);
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#252840] bg-[#12141f] px-6 py-10 text-center transition",
          dragging && "border-[#6dbf8f] bg-[#6dbf8f]/5",
        )}
      >
        <ImagePlus className="mb-3 h-10 w-10 text-[#6dbf8f]" />
        <p className="font-medium text-white">Drag & drop an oral image</p>
        <p className="mt-1 text-sm text-[#7a8299]">PNG, JPG, or WEBP up to 10MB</p>
        <label className="mt-4 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              onChange(selected);
            }}
          />
          <span className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-[#252840] bg-[#1e2235] px-2.5 text-sm font-medium text-[#a0a8b8] hover:bg-[#252840] hover:text-white transition-colors">
            <Upload className="h-4 w-4" />
            Browse File
          </span>
        </label>
      </div>

      {preview && file && (
        <div className="relative overflow-hidden rounded-2xl border border-[#252840] bg-[#12141f]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Oral image preview" className="max-h-80 w-full object-contain" />
          <div className="flex items-center justify-between border-t border-[#252840] px-4 py-3">
            <p className="truncate text-sm text-[#a0a8b8]">{file.name}</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)} className="text-[#a0a8b8] hover:text-white hover:bg-[#1e2235]">
              <Trash2 className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
