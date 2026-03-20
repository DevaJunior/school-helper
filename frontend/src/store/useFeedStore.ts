import { create } from 'zustand';
import { collection, getDocs, doc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserRole } from './useAuthStore';

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  targetAudience: 'global' | string; // 'global' ou ID da turma
  createdAt: string; // ISO string para exibição local
}

interface FeedState {
  posts: FeedPost[];
  loading: boolean;
  isPosting: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<FeedPost, 'id' | 'createdAt'>) => Promise<boolean>;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  loading: false,
  isPosting: false,

  fetchPosts: async () => {
    set({ loading: true });
    try {
      // Busca os posts ordenados do mais recente para o mais antigo
      const q = query(collection(db, 'SchoolHelper_Feed'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const postsList: FeedPost[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        postsList.push({
          id: docSnap.id,
          title: data.title || '',
          content: data.content || '',
          authorName: data.authorName || 'Usuário Desconhecido',
          authorRole: data.authorRole || 'student',
          targetAudience: data.targetAudience || 'global',
          createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString()
        });
      });

      set({ posts: postsList, loading: false });
    } catch (error) {
      console.error('Erro ao buscar feed:', error);
      set({ loading: false });
    }
  },

  createPost: async (postData) => {
    set({ isPosting: true });
    try {
      const newPostRef = doc(collection(db, 'SchoolHelper_Feed'));
      
      await setDoc(newPostRef, {
        ...postData,
        createdAt: serverTimestamp()
      });

      // Atualiza o estado local para refletir instantaneamente
      const newPost: FeedPost = {
        id: newPostRef.id,
        ...postData,
        createdAt: new Date().toISOString()
      };

      set((state) => ({
        posts: [newPost, ...state.posts],
        isPosting: false
      }));

      return true;
    } catch (error) {
      console.error('Erro ao criar post no feed:', error);
      set({ isPosting: false });
      return false;
    }
  }
}));