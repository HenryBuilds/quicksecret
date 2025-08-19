"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCreateNote } from "@/hooks/note-hook";
import {
  FiCheckCircle,
  FiLink,
  FiCopy,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiClock,
  FiEye as FiViewIcon,
  FiMessageSquare,
} from "react-icons/fi";

export default function NoteForm() {
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [expirationValue, setExpirationValue] = useState<number>(1);
  const [expirationUnit, setExpirationUnit] = useState<
    "minutes" | "hours" | "days"
  >("hours");
  const [maxViews, setMaxViews] = useState<number[]>([1]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const { mutate, data, isPending, isSuccess, isError, error } =
    useCreateNote();

  useEffect(() => {
    if (isSuccess && data?.id) {
      setNewNoteId(data.id);
      setDialogOpen(true);
    }
  }, [isSuccess, data]);

  const convertToSeconds = (value: number, unit: string) => {
    switch (unit) {
      case "minutes":
        return value * 60;
      case "hours":
        return value * 3600;
      case "days":
        return value * 86400;
      default:
        return value;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiresIn =
      expirationValue > 0
        ? convertToSeconds(expirationValue, expirationUnit)
        : undefined;

    mutate({
      content,
      password: password || undefined,
        expiresIn: expiresIn ? expiresIn * 1000 : undefined, // ← Multipliziere mit 1000!

      maxViews: maxViews[0],
    });
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const fullUrl = apiUrl && newNoteId ? `${apiUrl}/note?id=${newNoteId}` : "";

  const copyToClipboard = async () => {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setCopySuccess(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setPassword("");
    setShowPassword(false);
    setExpirationValue(1);
    setExpirationUnit("hours");
    setMaxViews([1]);
    setDialogOpen(false);
    setNewNoteId(null);
    setCopySuccess(false);
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <FiMessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Secret Note
              </CardTitle>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Create a secure, self-destructing note that can only be read once
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Note Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4 text-gray-500" />
                  <Label
                    htmlFor="content"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Note Content
                  </Label>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your secret message here..."
                  required
                  className="min-h-[120px] bg-white dark:bg-neutral-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  rows={5}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {content.length} characters
                </p>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-gray-500" />
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  >
                    Password Protection
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (optional)
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password to protect your note"
                    className="pr-12 bg-white dark:bg-neutral-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <FiLock className="w-3 h-3" />
                    <span>Note will be password protected</span>
                  </div>
                )}
              </div>

              {/* Expiration Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-500" />
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    Auto-Expiration
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (optional)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="expiration-value"
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      Duration
                    </Label>
                    <Input
                      id="expiration-value"
                      type="number"
                      value={expirationValue || ""}
                      onChange={(e) =>
                        setExpirationValue(Number(e.target.value))
                      }
                      placeholder="1"
                      className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                      min={1}
                      max={365}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                      Unit
                    </Label>
                    <Select
                      value={expirationUnit}
                      onValueChange={(value) =>
                        setExpirationUnit(value as "minutes" | "hours" | "days")
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {expirationValue > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <FiClock className="w-3 h-3" />
                    <span>
                      Note expires in {expirationValue} {expirationUnit}
                    </span>
                  </div>
                )}
              </div>

              {/* Max Views */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiViewIcon className="w-4 h-4 text-gray-500" />
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    Maximum Views
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="px-4">
                    <Slider
                      value={maxViews}
                      onValueChange={setMaxViews}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      1 view
                    </span>
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                      <FiViewIcon className="w-3 h-3" />
                      <span>
                        {maxViews[0]} view{maxViews[0] !== 1 ? "s" : ""} maximum
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      10 views
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending || content.trim() === ""}
                  className="w-full py-3 text-base font-medium rounded-full"
                  size="lg"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Note...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      Create Secret Note
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Error Message */}
            {isError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-red-500">❌</div>
                  <div>
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      Failed to create note
                    </p>
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {(error as Error).message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-full mx-4 bg-white dark:bg-neutral-900 border dark:border-slate-700/70">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <FiCheckCircle className="text-green-500 w-6 h-6" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Note Created Successfully!
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Your secret note has been created. Share the link below to give
              someone access to it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-slate-700 rounded-xl">
              <div className="flex items-start gap-3">
                <FiLink className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secure Link:
                  </p>
                  <code className="text-sm text-gray-900 dark:text-white bg-white dark:bg-neutral-900 p-2 rounded border border-gray-200 dark:border-slate-600 block break-all">
                    {fullUrl || "API URL or Note ID missing"}
                  </code>
                </div>
              </div>
            </div>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
              disabled={!fullUrl}
            >
              {copySuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheck className="w-4 h-4" />
                  Copied to Clipboard!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FiCopy className="w-4 h-4" />
                  Copy Link to Clipboard
                </div>
              )}
            </Button>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button onClick={resetForm} variant="outline" className="flex-1">
              Create Another Note
            </Button>
            <Button onClick={() => setDialogOpen(false)} className="flex-1">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
