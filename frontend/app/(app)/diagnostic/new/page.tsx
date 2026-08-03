"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { UploadBox } from "@/features/diagnostics/upload-box";
import { setPendingDiagnostic } from "@/lib/pending-diagnostic";
import { getProfile } from "@/services/profile";

const patientSchema = z.object({
  full_name: z.string().min(2, "Patient name is required"),
  age: z.number().min(1).max(120),
  gender: z.string().min(1, "Gender is required"),
  phone_number: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  tobacco_habit: z.boolean(),
  alcohol_habit: z.boolean(),
  clinical_notes: z.string().optional(),
});

type PatientValues = z.infer<typeof patientSchema>;

function PhotoGuide() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl border border-[#2a3a5c] bg-[#131929] p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5b9cf5]" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">How to take the right photo</p>
          <p className="text-sm text-[#7a8299]">
            For accurate AI analysis, the image must show <span className="text-white font-medium">only the inside of the mouth</span> — tongue, gums, inner cheeks, palate, or the affected oral area. Photos that include the full face add noise and reduce diagnostic accuracy.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Correct example */}
        <div className="rounded-xl border border-[#1e3a2a] bg-[#0f1f17] p-4">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#6dbf8f]" />
            <span className="text-sm font-medium text-[#6dbf8f]">Correct</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-[#12141f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guide-correct.jpg" alt="Correct: close-up of oral cavity" className="h-36 w-full object-cover" />
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-[#7a8299]">
            <li className="flex items-start gap-1.5"><span className="mt-px text-[#6dbf8f]">✓</span> Close-up of the oral cavity</li>
            <li className="flex items-start gap-1.5"><span className="mt-px text-[#6dbf8f]">✓</span> Only mouth interior visible</li>
            <li className="flex items-start gap-1.5"><span className="mt-px text-[#6dbf8f]">✓</span> Good lighting, area of concern in focus</li>
          </ul>
        </div>

        {/* Incorrect example */}
        <div className="rounded-xl border border-[#3a1e1e] bg-[#1f0f0f] p-4">
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-[#e05555]" />
            <span className="text-sm font-medium text-[#e05555]">Incorrect</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-[#12141f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guide-incorrect.jpg" alt="Incorrect: full face visible" className="h-36 w-full object-cover" />
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-[#7a8299]">
            <li className="flex items-start gap-1.5"><span className="mt-px text-[#e05555]">✗</span> Full face visible — adds noise</li>
            <li className="flex items-start gap-1.5"><span className="mt-px text-[#e05555]">✗</span> Mouth too small in the frame</li>
            <li className="flex items-start gap-1.5"><span className="mt-px text-[#e05555]">✗</span> AI cannot isolate the oral area</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg bg-[#1e2235] px-4 py-3">
        <p className="text-xs text-[#7a8299]">
          <span className="font-medium text-[#a0a8b8]">Tip:</span> Use a phone camera with flash on. Pull back the lips/cheek and photograph the specific area of concern from about 10–15 cm away. Ensure the image is sharp and well-lit.
        </p>
      </div>
    </div>
  );
}

export default function NewDiagnosticPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const form = useForm<PatientValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      full_name: "",
      age: 30,
      gender: "",
      phone_number: "",
      email: "",
      tobacco_habit: false,
      alcohol_habit: false,
      clinical_notes: "",
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        full_name: profileQuery.data.full_name || "",
        age: profileQuery.data.age || 30,
        gender: profileQuery.data.gender || "",
        phone_number: profileQuery.data.phone_number || "",
        email: profileQuery.data.email || "",
        tobacco_habit: !!profileQuery.data.tobacco_habit,
        alcohol_habit: !!profileQuery.data.alcohol_habit,
        clinical_notes: profileQuery.data.clinical_notes || "",
      });
    }
  }, [profileQuery.data, form]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">New Diagnostic</h1>
        <p className="mt-1 text-[#a0a8b8]">
          Step {step} of 2 — {step === 1 ? "Patient Information" : "Upload Oral Image"}
        </p>
      </div>

      <div className="flex gap-2">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#6dbf8f]" : "bg-[#252840]"}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#6dbf8f]" : "bg-[#252840]"}`} />
      </div>

      {step === 1 ? (
        <form
          onSubmit={form.handleSubmit(() => setStep(2))}
          className="space-y-4 rounded-2xl border border-[#252840] bg-[#1a1d2e] p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full_name">Patient Name</Label>
              <Input id="full_name" {...form.register("full_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...form.register("age", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={form.watch("gender")}
                onValueChange={(v) =>
                  form.setValue("gender", v ?? "", { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone</Label>
              <Input id="phone_number" {...form.register("phone_number")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="tobacco"
                checked={form.watch("tobacco_habit")}
                onCheckedChange={(v) => form.setValue("tobacco_habit", v === true)}
              />
              <Label htmlFor="tobacco" className="font-normal">
                Tobacco Habit
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="alcohol"
                checked={form.watch("alcohol_habit")}
                onCheckedChange={(v) => form.setValue("alcohol_habit", v === true)}
              />
              <Label htmlFor="alcohol" className="font-normal">
                Alcohol Habit
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinical_notes">Clinical Notes</Label>
            <Textarea id="clinical_notes" rows={4} {...form.register("clinical_notes")} />
          </div>

          <Button type="submit" className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
            Next
          </Button>
        </form>
      ) : (
        <div className="space-y-6 rounded-2xl border border-[#252840] bg-[#1a1d2e] p-6 shadow-sm">
          <PhotoGuide />
          <UploadBox file={file} onChange={setFile} />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-[#252840] text-[#a0a8b8] hover:bg-[#1e2235] hover:text-white">
              Back
            </Button>
            <Button
              type="button"
              className="bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]"
              onClick={() => {
                if (!file) {
                  toast.error("Please upload an oral image");
                  return;
                }
                const values = form.getValues();
                setPendingDiagnostic(file, {
                  patient: values,
                  notes: values.clinical_notes || "",
                });
                router.push("/diagnostic/processing");
              }}
            >
              Analyze Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
