import {
  CreateNoteData,
  CreateNoteResponse,
  DeleteNoteResponse,
  GetNoteResponse, 
  StatusResponse,
} from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = {
  createNote: async (data: CreateNoteData): Promise<CreateNoteResponse> => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create note");
    }

    return response.json();
  },

  getNote: async (id: string, password?: string): Promise<GetNoteResponse> => {
    const url = new URL(`/api/notes/${id}`, window.location.origin);
    if (password) {
      url.searchParams.set("password", password);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Failed to get note");
    }

    return response.json();
  },

  deleteNote: async (
    id: string,
    password?: string
  ): Promise<DeleteNoteResponse> => {
    const url = new URL(`/api/notes/${id}`, window.location.origin);
    if (password) {
      url.searchParams.set("password", password);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete note");
    }

    return response.json();
  },

  getNoteStatus: async (id: string): Promise<StatusResponse> => {
    const response = await fetch(`/api/notes/${id}/status`);

    if (!response.ok) {
      throw new Error("Failed to get note status");
    }

    return response.json();
  },
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useGetNote = (
  id: string,
  password?: string,
  options?: {
    enabled?: boolean;
    retry?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["note", id, password],
    queryFn: () => api.getNote(id, password),
    enabled: !!id && (options?.enabled ?? true),
    retry: options?.retry ?? false,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: string; password?: string }) =>
      api.deleteNote(id, password),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ["note", variables.id] });
      queryClient.removeQueries({ queryKey: ["noteStatus", variables.id] });
    },
  });
};

export const useNoteStatus = (
  id: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey: ["noteStatus", id],
    queryFn: () => api.getNoteStatus(id),
    enabled: !!id && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
    retry: false,
  });
};

export const useCreateNoteWithOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createNote,
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      const previousNotes = queryClient.getQueryData(["notes"]);

      return { previousNotes };
    },
    onError: (err, newNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useNoteWithCleanup = (id: string, password?: string) => {
  const queryClient = useQueryClient();

  const noteQuery = useGetNote(id, password);

  const cleanup = () => {
    queryClient.removeQueries({ queryKey: ["note", id] });
    queryClient.removeQueries({ queryKey: ["noteStatus", id] });
  };

  return {
    ...noteQuery,
    cleanup,
  };
};