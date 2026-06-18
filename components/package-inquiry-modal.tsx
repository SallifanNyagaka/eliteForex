"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { ArrowRight } from "lucide-react";

export function PackageInquiryModal({
  packageName,
}: {
  packageName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="secondary-button" type="button">
          Inquire Now <ArrowRight size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="inquiry-dialog">
        <div className="dialog-copy">
          <p className="eyebrow">Package Inquiry</p>
          <h2>{packageName}</h2>
          <p>Submit your details and we will follow up with the right onboarding guidance.</p>
        </div>
        <LeadCaptureForm variant="package" sourcePage="/packages" packageName={packageName} compact />
      </DialogContent>
    </Dialog>
  );
}
