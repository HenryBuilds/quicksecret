"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteNote, useGetNote, useNoteStatus } from "@/hooks/note-hook";
import {
  HiExclamationCircle,
  HiOutlineBookOpen,
  HiCheckCircle,
  HiXCircle,
  HiInformationCircle,
  HiKey,
  HiEye,
  HiEyeOff,
  HiLockClosed,
  HiLockOpen,
  HiTrash,
  HiDocumentText,
  HiShieldCheck,
  HiClock,
} from "react-icons/hi";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

export default function NoteCanvas() {
  const [noteId, setNoteId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shouldFetchNote, setShouldFetchNote] = useState(false);

  const { data: statusData } = useNoteStatus(noteId || "", {
    enabled: !!noteId && !deleted,
  });

  const { data, isLoading, isError, error } = useGetNote(
    noteId || "",
    password,
    { enabled: shouldFetchNote && !!noteId && !deleted }
  );
  
  const { mutate: deleteNote } = useDeleteNote();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get("id");
    if (idFromQuery) setNoteId(idFromQuery);
  }, []);

  const handleConfirm = async () => {
    if (!noteId) return;

    if (statusData?.isEncrypted && !password.trim()) {
      setShowPasswordInput(true);
      return;
    }

    setConfirmed(true);
    setPasswordError(false);
    setShouldFetchNote(true);
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) return;
    setShowPasswordInput(false);
    setPasswordError(false);
    
    setConfirmed(true);
    setShouldFetchNote(true);
  };

  const handleReject = () => {
    if (!noteId) return;
    deleteNote({ id: noteId, password });
    setDeleted(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    setDeleted(false);
    setNoteId(null);
    setShowNote(false);
    setShowPasswordInput(false);
    setPassword("");
    setPasswordError(false);
    setShouldFetchNote(false);
  };

  useEffect(() => {
    if (isError && shouldFetchNote) {
      const errorMessage = (error as Error)?.message || '';
      
      if (errorMessage.includes('Password required') || errorMessage.includes('Invalid password')) {
        setPasswordError(true);
        setShowPasswordInput(true);
        setConfirmed(false);
        setShouldFetchNote(false);
      }
    }
  }, [isError, error, shouldFetchNote]);

  useEffect(() => {
    if (data?.success && shouldFetchNote) {
    }
  }, [data, shouldFetchNote]);

  const showExpiredMessage =
    isError && confirmed && !deleted && !showPasswordInput && shouldFetchNote;

  if (!showNote) {
    return (
      <div className=" from-slate-50 to-slate-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Note view closed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" from-slate-50 to-slate-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-4 py-8">
      {!noteId && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-12 shadow-2xl max-w-lg w-full">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <HiXCircle size={40} className="text-red-500" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-red-500">Note ID Missing</h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                Please specify a valid note ID in the URL query parameter.
              </p>
            </div>
          </div>
        </div>
      )}

      {noteId && showPasswordInput && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-12 shadow-2xl max-w-lg w-full">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
              <HiLockClosed size={40} className="text-blue-500" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Protected Note
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Enter the password to unlock this note
              </p>
            </div>

            {passwordError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <HiExclamationCircle className="text-red-500 flex-shrink-0" size={20} />
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    Incorrect password. Please try again.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-3 text-left">
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300 font-medium text-base"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="h-12 pr-12 bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword("");
                    setPasswordError(false);
                  }}
                  className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordSubmit}
                  disabled={!password.trim()}
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <HiLockOpen size={18} className="mr-2" />
                  Unlock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {noteId && !confirmed && !deleted && !showPasswordInput && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-12 shadow-2xl max-w-2xl w-full">
          <div className="text-center space-y-10">
            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
              <HiShieldCheck size={48} className="text-amber-500" />
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Ready to Reveal?
              </h1>
              <div className="space-y-4">
                <p className="text-xl text-slate-700 dark:text-slate-200 font-medium">
                  This note will self-destruct after reading
                </p>
                <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed text-lg">
                  Once you choose to read this note, it cannot be recovered. If
                  you decide not to read it, it will be permanently deleted.
                </p>

                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  {statusData?.isEncrypted && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-full">
                      <HiLockClosed className="text-blue-600 dark:text-blue-400" size={16} />
                      <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                        Password Protected
                      </span>
                    </div>
                  )}

                  {statusData?.viewsLeft !== undefined && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-full">
                      <HiEye className="text-purple-600 dark:text-purple-400" size={16} />
                      <span className="text-purple-700 dark:text-purple-300 text-sm font-medium">
                        {statusData.viewsLeft} view{statusData.viewsLeft !== 1 ? "s" : ""} remaining
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleReject}
                className="flex-1 h-14 rounded-xl border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-base"
              >
                <HiTrash size={20} className="mr-2" />
                Delete Forever
              </Button>

              <Button
                onClick={handleConfirm}
                className="flex-1 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 font-semibold text-base"
              >
                <HiDocumentText size={20} className="mr-2" />
                Reveal Note
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleted && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-12 shadow-2xl max-w-lg w-full">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <HiXCircle size={40} className="text-red-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-red-500">Note Deleted</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                The note has been permanently removed and cannot be recovered.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="h-12 px-8 rounded-xl font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {showExpiredMessage && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-12 shadow-2xl max-w-lg w-full">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <HiInformationCircle size={40} className="text-slate-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                Note Unavailable
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                This note has expired, been viewed too many times, or was deleted.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="h-12 px-8 rounded-xl font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {confirmed && data && data.success && !showPasswordInput && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl shadow-2xl max-w-4xl w-full mx-4">
          <header className="flex items-center justify-between p-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                <HiOutlineBookOpen size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Secret Note
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {data.isEncrypted && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-full">
                  <HiLockClosed className="text-blue-600 dark:text-blue-400" size={14} />
                  <span className="text-blue-700 dark:text-blue-300 text-xs font-medium">
                    Encrypted
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-full">
                <HiEye className="text-purple-600 dark:text-purple-400" size={14} />
                <span className="text-purple-700 dark:text-purple-300 text-xs font-medium">
                  View {data.viewCount}
                </span>
              </div>
            </div>
          </header>

          <section className="p-8">
            <div className="bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8">
              <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-medium leading-relaxed text-lg">
                {data.content}
              </pre>
            </div>
          </section>

          <footer className="p-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <Button 
              onClick={handleClose} 
              className="h-12 px-8 rounded-xl font-medium"
            >
              Close Note
            </Button>
          </footer>
        </div>
      )}

      {isLoading && shouldFetchNote && (
        <div className="bg-white dark:bg-neutral-900 border dark:border-slate-700/70 rounded-3xl p-12 shadow-2xl max-w-lg w-full">
          <div className="text-center space-y-6">
            <LoadingSpinner />
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
              Loading note...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}