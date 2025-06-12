export interface messageModel {
  sender: string;
  receiver: string;
  text: string;
}

export interface ChatUserModel {
  username: string;
  profileImage: { src: string; contentType: string } | null;
  isOnline: boolean;
}

