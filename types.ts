

import React from 'react';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface AcademicProfile {
    institution?: string;
    status?: 'Student' | 'Faculty' | 'Alumni' | 'Staff';
    subjects?: string[];
}

export interface StudyProfile {
    studyHabits?: string[]; // e.g., 'Late Night', 'Group Study', 'Quiet Environment'
    learningGoals?: string;
    availability?: string; // e.g., 'Weekends', 'Evenings'
}


export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  isAnonymous: boolean;
  isCreator?: boolean;
  bio?: string;
  followers?: number;
  role?: 'user' | 'creator' | 'admin';
  theme?: 'light' | 'dark';
  createdAt?: string;
  isOnline?: boolean;
  lastSeen?: string;
  socketId?: string;
  purchasedItems?: string[]; // Array of MarketplaceItem IDs
  aiTwinStyleProfile?: string;
  aiTwinLastTrained?: string; // ISO date string
  isTwoFactorEnabled?: boolean;
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  academicProfile?: AcademicProfile;
  language?: string; // e.g., 'en', 'de', 'es'
  studyProfile?: StudyProfile;
  presence?: {
    status: 'online' | 'away' | 'busy' | 'driving' | 'sleeping';
    message?: string;
  };
  currency?: string; // e.g., 'usd', 'kes', 'ghs'
  storefrontSettings?: {
    bannerUrl?: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        website?: string;
    }
  }
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; twoFactorRequired?: boolean; tempToken?: string; }>;
  loginWithTwoFactor: (token: string, tempToken: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  anonymousLogin: () => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserPresence: (presence: { status: 'online' | 'away' | 'busy' | 'driving' | 'sleeping'; message?: string }) => Promise<void>;
  fetchUser: (token: string) => Promise<void>;
  disableTwoFactor: (password: string) => Promise<boolean>;
}

export interface BaseMessage {
    id: string;
    timestamp: string;
    senderId: string;
    isGhost?: boolean;
    destructTime?: number; // Unix timestamp
    status?: 'sent' | 'pending' | 'failed' | 'local';
    readStatus?: 'sent' | 'delivered' | 'glimpsed' | 'read';
    readAt?: string; // ISO date string
    safetyAnalysis?: SafetyAnalysis;
    deliveryMethod?: 'server' | 'p2p';
    adminAction?: {
      action: 'dismissed' | 'deleted';
      adminId: string;
      timestamp: string;
    };
}

export interface SafetyAnalysis {
    status: 'pending' | 'safe' | 'warning';
    type?: 'deepfake' | 'scam_link';
    reason?: string;
}


export interface TextMessage extends BaseMessage {
    type: 'text';
    text: string;
    detectedLanguage?: string;
    translations?: Record<string, string>; // e.g., { 'de': 'Hallo Welt' }
}

export interface AudioMessage extends BaseMessage {
    type: 'audio';
    audioUrl: string;
    duration: number; // in seconds
}

export interface ImageMessage extends BaseMessage {
    type: 'image';
    imageUrl: string;
}

export interface DocumentMessage extends BaseMessage {
    type: 'document';
    fileUrl: string;
    fileName: string;
    fileSize: number; // in bytes
}

export interface CapsuleMessage extends BaseMessage {
    type: 'capsule';
    text: string; // The locked content
    releaseAt: string; // ISO date string for unlock time
}

export interface GhostNoteMessage extends BaseMessage {
    type: 'ghost-note';
    text: string;
}

export interface SystemMessage extends BaseMessage {
    type: 'system';
    text: string;
    relatedConversationId?: string;
    systemMetadata?: {
        participants?: string[];
    };
}

export interface SimulatedTextMessage {
    id: string;
    type: 'simulated-text';
    senderId: string;
    text: string;
    timestamp: string;
    tone?: string;
    isHypothetical?: boolean;
}


export type ChatMessage = TextMessage | AudioMessage | ImageMessage | DocumentMessage | CapsuleMessage | GhostNoteMessage | SystemMessage;

export type MessageSendContent = 
    | { type: 'text'; content: string; isGhost: boolean }
    | { type: 'audio'; file: File; duration: number }
    | { type: 'image'; file: File }
    | { type: 'document'; file: File }
    | { type: 'capsule'; content: string; releaseAt: string };


export interface BaseConversation {
    id: string;
    messages: ChatMessage[];
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isAiConversation: boolean;
}

export interface DirectConversation extends BaseConversation {
    type: 'direct';
    otherUser: User;
    p2pStatus?: 'disconnected' | 'connecting' | 'connected' | 'failed';
}

export interface GroupConversation extends BaseConversation {
    type: 'group';
    name: string;
    avatar: React.ReactNode; 
    members: User[];
    admin: User;
    isCognitive?: boolean;
    isWhisperThread?: boolean;
    parentConversationId?: string;
    isRoleplayRoom?: boolean;
    roleplaySettings?: {
        scenario: string;
        characterRoles: {
            userId: string;
            characterName: string;
        }[];
    };
    activeVoiceRoom?: VoiceRoomState;
    watchParty?: WatchPartyState;
    communityDetails?: {
        _id: string;
        category: 'Study Group' | 'Social Club' | 'Campus Event' | 'Resource Hub';
    };
}

export type Conversation = DirectConversation | GroupConversation;


export interface SmartReply {
    id: string;
    text: string;
}

export interface VibeReply {
    text: string;
    tone: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export type NotificationType = 'success' | 'error' | 'info';
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

export interface OfflineContextType {
  isOffline: boolean;
}

export interface AdminStats {
    totalUsers: number;
    totalRevenue: number;
    totalTips: number;
    totalMarketplaceSales: number;
    dailyRevenueChartData: {
        labels: string[];
        data: number[];
    };
}

export interface ActivityLog {
    _id: string;
    actor: {
        _id: string;
        name: string;
        email?: string;
    };
    action: string;
    target?: string;
    details?: any;
    timestamp: string;
}

export interface Transaction {
    _id: string;
    fromUser: { _id: string, name: string, avatar: string };
    toUser: { _id: string, name: string };
    amount: number;
    currency: string;
    status: 'completed' | 'failed';
    paymentId: string;
    createdAt: string;
    details?: { type: string, itemId?: string, title?: string };
}

export interface MarketplaceItem {
    _id: string;
    creator: User;
    title: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    assetUrl: string;
    createdAt: string;
}

export interface WatchPartyState {
    isActive: boolean;
    videoId: string;
    hostId: string;
    isPlaying: boolean;
    timestamp: number;
}

export type PlaybackControl = 
  | { type: 'PLAY'; timestamp: number }
  | { type: 'PAUSE'; timestamp: number }
  | { type: 'SEEK'; timestamp: number };

export interface CallState {
    isReceivingCall: boolean;
    isCallActive: boolean;
    caller?: User;
    callSignal?: any;
    isStealthCall?: boolean;
    stealthCallHost?: User;
    remoteStreams: Map<string, MediaStream>; // Key is user ID
}

export interface CRoomPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onGetSummary: () => void;
    onAskMemory: (question: string) => void;
    isLoading: boolean;
}

export interface ApiKey {
    _id: string;
    keyPrefix: string;
    owner: string;
    permissions: string[];
    usageCount: number;
    lastUsedAt?: string;
    isActive: boolean;
    createdAt: string;
}

export interface GeneratedContract {
    parties: string;
    terms: string[];
    effectiveDate: string;
}

export type LocalP2PStatus = 'inactive' | 'generating' | 'scanning' | 'connected' | 'failed';

export interface ChatWindowProps {
    conversation: Conversation;
    currentUser: User;
    onSendMessage: (content: MessageSendContent) => void;
    onSendGhostNote: (text: string) => void;
    onBack: () => void;
    typingText: string | null;
    onSummarize: (messages: ChatMessage[]) => void;
    onRevealGhostMessage: (messageId: string) => void;
    onOpenCreatorProfile: (user: User) => void;
    onOpenConversationInfo: () => void;
    onStartWatchParty: () => void;
    onStartCall: () => void;
    onOpenStudyHub: () => void;
    onOpenCRoomPanel: () => void;
    onOpenMemoryCapsule?: () => void;
    onEnterVibeTimeline: () => void;
    onGetRoleplayPrompt?: () => Promise<string | null>;
    onGenerateContract?: () => void;
    p2pStatus: 'disconnected' | 'connecting' | 'connected' | 'failed';
    onStartStealthCall: () => void;
    onOpenTDMConfig: () => void;
    onStartVoiceRoom: () => void;
    onStartWhisperThread: (messageAuthor: User) => void;
    onOpenWhisperThread: (relatedConversationId: string) => void;
    onOpenMoodTranslator: (text: string) => void;
    isAiTwinModeActive?: boolean;
    onToggleAiTwinMode?: () => void;
    aiTwinSuggestion?: string | null;
    onClearAiSuggestion?: () => void;
    onLocalP2PConnect?: () => void;
    localP2PStatus?: LocalP2PStatus;
}

export interface ChatHeaderProps {
    onBack: () => void;
    conversation: Conversation;
    currentUser: User;
    onOpenCreatorProfile: (user: User) => void;
    onOpenConversationInfo: () => void;
    onStartWatchParty: () => void;
    onStartCall: () => void;
    onOpenStudyHub: () => void;
    onGenerateContract?: () => void;
    p2pStatus: 'disconnected' | 'connecting' | 'connected' | 'failed';
    onStartStealthCall: () => void;
    onOpenTDMConfig: () => void;
    onStartVoiceRoom: () => void;
    isAiTwinModeActive?: boolean;
    onToggleAiTwinMode?: () => void;
    onLocalP2PConnect?: () => void;
    localP2PStatus?: LocalP2PStatus;
}

export interface TDMSettings {
    conversationId: string;
    isHidden: boolean;
    unhideAt?: string; // ISO date string
}


export interface VoiceRoom {
    id: string;
    host: User;
    participants: VoiceRoomParticipant[];
    listeners: User[];
    speakers: User[];
}

export interface VoiceRoomParticipant {
    user: User;
    role: 'host' | 'speaker' | 'listener';
    isMuted: boolean;
    isSpeaking: boolean;
}

export interface VoiceRoomState {
    isActive: boolean;
    hostId: string;
    startedAt: string;
}

export interface Transcription {
    id: string;
    text: string;
    translation?: string;
    sender: {
        id: string;
        name: string;
    };
}

export interface Community {
    _id: string;
    name: string;
    description: string;
    creator: { _id: string; name: string };
    category: 'Study Group' | 'Social Club' | 'Campus Event' | 'Resource Hub';
    conversation: string;
    memberCount: number;
    createdAt: string;
}

export interface StudyTask {
    _id: string;
    title: string;
    dueDate: string;
    isCompleted: boolean;
    createdBy: string; // user id
    conversationId: string;
}

export interface Flashcard {
    _id: string;
    front: string;
    back: string;
}

export interface FlashcardDeck {
    _id: string;
    name: string;
    conversationId: string;
    cards: Flashcard[];
}

export interface Notice {
    _id: string;
    title: string;
    content: string;
    author: { name: string; };
    category: 'Event' | 'News' | 'Alert';
    createdAt: string;
}

export interface Resource {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileName: string;
    fileType: 'document' | 'video' | 'image';
    uploader: { name: string; };
    createdAt: string;
}

export interface SmartFeed {
    recommendedCommunities: Community[];
    relevantNotices: Notice[];
}